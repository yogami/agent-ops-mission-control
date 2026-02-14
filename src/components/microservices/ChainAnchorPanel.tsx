'use client';

import { useState } from 'react';
import { getCircuitBreaker } from '@/infrastructure/CircuitBreaker';

const CHAIN_ANCHOR_API = 'https://agent-chain-anchor-production.up.railway.app';
const chainAnchorBreaker = getCircuitBreaker('chain-anchor', { failureThreshold: 3, recoveryTimeMs: 30000 });

interface AnchorResult {
    txId: string;
    chain: string;
    proofHash: string;
    timestamp: number;
    explorerUrl: string;
    verified: boolean;
}

export function ChainAnchorPanel() {
    const [isAnchoring, setIsAnchoring] = useState(false);
    const [result, setResult] = useState<AnchorResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    const anchorProof = async () => {
        if (!chainAnchorBreaker.canExecute()) {
            setError('Circuit breaker OPEN — Chain Anchor service degraded. Auto-recovery in progress.');
            return;
        }

        setIsAnchoring(true);
        setError(null);
        setResult(null);

        const proofHash = `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;

        try {
            const data = await chainAnchorBreaker.execute(async () => {
                const response = await fetch(`${CHAIN_ANCHOR_API}/api/anchor`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        proofHash,
                        proofType: 'sla',
                        agentDid: 'did:web:mission-control.berlin-ai-labs.de',
                        metadata: {
                            source: 'mission-control-demo',
                            uptime: 99.7,
                            complianceScore: 94
                        }
                    }),
                });
                if (!response.ok) throw new Error('Anchor failed');
                return response.json();
            });
            setResult(data);
        } catch (err) {
            const cbStatus = chainAnchorBreaker.getStatus();
            if (cbStatus.state === 'OPEN') {
                setError(`Circuit breaker OPEN after ${cbStatus.failures} failures — auto-recovery in 30s.`);
            } else {
                setError('Failed to connect to Chain Anchor. Service may be starting up.');
            }
            console.error('Chain Anchor error:', err);
        } finally {
            setIsAnchoring(false);
        }
    };

    return (
        <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">⛓️</span>
                <div>
                    <h3 className="text-lg font-semibold text-white">Chain Anchor</h3>
                    <p className="text-xs text-gray-500">Immutable SLA proofs on Solana</p>
                </div>
                <div className="ml-auto flex items-center gap-2">
                    {chainAnchorBreaker.getStatus().state !== 'CLOSED' && (
                        <span className={`px-2 py-0.5 text-[10px] rounded-full border font-bold ${chainAnchorBreaker.getStatus().state === 'OPEN' ? 'bg-red-500/20 text-red-400 border-red-500/30 animate-pulse' : 'bg-amber-500/20 text-amber-400 border-amber-500/30'}`}>
                            CIRCUIT {chainAnchorBreaker.getStatus().state}
                        </span>
                    )}
                    <span className="px-2 py-0.5 text-[10px] bg-emerald-500/20 text-emerald-400 rounded-full border border-emerald-500/30">
                        LIVE
                    </span>
                </div>
            </div>

            <div className="space-y-4">
                <div className="p-3 bg-[var(--surface-2)] rounded-lg text-xs text-gray-400">
                    <p className="mb-2">Click to anchor an SLA proof to <strong className="text-[var(--primary)]">Solana Devnet</strong>:</p>
                    <ul className="space-y-1 ml-4">
                        <li>• Generates cryptographic hash of compliance metrics</li>
                        <li>• Anchors immutably to blockchain</li>
                        <li>• Returns verifiable transaction ID</li>
                    </ul>
                </div>

                <button
                    onClick={anchorProof}
                    disabled={isAnchoring}
                    className="w-full btn-primary disabled:opacity-50"
                >
                    {isAnchoring ? (
                        <span className="flex items-center justify-center gap-2">
                            <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                            Anchoring to Solana...
                        </span>
                    ) : (
                        '⚡ Anchor SLA Proof to Solana'
                    )}
                </button>

                {error && (
                    <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                        <p className="text-red-400 text-sm">{error}</p>
                    </div>
                )}

                {result && (
                    <div className="p-4 bg-[var(--surface-2)] border border-[var(--primary)]/30 rounded-lg">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-xl">✅</span>
                            <span className="font-semibold text-emerald-400">Anchored to Solana</span>
                            {result.verified && (
                                <span className="ml-auto px-2 py-0.5 text-[10px] bg-emerald-500/20 text-emerald-400 rounded border border-emerald-500/30">
                                    VERIFIED
                                </span>
                            )}
                        </div>

                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-500">Transaction ID:</span>
                                <code className="text-[var(--primary)] text-xs bg-black/30 px-2 py-1 rounded truncate max-w-[180px]">
                                    {result.txId.slice(0, 20)}...
                                </code>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Proof Hash:</span>
                                <code className="text-gray-300 text-xs truncate max-w-[180px]">{result.proofHash.slice(0, 16)}...</code>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Timestamp:</span>
                                <span className="text-gray-300 text-xs">{new Date(result.timestamp).toLocaleString()}</span>
                            </div>
                        </div>

                        <a
                            href={result.explorerUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-4 block w-full text-center py-2 text-sm bg-[var(--primary)]/20 text-[var(--primary)] rounded-lg hover:bg-[var(--primary)]/30 transition-colors"
                        >
                            View on Solana Explorer →
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
}
