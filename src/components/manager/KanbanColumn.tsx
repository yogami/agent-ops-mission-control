'use client';

import { Agent, ExecutionStatus } from '@/domain/Agent';
import ManagerAgentCard from './ManagerAgentCard';

interface KanbanColumnProps {
    title: string;
    status: ExecutionStatus;
    color: string;
    agents: Agent[];
    onDrop: (agentId: string) => void;
}

export default function KanbanColumn({ title, agents, status, color, onDrop }: KanbanColumnProps) {
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent) => {
        const agentId = e.dataTransfer.getData('agentId');
        if (agentId) {
            onDrop(agentId);
        }
    };

    return (
        <div
            className="flex-1 min-w-[300px] flex flex-col h-full"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
        >
            <div className="flex items-center justify-between mb-4 border-b border-[var(--border)] pb-2 px-2">
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${color.replace('/20', '')}`} />
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">{title}</h3>
                </div>
                <span className="text-xs text-gray-500 font-mono">{agents.length}</span>
            </div>

            <div className="flex flex-col gap-4 flex-1">
                {agents.map((agent) => (
                    <ManagerAgentCard
                        key={agent.id}
                        agent={agent}
                        draggable
                        onDragStart={(e) => {
                            e.dataTransfer.setData('agentId', agent.id);
                        }}
                    />
                ))}
                {agents.length === 0 && (
                    <div className="h-32 rounded-xl border border-dashed border-white/5 bg-white/[0.01] flex items-center justify-center text-xs text-gray-700 italic">
                        Drop agents here
                    </div>
                )}
            </div>
        </div>
    );
}
