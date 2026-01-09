'use client';

import { Agent } from '@/domain/Agent';

interface DashboardSummaryProps {
    agents: Agent[];
    onNewAgent: () => void;
}

export default function DashboardSummary({ agents, onNewAgent }: DashboardSummaryProps) {
    const activeCount = agents.filter(a => a.executionStatus === 'running').length;
    const reviewCount = agents.filter(a => a.executionStatus === 'review').length;
    const avgTrust = agents.length > 0
        ? Math.round(agents.reduce((sum, a) => sum + (a.trustScore || 0), 0) / agents.length)
        : 0;

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            {/* Primary Action Card */}
            <div
                onClick={onNewAgent}
                className="glass-card p-6 border-dashed border-2 border-[var(--primary)]/30 hover:border-[var(--primary)] flex flex-col items-center justify-center text-center group cursor-pointer"
            >
                <div className="w-12 h-12 rounded-full bg-[var(--primary-glow)] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <span className="text-2xl text-[var(--primary)]">+</span>
                </div>
                <h3 className="text-white font-bold">Deploy New Agent</h3>
                <p className="text-xs text-gray-500 mt-1">Initialize task orchestrator</p>
            </div>

            {/* Stats Cards */}
            <div className="glass-card p-6">
                <div className="text-gray-500 text-xs font-mono uppercase tracking-widest mb-1">Active Agents</div>
                <div className="text-4xl font-bold text-white flex items-baseline gap-2">
                    {activeCount}
                    <span className="status-pulse status-online" />
                </div>
                <div className="text-[var(--primary)] text-xs mt-2">Currently executing</div>
            </div>

            <div className="glass-card p-6">
                <div className="text-gray-500 text-xs font-mono uppercase tracking-widest mb-1">Human Review</div>
                <div className="text-4xl font-bold text-white flex items-baseline gap-2">
                    {reviewCount}
                    {reviewCount > 0 && <span className="status-pulse status-warning" />}
                </div>
                <div className="text-[var(--secondary)] text-xs mt-2">Awaiting decision</div>
            </div>

            <div className="glass-card p-6">
                <div className="text-gray-500 text-xs font-mono uppercase tracking-widest mb-1">Fleet Trust</div>
                <div className="text-4xl font-bold text-white">
                    {avgTrust}%
                </div>
                <div className="text-emerald-500 text-xs mt-2">Verified compliance level</div>
            </div>
        </div>
    );
}
