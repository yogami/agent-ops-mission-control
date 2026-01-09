import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import KanbanBoard from './KanbanBoard';
import { createAgent } from '@/domain/Agent';

describe('KanbanBoard Component', () => {
    const mockAgents = [
        createAgent({ id: '1', name: 'Agent 1', executionStatus: 'scheduled' }),
        createAgent({ id: '2', name: 'Agent 2', executionStatus: 'running' }),
    ];

    it('should render all columns', () => {
        render(<KanbanBoard agents={mockAgents} onStatusChange={() => { }} />);

        expect(screen.getByText('Scheduled')).toBeDefined();
        expect(screen.getByText('Active')).toBeDefined();
        expect(screen.getByText('In Review')).toBeDefined();
        expect(screen.getByText('Completed')).toBeDefined();
    });

    it('should filter agents into correct columns', () => {
        render(<KanbanBoard agents={mockAgents} onStatusChange={() => { }} />);

        const scheduledColumn = screen.getByTestId('kanban-column-scheduled');
        const activeColumn = screen.getByTestId('kanban-column-running');

        expect(scheduledColumn.textContent).toContain('Agent 1');
        expect(activeColumn.textContent).toContain('Agent 2');
    });
});
