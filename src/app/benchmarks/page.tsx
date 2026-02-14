'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Benchmarks {
    timestamp: string;
    convoGuard: {
        model: string;
        inferenceBackend: string;
        crisisDetection: { recall: number; precision: number; f1: number; testSetSize: number; falsePositiveRate: number; note: string; categories: string[] };
        gdprConsentDetection: { recall: number; precision: number; f1: number; testSetSize: number; falsePositiveRate: number; limitations: string[] };
        specialCategoryDetection: { recall: number; precision: number; f1: number; testSetSize: number; limitations: string[] };
        latency: { p50_ms: number; p95_ms: number; p99_ms: number; maxObserved_ms: number; measurementConditions: string };
    };
    poeVerification: {
        signatureScheme: string;
        chainIntegrity: string;
        verificationLatency_ms: number;
        anchoringChains: string[];
        anchoringLatency: { solana_avg_ms: number; zkSync_avg_ms: number; starknet_avg_ms: number };
    };
    missionControl: {
        killSwitchLatency_ms: number;
        humanInLoopCoverage: string;
        fleetMonitoringInterval_s: number;
    };
    methodology: {
        testFramework: string;
        lastBenchmarkRun: string;
        ciPipeline: string;
        reproducibility: string;
    };
}

function MetricBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
    const pct = Math.min((value / max) * 100, 100);
    return (
        <div className="flex items-center gap-3 text-sm">
            <span className="w-20 text-gray-400 text-right shrink-0">{label}</span>
            <div className="flex-1 bg-gray-100 rounded-full h-3 overflow-hidden">
                <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
            </div>
            <span className="font-mono font-bold w-14 text-right">{(value * 100).toFixed(0)}%</span>
        </div>
    );
}

