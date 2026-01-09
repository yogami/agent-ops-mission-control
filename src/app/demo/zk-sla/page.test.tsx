import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ZKSlaDemoPage from './page';

describe('ZKSlaDemoPage Component', () => {
    it('should run the simulation through all phases', async () => {
        render(<ZKSlaDemoPage />);

        const button = screen.getByRole('button', { name: /Initialize ZK Simulation/i });
        fireEvent.click(button);

        expect(screen.getByText(/Computing Proof/i)).toBeDefined();

        // Phase 1: ZK-SLA Proof
        await waitFor(() => {
            expect(screen.getByText('PROVED')).toBeDefined();
        }, { timeout: 2000 });

        // Phase 2: Credential Issuance
        await waitFor(() => {
            expect(screen.getByText('ISSUED')).toBeDefined();
        }, { timeout: 4000 });

        // Phase 3: Semantic Alignment
        await waitFor(() => {
            expect(screen.getByText('VERIFIED')).toBeDefined();
        }, { timeout: 6000 });

        // Final State: Done
        await waitFor(() => {
            expect(screen.getByText('TRUST ESTABLISHED')).toBeDefined();
            expect(screen.getByRole('button', { name: /Reset Simulation/i })).toBeDefined();
        }, { timeout: 8000 });
    }, 15000); // 15s timeout for the 4.5s simulation
});
