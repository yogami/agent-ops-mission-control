'use client';

import { useState, useEffect } from 'react';
import { Agent, ExecutionStatus } from '@/domain/Agent';
import DashboardSummary from '@/components/manager/DashboardSummary';
import KanbanBoard from '@/components/manager/KanbanBoard';
import Link from 'next/link';

export default function ManagePage() {
    const [agents, setAgents] = useState<Agent[]>([]);
    const [isLoading, setIsLoading] = useState(true);

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
        // Optimistic UI update
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
            // Rollback on error
            setAgents(previousAgents);
            alert('Failed to update agent status. Please check connectivity.');
        }
    };

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
                        <div className="hidden md:flex items-center gap-3 glass-card px-4 py-2 border-[var(--primary)]/20 text-xs">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-gray-400 font-mono">SUPABASE CONNECTED</span>
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
        </main>
    );
}
