import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ComplianceFilter } from './ComplianceFilter';

describe('ComplianceFilter Component', () => {
    it('should render all filter options', () => {
        render(<ComplianceFilter onFilterChange={() => { }} />);

        expect(screen.getByTestId('filter-GDPR')).toBeDefined();
        expect(screen.getByTestId('filter-AI_ACT')).toBeDefined();
        expect(screen.getByTestId('filter-DIGA')).toBeDefined();
        expect(screen.getByTestId('filter-DATA_RESIDENCY_EU')).toBeDefined();
    });

    it('should toggle filter on click', () => {
        const handleChange = vi.fn();
        render(<ComplianceFilter onFilterChange={handleChange} />);

        fireEvent.click(screen.getByTestId('filter-GDPR'));

        expect(handleChange).toHaveBeenCalledWith(['GDPR']);
        expect(screen.getByTestId('filter-GDPR')).toHaveTextContent('✓');
    });

    it('should deselect filter on second click', () => {
        const handleChange = vi.fn();
        render(<ComplianceFilter onFilterChange={handleChange} />);

        fireEvent.click(screen.getByTestId('filter-GDPR'));
        fireEvent.click(screen.getByTestId('filter-GDPR'));

        expect(handleChange).toHaveBeenLastCalledWith([]);
    });

    it('should support multiple filters', () => {
        const handleChange = vi.fn();
        render(<ComplianceFilter onFilterChange={handleChange} />);

        fireEvent.click(screen.getByTestId('filter-GDPR'));
        fireEvent.click(screen.getByTestId('filter-AI_ACT'));

        expect(handleChange).toHaveBeenLastCalledWith(['GDPR', 'AI_ACT']);
    });

    it('should show clear all button when filters selected', () => {
        render(<ComplianceFilter onFilterChange={() => { }} />);

        // No clear button initially
        expect(screen.queryByRole('button', { name: 'Clear all' })).toBeNull();

        // After selecting a filter
        fireEvent.click(screen.getByTestId('filter-GDPR'));
        expect(screen.getByRole('button', { name: 'Clear all' })).toBeDefined();
    });

    it('should clear all filters on clear button click', () => {
        const handleChange = vi.fn();
        render(<ComplianceFilter onFilterChange={handleChange} />);

        fireEvent.click(screen.getByTestId('filter-GDPR'));
        fireEvent.click(screen.getByTestId('filter-AI_ACT'));
        fireEvent.click(screen.getByRole('button', { name: 'Clear all' }));

        expect(handleChange).toHaveBeenLastCalledWith([]);
    });
});
