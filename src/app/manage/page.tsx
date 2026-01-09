'use client';

import { useState, useEffect } from 'react';
import { Agent, ExecutionStatus, Anomaly, PendingAction } from '@/domain/Agent';
import DashboardSummary from '@/components/manager/DashboardSummary';
import KanbanBoard from '@/components/manager/KanbanBoard';
import { GlobalKillSwitch, AlertPanel, HumanReviewPanel } from '@/components/enterprise';
import Link from 'next/link';

// Mock anomalies for demo
const MOCK_ANOMALIES: Anomaly[] = [
    { id: 'a1', type: 'drift', severity: 'high', message: 'Model accuracy dropped 15% in last 24h', detectedAt: new Date().toISOString() },
    { id: 'a2', type: 'policy_violation', severity: 'critical', message: 'Agent accessed restricted data category', detectedAt: new Date(Date.now() - 3600000).toISOString() },
    { id: 'a3', type: 'pii_leak', severity: 'medium', message: 'Potential PII detected in output logs', detectedAt: new Date(Date.now() - 7200000).toISOString() },
    { id: 'a4', type: 'performance', severity: 'low', message: 'Response latency increased by 200ms', detectedAt: new Date(Date.now() - 86400000).toISOString(), resolved: true },
];

// Mock pending actions for demo
const MOCK_PENDING_ACTIONS: PendingAction[] = [
    { id: 'p1', action: 'Deploy Model v2.3', description: 'Update production model with retrained weights', requestedAt: new Date().toISOString(), status: 'pending' },
    { id: 'p2', action: 'Expand Data Access', description: 'Grant access to customer_orders table for analysis', payload: { table: 'customer_orders', access: 'read' }, requestedAt: new Date(Date.now() - 1800000).toISOString(), status: 'pending' },
    { id: 'p3', action: 'Update Rate Limits', description: 'Increase API rate limit from 100/min to 500/min', requestedAt: new Date(Date.now() - 86400000).toISOString(), status: 'approved', reviewedBy: 'admin@example.com', reviewedAt: new Date(Date.now() - 82800000).toISOString() },
];

export default function ManagePage() {
    const [agents, setAgents] = useState<Agent[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [anomalies, setAnomalies] = useState<Anomaly[]>(MOCK_ANOMALIES);
    const [pendingActions, setPendingActions] = useState<PendingAction[]>(MOCK_PENDING_ACTIONS);

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
        // In production, this would call the API to stop all agents
        setAgents(prev => prev.map(a => ({ ...a, isEmergencyStopped: true, stoppedAt: new Date().toISOString() })));
        console.log('Global emergency stop triggered');
    };

    const handleResolveAnomaly = (anomalyId: string) => {
        setAnomalies(prev => prev.map(a => a.id === anomalyId ? { ...a, resolved: true } : a));
    };

    const handleApproveAction = async (actionId: string, reviewerName: string) => {
        setPendingActions(prev => prev.map(a =>
            a.id === actionId ? { ...a, status: 'approved' as const, reviewedBy: reviewerName, reviewedAt: new Date().toISOString() } : a
        ));
    };

    const handleDenyAction = async (actionId: string, reviewerName: string, reason?: string) => {
        setPendingActions(prev => prev.map(a =>
            a.id === actionId ? { ...a, status: 'denied' as const, reviewedBy: reviewerName, reviewedAt: new Date().toISOString() } : a
        ));
        if (reason) console.log(`Action ${actionId} denied: ${reason}`);
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
