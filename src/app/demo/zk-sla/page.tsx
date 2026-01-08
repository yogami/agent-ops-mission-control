/**
 * ZK-SLA Interactive Demo
 * 
 * Ported from agent-suite-website and upgraded to Cyber Governance 2026 styling.
 */

'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function ZKSlaDemoPage() {
    const [step, setStep] = useState(0); // 0: Idle, 1: Proving, 2: Issuing, 3: Semantic, 4: Done

    const runSimulation = async () => {
        setStep(1);
        await new Promise(r => setTimeout(r, 1500)); // Simulate proving time
        setStep(2);
        await new Promise(r => setTimeout(r, 1500)); // Simulate verifying time
        setStep(3);
        await new Promise(r => setTimeout(r, 1500)); // Simulate semantic check
        setStep(4);
    };

    const mockProof = {
        pi_a: ["50529effc72390c6cfb6dcd613d22e0e744fcc3512b03b3ffbc4fcf9e9dc523f", "d7910eb0e2590a0c41d83eac1e6da296f3fbde30af6bccbfc5d89c79b5c3694a", "1"],
        pi_b: [
            ["3db5218bf5475d00cef235e4d3f1c613f2b73d46cdae991040d14f2be86c7f62", "9fc9b2ed3e696a17257bff4304e6204ab8054cbf9c69537489160ffc81557d37"],
            ["06b89ebd5214ef20d73250193a1fb8d975bf7b62fa177686cdcf0fec14d941b4", "29f744e083c3b8ea89b9c5025e40eba696684e674e27df654752d4a4283c47bf"],
            ["1", "0"]
        ],
        protocol: "groth16",
        curve: "bn128"
    };

    return (
        <main className="min-h-screen py-12 px-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-12 text-center">
                    <Link href="/" className="text-sm text-gray-500 hover:text-[var(--primary)] mb-4 inline-block">
                        ← Back to Mission Control
                    </Link>
                    <h1 className="text-4xl font-bold text-white mb-4">
                        Zero-Knowledge <span className="gradient-text">SLA Verification</span>
                    </h1>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Proving agent compliance without revealing internal state.
                        This simulation uses Groth16 zero-knowledge proofs to verify performance metrics.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    {/* Progress panel */}
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-3">
                            <span className="status-pulse status-online" />
                            Proof Sequence
                        </h2>

                        <div className={`glass-card p-6 transition-all duration-500 ${step >= 1 ? 'border-[var(--primary)] bg-[var(--primary-glow)]' : ''}`}>
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-semibold text-white">Phase 1: ZK-SLA Proof</span>
                                {step >= 1 && <span className="text-[var(--primary)] text-sm font-mono">PROVED</span>}
                            </div>
                            <p className="text-sm text-gray-400">
                                Agent generates proof of "Task Latency &lt; 100ms" using local trace data.
                            </p>
                        </div>

                        <div className={`glass-card p-6 transition-all duration-500 ${step >= 2 ? 'border-[var(--secondary)] bg-[var(--secondary-glow)]' : ''}`}>
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-semibold text-white">Phase 2: Credential Issuance</span>
                                {step >= 2 && <span className="text-[var(--secondary)] text-sm font-mono">ISSUED</span>}
                            </div>
                            <p className="text-sm text-gray-400">
                                Trust Verifier checks proof and issues a W3C Verifiable Credential.
                            </p>
                        </div>

                        <div className={`glass-card p-6 transition-all duration-500 ${step >= 3 ? 'border-emerald-500/50 bg-emerald-500/5' : ''}`}>
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-semibold text-white">Phase 3: Semantic Alignment</span>
                                {step >= 3 && <span className="text-emerald-400 text-sm font-mono">VERIFIED</span>}
                            </div>
                            <p className="text-sm text-gray-400">
                                Mathematical proof that agent vocabulary matches enterprise ontology.
                            </p>
                        </div>

                        <button
                            onClick={runSimulation}
                            disabled={step > 0 && step < 4}
                            className="w-full btn-primary text-lg"
                        >
                            {step === 0 ? 'Initialize ZK Simulation' : step === 4 ? 'Reset Simulation' : 'Computing Proof...'}
                        </button>
                    </div>

                    {/* Terminal panel */}
                    <div className="bg-black border border-[var(--border)] rounded-2xl p-6 font-mono text-sm h-[600px] flex flex-col shadow-2xl">
                        <div className="flex items-center justify-between mb-4 border-b border-[var(--border)] pb-2">
                            <span className="text-gray-500">Governance Node Output</span>
                            <div className="flex space-x-2">
                                <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                                <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
                            </div>
                        </div>

                        <div className="overflow-y-auto space-y-6 flex-1 pr-2">
                            {step === 0 && (
                                <div className="text-gray-600 italic">SYSTEM IDLE: Waiting for trigger...</div>
                            )}

                            {step >= 1 && (
                                <div className="animate-in fade-in slide-in-from-left duration-500">
                                    <div className="text-[var(--primary)] font-bold mb-1">❯ node generate-zk-proof --latency=95ms</div>
                                    <div className="text-gray-300">Calculating witnesses... Done.</div>
                                    <div className="text-gray-300">Generating SNARK proof... Done.</div>
                                    <div className="text-emerald-400 mt-2">✓ Proof Generated: groth16/bn128 (832 bytes)</div>
                                    <pre className="mt-2 text-[10px] text-gray-500 bg-gray-900/50 p-3 rounded-lg border border-white/5 overflow-x-auto">
                                        {JSON.stringify(mockProof, null, 2)}
                                    </pre>
                                </div>
                            )}

                            {step >= 2 && (
                                <div className="animate-in fade-in slide-in-from-left duration-500 pt-4 border-t border-white/5">
                                    <div className="text-[var(--secondary)] font-bold mb-1">❯ trust-verifier --verify did:web:agent-007</div>
                                    <div className="text-gray-300">Resolving DID document... Confirmed.</div>
                                    <div className="text-gray-300">Validating SNARK proof against circuit... Valid.</div>
                                    <div className="text-emerald-400 mt-2">✓ Issuing Credential: AgentSlaVerified-2026.json</div>
                                </div>
                            )}

                            {step >= 3 && (
                                <div className="animate-in fade-in slide-in-from-left duration-500 pt-4 border-t border-white/5">
                                    <div className="text-emerald-400 font-bold mb-1">❯ semantic-aligner --check /contracts/legal</div>
                                    <div className="text-gray-300">Source: [Refund] -&gt; Target: [Reversal]</div>
                                    <div className="text-gray-300">Calculated Cosine Distance: 0.283 (Threshold: 0.3)</div>
                                    <div className="text-emerald-400 mt-2">✓ Semantic Proof Valid: Context Integrity Maintained</div>
                                </div>
                            )}

                            {step === 4 && (
                                <div className="animate-in zoom-in duration-500 mt-8">
                                    <div className="text-white bg-emerald-900/20 px-4 py-8 rounded-2xl border border-emerald-500/30 text-center font-bold">
                                        <div className="text-4xl mb-4">🛡️</div>
                                        TRUST ESTABLISHED
                                        <p className="text-xs font-normal text-emerald-400/70 mt-2 font-mono uppercase tracking-widest">
                                            Agent interaction authorized for production
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Info footer */}
                <div className="mt-12 p-8 glass-card border-[var(--primary)]/20">
                    <h3 className="text-lg font-semibold text-white mb-4">How it works</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                        In a multi-agent ecosystem, revealing raw logs is a privacy risk. Zero-Knowledge Proofs allow agents to prove they correctly followed an SLA (like responding under 100ms) or adhered to a safety policy without exposing the actual data processed.
                        <strong> AgentOps Suite</strong> provides the infrastructure to generate, verify, and store these proofs as portable credentials.
                    </p>
                </div>
            </div>
        </main>
    );
}
