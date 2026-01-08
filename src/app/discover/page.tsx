/**
 * Discovery Page
 * 
 * Natural language search for agent discovery with live results.
 */

'use client';

import { useState } from 'react';
import { SearchBar } from '@/components/SearchBar';
import { FleetGrid } from '@/components/FleetGrid';
import { SEED_AGENTS } from '@/infrastructure/seedAgents';
import { Agent } from '@/domain/Agent';
import Link from 'next/link';

export default function DiscoverPage() {
    const [results, setResults] = useState<Agent[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [lastQuery, setLastQuery] = useState('');

    const handleSearch = async (query: string) => {
        setIsLoading(true);
        setLastQuery(query);
        setHasSearched(true);

        // Simulate API delay for demo effect
        await new Promise(resolve => setTimeout(resolve, 500));

        // Local filtering for demo (in production, call Capability Broker API)
        const queryLower = query.toLowerCase();
        const filtered = SEED_AGENTS.filter(agent =>
            agent.name.toLowerCase().includes(queryLower) ||
            agent.description.toLowerCase().includes(queryLower) ||
            agent.tags.some(tag => tag.toLowerCase().includes(queryLower)) ||
            agent.badges.some(b => b.type.toLowerCase().includes(queryLower.replace('-', '_')))
        );

        setResults(filtered);
        setIsLoading(false);
    };

    return (
        <main className="min-h-screen py-12 px-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-12">
                    <Link href="/" className="text-sm text-gray-500 hover:text-[var(--primary)] mb-4 inline-block">
                        ← Back to Dashboard
                    </Link>
                    <h1 className="text-4xl font-bold text-white mb-4">
                        Discover <span className="gradient-text">Verified Agents</span>
                    </h1>
                    <p className="text-gray-400 max-w-2xl">
                        Search our registry of pre-vetted, regulatory-compliant AI agents.
                        Every agent is verified for EU AI Act, GDPR, and industry-specific compliance.
                    </p>
                </div>

                {/* Search */}
                <div className="mb-12">
                    <SearchBar onSearch={handleSearch} isLoading={isLoading} />
                </div>

                {/* Results */}
                <div data-testid="search-results">
                    {!hasSearched ? (
                        // Initial state - show all agents
                        <div>
                            <h2 className="text-xl font-semibold text-white mb-6">
                                All Available Agents ({SEED_AGENTS.length})
                            </h2>
                            <FleetGrid agents={SEED_AGENTS} />
                        </div>
                    ) : isLoading ? (
                        // Loading state
                        <div className="flex items-center justify-center py-20">
                            <div className="flex items-center gap-3 text-gray-400">
                                <div className="w-6 h-6 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
                                <span>Searching registry...</span>
                            </div>
                        </div>
                    ) : results.length > 0 ? (
                        // Results found
                        <div>
                            <h2 className="text-xl font-semibold text-white mb-6">
                                Found {results.length} agent{results.length !== 1 ? 's' : ''} for "{lastQuery}"
                            </h2>
                            <FleetGrid agents={results} />
                        </div>
                    ) : (
                        // No results
                        <div className="text-center py-20">
                            <div className="text-6xl mb-4">🔍</div>
                            <h2 className="text-xl font-semibold text-white mb-2">
                                No agents found for "{lastQuery}"
                            </h2>
                            <p className="text-gray-400 mb-6">
                                Try a different search term or browse all available agents.
                            </p>
                            <button
                                onClick={() => {
                                    setHasSearched(false);
                                    setResults([]);
                                }}
                                className="btn-secondary"
                            >
                                Show All Agents
                            </button>
                        </div>
                    )}
                </div>

                {/* Compliance Legend */}
                <div className="mt-16 p-6 glass-card">
                    <h3 className="text-lg font-semibold text-white mb-4">Compliance Badges</h3>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        {[
                            { type: 'AI_ACT', label: 'EU AI Act', desc: 'Compliant with Regulation 2024/1689' },
                            { type: 'GDPR', label: 'GDPR', desc: 'Data protection verified' },
                            { type: 'DIGA', label: 'DiGA', desc: 'German digital health approved' },
                            { type: 'SOC2', label: 'SOC2', desc: 'Security controls audited' },
                            { type: 'ISO27001', label: 'ISO27001', desc: 'Information security certified' },
                        ].map((badge) => (
                            <div key={badge.type} className="text-center">
                                <div className="inline-block px-3 py-1 rounded-full bg-[var(--surface-2)] border border-[var(--border)] text-[var(--primary)] text-sm mb-2">
                                    ✓ {badge.label}
                                </div>
                                <p className="text-xs text-gray-500">{badge.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}
