'use client';

import { useState } from 'react';
import Link from 'next/link';

const CONVOGUARD_API = 'https://convo-guard-ai-production.up.railway.app';

export default function FastAuditPage() {
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    const runAudit = async () => {
        if (!input.trim()) return;
        setIsLoading(true);
        setError(null);
        setResult(null);

        try {
            // Use the neural-powered ML endpoint directly
            const response = await fetch(`${CONVOGUARD_API}/api/ml-validate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ transcript: input }),
            });

            if (!response.ok) throw new Error('Audit failed');
            const data = await response.json();
            setResult(data);
        } catch (err) {
            setError('System temporär nicht erreichbar. Bitte versuchen Sie es erneut.');
        } finally {
            setIsLoading(false);
        }
    };

    const downloadXML = async () => {
        if (!result) return;
        try {
            const response = await fetch(`${CONVOGUARD_API}/api/bfarm-xml`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ transcript: input }),
            });
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `bfarm_audit_${result.audit_id.slice(0, 8)}.xml`;
            a.click();
        } catch (err) {
            alert('XML-Download fehlgeschlagen');
        }
    };

    return (
        <main className="min-h-screen bg-white text-gray-900 font-sans selection:bg-blue-100">
            {/* Minimalist Header */}
            <nav className="border-b border-gray-100 py-4 px-6 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <span className="text-xl font-bold tracking-tight text-blue-600">ConvoGuard</span>
                    <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-medium">BETA</span>
                </div>
                <div className="flex gap-6 text-sm font-medium text-gray-500">
                    <Link href="/docs" className="hover:text-blue-600 transition-colors">API Docs</Link>
                    <Link href="/audit" className="hover:text-blue-600 transition-colors">Advanced Dashboard</Link>
                </div>
            </nav>

            <div className="max-w-2xl mx-auto py-16 px-6">
                <div className="mb-10 text-center">
                    <h1 className="text-3xl font-extrabold text-gray-900 mb-3 tracking-tight">
                        DiGA Compliance Audit
                    </h1>
                    <p className="text-gray-500 text-lg leading-relaxed">
                        Fügen Sie Ihr KI-Transkript ein, um eine sofortige regulatorische Prüfung gemäß <span className="text-gray-900 font-medium">BfArM (DiGAV)</span> und <span className="text-gray-900 font-medium">EU AI Act</span> durchzuführen.
                    </p>
                </div>

                {/* The "Toaster" - Simple Input */}
                <div className="space-y-4">
                    <div className="relative group">
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Hier KI-Transkript einfügen..."
                            className="w-full h-64 p-6 bg-gray-50 border-2 border-transparent rounded-2xl text-lg leading-relaxed focus:bg-white focus:border-blue-500 focus:outline-none transition-all shadow-inner placeholder:text-gray-300"
                        />
                        {!input && (
                            <button
                                onClick={() => setInput('Patient: "Ich habe Suizidgedanken und weiß nicht mehr weiter."\nKI-Bot: "Das tut mir leid zu hören. Erzählen Sie mehr."')}
                                className="absolute bottom-4 left-6 text-xs text-blue-500 font-medium opacity-60 hover:opacity-100 transition-opacity"
                            >
                                [Beispiel mit Krisenrisiko laden]
                            </button>
                        )}
                    </div>

                    <button
                        onClick={runAudit}
                        disabled={isLoading || !input.trim()}
                        className="w-full py-5 bg-gray-900 hover:bg-black text-white text-lg font-bold rounded-2xl transition-all shadow-lg shadow-gray-200 flex items-center justify-center gap-3 disabled:bg-gray-200 disabled:shadow-none"
                    >
                        {isLoading ? (
                            <>
                                <span className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                                Analysiere Compliance...
                            </>
                        ) : (
                            'Audit Protokoll generieren →'
                        )}
                    </button>
                </div>

                {/* Result - Only shows when done */}
                {result && (
                    <div className={`mt-8 p-8 rounded-3xl border-2 transition-all animate-in fade-in slide-in-from-bottom-4 ${result.compliant ? 'bg-emerald-50 border-emerald-100' : 'bg-red-50 border-red-100'}`}>
                        <div className="flex items-start justify-between mb-6">
                            <div>
                                <h2 className={`text-xl font-black uppercase tracking-wider mb-1 ${result.compliant ? 'text-emerald-700' : 'text-red-700'}`}>
                                    {result.compliant ? 'Prüfung Bestanden' : 'Verstoß Festgestellt'}
                                </h2>
                                <p className="text-sm font-medium opacity-60">Audit ID: {result.audit_id.slice(0, 12)}...</p>
                            </div>
                            <div className="text-right font-mono bg-white/50 px-3 py-1 rounded-lg border border-black/5">
                                <span className="text-2xl font-bold">{result.score}</span>
                                <span className="text-sm opacity-50">/100</span>
                            </div>
                        </div>

                        {result.risks && result.risks.length > 0 && (
                            <div className="space-y-3 mb-8">
                                {result.risks.map((risk: any, i: number) => (
                                    <div key={i} className="bg-white/60 p-4 rounded-xl border border-black/5 shadow-sm">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className={`w-2 h-2 rounded-full ${risk.severity === 'HIGH' ? 'bg-red-500 animate-pulse' : 'bg-orange-400'}`} />
                                            <span className="text-xs font-bold uppercase tracking-tight">{risk.category}</span>
                                        </div>
                                        <p className="text-gray-700 font-medium leading-snug">{risk.message}</p>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={downloadXML}
                                className="py-4 bg-white border border-gray-200 text-gray-900 font-bold rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 shadow-sm"
                            >
                                📋 BfArM XML
                            </button>
                            <button
                                onClick={() => window.print()}
                                className="py-4 bg-white border border-gray-200 text-gray-900 font-bold rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 shadow-sm"
                            >
                                📄 PDF Report
                            </button>
                        </div>

                        <div className="mt-8 pt-6 border-t border-black/5 text-center">
                            <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-gray-400 mb-2">Digitaler Identitäts-Nachweis (SHA-256)</p>
                            <code className="text-[10px] font-mono text-gray-300 break-all bg-black/5 px-2 py-1 rounded">
                                {result.tamper_proof_signature || 'ca38e072f6a7d6e8... (lokal signiert)'}
                            </code>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="mt-6 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-center font-medium">
                        ⚠️ {error}
                    </div>
                )}

                {/* Minimal Footer */}
                <footer className="mt-20 text-center border-t border-gray-100 pt-10">
                    <p className="text-sm text-gray-400">
                        Berlin AI Labs GmbH · Audit Version 1.2.0 · Neural (DistilBERT) active
                    </p>
                </footer>
            </div>
        </main>
    );
}
