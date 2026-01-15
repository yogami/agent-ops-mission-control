'use client';

import { useState, useEffect } from 'react';

const TRUST_PROTOCOL_API = 'https://agent-trust-protocol-production.up.railway.app';

interface TrustScore {
    agentId: string;
    score: number;
    grade: string;
    factors: {
        compliance: number;
        uptime: number;
        responseTime: number;
        auditTrail: number;
    };
    lastUpdated: string;
    badges: string[];
}

// Demo agent IDs from the Trust Protocol
const DEMO_AGENTS = [
    { id: '34ffedae-923b-4624-9da4-4d36c3d5a2a6', name: 'ConvoGuard AI' },
    { id: 'semantic-aligner-prod', name: 'Semantic Aligner' },
    { id: 'fairness-auditor-v1', name: 'Fairness Auditor' },
];

export function TrustScorePanel() {
    const [selectedAgent, setSelectedAgent] = useState(DEMO_AGENTS[0]);
    const [trustScore, setTrustScore] = useState<TrustScore | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchTrustScore = async (agentId: string) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(`${TRUST_PROTOCOL_API}/api/trustscore/${agentId}`);

            if (!response.ok) throw new Error('Failed to fetch trust score');

            const data = await response.json();
            setTrustScore(data);
        } catch (err) {
            setError('Failed to connect to Trust Protocol. Service may be starting up.');
            console.error('Trust Protocol error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTrustScore(selectedAgent.id);
    }, [selectedAgent.id]);

    const getScoreColor = (score: number) => {
        if (score >= 90) return 'text-emerald-400';
        if (score >= 70) return 'text-yellow-400';
        return 'text-red-400';
    };

    const getGradeColor = (grade: string) => {
        if (grade === 'A' || grade === 'A+') return 'bg-emerald-500';
        if (grade === 'B' || grade === 'B+') return 'bg-yellow-500';
        return 'bg-red-500';
    };

    return (
        <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">🏆</span>
                <div>
                    <h3 className="text-lg font-semibold text-white">Agent Trust Protocol</h3>
                    <p className="text-xs text-gray-500">Verifiable reputation scores</p>
                </div>
                <span className="ml-auto px-2 py-0.5 text-[10px] bg-emerald-500/20 text-emerald-400 rounded-full border border-emerald-500/30">
                    LIVE
                </span>
            </div>

            <div className="space-y-4">
                <select
                    value={selectedAgent.id}
                    onChange={(e) => {
                        const agent = DEMO_AGENTS.find(a => a.id === e.target.value);
                        if (agent) setSelectedAgent(agent);
                    }}
                    className="w-full px-4 py-2 bg-[var(--surface-2)] border border-[var(--border)] rounded-lg text-white text-sm"
                >
                    {DEMO_AGENTS.map(agent => (
                        <option key={agent.id} value={agent.id}>{agent.name}</option>
                    ))}
                </select>

                {isLoading && (
                    <div className="flex items-center justify-center py-8">
                        <div className="w-8 h-8 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
                    </div>
                )}

                {error && (
                    <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                        <p className="text-red-400 text-sm">{error}</p>
                    </div>
                )}

                {trustScore && !isLoading && (
                    <div className="space-y-4">
                        {/* Main Score */}
                        <div className="flex items-center justify-between p-4 bg-[var(--surface-2)] rounded-lg">
                            <div>
                                <p className="text-sm text-gray-400">Trust Score</p>
                                <p className={`text-4xl font-bold ${getScoreColor(trustScore.score)}`}>
                                    {trustScore.score}
                                </p>
                            </div>
                            <div className={`w-16 h-16 rounded-full ${getGradeColor(trustScore.grade)} flex items-center justify-center`}>
                                <span className="text-2xl font-bold text-black">{trustScore.grade}</span>
                            </div>
                        </div>

                        {/* Factors */}
                        <div className="grid grid-cols-2 gap-3">
                            {Object.entries(trustScore.factors).map(([key, value]) => (
                                <div key={key} className="p-3 bg-[var(--surface-2)] rounded-lg">
                                    <p className="text-xs text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <div className="flex-1 h-2 bg-[var(--surface-1)] rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-[var(--primary)]"
                                                style={{ width: `${value}%` }}
                                            />
                                        </div>
                                        <span className="text-sm text-white font-mono">{value}%</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Badges */}
                        {trustScore.badges && trustScore.badges.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {trustScore.badges.map((badge, i) => (
                                    <span key={i} className="px-2 py-1 text-xs bg-[var(--primary)]/20 text-[var(--primary)] rounded-full border border-[var(--primary)]/30">
                                        ✓ {badge}
                                    </span>
                                ))}
                            </div>
                        )}

                        <p className="text-xs text-gray-500 text-right">
                            Last updated: {new Date(trustScore.lastUpdated).toLocaleString()}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
