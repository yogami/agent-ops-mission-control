import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { KillSwitch } from './KillSwitch';

describe('KillSwitch', () => {
    const defaultProps = {
        agentId: '1',
        agentName: 'Test Agent',
        onKill: vi.fn().mockResolvedValue(undefined),
        onRestore: vi.fn().mockResolvedValue(undefined),
    };

    it('should show the kill button', () => {
        render(<KillSwitch {...defaultProps} />);
        expect(screen.getByTestId('kill-switch')).toBeInTheDocument();
    });

    it('should show confirmation modal with countdown when clicked', async () => {
        vi.useFakeTimers();
        render(<KillSwitch {...defaultProps} />);
        fireEvent.click(screen.getByTestId('kill-switch'));

        expect(screen.getByTestId('kill-confirm-modal')).toBeInTheDocument();
        const confirmBtn = screen.getByTestId('confirm-kill');
        expect(confirmBtn).toBeDisabled();
        expect(confirmBtn).toHaveTextContent('Confirm (3)');

        // Advance 3 seconds
        await act(async () => {
            vi.advanceTimersByTime(3000);
        });

        expect(confirmBtn).toBeEnabled();
        expect(confirmBtn).toHaveTextContent('Confirm Kill');

        vi.useRealTimers();
    });

    it('should show stopped status and restore button when stopped', () => {
        render(<KillSwitch {...defaultProps} isEmergencyStopped={true} />);
        expect(screen.getByText('STOPPED')).toBeInTheDocument();
        expect(screen.getByTestId('restore-agent')).toBeInTheDocument();
    });

    it('should call onRestore when restore clicked', async () => {
        render(<KillSwitch {...defaultProps} isEmergencyStopped={true} />);
        fireEvent.click(screen.getByTestId('restore-agent'));
        expect(defaultProps.onRestore).toHaveBeenCalledWith('1');
    });
});
