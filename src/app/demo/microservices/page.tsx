'use client';

import { ConvoGuardPanel, ChainAnchorPanel } from '@/components/microservices';
import Link from 'next/link';

export default function MicroservicesDemoPage() {
    return (
        <main className="min-h-screen py-12 px-6">
            <div className="max-w-6xl mx-auto">
                <Link href="/" className="text-sm text-gray-500 hover:text-[var(--primary)] mb-4 inline-block">
                    ← Back to Mission Control
                </Link>

                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2">
                        Live <span className="gradient-text">Microservices</span> Demo
                    </h1>
                    <p className="text-gray-400">
                        These are the real microservices powering Agent Ops Mission Control.
                        All API calls go to live production endpoints.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* ConvoGuard AI */}
                    <ConvoGuardPanel />

                    {/* Chain Anchor */}
                    <ChainAnchorPanel />
                </div>

                {/* Additional Info */}
                <div className="mt-8 p-6 glass-card border-[var(--primary)]/20">
                    <h2 className="text-xl font-semibold text-white mb-4">🏗️ Architecture</h2>
                    <div className="grid md:grid-cols-3 gap-6 text-sm">
                        <div>
                            <h3 className="text-[var(--primary)] font-medium mb-2">ConvoGuard AI</h3>
                            <p className="text-gray-400">
                                Railway-hosted compliance engine. Validates AI outputs against EU AI Act,
                                GDPR, and mental health safety policies in real-time.
                            </p>
                            <code className="block mt-2 text-xs text-gray-500 bg-black/20 px-2 py-1 rounded">
                                convo-guard-ai-production.up.railway.app
                            </code>
                        </div>
                        <div>
                            <h3 className="text-[var(--primary)] font-medium mb-2">Chain Anchor</h3>
                            <p className="text-gray-400">
                                Blockchain anchoring service. Creates immutable proofs of SLA compliance
                                on Solana, zkSync, or Starknet.
                            </p>
                            <code className="block mt-2 text-xs text-gray-500 bg-black/20 px-2 py-1 rounded">
                                agent-chain-anchor-production.up.railway.app
                            </code>
                        </div>
                        <div>
                            <h3 className="text-[var(--primary)] font-medium mb-2">Trust Protocol</h3>
                            <p className="text-gray-400">
                                Reputation scoring system. Tracks agent compliance history, uptime,
                                and generates verifiable TrustScores.
                            </p>
                            <code className="block mt-2 text-xs text-gray-500 bg-black/20 px-2 py-1 rounded">
                                agent-trust-protocol-production.up.railway.app
                            </code>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
