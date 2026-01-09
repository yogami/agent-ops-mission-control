import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ShadowDiscoveryPage from './page';

describe('ShadowDiscoveryPage', () => {
    beforeEach(() => {
        vi.stubGlobal('fetch', vi.fn());
    });

    it('should navigate through the wizard', async () => {
        vi.mocked(fetch).mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                agents: [{ id: '1', name: 'Agent 1', provider: 'aws', type: 'Model' }],
                isMockData: true
            })
        } as Response);

        render(<ShadowDiscoveryPage />);

        // Step 1: Select Provider
        fireEvent.click(screen.getByTestId('provider-aws'));
        fireEvent.click(screen.getByTestId('btn-next-provider'));

        // Step 2: Credentials
        expect(screen.getByTestId('btn-start-scan')).toBeInTheDocument();
        fireEvent.click(screen.getByTestId('btn-start-scan'));

        // Step 3: Scanning (should show results after fetch)
        await waitFor(() => {
            expect(screen.getByText('Discovered Agents')).toBeInTheDocument();
            expect(screen.getByText('Agent 1')).toBeInTheDocument();
        });

        // Step 4: Add toRegistry
        fireEvent.click(screen.getByTestId('add-to-registry'));
        expect(screen.getByText('✓ Added')).toBeInTheDocument();
    });

    it('should handle scan error', async () => {
        vi.mocked(fetch).mockResolvedValueOnce({
            ok: false,
        } as Response);

        render(<ShadowDiscoveryPage />);

        fireEvent.click(screen.getByTestId('provider-aws'));
        fireEvent.click(screen.getByTestId('btn-next-provider'));
        fireEvent.click(screen.getByTestId('btn-start-scan'));

        await waitFor(() => {
            expect(screen.getByText(/Scan failed/i)).toBeInTheDocument();
        });
    });
});
