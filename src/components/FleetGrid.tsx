'use client';

/**
 * FleetGrid Component
 * 
 * Displays the agent fleet as a responsive grid of cards.
 */

import { Agent } from '@/domain/Agent';
import { AgentCard } from './AgentCard';

interface FleetGridProps {
    agents: Agent[];
    onAgentClick?: (agent: Agent) => void;
    emptyMessage?: string;
}

export function FleetGrid({ agents, onAgentClick, emptyMessage = 'No agents found' }: FleetGridProps) {
    if (agents.length === 0) {
        return (
            <div
                data-testid="fleet-grid-empty"
                className="flex flex-col items-center justify-center py-16 text-gray-400"
            >
                <svg
                    className="w-16 h-16 mb-4 opacity-50"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                </svg>
                <p>{emptyMessage}</p>
            </div>
        );
    }

    return (
        <div
            data-testid="fleet-grid"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
            {agents.map((agent) => (
                <AgentCard
                    key={agent.id}
                    agent={agent}
                    onClick={() => onAgentClick?.(agent)}
                />
            ))}
        </div>
    );
}
