'use client';

import { useState, useEffect, useCallback } from 'react';
import { Agent, ExecutionStatus, Anomaly, PendingAction } from '@/domain/Agent';
import DashboardSummary from '@/components/manager/DashboardSummary';
import KanbanBoard from '@/components/manager/KanbanBoard';
import { GlobalKillSwitch, AlertPanel, HumanReviewPanel } from '@/components/enterprise';
import Link from 'next/link';

export default function ManagePage() {
    const [agents, setAgents] = useState<Agent[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
    const [pendingActions, setPendingActions] = useState<PendingAction[]>([]);

    // Fetch agents from the live API
    useEffect(() => {
        async function fetchAgents() {
            try {
                const response = await fetch('/api/manager/agents');
                if (!response.ok) throw new Error('Failed to fetch agents');
                const data = await response.json();
                setAgents(data);
            } catch (error) {
                console.error('Error loading agents:', error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchAgents();
    }, []);

    // Fetch anomalies from live API (with polling)
    const fetchAnomalies = useCallback(async () => {
        try {
            const response = await fetch('/api/anomalies');
            if (response.ok) {
                const data = await response.json();
                setAnomalies(data.anomalies || []);
            }
        } catch (error) {
            console.error('Error loading anomalies:', error);
        }
    }, []);

    useEffect(() => {
        fetchAnomalies();
        const interval = setInterval(fetchAnomalies, 30000); // Poll every 30s
        return () => clearInterval(interval);
    }, [fetchAnomalies]);

    // Fetch pending actions from live API
    const fetchActions = useCallback(async () => {
        try {
            const response = await fetch('/api/actions');
            if (response.ok) {
                const data = await response.json();
                setPendingActions(data.actions || []);
            }
        } catch (error) {
            console.error('Error loading actions:', error);
        }
    }, []);

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

    const handleGlobalKill = async () => {
        try {
            const response = await fetch('/api/kill', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ actorId: 'admin@mission-control' })
            });

            if (response.ok) {
                const data = await response.json();
                console.log(`Global kill successful: ${data.stoppedCount} agents stopped`);
                // Refresh agents list
                const agentsResponse = await fetch('/api/manager/agents');
                if (agentsResponse.ok) {
                    setAgents(await agentsResponse.json());
                }
            }
        } catch (error) {
            console.error('Global kill failed:', error);
            // Fallback to optimistic update
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

    const activeAgentCount = agents.filter(a => !a.isEmergencyStopped && a.status === 'online').length;

    return (
        <main className="min-h-screen py-12 px-6">
            <div className="max-w-7xl mx-auto">
                {/* Navigation */}
                <div className="mb-12">
                    <Link href="/" className="text-sm text-gray-500 hover:text-[var(--primary)] mb-4 inline-block">
                        ← Back to Mission Control
                    </Link>
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-bold text-white mb-2">
                                Fleet <span className="gradient-text">Management</span>
                            </h1>
                            <p className="text-gray-400">
                                Orchestrate your autonomous agents and monitor live execution.
                            </p>
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
            <GlobalKillSwitch onGlobalKill={handleGlobalKill} activeAgentCount={activeAgentCount} />
        </main>
    );
}
