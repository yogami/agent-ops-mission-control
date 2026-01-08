/**
 * SearchBar Component
 * 
 * Natural language search input for agent discovery.
 */

'use client';

import { useState, FormEvent } from 'react';

interface SearchBarProps {
    onSearch: (query: string) => void;
    placeholder?: string;
    isLoading?: boolean;
}

export function SearchBar({
    onSearch,
    placeholder = 'Search for agents... (e.g., "GDPR-safe HR screening tool")',
    isLoading = false
}: SearchBarProps) {
    const [query, setQuery] = useState('');

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            onSearch(query.trim());
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto">
            <div className="relative group">
                {/* Glow effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] rounded-2xl opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-500" />

                <div className="relative flex items-center">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder={placeholder}
                        className="w-full px-6 py-4 bg-[var(--surface-1)] border border-[var(--border)] rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-[var(--primary)] transition-colors"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !query.trim()}
                        className="absolute right-2 btn-primary px-6 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <span className="animate-pulse">Searching...</span>
                        ) : (
                            'Search'
                        )}
                    </button>
                </div>
            </div>

            {/* Quick suggestions */}
            <div className="flex flex-wrap gap-2 mt-4 justify-center">
                {['GDPR compliance', 'HR screening', 'Mental health', 'Financial audit'].map((suggestion) => (
                    <button
                        key={suggestion}
                        type="button"
                        onClick={() => {
                            setQuery(suggestion);
                            onSearch(suggestion);
                        }}
                        className="px-3 py-1 text-sm text-gray-400 hover:text-[var(--primary)] border border-[var(--border)] rounded-full hover:border-[var(--primary)] transition-colors"
                    >
                        {suggestion}
                    </button>
                ))}
            </div>
        </form>
    );
}
