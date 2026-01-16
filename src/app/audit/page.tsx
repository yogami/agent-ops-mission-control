'use client';

import { ConvoGuardPanel, ChainAnchorPanel } from '@/components/microservices';
import Link from 'next/link';

export default function AuditPage() {
    return (
        <main className="min-h-screen bg-gradient-to-br from-gray-950 via-emerald-950 to-gray-950 py-12 px-6">
            <div className="max-w-6xl mx-auto">
                <Link href="/" className="text-sm text-gray-500 hover:text-emerald-400 mb-4 inline-block">
                    ← Back to Home
                </Link>

                <div className="mb-8 p-6 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl">
                    <h1 className="text-4xl font-bold text-white mb-2">
                        Clinical <span className="text-emerald-400 font-mono italic">Compliance</span> Audit
                    </h1>
                    <p className="text-gray-400 max-w-2xl">
                        Validate AI therapy transcripts against <strong className="text-white">EU AI Act</strong> and
                        <strong className="text-white"> BfArM</strong> standards. Generate regulator-ready audit reports.
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-6">
                    {/* ConvoGuard - Main Compliance Tool */}
                    <ConvoGuardPanel />

                    {/* Chain Anchor - Audit Trail */}
                    <div className="glass-card p-6 border-l-4 border-gray-500">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-2xl">🔐</span>
                            <div>
                                <h3 className="text-lg font-semibold text-white uppercase tracking-tight">Audit Trail Anchoring</h3>
                                <p className="text-xs text-gray-400 font-mono">Immutable Compliance Evidence</p>
                            </div>
                            <span className="ml-auto px-2 py-0.5 text-[10px] bg-gray-500/20 text-gray-400 rounded-full border border-gray-500/30">
                                OPTIONAL
                            </span>
                        </div>

                        <div className="space-y-4 text-sm text-gray-400">
                            <p>
                                Every compliance validation above generates a cryptographic hash.
                                Anchor this hash to create <strong className="text-white">tamper-proof evidence</strong> that
                                your safety layer was active at a specific time.
                            </p>

                            <div className="p-4 bg-black/30 rounded-lg border border-white/5">
                                <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Why Anchor?</p>
                                <ul className="space-y-2 text-xs">
                                    <li className="flex items-start gap-2">
                                        <span className="text-emerald-400">✓</span>
                                        <span>Proves to regulators that logs weren't modified after-the-fact</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-emerald-400">✓</span>
                                        <span>Creates legally defensible audit trail for liability protection</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-emerald-400">✓</span>
                                        <span>Required for highest-tier DiGA certification</span>
                                    </li>
                                </ul>
                            </div>

                            <ChainAnchorPanel />
                        </div>
                    </div>
                </div>

                {/* Architecture Note */}
                <div className="mt-8 p-4 bg-black/20 border border-white/5 rounded-lg text-xs text-gray-500">
                    <strong className="text-gray-400">Technical Note:</strong> This system calls live production APIs.
                    Compliance validation is powered by ConvoGuard AI. Audit anchoring uses Solana Devnet.
                </div>
            </div>
        </main>
    );
}
