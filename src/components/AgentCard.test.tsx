import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AgentCard } from './AgentCard';
import { createAgent } from '@/domain/Agent';

describe('AgentCard Component', () => {
    const mockAgent = createAgent({
        name: 'Test Agent',
        trustScore: 85,
        description: 'Testing description',
        category: 'compliance',
        badges: [{ type: 'GDPR', verified: true }]
    });

    it('should render agent information', () => {
        render(<AgentCard agent={mockAgent} />);

        expect(screen.getByText('Test Agent')).toBeDefined();
        expect(screen.getByText('85')).toBeDefined();
        expect(screen.getByText('Testing description')).toBeDefined();
        expect(screen.getByText('compliance')).toBeDefined();
        expect(screen.getByText('✓ GDPR')).toBeDefined();
    });

    it('should call onClick when clicked', () => {
        const handleClick = vi.fn();
        render(<AgentCard agent={mockAgent} onClick={handleClick} />);

        fireEvent.click(screen.getByTestId('agent-card'));
        expect(handleClick).toHaveBeenCalled();
    });

    it('should show correct status pulse color', () => {
        const { rerender } = render(<AgentCard agent={{ ...mockAgent, status: 'online' }} />);
        expect(document.querySelector('.status-online')).toBeDefined();

        rerender(<AgentCard agent={{ ...mockAgent, status: 'degraded' }} />);
        expect(document.querySelector('.status-warning')).toBeDefined();

        rerender(<AgentCard agent={{ ...mockAgent, status: 'offline' }} />);
        expect(document.querySelector('.status-offline')).toBeDefined();
    });
});
