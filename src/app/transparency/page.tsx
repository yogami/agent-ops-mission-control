'use client';

import Link from 'next/link';

export default function TransparencyPage() {
    return (
        <main className="min-h-screen bg-white text-gray-900 font-sans selection:bg-blue-100">
            <nav className="border-b border-gray-100 py-4 px-6 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <span className="text-xl font-bold tracking-tight text-blue-600">ConvoGuard</span>
                    <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-medium">TRANSPARENCY</span>
                </div>
                <div className="flex gap-6 text-sm font-medium text-gray-500">
                    <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
                    <Link href="/benchmarks" className="hover:text-blue-600 transition-colors">Benchmarks</Link>
                    <Link href="/validation" className="hover:text-blue-600 transition-colors">Validation</Link>
                </div>
            </nav>

            <div className="max-w-3xl mx-auto py-16 px-6">
                <h1 className="text-3xl font-extrabold text-gray-900 mb-3 tracking-tight">
                    Transparency & Model Card
                </h1>
                <p className="text-gray-500 text-lg mb-12">
                    We publish every known limitation. This page is our commitment to honest AI governance.
                </p>

                {/* Model Card */}
                <section className="mb-12">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <span className="w-2 h-2 bg-blue-500 rounded-full" />
                        Model Card
                    </h2>
                    <div className="bg-gray-50 rounded-2xl p-6 space-y-4 text-sm">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <span className="text-gray-400 text-xs uppercase tracking-wider">Model</span>
                                <p className="font-semibold text-gray-900 mt-1">DistilBERT (ONNX-quantized)</p>
                            </div>
                            <div>
                                <span className="text-gray-400 text-xs uppercase tracking-wider">Parameters</span>
                                <p className="font-semibold text-gray-900 mt-1">67M</p>
                            </div>
                            <div>
                                <span className="text-gray-400 text-xs uppercase tracking-wider">Inference Backend</span>
                                <p className="font-semibold text-gray-900 mt-1">ONNX Runtime (CPU)</p>
                            </div>
                            <div>
                                <span className="text-gray-400 text-xs uppercase tracking-wider">Training Domain</span>
                                <p className="font-semibold text-gray-900 mt-1">German therapy conversation patterns</p>
                            </div>
                            <div>
                                <span className="text-gray-400 text-xs uppercase tracking-wider">Inference Latency (p50)</span>
                                <p className="font-semibold text-gray-900 mt-1">8ms</p>
                            </div>
                            <div>
                                <span className="text-gray-400 text-xs uppercase tracking-wider">Deployment</span>
                                <p className="font-semibold text-gray-900 mt-1">Railway (dedicated container, no third-party API calls)</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Accuracy Metrics */}
                <section className="mb-12">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full" />
                        Accuracy Metrics
                    </h2>
                    <div className="space-y-4">
                        <div className="bg-gray-50 rounded-2xl p-6">
                            <h3 className="font-bold text-gray-900 mb-2">Crisis Detection</h3>
                            <div className="grid grid-cols-4 gap-4 text-sm">
                                <div><span className="text-gray-400">Recall</span><p className="font-bold text-emerald-600">100%</p></div>
                                <div><span className="text-gray-400">Precision</span><p className="font-bold">94%</p></div>
                                <div><span className="text-gray-400">F1</span><p className="font-bold">0.97</p></div>
                                <div><span className="text-gray-400">Test Set</span><p className="font-bold">n=312</p></div>
                            </div>
                            <p className="text-xs text-gray-400 mt-3">
                                Recall prioritized over precision — false positives are acceptable, false negatives are not.
                            </p>
                        </div>

                        <div className="bg-gray-50 rounded-2xl p-6">
                            <h3 className="font-bold text-gray-900 mb-2">GDPR Consent Detection</h3>
                            <div className="grid grid-cols-4 gap-4 text-sm">
                                <div><span className="text-gray-400">Recall</span><p className="font-bold">92%</p></div>
                                <div><span className="text-gray-400">Precision</span><p className="font-bold text-emerald-600">96%</p></div>
                                <div><span className="text-gray-400">F1</span><p className="font-bold">0.94</p></div>
                                <div><span className="text-gray-400">Test Set</span><p className="font-bold">n=847</p></div>
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-2xl p-6">
                            <h3 className="font-bold text-gray-900 mb-2">Special Category Detection (Art. 9)</h3>
                            <div className="grid grid-cols-4 gap-4 text-sm">
                                <div><span className="text-gray-400">Recall</span><p className="font-bold">89%</p></div>
                                <div><span className="text-gray-400">Precision</span><p className="font-bold">91%</p></div>
                                <div><span className="text-gray-400">F1</span><p className="font-bold">0.90</p></div>
                                <div><span className="text-gray-400">Test Set</span><p className="font-bold">n=234</p></div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Known Limitations */}
                <section className="mb-12">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <span className="w-2 h-2 bg-red-500 rounded-full" />
                        Known Limitations
                    </h2>
                    <div className="space-y-4 text-sm">
                        <div className="bg-red-50 border border-red-100 rounded-2xl p-6">
                            <h3 className="font-bold text-red-800 mb-3">Crisis Detection</h3>
                            <ul className="space-y-2 text-red-700">
                                <li className="flex items-start gap-2">
                                    <span className="text-red-400 mt-0.5">⚠</span>
                                    6% false positive rate — some safe conversations may be flagged as crises
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-red-400 mt-0.5">⚠</span>
                                    Trained on German therapy patterns — may underperform on other languages or domains
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-red-400 mt-0.5">⚠</span>
                                    Cannot detect non-verbal crisis cues (voice tone, pauses, facial expressions)
                                </li>
                            </ul>
                        </div>

                        <div className="bg-red-50 border border-red-100 rounded-2xl p-6">
                            <h3 className="font-bold text-red-800 mb-3">Consent Detection</h3>
                            <ul className="space-y-2 text-red-700">
                                <li className="flex items-start gap-2">
                                    <span className="text-red-400 mt-0.5">⚠</span>
                                    Pattern matching on text only — multilingual consent detection not yet supported
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-red-400 mt-0.5">⚠</span>
                                    Cannot detect implied consent or consent given outside the conversation
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-red-400 mt-0.5">⚠</span>
                                    Sarcastic or ambiguous consent responses may be misclassified
                                </li>
                            </ul>
                        </div>

                        <div className="bg-red-50 border border-red-100 rounded-2xl p-6">
                            <h3 className="font-bold text-red-800 mb-3">Special Category Data (Art. 9)</h3>
                            <ul className="space-y-2 text-red-700">
                                <li className="flex items-start gap-2">
                                    <span className="text-red-400 mt-0.5">⚠</span>
                                    Keyword-based detection — may miss euphemisms or coded language
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-red-400 mt-0.5">⚠</span>
                                    Medical terminology coverage limited to ~200 common terms
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-red-400 mt-0.5">⚠</span>
                                    New drug names or conditions require manual rule updates
                                </li>
                            </ul>
                        </div>

                        <div className="bg-orange-50 border border-orange-100 rounded-2xl p-6">
                            <h3 className="font-bold text-orange-800 mb-3">Infrastructure</h3>
                            <ul className="space-y-2 text-orange-700">
                                <li className="flex items-start gap-2">
                                    <span className="text-orange-400 mt-0.5">⚠</span>
                                    ONNX inference runs on Railway (cloud) — for true on-premise, a Docker deployment option is planned
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-orange-400 mt-0.5">⚠</span>
                                    Solana anchoring uses Devnet — mainnet deployment requires SOL funding
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-orange-400 mt-0.5">⚠</span>
                                    Single-region deployment — no multi-region failover configured
                                </li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* Data Handling */}
                <section className="mb-12">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <span className="w-2 h-2 bg-blue-500 rounded-full" />
                        Data Handling
                    </h2>
                    <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 text-sm text-blue-800 space-y-2">
                        <p>✓ No conversation data is stored after inference</p>
                        <p>✓ No data is sent to OpenAI, Anthropic, or any third-party API during ML inference</p>
                        <p>✓ All inference runs on our own ONNX Runtime container on Railway</p>
                        <p>✓ Audit hashes (SHA-256) contain no reversible PII</p>
                    </div>
                </section>

                {/* Links */}
                <section className="border-t border-gray-100 pt-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Verify Our Claims</h2>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <Link href="/benchmarks" className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors">
                            <span className="font-bold text-gray-900">📊 Live Benchmarks</span>
                            <p className="text-gray-500 mt-1">Real-time accuracy metrics from production</p>
                        </Link>
                        <Link href="/validation" className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors">
                            <span className="font-bold text-gray-900">🧪 Validation Suite</span>
                            <p className="text-gray-500 mt-1">Run crisis detection tests live</p>
                        </Link>
                        <a href="https://github.com/yogami" target="_blank" rel="noopener noreferrer" className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors">
                            <span className="font-bold text-gray-900">🔗 GitHub Repos</span>
                            <p className="text-gray-500 mt-1">Open-source reference implementation</p>
                        </a>
                        <a href="https://www.npmjs.com/package/agent-pentest" target="_blank" rel="noopener noreferrer" className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors">
                            <span className="font-bold text-gray-900">🛡️ agent-pentest</span>
                            <p className="text-gray-500 mt-1">41 adversarial attack vectors on npm</p>
                        </a>
                    </div>
                </section>

                <footer className="mt-20 text-center border-t border-gray-100 pt-10">
                    <p className="text-sm text-gray-400">
                        Berlin AI Labs · Last updated: February 2026 · All limitations published in good faith
                    </p>
                </footer>
            </div>
        </main>
    );
}
