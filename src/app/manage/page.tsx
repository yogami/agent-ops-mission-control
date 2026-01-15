'use client';

import { useState, useEffect, useCallback } from 'react';
import { Agent, ExecutionStatus, Anomaly, PendingAction } from '@/domain/Agent';
import DashboardSummary from '@/components/manager/DashboardSummary';
import KanbanBoard from '@/components/manager/KanbanBoard';
import { GlobalKillSwitch, AlertPanel, HumanReviewPanel } from '@/components/enterprise';
import Link from 'next/link';

const DEMO_COMPANIES = [
    { id: 'berlin-ai-labs', name: 'Berlin AI Labs' },
    { id: 'regutech-corp', name: 'ReguTech Corp' },
    { id: 'delta-campus', name: 'Delta Campus' },
];

export default function ManagePage() {
    const [selectedCompany, setSelectedCompany] = useState(DEMO_COMPANIES[0]);
    const [agents, setAgents] = useState<Agent[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
    const [pendingActions, setPendingActions] = useState<PendingAction[]>([]);

    // Fetch agents from the live API (company scoped)
    const fetchAgents = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/manager/agents?companyId=${selectedCompany.id}`);
            if (!response.ok) throw new Error('Failed to fetch agents');
            const data = await response.json();
            setAgents(data);
        } catch (error) {
            console.error('Error loading agents:', error);
        } finally {
            setIsLoading(false);
        }
    }, [selectedCompany.id]);

    useEffect(() => {
        fetchAgents();
    }, [fetchAgents]);

    // Fetch anomalies from live API (with polling)
    const fetchAnomalies = useCallback(async () => {
        try {
            const response = await fetch(`/api/anomalies?companyId=${selectedCompany.id}`);
            if (response.ok) {
                const data = await response.json();
                setAnomalies(data.anomalies || []);
            }
        } catch (error) {
            console.error('Error loading anomalies:', error);
        }
    }, [selectedCompany.id]);

    useEffect(() => {
        fetchAnomalies();
        const interval = setInterval(fetchAnomalies, 30000); // Poll every 30s
        return () => clearInterval(interval);
    }, [fetchAnomalies]);

    // Fetch pending actions from live API
    const fetchActions = useCallback(async () => {
        try {
            const response = await fetch(`/api/actions?companyId=${selectedCompany.id}`);
            if (response.ok) {
                const data = await response.json();
                setPendingActions(data.actions || []);
            }
        } catch (error) {
            console.error('Error loading actions:', error);
        }
    }, [selectedCompany.id]);

    useEffect(() => {
        fetchActions();
    }, [fetchActions]);

    const handleStatusChange = async (agentId: string, newStatus: ExecutionStatus) => {
        const previousAgents = [...agents];
        setAgents(prev => prev.map(a =>
            a.id === agentId ? { ...a, executionStatus: newStatus } : a
        ));

        try {
            const response = await fetch(`/api/manager/agents/${agentId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ executionStatus: newStatus })
            });

            if (!response.ok) throw new Error('Failed to update status');
            console.log(`Successfully updated agent ${agentId} to ${newStatus}`);
        } catch (error) {
            console.error('Error updating status:', error);
            setAgents(previousAgents);
            alert('Failed to update agent status. Please check connectivity.');
        }
    };

    const handleFleetKill = async () => {
        try {
            const response = await fetch('/api/kill', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    actorId: 'admin@mission-control',
                    companyId: selectedCompany.id
                })
            });

            if (response.ok) {
                const data = await response.json();
                console.log(`Fleet stop successful: ${data.stoppedCount} agents stopped for ${selectedCompany.name}`);
                await fetchAgents(); // Refresh the list
            }
        } catch (error) {
            console.error('Fleet kill failed:', error);
            setAgents(prev => prev.map(a => ({ ...a, isEmergencyStopped: true, stoppedAt: new Date().toISOString() })));
        }
    };

    const handleResolveAnomaly = (anomalyId: string) => {
        setAnomalies(prev => prev.map(a => a.id === anomalyId ? { ...a, resolved: true } : a));
    };

    const handleApproveAction = async (actionId: string, reviewerName: string) => {
        try {
            const response = await fetch('/api/actions', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ actionId, status: 'approved', reviewedBy: reviewerName })
            });

            if (response.ok) {
                await fetchActions(); // Refresh from DB
            }
        } catch (error) {
            console.error('Approve failed:', error);
        }
    };

    const handleDenyAction = async (actionId: string, reviewerName: string, reason?: string) => {
        try {
            const response = await fetch('/api/actions', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ actionId, status: 'denied', reviewedBy: reviewerName, reason })
            });

            if (response.ok) {
                await fetchActions(); // Refresh from DB
            }
        } catch (error) {
            console.error('Deny failed:', error);
        }
    };

    const agentsArray = Array.isArray(agents) ? agents : [];
    const activeAgentCount = agentsArray.filter(a => !a.isEmergencyStopped && a.status === 'online').length;

    return (
        <main className="min-h-screen py-12 px-6">
            <div className="max-w-7xl mx-auto">
                {/* Navigation */}
                <div className="mb-12">
                    <Link href="/" className="text-sm text-gray-500 hover:text-[var(--primary)] mb-4 inline-block">
                        ← Back to Mission Control
                    </Link>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex-1">
                            <div className="flex items-center gap-4">
                                <h1 className="text-4xl font-bold text-white mb-2">
                                    Fleet <span className="gradient-text">Management</span>
                                </h1>
                                <div className="px-3 py-1 bg-[var(--primary)]/10 border border-[var(--primary)]/20 rounded-full text-[var(--primary)] text-[10px] font-mono uppercase tracking-wider">
                                    {selectedCompany.name}
                                </div>
                            </div>
                            <div className="flex items-center gap-4 mt-1">
                                <p className="text-gray-400 text-sm">
                                    Orchestrate your autonomous agents and monitor live execution.
                                </p>
                                <select
                                    className="bg-[var(--surface-2)] border border-[var(--border)] rounded text-[10px] text-gray-500 px-2 py-0.5 outline-none hover:border-[var(--primary)]/50 transition-colors"
                                    value={selectedCompany.id}
                                    onChange={(e) => {
                                        const company = DEMO_COMPANIES.find(c => c.id === e.target.value);
                                        if (company) setSelectedCompany(company);
                                    }}
                                >
                                    {DEMO_COMPANIES.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            {/* Enterprise Controls */}
                            <AlertPanel
                                anomalies={anomalies}
                                onResolve={handleResolveAnomaly}
                                onConfigureAlerts={() => alert('Alert configuration coming soon')}
                            />
                            <HumanReviewPanel
                                pendingActions={pendingActions}
                                onApprove={handleApproveAction}
                                onDeny={handleDenyAction}
                            />
                            <div className="hidden md:flex items-center gap-3 glass-card px-4 py-2 border-[var(--primary)]/20 text-xs">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-gray-400 font-mono">SUPABASE CONNECTED</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Dashboard Overview */}
                <DashboardSummary
                    agents={agents}
                    onNewAgent={() => alert('New Agent creation involves ZK-Credential verification in production.')}
                />

                {/* Main Kanban Content */}
                <section className="mt-12">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="w-8 h-8 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : (
                        <KanbanBoard agents={agents} onStatusChange={handleStatusChange} />
                    )}
                </section>
            </div>

            {/* Global Kill Switch - Fixed Position */}
            <GlobalKillSwitch onGlobalKill={handleFleetKill} activeAgentCount={activeAgentCount} />
        </main>
    );
}
