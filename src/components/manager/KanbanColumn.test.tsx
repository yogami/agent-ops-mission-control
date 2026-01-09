import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, createEvent } from '@testing-library/react';
import KanbanColumn from './KanbanColumn';
import { createAgent } from '@/domain/Agent';

describe('KanbanColumn Component', () => {
    const mockAgents = [
        createAgent({ id: '1', name: 'Agent 1' }),
    ];

    it('should render column title and agent count', () => {
        render(<KanbanColumn title="Test Column" agents={mockAgents} color="bg-blue-500" onDrop={() => { }} />);

        expect(screen.getByText('Test Column')).toBeDefined();
        expect(screen.getByText('1')).toBeDefined();
        expect(screen.getByText('Agent 1')).toBeDefined();
    });

    it('should show empty state message', () => {
        render(<KanbanColumn title="Empty" agents={[]} color="bg-blue-500" onDrop={() => { }} />);

        expect(screen.getByText('Drop agents here')).toBeDefined();
    });

    it('should handle drag over', () => {
        render(<KanbanColumn title="Test" agents={[]} color="bg-blue-500" onDrop={() => { }} />);
        const column = screen.getByTestId('kanban-column');

        const event = createEvent.dragOver(column);
        fireEvent(column, event);

        expect(event.defaultPrevented).toBe(true);
    });

    it('should handle drop', () => {
        const handleDrop = vi.fn();
        render(<KanbanColumn title="Test" agents={[]} color="bg-blue-500" onDrop={handleDrop} />);
        const column = screen.getByTestId('kanban-column');

        const dragEvent = {
            dataTransfer: {
                getData: vi.fn().mockReturnValue('agent-123')
            }
        };

        fireEvent.drop(column, dragEvent);
        expect(handleDrop).toHaveBeenCalledWith('agent-123');
    });
});
