'use client';

import { Agent, getTrustScoreLabel } from '@/domain/Agent';

interface ManagerAgentCardProps {
    agent: Agent;
    draggable?: boolean;
    onDragStart?: (e: React.DragEvent) => void;
    onClick?: () => void;
}

export default function ManagerAgentCard({ agent, draggable, onDragStart, onClick }: ManagerAgentCardProps) {
    const scoreLabel = getTrustScoreLabel(agent.trustScore);
    const scoreColor =
        scoreLabel === 'Excellent' ? 'text-green-400' :
            scoreLabel === 'Good' ? 'text-yellow-400' : 'text-red-400';

    const timeRemaining = agent.deadline ? formatTimeRemaining(agent.deadline) : null;

    return (
        <div
            draggable={draggable}
            onDragStart={onDragStart}
            onClick={onClick}
            className="glass-card p-4 cursor-grab active:cursor-grabbing hover:translate-y-[-2px] transition-all group"
        >
            <div className="flex items-start justify-between mb-3">
                <h4 className="font-bold text-white group-hover:text-[var(--primary)] transition-colors truncate">
                    {agent.name}
                </h4>
                <span className={`text-sm font-mono font-bold ${scoreColor}`}>
                    {agent.trustScore}%
                </span>
            </div>

            <div className="flex flex-wrap gap-2 mb-3">
                {timeRemaining && (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 border border-white/10 text-gray-400">
                        ⏱️ {timeRemaining}
                    </span>
                )}
                {agent.did && (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-[var(--primary-glow)] border border-[var(--primary)]/20 text-[var(--primary)]">
                        DID:VERIFIED
                    </span>
                )}
            </div>

            {agent.lastAction && (
                <div className="bg-black/40 rounded-lg p-2 border border-white/5">
                    <p className="text-[10px] text-gray-500 font-mono line-clamp-2">
                        <span className="text-[var(--primary)] mr-1">❯</span>
                        {agent.lastAction}
                    </p>
                </div>
            )}
        </div>
    );
}

function formatTimeRemaining(deadline: string): string {
    const remaining = new Date(deadline).getTime() - Date.now();
    if (remaining < 0) return 'Overdue';
    const hours = Math.floor(remaining / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    if (hours > 24) return `${Math.floor(hours / 24)}d left`;
    if (hours > 0) return `${hours}h ${minutes}m left`;
    return `${minutes}m left`;
}
