'use client';

import { useState } from 'react';

const CONVOGUARD_API = 'https://convo-guard-ai-production.up.railway.app';

interface ConsentCheckResult {
    compliant: boolean;
    score: number;
    risks: { category: string; severity: string; message: string }[];
    audit_id: string;
}

export function GDPRConsentChecker() {
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<ConsentCheckResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    const SAMPLE_CONVERSATIONS = [
        {
            label: 'Missing Consent (Health Data)',
            text: 'Bot: "Tell me about your anxiety levels and how you\'ve been sleeping."\nUser: "I\'ve been having terrible anxiety and not sleeping at all."',
        },
        {
            label: 'Proper Consent Flow',
            text: 'Bot: "Before we begin, do you consent to the collection and processing of your health data in accordance with our privacy policy?"\nUser: "Yes, I agree to the data processing terms."\nBot: "Thank you. Now, how are you feeling today?"',
        },
        {
            label: 'GDPR Art 9 Special Category',
            text: 'Bot: "Can you tell me about your current medications?"\nUser: "I\'m taking medication for my HIV diagnosis and also antidepressants."',
        },
    ];

    const runConsentCheck = async () => {
        if (!input.trim()) return;
        setIsLoading(true);
        setError(null);
        setResult(null);

        try {
            const response = await fetch(`${CONVOGUARD_API}/api/ml-validate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ transcript: input }),
            });

            if (!response.ok) throw new Error('Validation failed');
            const data = await response.json();
            setResult(data);
        } catch {
            setError('ConvoGuard service temporarily unreachable');
        } finally {
            setIsLoading(false);
        }
    };

    const gdprRisks = result?.risks?.filter(
        (r) => r.category === 'GDPR_CONSENT' || r.category === 'TRANSPARENCY'
    ) || [];

    const otherRisks = result?.risks?.filter(
        (r) => r.category !== 'GDPR_CONSENT' && r.category !== 'TRANSPARENCY'
    ) || [];

    return (
        <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl">🔍</span>
                <div>
                    <h3 className="text-lg font-semibold text-white">Live GDPR Consent Checker</h3>
                    <p className="text-xs text-gray-500">Powered by ConvoGuard · GDPR Art 6/9 · Real-time Neural Inference</p>
                </div>
            </div>

            {/* Sample Buttons */}
            <div className="flex flex-wrap gap-2 mb-4">
                {SAMPLE_CONVERSATIONS.map((sample, i) => (
                    <button
                        key={i}
                        onClick={() => setInput(sample.text)}
                        className="text-[10px] px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-gray-400 hover:text-cyan-400 hover:border-cyan-500/30 transition-all"
                    >
                        {sample.label}
                    </button>
                ))}
            </div>

            {/* Input */}
            <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Paste an AI conversation to check GDPR consent compliance..."
                className="w-full h-32 p-4 bg-black/30 border border-white/10 rounded-xl text-sm text-gray-300 placeholder:text-gray-600 focus:border-cyan-500/50 focus:outline-none resize-none font-mono transition-colors"
            />

            <button
                onClick={runConsentCheck}
                disabled={isLoading || !input.trim()}
                className="w-full mt-3 py-3 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-semibold rounded-xl hover:bg-cyan-500/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
                {isLoading ? (
                    <>
                        <span className="w-4 h-4 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin" />
                        Analyzing GDPR Compliance...
                    </>
                ) : (
                    'Run GDPR Consent Check →'
                )}
            </button>

            {/* Results */}
            {result && (
                <div className="mt-4 space-y-3 animate-in fade-in">
                    <div className={`flex items-center justify-between p-4 rounded-xl border ${result.compliant
                            ? 'bg-emerald-500/5 border-emerald-500/20'
                            : 'bg-red-500/5 border-red-500/20'
                        }`}>
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">{result.compliant ? '✅' : '⚠️'}</span>
                            <div>
                                <p className={`font-bold ${result.compliant ? 'text-emerald-400' : 'text-red-400'}`}>
                                    {result.compliant ? 'GDPR Compliant' : 'GDPR Violation Detected'}
                                </p>
                                <p className="text-[10px] text-gray-500 font-mono">Audit: {result.audit_id?.slice(0, 12)}...</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className="text-2xl font-bold text-white">{result.score}</span>
                            <span className="text-sm text-gray-500">/100</span>
                        </div>
                    </div>

                    {/* GDPR-specific risks */}
                    {gdprRisks.length > 0 && (
                        <div className="space-y-2">
                            <p className="text-[10px] uppercase tracking-widest text-amber-400/60 font-bold">GDPR Findings</p>
                            {gdprRisks.map((risk, i) => (
                                <div key={i} className="p-3 bg-amber-500/5 border border-amber-500/20 rounded-lg">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className={`w-1.5 h-1.5 rounded-full ${risk.severity === 'HIGH' ? 'bg-red-500 animate-pulse' : 'bg-amber-400'
                                            }`} />
                                        <span className="text-[10px] font-bold text-amber-400 uppercase">{risk.category}</span>
                                    </div>
                                    <p className="text-xs text-gray-400">{risk.message}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Other risks */}
                    {otherRisks.length > 0 && (
                        <div className="space-y-2">
                            <p className="text-[10px] uppercase tracking-widest text-gray-600 font-bold">Other Findings</p>
                            {otherRisks.map((risk, i) => (
                                <div key={i} className="p-3 bg-white/3 border border-white/5 rounded-lg">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className={`w-1.5 h-1.5 rounded-full ${risk.severity === 'HIGH' ? 'bg-red-500' : 'bg-gray-400'
                                            }`} />
                                        <span className="text-[10px] font-bold text-gray-400 uppercase">{risk.category}</span>
                                    </div>
                                    <p className="text-xs text-gray-500">{risk.message}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {error && (
                <div className="mt-4 p-3 bg-red-500/5 border border-red-500/20 rounded-xl text-xs text-red-400 text-center">
                    ⚠ {error}
                </div>
            )}
        </div>
    );
}
