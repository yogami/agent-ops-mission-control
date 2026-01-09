import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { EnterpriseTrialModal } from './EnterpriseTrialModal';

describe('EnterpriseTrialModal', () => {
    const defaultProps = {
        isOpen: true,
        onClose: vi.fn(),
    };

    it('should show nothing if not open', () => {
        const { container } = render(<EnterpriseTrialModal {...defaultProps} isOpen={false} />);
        expect(container).toBeEmptyDOMElement();
    });

    it('should show form when open', () => {
        render(<EnterpriseTrialModal {...defaultProps} />);
        expect(screen.getByTestId('enterprise-trial-modal')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Acme Corp')).toBeInTheDocument();
    });

    it('should validate form fields', () => {
        render(<EnterpriseTrialModal {...defaultProps} />);
        const submitBtn = screen.getByTestId('btn-start-trial');
        expect(submitBtn).toBeDisabled();

        fireEvent.change(screen.getByPlaceholderText('Acme Corp'), { target: { value: 'Acme' } });
        fireEvent.change(screen.getByPlaceholderText('you@company.com'), { target: { value: 'test@test.com' } });

        expect(submitBtn).toBeEnabled();
    });

    it('should show success message on submission', async () => {
        render(<EnterpriseTrialModal {...defaultProps} />);

        fireEvent.change(screen.getByPlaceholderText('Acme Corp'), { target: { value: 'Acme' } });
        fireEvent.change(screen.getByPlaceholderText('you@company.com'), { target: { value: 'test@test.com' } });
        fireEvent.click(screen.getByTestId('btn-start-trial'));

        expect(screen.getByText('Starting Trial...')).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.getByText('Welcome to AgentOps!')).toBeInTheDocument();
        }, { timeout: 2000 });
    });
});
