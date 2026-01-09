import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { GlobalKillSwitch } from './GlobalKillSwitch';

describe('GlobalKillSwitch', () => {
    const defaultProps = {
        onGlobalKill: vi.fn().mockResolvedValue(undefined),
        activeAgentCount: 5,
    };

    it('should show the emergency stop button', () => {
        render(<GlobalKillSwitch {...defaultProps} />);
        expect(screen.getByTestId('global-kill-switch')).toBeInTheDocument();
    });

    it('should open modal when clicked', () => {
        render(<GlobalKillSwitch {...defaultProps} />);
        fireEvent.click(screen.getByTestId('global-kill-switch'));
        expect(screen.getByTestId('global-kill-modal')).toBeInTheDocument();
        expect(screen.getByText('5')).toBeInTheDocument(); // Active count
    });

    it('should countdown and enable confirm button', async () => {
        vi.useFakeTimers();
        render(<GlobalKillSwitch {...defaultProps} />);
        fireEvent.click(screen.getByTestId('global-kill-switch'));

        const confirmBtn = screen.getByTestId('confirm-global-kill');
        expect(confirmBtn).toBeDisabled();
        expect(confirmBtn).toHaveTextContent('KILL ALL (5)');

        // Advance 5 seconds
        await act(async () => {
            vi.advanceTimersByTime(5000);
        });

        expect(confirmBtn).toBeEnabled();
        expect(confirmBtn).toHaveTextContent('KILL ALL AGENTS');

        vi.useRealTimers();
    });

    it('should call onGlobalKill when confirmed', async () => {
        vi.useFakeTimers();
        render(<GlobalKillSwitch {...defaultProps} />);
        fireEvent.click(screen.getByTestId('global-kill-switch'));

        await act(async () => {
            vi.advanceTimersByTime(5000);
        });

        fireEvent.click(screen.getByTestId('confirm-global-kill'));
        expect(defaultProps.onGlobalKill).toHaveBeenCalled();

        vi.useRealTimers();
    });
});