export default function BenchmarksPage() {
    const [data, setData] = useState<Benchmarks | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch('/api/gdpr/benchmarks')
            .then(r => r.json())
            .then(d => { setData(d); setLoading(false); })
            .catch(e => { setError(e.message); setLoading(false); });
    }, []);

    if (loading) return (
        <main className="min-h-screen bg-white flex items-center justify-center">
            <div className="animate-spin w-8 h-8 border-4 border-gray-200 border-t-blue-600 rounded-full" />
        </main>
    );

    if (error || !data) return (
        <main className="min-h-screen bg-white flex items-center justify-center text-red-500">
            Failed to load benchmarks: {error}
        </main>
    );

    return (
        <main className="min-h-screen bg-white text-gray-900 font-sans selection:bg-blue-100">
            <nav className="border-b border-gray-100 py-4 px-6 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <span className="text-xl font-bold tracking-tight text-blue-600">ConvoGuard</span>
                    <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-medium">BENCHMARKS</span>
                </div>
                <div className="flex gap-6 text-sm font-medium text-gray-500">
                    <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
                    <Link href="/transparency" className="hover:text-blue-600 transition-colors">Transparency</Link>
                    <Link href="/validation" className="hover:text-blue-600 transition-colors">Validation</Link>
                </div>
            </nav>

            <div className="max-w-3xl mx-auto py-16 px-6">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-extrabold text-gray-900 mb-3 tracking-tight">
                        📊 Publicly Verifiable Benchmarks
                    </h1>
                    <p className="text-gray-500 text-lg">
                        Live data from <code className="bg-gray-100 px-2 py-0.5 rounded">/api/gdpr/benchmarks</code>
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                        Last benchmark run: {new Date(data.methodology.lastBenchmarkRun).toLocaleString()}
                    </p>
                </div>

                {/* Crisis Detection */}
                <section className="mb-10">
                    <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <span className="w-6 h-6 bg-red-100 text-red-600 text-xs rounded-full flex items-center justify-center font-bold">!</span>
                        Crisis Detection
                        <span className="text-xs text-gray-400 font-normal">n={data.convoGuard.crisisDetection.testSetSize}</span>
                    </h2>
                    <div className="space-y-2 bg-gray-50 rounded-2xl p-6">
                        <MetricBar label="Recall" value={data.convoGuard.crisisDetection.recall} max={1} color="bg-emerald-500" />
                        <MetricBar label="Precision" value={data.convoGuard.crisisDetection.precision} max={1} color="bg-blue-500" />
                        <MetricBar label="F1" value={data.convoGuard.crisisDetection.f1} max={1} color="bg-purple-500" />
                    </div>
                    <p className="text-xs text-gray-400 mt-2 px-2">{data.convoGuard.crisisDetection.note}</p>
                    <div className="flex flex-wrap gap-1 mt-2 px-2">
                        {data.convoGuard.crisisDetection.categories.map(c => (
                            <span key={c} className="text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded-full">{c.replace(/_/g, ' ')}</span>
                        ))}
                    </div>
                </section>

                {/* Consent Detection */}
                <section className="mb-10">
                    <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <span className="w-6 h-6 bg-blue-100 text-blue-600 text-xs rounded-full flex items-center justify-center">✓</span>
                        GDPR Consent Detection
                        <span className="text-xs text-gray-400 font-normal">n={data.convoGuard.gdprConsentDetection.testSetSize}</span>
                    </h2>
                    <div className="space-y-2 bg-gray-50 rounded-2xl p-6">
                        <MetricBar label="Recall" value={data.convoGuard.gdprConsentDetection.recall} max={1} color="bg-emerald-500" />
                        <MetricBar label="Precision" value={data.convoGuard.gdprConsentDetection.precision} max={1} color="bg-blue-500" />
                        <MetricBar label="F1" value={data.convoGuard.gdprConsentDetection.f1} max={1} color="bg-purple-500" />
                    </div>
                </section>

                {/* Special Category Detection */}
                <section className="mb-10">
                    <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <span className="w-6 h-6 bg-orange-100 text-orange-600 text-xs rounded-full flex items-center justify-center">9</span>
                        Special Category (Art. 9)
                        <span className="text-xs text-gray-400 font-normal">n={data.convoGuard.specialCategoryDetection.testSetSize}</span>
                    </h2>
                    <div className="space-y-2 bg-gray-50 rounded-2xl p-6">
                        <MetricBar label="Recall" value={data.convoGuard.specialCategoryDetection.recall} max={1} color="bg-emerald-500" />
                        <MetricBar label="Precision" value={data.convoGuard.specialCategoryDetection.precision} max={1} color="bg-blue-500" />
                        <MetricBar label="F1" value={data.convoGuard.specialCategoryDetection.f1} max={1} color="bg-purple-500" />
                    </div>
                </section>

                {/* Latency */}
                <section className="mb-10">
                    <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <span className="w-6 h-6 bg-gray-100 text-gray-600 text-xs rounded-full flex items-center justify-center">⚡</span>
                        Latency
                    </h2>
                    <div className="grid grid-cols-4 gap-4 bg-gray-50 rounded-2xl p-6">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-emerald-600">{data.convoGuard.latency.p50_ms}ms</div>
                            <div className="text-xs text-gray-400">p50</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">{data.convoGuard.latency.p95_ms}ms</div>
                            <div className="text-xs text-gray-400">p95</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-orange-600">{data.convoGuard.latency.p99_ms}ms</div>
                            <div className="text-xs text-gray-400">p99</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-red-600">{data.convoGuard.latency.maxObserved_ms}ms</div>
                            <div className="text-xs text-gray-400">max</div>
                        </div>
                    </div>
                    <p className="text-xs text-gray-400 mt-2 px-2">{data.convoGuard.latency.measurementConditions}</p>
                </section>

                {/* Proof Anchoring */}
                <section className="mb-10">
                    <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <span className="w-6 h-6 bg-purple-100 text-purple-600 text-xs rounded-full flex items-center justify-center">🔗</span>
                        Proof Anchoring
                    </h2>
                    <div className="bg-gray-50 rounded-2xl p-6 text-sm space-y-3">
                        <div className="flex justify-between"><span className="text-gray-400">Signature Scheme</span><span className="font-mono font-bold">{data.poeVerification.signatureScheme}</span></div>
                        <div className="flex justify-between"><span className="text-gray-400">Chain Integrity</span><span className="font-mono font-bold">{data.poeVerification.chainIntegrity}</span></div>
                        <div className="flex justify-between"><span className="text-gray-400">Verification Latency</span><span className="font-mono font-bold">{data.poeVerification.verificationLatency_ms}ms</span></div>
                        <div className="border-t border-gray-200 pt-3">
                            <span className="text-gray-400 text-xs">Anchoring Latency</span>
                            <div className="grid grid-cols-3 gap-3 mt-2">
                                {data.poeVerification.anchoringChains.map((chain, i) => (
                                    <div key={chain} className="text-center bg-white p-3 rounded-xl">
                                        <p className="font-bold">{[data.poeVerification.anchoringLatency.solana_avg_ms, data.poeVerification.anchoringLatency.zkSync_avg_ms, data.poeVerification.anchoringLatency.starknet_avg_ms][i]}ms</p>
                                        <p className="text-xs text-gray-400">{chain}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Methodology */}
                <section className="mb-10">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Methodology</h2>
                    <div className="bg-gray-50 rounded-2xl p-6 text-sm space-y-2">
                        <div className="flex justify-between"><span className="text-gray-400">Test Framework</span><span className="font-semibold">{data.methodology.testFramework}</span></div>
                        <div className="flex justify-between"><span className="text-gray-400">CI Pipeline</span><span className="font-semibold">{data.methodology.ciPipeline}</span></div>
                        <div className="flex justify-between"><span className="text-gray-400">Reproducibility</span><span className="font-semibold">{data.methodology.reproducibility}</span></div>
                    </div>
                </section>

                <div className="text-center border-t border-gray-100 pt-8">
                    <p className="text-sm text-gray-400 mb-4">Raw API endpoint:</p>
                    <a
                        href="/api/gdpr/benchmarks"
                        target="_blank"
                        className="inline-block bg-gray-100 hover:bg-gray-200 text-gray-700 font-mono text-sm px-4 py-2 rounded-xl transition-colors"
                    >
                        GET /api/gdpr/benchmarks →
                    </a>
                </div>
            </div>
        </main>
    );
}
