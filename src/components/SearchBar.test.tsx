import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SearchBar } from './SearchBar';

describe('SearchBar Component', () => {
    it('should update query on input change', () => {
        render(<SearchBar onSearch={() => { }} />);
        const input = screen.getByPlaceholderText(/Search for agents/i) as HTMLInputElement;

        fireEvent.change(input, { target: { value: 'test query' } });
        expect(input.value).toBe('test query');
    });

    it('should call onSearch on submit', () => {
        const handleSearch = vi.fn();
        render(<SearchBar onSearch={handleSearch} />);
        const input = screen.getByPlaceholderText(/Search for agents/i);

        fireEvent.change(input, { target: { value: 'test query' } });
        fireEvent.click(screen.getByRole('button', { name: /search/i }));

        expect(handleSearch).toHaveBeenCalledWith('test query');
    });

    it('should call onSearch when clicking suggestions', () => {
        const handleSearch = vi.fn();
        render(<SearchBar onSearch={handleSearch} />);

        fireEvent.click(screen.getByText('GDPR compliance'));

        expect(handleSearch).toHaveBeenCalledWith('GDPR compliance');
    });

    it('should disable input and button when loading', () => {
        render(<SearchBar onSearch={() => { }} isLoading={true} />);

        const input = screen.getByPlaceholderText(/Search for agents/i);
        const button = screen.getByRole('button', { name: /searching/i });

        expect(input).toBeDisabled();
        expect(button).toBeDisabled();
    });
});
