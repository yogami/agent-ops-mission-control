import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AnomalyBadge } from './AnomalyBadge';
import { Anomaly, AnomalySeverity, AnomalyType } from '@/domain/Agent';

describe('AnomalyBadge', () => {
    const mockAnomalies: Anomaly[] = [
        { id: '1', type: 'drift' as AnomalyType, severity: 'critical' as AnomalySeverity, message: 'Model drift', detectedAt: new Date().toISOString() },
        { id: '2', type: 'performance' as AnomalyType, severity: 'low' as AnomalySeverity, message: 'Slow', detectedAt: new Date().toISOString() },
    ];

    it('should show nothing if no unresolved anomalies', () => {
        const { container } = render(<AnomalyBadge anomalies={[]} />);
        expect(container).toBeEmptyDOMElement();

        const resolved: Anomaly[] = [{ id: '1', type: 'drift' as AnomalyType, severity: 'critical' as AnomalySeverity, message: 'Fixed', detectedAt: new Date().toISOString(), resolved: true }];
        const { container: container2 } = render(<AnomalyBadge anomalies={resolved} />);
        expect(container2).toBeEmptyDOMElement();
    });

    it('should show count and highest severity indicator', () => {
        render(<AnomalyBadge anomalies={mockAnomalies} />);
        expect(screen.getByTestId('anomaly-badge')).toBeInTheDocument();
        expect(screen.getByText('2')).toBeInTheDocument();
    });

    it('should show tooltip content on hover', () => {
        render(<AnomalyBadge anomalies={mockAnomalies} />);
        expect(screen.getByText(/2 Active Anomalies/)).toBeInTheDocument();
        expect(screen.getByText('DRIFT')).toBeInTheDocument();
        expect(screen.getByText('PERFORMANCE')).toBeInTheDocument();
    });
});
