'use client';

import { Agent, ExecutionStatus } from '@/domain/Agent';
import KanbanColumn from './KanbanColumn';

interface KanbanBoardProps {
    agents: Agent[];
    onStatusChange: (agentId: string, newStatus: ExecutionStatus) => void;
}

export default function KanbanBoard({ agents, onStatusChange }: KanbanBoardProps) {
    const columns: { title: string; status: ExecutionStatus; color: string }[] = [
        { title: 'Scheduled', status: 'scheduled', color: 'bg-gray-500/20' },
        { title: 'Active', status: 'running', color: 'bg-cyan-500/20' },
        { title: 'In Review', status: 'review', color: 'bg-amber-500/20' },
        { title: 'Completed', status: 'completed', color: 'bg-emerald-500/20' },
    ];

    return (
        <div data-testid="kanban-board" className="flex gap-6 overflow-x-auto pb-6 custom-scrollbar">
            {columns.map((column) => (
                <KanbanColumn
                    key={column.status}
                    data-testid={`kanban-column-${column.status}`}
                    title={column.title}
                    color={column.color}
                    agents={agents.filter((a) => a.executionStatus === column.status)}
                    onDrop={(agentId) => onStatusChange(agentId, column.status)}
                />
            ))}
        </div>
    );
}
