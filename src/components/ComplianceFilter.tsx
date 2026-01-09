'use client';

import { useState } from 'react';

export type ComplianceFilterType = 'GDPR' | 'AI_ACT' | 'DIGA' | 'DATA_RESIDENCY_EU';

interface ComplianceFilterProps {
    onFilterChange: (selectedFilters: ComplianceFilterType[]) => void;
}

const FILTER_OPTIONS: { type: ComplianceFilterType; label: string }[] = [
    { type: 'GDPR', label: 'GDPR' },
    { type: 'AI_ACT', label: 'EU AI Act' },
    { type: 'DIGA', label: 'DiGA' },
    { type: 'DATA_RESIDENCY_EU', label: 'EU Data Residency' },
];

export function ComplianceFilter({ onFilterChange }: ComplianceFilterProps) {
    const [selected, setSelected] = useState<ComplianceFilterType[]>([]);

    const toggleFilter = (filter: ComplianceFilterType) => {
        const newSelected = selected.includes(filter)
            ? selected.filter(f => f !== filter)
            : [...selected, filter];
        setSelected(newSelected);
        onFilterChange(newSelected);
    };

    return (
        <div className="flex flex-wrap gap-2" data-testid="compliance-filter">
            <span className="text-sm text-gray-500 self-center mr-2">Filter by:</span>
            {FILTER_OPTIONS.map((option) => (
                <button
                    key={option.type}
                    onClick={() => toggleFilter(option.type)}
                    data-testid={`filter-${option.type}`}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${selected.includes(option.type)
                            ? 'bg-[var(--primary)] text-black'
                            : 'bg-[var(--surface-2)] text-gray-400 border border-[var(--border)] hover:border-[var(--primary)]'
                        }`}
                >
                    {selected.includes(option.type) ? '✓ ' : ''}{option.label}
                </button>
            ))}
            {selected.length > 0 && (
                <button
                    onClick={() => {
                        setSelected([]);
                        onFilterChange([]);
                    }}
                    className="px-3 py-1.5 rounded-full text-sm text-gray-500 hover:text-white transition-colors"
                >
                    Clear all
                </button>
            )}
        </div>
    );
}
