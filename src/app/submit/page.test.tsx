import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import SubmitPage from './page';

describe('SubmitPage', () => {
    beforeEach(() => {
        vi.stubGlobal('fetch', vi.fn());
    });

    it('should navigate and submit successfully', async () => {
        vi.mocked(fetch).mockResolvedValueOnce({
            ok: true,
            json: async () => ({ success: true })
        } as Response);

        render(<SubmitPage />);

        // Step 1
        fireEvent.change(screen.getByTestId('input-name'), { target: { value: 'Test Agent' } });
        fireEvent.click(screen.getByTestId('btn-next-1'));

        // Step 2
        fireEvent.click(screen.getByTestId('badge-GDPR'));
        fireEvent.click(screen.getByTestId('btn-next-2'));

        // Step 3
        fireEvent.click(screen.getByTestId('checkbox-tos'));
        fireEvent.click(screen.getByTestId('btn-submit'));

        await waitFor(() => {
            expect(screen.getByText('Agent Submitted!')).toBeInTheDocument();
        });
    });

    it('should handle submission error', async () => {
        vi.mocked(fetch).mockResolvedValueOnce({
            ok: false,
            json: async () => ({ error: 'Fail' })
        } as Response);

        render(<SubmitPage />);

        // Fill steps
        fireEvent.change(screen.getByTestId('input-name'), { target: { value: 'Test Agent' } });
        fireEvent.click(screen.getByTestId('btn-next-1'));
        fireEvent.click(screen.getByTestId('badge-GDPR'));
        fireEvent.click(screen.getByTestId('btn-next-2'));
        fireEvent.click(screen.getByTestId('checkbox-tos'));
        fireEvent.click(screen.getByTestId('btn-submit'));

        await waitFor(() => {
            expect(screen.getByText('Fail')).toBeInTheDocument();
        });
    });
});
