import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import DashboardSummary from './DashboardSummary';
import { createAgent } from '@/domain/Agent';

describe('DashboardSummary Component', () => {
    const mockAgents = [
        createAgent({ name: 'Agent 1', executionStatus: 'running', trustScore: 90 }),
        createAgent({ name: 'Agent 2', executionStatus: 'review', trustScore: 80 }),
    ];

    it('should calculate and display correct stats', () => {
        render(<DashboardSummary agents={mockAgents} onNewAgent={() => { }} />);

        expect(screen.getByTestId('active-count').textContent).toContain('1');
        expect(screen.getByTestId('review-count').textContent).toContain('1');
        expect(screen.getByTestId('avg-trust').textContent).toContain('85%');
    });

    it('should call onNewAgent when deploy card is clicked', () => {
        const handleNewAgent = vi.fn();
        render(<DashboardSummary agents={[]} onNewAgent={handleNewAgent} />);

        fireEvent.click(screen.getByText('Deploy New Agent'));
        expect(handleNewAgent).toHaveBeenCalled();
    });

    it('should handle empty agents list', () => {
        render(<DashboardSummary agents={[]} onNewAgent={() => { }} />);

        expect(screen.getByTestId('active-count').textContent).toContain('0');
        expect(screen.getByTestId('review-count').textContent).toContain('0');
        expect(screen.getByTestId('avg-trust').textContent).toContain('0%');
    });
});
