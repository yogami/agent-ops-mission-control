import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import ManagePage from './page';
import { createAgent } from '@/domain/Agent';

describe('ManagePage Component', () => {
    beforeEach(() => {
        vi.stubGlobal('fetch', vi.fn());
    });

    it('should fetch and render agents', async () => {
        const mockAgents = [
            createAgent({ id: '1', name: 'Agent 1', executionStatus: 'running' }),
        ];

        vi.mocked(fetch).mockResolvedValueOnce({
            ok: true,
            json: async () => mockAgents,
        } as unknown as Response);

        render(<ManagePage />);

        // Should show loading initially
        expect(document.querySelector('.animate-spin')).toBeDefined();

        await waitFor(() => {
            expect(screen.getByText('Agent 1')).toBeDefined();
            expect(screen.getByText('SUPABASE CONNECTED')).toBeDefined();
        });
    });

    it('should handle status change', async () => {
        const mockAgents = [
            createAgent({ id: '1', name: 'Agent 1', executionStatus: 'scheduled' }),
        ];

        vi.mocked(fetch)
            .mockResolvedValueOnce({
                ok: true,
                json: async () => mockAgents,
            } as unknown as Response)
            .mockResolvedValueOnce({
                ok: true,
            } as unknown as Response);

        render(<ManagePage />);

        await waitFor(() => {
            expect(screen.getByText('Agent 1')).toBeDefined();
        });

        // Simulate status change call via drop
        const activeColumn = screen.getByTestId('kanban-column-running');
        fireEvent.drop(activeColumn, {
            dataTransfer: {
                getData: (key: string) => key === 'agentId' ? '1' : ''
            }
        });

        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith(
                expect.stringContaining('/api/manager/agents/1'),
                expect.objectContaining({
                    method: 'PATCH',
                    body: expect.stringContaining('"executionStatus":"running"')
                })
            );
        });
    });

    it('should handle fetch errors gracefully', async () => {
        vi.mocked(fetch).mockResolvedValueOnce({
            ok: false,
        } as unknown as Response);

        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });
        render(<ManagePage />);

        await waitFor(() => {
            expect(isLoading()).toBe(false);
        });

        expect(consoleSpy).toHaveBeenCalledWith('Error loading agents:', expect.any(Error));
    });
});

function isLoading() {
    return !!document.querySelector('.animate-spin');
}
