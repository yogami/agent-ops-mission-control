'use client';

import { useState } from 'react';

const CONVOGUARD_API = 'https://convo-guard-ai-production.up.railway.app';

interface ValidationResult {
    compliant: boolean;
    score: number;
    policyPackId: string;
    risks: Array<{
        type: string;
        severity: string;
        message: string;
    }>;
    audit_id: string;
    execution_time_ms: number;
}

export function ConvoGuardPanel() {
    const [input, setInput] = useState('');
    const [result, setResult] = useState<ValidationResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const testCompliance = async () => {
        if (!input.trim()) return;

        setIsLoading(true);
        setError(null);
        setResult(null);

        try {
            const response = await fetch(`${CONVOGUARD_API}/api/validate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ transcript: input }),
            });

            if (!response.ok) throw new Error('Validation failed');

            const data = await response.json();
            setResult(data);
        } catch (err) {
            setError('Failed to connect to ConvoGuard. Service may be starting up.');
            console.error('ConvoGuard error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">🛡️</span>
                <div>
                    <h3 className="text-lg font-semibold text-white">ConvoGuard AI</h3>
                    <p className="text-xs text-gray-500">Real-time compliance validation</p>
                </div>
                <span className="ml-auto px-2 py-0.5 text-[10px] bg-emerald-500/20 text-emerald-400 rounded-full border border-emerald-500/30">
                    LIVE
                </span>
            </div>

            <div className="space-y-4">
                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Enter AI agent output to validate for compliance..."
                    className="w-full h-24 px-4 py-3 bg-[var(--surface-2)] border border-[var(--border)] rounded-lg text-white text-sm resize-none focus:border-[var(--primary)] focus:outline-none"
                />

                <div className="flex gap-2">
                    <button
                        onClick={testCompliance}
                        disabled={isLoading || !input.trim()}
                        className="btn-primary text-sm disabled:opacity-50"
                    >
                        {isLoading ? 'Validating...' : '🔍 Test Compliance'}
                    </button>
                    <button
                        onClick={() => setInput('I want to hurt myself and end it all')}
                        className="btn-secondary text-xs"
                    >
                        Try Harmful
                    </button>
                    <button
                        onClick={() => setInput('The quarterly report shows 15% revenue growth.')}
                        className="btn-secondary text-xs"
                    >
                        Try Safe
                    </button>
                </div>

                {error && (
                    <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                        <p className="text-red-400 text-sm">{error}</p>
                    </div>
                )}

                {result && (
                    <div className={`p-4 rounded-lg border ${result.compliant ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-xl">{result.compliant ? '✅' : '🚫'}</span>
                            <span className={`font-semibold ${result.compliant ? 'text-emerald-400' : 'text-red-400'}`}>
                                {result.compliant ? 'COMPLIANT' : 'BLOCKED'}
                            </span>
                            <span className="text-xs text-gray-500 ml-auto">
                                {result.execution_time_ms}ms • Score: {result.score}/100
                            </span>
                        </div>

                        {result.risks && result.risks.length > 0 && (
                            <div className="space-y-2 mb-3">
                                <p className="text-xs text-gray-400 uppercase tracking-wider">Detected Risks:</p>
                                {result.risks.map((risk, i) => (
                                    <div key={i} className="flex items-center gap-2 text-sm">
                                        <span className={`w-2 h-2 rounded-full ${risk.severity === 'critical' ? 'bg-red-500' : risk.severity === 'high' ? 'bg-orange-500' : 'bg-yellow-500'}`} />
                                        <span className="text-gray-300">{risk.type}:</span>
                                        <span className="text-gray-400">{risk.message}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="pt-3 border-t border-white/10 text-xs text-gray-500">
                            <span>Policy Pack: {result.policyPackId}</span>
                            <span className="mx-2">•</span>
                            <span>Audit ID: {result.audit_id?.slice(0, 8)}...</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
