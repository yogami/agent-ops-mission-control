import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DiscoverPage from './page';

describe('DiscoverPage Component', () => {
    it('should show all agents initially', () => {
        render(<DiscoverPage />);

        expect(screen.getByText(/All Available Agents/)).toBeDefined();
        // Since it's using SEED_AGENTS, we expect some cards
        expect(screen.getAllByTestId('agent-card').length).toBeGreaterThan(0);
    });

    it('should search and filter agents', async () => {
        render(<DiscoverPage />);
        const input = screen.getByPlaceholderText(/Search for agents/i);

        // Use a term that matches ConvoGuard AI from seed data
        fireEvent.change(input, { target: { value: 'ConvoGuard' } });
        fireEvent.click(screen.getByRole('button', { name: /search/i }));

        expect(screen.getByText(/Searching registry/)).toBeDefined();

        await waitFor(() => {
            expect(screen.getByText(/Found 1 agent for "ConvoGuard"/)).toBeDefined();
            expect(screen.getByText('ConvoGuard AI')).toBeDefined();
        });
    });

    it('should show no results message', async () => {
        render(<DiscoverPage />);
        const input = screen.getByPlaceholderText(/Search for agents/i);

        fireEvent.change(input, { target: { value: 'NonExistentAgent123' } });
        fireEvent.click(screen.getByRole('button', { name: /search/i }));

        await waitFor(() => {
            expect(screen.getByText(/No agents found for "NonExistentAgent123"/)).toBeDefined();
        });

        fireEvent.click(screen.getByText('Show All Agents'));
        expect(screen.getByText(/All Available Agents/)).toBeDefined();
    });
});
