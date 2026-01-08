'use client';

/**
 * AgentCard Component
 * 
 * Displays a single agent with status, trust score, and compliance badges.
 */

import { Agent, getTrustScoreLabel } from '@/domain/Agent';

interface AgentCardProps {
    agent: Agent;
    onClick?: () => void;
}

export function AgentCard({ agent, onClick }: AgentCardProps) {
    const scoreLabel = getTrustScoreLabel(agent.trustScore);
    const scoreColor =
        scoreLabel === 'Excellent' ? 'text-green-400' :
            scoreLabel === 'Good' ? 'text-yellow-400' : 'text-red-400';

    return (
        <div
            data-testid="agent-card"
            onClick={onClick}
            className="glass-card p-6 cursor-pointer group"
        >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className={`status-pulse status-${agent.status === 'online' ? 'online' : agent.status === 'degraded' ? 'warning' : 'offline'}`} />
                    <h3 className="text-lg font-semibold text-white group-hover:text-[var(--primary)] transition-colors">
                        {agent.name}
                    </h3>
                </div>
                <span className={`text-2xl font-bold ${scoreColor}`}>
                    {agent.trustScore}
                </span>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                {agent.description}
            </p>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-4">
                {agent.badges.map((badge, idx) => (
                    <span
                        key={idx}
                        className="px-2 py-1 text-xs rounded-full bg-[var(--surface-2)] border border-[var(--border)] text-[var(--primary)]"
                    >
                        {badge.verified && '✓ '}{badge.type.replace('_', ' ')}
                    </span>
                ))}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between text-xs text-gray-500">
                <span className="capitalize">{agent.category}</span>
                {agent.pricePerRequest && (
                    <span>€{agent.pricePerRequest.toFixed(3)}/req</span>
                )}
            </div>
        </div>
    );
}
