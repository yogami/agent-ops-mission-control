import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FleetGrid } from './FleetGrid';
import { createAgent } from '@/domain/Agent';

describe('FleetGrid Component', () => {
    const mockAgents = [
        createAgent({ id: '1', name: 'Agent 1' }),
        createAgent({ id: '2', name: 'Agent 2' }),
    ];

    it('should render a grid of agent cards', () => {
        render(<FleetGrid agents={mockAgents} />);

        expect(screen.getByTestId('fleet-grid')).toBeDefined();
        expect(screen.getByText('Agent 1')).toBeDefined();
        expect(screen.getByText('Agent 2')).toBeDefined();
    });

    it('should show empty message when no agents are provided', () => {
        render(<FleetGrid agents={[]} emptyMessage="Custom empty message" />);

        expect(screen.getByTestId('fleet-grid-empty')).toBeDefined();
        expect(screen.getByText('Custom empty message')).toBeDefined();
    });

    it('should call onAgentClick when a card is clicked', () => {
        const handleClick = vi.fn();
        render(<FleetGrid agents={mockAgents} onAgentClick={handleClick} />);

        fireEvent.click(screen.getByText('Agent 1'));
        expect(handleClick).toHaveBeenCalledWith(expect.objectContaining({ id: '1' }));
    });
});
