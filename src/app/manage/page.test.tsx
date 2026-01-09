import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import ManagePage from './page';
import { createAgent } from '@/domain/Agent';

describe('ManagePage Component', () => {
    const mockAgents = [
        createAgent({ id: '1', name: 'Agent 1', executionStatus: 'running', status: 'online' }),
    ];

    const mockAnomalies = [
        { id: 'a1', type: 'drift', severity: 'critical', message: 'Test Anomaly', detectedAt: new Date().toISOString() }
    ];

    const mockActions = [
        { id: 'act1', action: 'Update', description: 'Test Action', status: 'pending', requestedAt: new Date().toISOString() }
    ];

    beforeEach(() => {
        vi.stubGlobal('fetch', vi.fn((url) => {
            if (url.includes('/api/manager/agents')) {
                return Promise.resolve({ ok: true, json: async () => mockAgents } as Response);
            }
            if (url.includes('/api/anomalies')) {
                return Promise.resolve({ ok: true, json: async () => ({ anomalies: mockAnomalies }) } as Response);
            }
            if (url.includes('/api/actions')) {
                return Promise.resolve({ ok: true, json: async () => ({ actions: mockActions }) } as Response);
            }
            return Promise.resolve({ ok: true, json: async () => [] } as Response);
        }));
        vi.stubGlobal('alert', vi.fn());
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('should fetch and render all data', async () => {
        render(<ManagePage />);

        await waitFor(() => {
            expect(screen.getByText('Agent 1')).toBeInTheDocument();
        });
    });

    it('should handle action review triggers', async () => {
        render(<ManagePage />);

        await waitFor(() => {
            expect(screen.getByTestId('human-review-trigger')).toBeInTheDocument();
        });

        fireEvent.click(screen.getByTestId('human-review-trigger'));
        expect(screen.getByText('Human-in-Loop Review')).toBeInTheDocument();
    });

    it('should handle status change', async () => {
        render(<ManagePage />);

        await waitFor(() => {
            expect(screen.getByText('Agent 1')).toBeInTheDocument();
        });

        const runningColumn = screen.getByTestId('kanban-column-running');
        fireEvent.drop(runningColumn, {
            dataTransfer: {
                getData: (key: string) => key === 'agentId' ? '1' : ''
            }
        });

        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith(
                expect.stringContaining('/api/manager/agents/1'),
                expect.objectContaining({ method: 'PATCH' })
            );
        });
    });

    it('should handle fetch errors gracefully', async () => {
        vi.mocked(fetch).mockResolvedValue({
            ok: false,
        } as Response);

        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });
        render(<ManagePage />);

        await waitFor(() => {
            expect(document.querySelector('.animate-spin')).toBeNull();
        }, { timeout: 3000 });

        expect(consoleSpy).toHaveBeenCalled();
    });
});
