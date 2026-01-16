'use client';

import Link from 'next/link';

export default function APIDocsPage() {
    return (
        <main className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-blue-100">
            <nav className="border-b border-gray-100 bg-white py-4 px-6 flex justify-between items-center sticky top-0 z-10">
                <div className="flex items-center gap-2">
                    <span className="text-xl font-bold tracking-tight text-blue-600">ConvoGuard</span>
                    <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-medium italic">API Docs</span>
                </div>
                <div className="flex gap-6 text-sm font-medium">
                    <Link href="/fast-audit" className="text-gray-500 hover:text-blue-600 transition-colors">Audit Console</Link>
                </div>
            </nav>

            <div className="max-w-4xl mx-auto py-16 px-6">
                <header className="mb-16">
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">API Reference v1.2</h1>
                    <p className="text-xl text-gray-500">
                        Plug ConvoGuard's neural compliance brain directly into your clinical pipeline.
                    </p>
                </header>

                <div className="space-y-12">
                    {/* Security Note */}
                    <div className="bg-blue-50 border border-blue-100 p-6 rounded-2xl">
                        <h3 className="text-blue-900 font-bold mb-2 flex items-center gap-2">
                            <span>🛡️</span> GDPR & Clinical Data
                        </h3>
                        <p className="text-blue-800 text-sm leading-relaxed">
                            This API supports local-first inference. No data is stored on our servers.
                            All transcripts are processed in memory and immediately discarded after audit protocol generation.
                        </p>
                    </div>

                    {/* Authentication */}
                    <section>
                        <h2 className="text-2xl font-bold mb-4">Base URL</h2>
                        <div className="bg-gray-900 text-gray-300 p-4 rounded-xl font-mono text-sm overflow-x-auto shadow-lg">
                            https://convo-guard-ai-production.up.railway.app
                        </div>
                    </section>

                    {/* Endpoint: Validate */}
                    <section>
                        <div className="flex items-center gap-3 mb-4">
                            <span className="bg-emerald-500 text-white px-3 py-1 rounded-lg text-xs font-black">POST</span>
                            <h2 className="text-2xl font-bold">/api/ml-validate</h2>
                        </div>
                        <p className="text-gray-600 mb-6">
                            Executes a neural crisis detection audit. Returns a compliance verdict, risk mapping, and cryptographic signature.
                        </p>

                        <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-3">Request Body (JSON)</h3>
                        <table className="w-full text-left text-sm mb-6 bg-white rounded-xl border border-gray-100 overflow-hidden">
                            <thead className="bg-gray-50 text-gray-500 uppercase font-bold">
                                <tr>
                                    <th className="px-4 py-3">Property</th>
                                    <th className="px-4 py-3">Type</th>
                                    <th className="px-4 py-3">Description</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                <tr>
                                    <td className="px-4 py-3 font-mono text-blue-600">transcript</td>
                                    <td className="px-4 py-3">string</td>
                                    <td className="px-4 py-3 font-medium">The full AI/Patient conversation text.</td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-3 font-mono text-blue-600">policyPackId</td>
                                    <td className="px-4 py-3">string</td>
                                    <td className="px-4 py-3 text-gray-400 italic">Optional. Defaults to MENTAL_HEALTH_EU_V1.</td>
                                </tr>
                            </tbody>
                        </table>

                        <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-3">Quick Start (cURL)</h3>
                        <div className="bg-gray-900 text-gray-300 p-6 rounded-2xl font-mono text-sm overflow-x-auto shadow-xl group relative">
                            <pre className="whitespace-pre-wrap leading-relaxed">
                                {`curl -X POST https://convo-guard-ai-production.up.railway.app/api/ml-validate \\
-H "Content-Type: application/json" \\
-d '{
  "transcript": "Ich fühle mich heute sehr schlecht und möchte nicht mehr leben."
}'`}
                            </pre>
                        </div>
                    </section>

                    {/* Endpoint: XML */}
                    <section>
                        <div className="flex items-center gap-3 mb-4">
                            <span className="bg-purple-500 text-white px-3 py-1 rounded-lg text-xs font-black">POST</span>
                            <h2 className="text-2xl font-bold">/api/bfarm-xml</h2>
                        </div>
                        <p className="text-gray-600 mb-6">
                            Generates a machine-readable XML report in the official BfArM-compliant format for audit logs.
                        </p>

                        <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-3">Example Request</h3>
                        <div className="bg-gray-900 text-gray-300 p-6 rounded-2xl font-mono text-sm overflow-x-auto shadow-xl">
                            <pre className="whitespace-pre-wrap leading-relaxed">
                                {`curl -X POST https://convo-guard-ai-production.up.railway.app/api/bfarm-xml \\
-H "Content-Type: application/json" \\
-d '{ "transcript": "..." }' --output audit_report.xml`}
                            </pre>
                        </div>
                    </section>

                    {/* Success Metrics */}
                    <section className="bg-gray-900 text-white p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                            <span className="text-blue-400">⚡</span> Performance Benchmarks
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            <div>
                                <p className="text-xs uppercase font-bold text-gray-500 mb-1">Latency (P50)</p>
                                <p className="text-3xl font-black italic">~240ms</p>
                            </div>
                            <div>
                                <p className="text-xs uppercase font-bold text-gray-500 mb-1">Crisis Recall</p>
                                <p className="text-3xl font-black italic">100%</p>
                            </div>
                            <div>
                                <p className="text-xs uppercase font-bold text-gray-500 mb-1">Architecture</p>
                                <p className="text-3xl font-black italic">Neural</p>
                            </div>
                            <div>
                                <p className="text-xs uppercase font-bold text-gray-500 mb-1">EU AI Act</p>
                                <p className="text-3xl font-black italic">Ready</p>
                            </div>
                        </div>
                        <p className="mt-8 text-sm text-gray-400 italic">
                            *Benchmarks based on Neural DistilBERT inference on German synthetic training sets.
                            Real-world recall may vary (Target: &gt;85%).
                        </p>
                    </section>
                </div>

                <footer className="mt-32 pt-16 border-t border-gray-100 flex justify-between items-center bg-gray-50 rounded-b-3xl px-10 pb-10">
                    <div className="text-sm text-gray-400">
                        © 2026 Berlin AI Labs
                    </div>
                    <div className="flex gap-6 text-sm font-bold text-gray-500">
                        <Link href="/fast-audit" className="hover:text-blue-600">Audit Console</Link>
                        <a href="mailto:docs@convo-guard.ai" className="hover:text-blue-600">Support</a>
                    </div>
                </footer>
            </div>
        </main>
    );
}
