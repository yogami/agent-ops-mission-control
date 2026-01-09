import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { HumanReviewPanel } from './HumanReviewPanel';

describe('HumanReviewPanel', () => {
    const mockActions = [
        { id: '1', action: 'Action 1', description: 'Desc 1', requestedAt: new Date().toISOString(), status: 'pending' as const },
        { id: '2', action: 'Action 2', description: 'Desc 2', requestedAt: new Date().toISOString(), status: 'approved' as const, reviewedBy: 'admin', reviewedAt: new Date().toISOString() },
    ];

    const defaultProps = {
        pendingActions: mockActions,
        onApprove: vi.fn(),
        onDeny: vi.fn(),
    };

    it('should show the review trigger with count', () => {
        render(<HumanReviewPanel {...defaultProps} />);
        expect(screen.getByTestId('human-review-trigger')).toBeInTheDocument();
        expect(screen.getByText('1')).toBeInTheDocument(); // 1 pending
    });

    it('should open the panel when clicked', () => {
        render(<HumanReviewPanel {...defaultProps} />);
        fireEvent.click(screen.getByTestId('human-review-trigger'));
        expect(screen.getByTestId('human-review-panel')).toBeInTheDocument();
    });

    it('should call onApprove when approving an action', async () => {
        render(<HumanReviewPanel {...defaultProps} />);
        fireEvent.click(screen.getByTestId('human-review-trigger'));

        const approveBtn = screen.getByTestId('approve-action');
        fireEvent.click(approveBtn);

        expect(defaultProps.onApprove).toHaveBeenCalledWith('1', 'current-user');
    });

    it('should show deny modal and call onDeny', async () => {
        render(<HumanReviewPanel {...defaultProps} />);
        fireEvent.click(screen.getByTestId('human-review-trigger'));

        const denyBtn = screen.getByTestId('deny-action');
        fireEvent.click(denyBtn);

        expect(screen.getByPlaceholderText(/Reason for denial/)).toBeInTheDocument();

        fireEvent.change(screen.getByPlaceholderText(/Reason for denial/), { target: { value: 'Too risky' } });
        fireEvent.click(screen.getByTestId('confirm-deny'));

        expect(defaultProps.onDeny).toHaveBeenCalledWith('1', 'current-user', 'Too risky');
    });
});
