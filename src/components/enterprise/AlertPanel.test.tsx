import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AlertPanel } from './AlertPanel';
import { Anomaly, AnomalySeverity, AnomalyType } from '@/domain/Agent';

describe('AlertPanel', () => {
    const mockAnomalies: Anomaly[] = [
        { id: '1', type: 'drift' as AnomalyType, severity: 'critical' as AnomalySeverity, message: 'Drift detected', detectedAt: new Date().toISOString() },
        { id: '2', type: 'performance' as AnomalyType, severity: 'low' as AnomalySeverity, message: 'Slow response', detectedAt: new Date().toISOString(), resolved: true },
    ];

    const defaultProps = {
        anomalies: mockAnomalies,
        onResolve: vi.fn(),
        onConfigureAlerts: vi.fn(),
    };

    it('should show the alert bell with count', () => {
        render(<AlertPanel {...defaultProps} />);
        expect(screen.getByTestId('alert-panel-trigger')).toBeInTheDocument();
        expect(screen.getByText('1')).toBeInTheDocument(); // 1 unresolved
    });

    it('should open the panel when clicked', () => {
        render(<AlertPanel {...defaultProps} />);
        fireEvent.click(screen.getByTestId('alert-panel-trigger'));
        expect(screen.getByTestId('alert-panel')).toBeInTheDocument();
    });

    it('should filter anomalies by severity', () => {
        render(<AlertPanel {...defaultProps} />);
        fireEvent.click(screen.getByTestId('alert-panel-trigger'));

        const severitySelect = screen.getByDisplayValue('All Severities');
        fireEvent.change(severitySelect, { target: { value: 'critical' } });

        const items = screen.getAllByTestId('anomaly-item');
        expect(items).toHaveLength(1);
        expect(screen.getByText('Drift detected')).toBeInTheDocument();
    });

    it('should call onResolve when resolving an anomaly', () => {
        render(<AlertPanel {...defaultProps} />);
        fireEvent.click(screen.getByTestId('alert-panel-trigger'));

        const resolveBtn = screen.getByText('Mark Resolved');
        fireEvent.click(resolveBtn);
        expect(defaultProps.onResolve).toHaveBeenCalledWith('1');
    });
});
