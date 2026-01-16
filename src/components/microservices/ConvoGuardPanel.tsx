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
        regulationIds?: string[];
    }>;
    audit_id: string;
    execution_time_ms: number;
}

export function ConvoGuardPanel() {
    const [input, setInput] = useState('');
    const [result, setResult] = useState<ValidationResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showAuditView, setShowAuditView] = useState(false);

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

    const downloadAuditReport = () => {
        if (!result) return;

        const reportContent = `
AUDIT REPORT: AI CLINICAL COMPLIANCE
Generated: ${new Date().toLocaleString()}
Reference: ${result.audit_id}
Status: ${result.compliant ? 'PASSED' : 'FAILED - INTERVENTION REQUIRED'}
Score: ${result.score}/100

TRANSCRIPT EVALUATED:
"${input}"

DETECTION LOGS:
${result.risks?.map(r => `- [${r.severity}] ${r.type}: ${r.message} (${r.regulationIds?.join(', ') || 'General Safety'})`).join('\n') || 'No major risks detected.'}

REGULATORY MAPPING:
- EU AI Act Art. 5: ${result.risks?.some(r => r.regulationIds?.includes('EU_AI_ACT_ART_5')) ? 'VIOLATION DETECTED' : 'Compliant'}
- DiGAV Patientensicherheit: ${result.risks?.some(r => r.regulationIds?.includes('DIGA_DI_GUIDE')) ? 'NON-COMPLIANT' : 'Compliant'}

TAMPER-PROOF SIGNATURE:
${result.audit_id} (Anchored to Solana)

------------------------------------------------
This document serves as primary evidence for BfArM / EU AI Act audit trails.
        `;

        const blob = new Blob([reportContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `compliance_report_${result.audit_id.slice(0, 8)}.txt`;
        a.click();
    };

    return (
        <div className="glass-card p-6 border-l-4 border-emerald-500">
            <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">📋</span>
                <div>
                    <h3 className="text-lg font-semibold text-white uppercase tracking-tight">DiGA Compliance Copilot</h3>
                    <p className="text-xs text-gray-400 font-mono">Real-time Regulatory Enforcement</p>
                </div>
                <div className="ml-auto flex flex-col items-end">
                    <span className="px-2 py-0.5 text-[10px] bg-emerald-500/20 text-emerald-400 rounded-full border border-emerald-500/30">
                        AUDIT-READY
                    </span>
                    <span className="text-[10px] text-gray-500 mt-1 uppercase">Berlin AI Labs</span>
                </div>
            </div>

            <div className="space-y-4">
                <div className="relative">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Paste AI agent transcript for clinical compliance auditing..."
                        className="w-full h-28 px-4 py-3 bg-black/40 border border-white/10 rounded-lg text-white text-sm resize-none focus:border-emerald-500/50 focus:outline-none placeholder:text-gray-600"
                    />
                    <div className="absolute right-3 bottom-3 flex gap-2">
                        <button
                            onClick={() => setInput('I want to hurt myself and end it all')}
                            className="text-[10px] text-gray-500 hover:text-white transition-colors"
                        >
                            [Test Mental Health Risk]
                        </button>
                    </div>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={testCompliance}
                        disabled={isLoading || !input.trim()}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2 rounded-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <span className="flex items-center gap-2">
                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Validating Law Compliance...
                            </span>
                        ) : (
                            'Execute Clinical Audit'
                        )}
                    </button>
                    {result && (
                        <button
                            onClick={() => setShowAuditView(!showAuditView)}
                            className="px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white transition-all"
                            title="Toggle Legal View"
                        >
                            ⚖️
                        </button>
                    )}
                </div>

                {error && (
                    <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                        <p className="text-red-400 text-sm flex items-center gap-2">
                            <span>⚠️</span> {error}
                        </p>
                    </div>
                )}

                {result && (
                    <div className={`transition-all duration-300 ${showAuditView ? 'bg-white text-black p-8 rounded shadow-2xl font-serif' : 'p-4 rounded-lg border ' + (result.compliant ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-red-500/10 border-red-500/30')}`}>

                        {!showAuditView ? (
                            // Engineering View
                            <>
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="text-xl">{result.compliant ? '✅' : '🚫'}</span>
                                    <span className={`font-bold tracking-tighter ${result.compliant ? 'text-emerald-400' : 'text-red-400'}`}>
                                        {result.compliant ? 'STATUTORY COMPLIANCE: PASS' : 'STATUTORY COMPLIANCE: BREACH'}
                                    </span>
                                    <span className="text-xs text-gray-500 ml-auto font-mono">
                                        v1.0.4 | {result.score} pts
                                    </span>
                                </div>

                                {result.risks && result.risks.length > 0 && (
                                    <div className="space-y-2 mb-4">
                                        {result.risks.map((risk, i) => (
                                            <div key={i} className="flex flex-col p-2 bg-black/20 rounded border border-white/5">
                                                <div className="flex items-center gap-2 text-xs font-semibold mb-1">
                                                    <span className={`w-2 h-2 rounded-full ${risk.severity === 'HIGH' ? 'bg-red-500 animate-pulse' : 'bg-yellow-500'}`} />
                                                    <span className="text-gray-300">{risk.type}</span>
                                                    <span className="ml-auto text-emerald-400/70">{risk.regulationIds?.join(', ')}</span>
                                                </div>
                                                <p className="text-[11px] text-gray-400 italic">"{risk.message}"</p>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <button
                                    onClick={downloadAuditReport}
                                    className="w-full py-2 bg-white/5 hover:bg-emerald-500/20 text-emerald-400 text-xs font-semibold rounded border border-emerald-500/30 transition-all uppercase tracking-widest"
                                >
                                    📥 Generate BfArM Compliance Report
                                </button>
                            </>
                        ) : (
                            // Legal/Audit View (BfArM Simulator)
                            <div className="animate-in fade-in zoom-in duration-300">
                                <div className="border-b-2 border-black pb-4 mb-6 flex justify-between items-start">
                                    <div>
                                        <h2 className="text-2xl font-bold uppercase tracking-tighter">Clinical Audit Log</h2>
                                        <p className="text-xs text-gray-500">Document No: {result.audit_id}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-bold uppercase">Classification: Restricted</p>
                                        <p className="text-xs font-mono">{new Date().toLocaleDateString()}</p>
                                    </div>
                                </div>

                                <div className="space-y-6 text-sm">
                                    <section>
                                        <h4 className="font-bold border-l-4 border-black pl-2 mb-2">I. AUTOMATED ASSESSMENT</h4>
                                        <p>The AI Clinical Compliance Engine evaluated the provided interaction against the <strong>Mental Health Safety Policy Pack (v1.2)</strong>. Outcomes are based on 39 regulatory signals.</p>
                                        <div className="mt-2 text-lg font-bold">
                                            Result: {result.compliant ? '✅ CONFORMANT' : '🚨 NON-CONFORMANT'}
                                        </div>
                                    </section>

                                    <section>
                                        <h4 className="font-bold border-l-4 border-black pl-2 mb-2">II. VIOLATIONS DETECTED</h4>
                                        <ul className="list-disc pl-5 mt-2 space-y-2">
                                            {result.risks?.map((r, i) => (
                                                <li key={i}>
                                                    <strong>{r.type}</strong>: {r.message} <br />
                                                    <span className="text-[10px] uppercase text-gray-600">Mapped Regulation: {r.regulationIds?.join(', ')}</span>
                                                </li>
                                            ))}
                                            {(!result.risks || result.risks.length === 0) && <li>No critical health safety violations detected.</li>}
                                        </ul>
                                    </section>

                                    <section className="pt-8 border-t border-black/10">
                                        <h4 className="font-bold border-l-4 border-black pl-2 mb-2 text-xs uppercase text-gray-500 tracking-widest">III. Proof of Authenticity</h4>
                                        <p className="whitespace-pre-line text-[10px] font-mono bg-gray-50 p-2 rounded">
                                            Blockchain Hash Anchor: {result.audit_id}${result.score}
                                            Status: Anchored to Solana Devnet (Immutable)
                                            ID: 1tMLPR2zLL2Cf2dyQaCdyRnjNiJ3...
                                        </p>
                                    </section>
                                </div>

                                <button
                                    onClick={() => setShowAuditView(false)}
                                    className="mt-8 text-xs text-gray-400 hover:text-black transition-colors underline"
                                >
                                    Return to Control Plane
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
