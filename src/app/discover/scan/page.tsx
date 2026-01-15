'use client';

import { useState } from 'react';
import Link from 'next/link';

type CloudProvider = 'aws' | 'azure' | 'openai' | 'gcp';
type ScanStep = 'select' | 'credentials' | 'scanning' | 'results';

interface DiscoveredAgent {
    id: string;
    name: string;
    provider: CloudProvider;
    type: string;
    region: string;
    lastActive: string;
    isManaged: boolean;
    modelId?: string;
}

const PROVIDER_INFO: Record<CloudProvider, { name: string; icon: string; color: string }> = {
    aws: { name: 'AWS Bedrock', icon: '🟠', color: 'border-orange-500/30' },
    azure: { name: 'Azure OpenAI', icon: '🔵', color: 'border-blue-500/30' },
    openai: { name: 'OpenAI', icon: '⚫', color: 'border-gray-500/30' },
    gcp: { name: 'Google Vertex', icon: '🔴', color: 'border-red-500/30' },
};

export default function ShadowDiscoveryPage() {
    const [step, setStep] = useState<ScanStep>('select');
    const [selectedProvider, setSelectedProvider] = useState<CloudProvider | null>(null);
    const [credentials, setCredentials] = useState({ key: '', secret: '', region: '' });
    const [scanProgress, setScanProgress] = useState(0);
    const [discovered, setDiscovered] = useState<DiscoveredAgent[]>([]);
    const [addedAgents, setAddedAgents] = useState<Set<string>>(new Set());
    const [isMockData, setIsMockData] = useState(false);
    const [scanError, setScanError] = useState<string | null>(null);

    const startScan = async () => {
        setStep('scanning');
        setScanProgress(0);
        setScanError(null);

        // Animate progress bar
        const progressInterval = setInterval(() => {
            setScanProgress(prev => Math.min(prev + 5, 90));
        }, 200);

        try {
            const response = await fetch('/api/scanner', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    provider: selectedProvider,
                    credentials: credentials.key ? {
                        accessKeyId: credentials.key,
                        secretAccessKey: credentials.secret,
                        apiKey: credentials.key,
                        region: credentials.region,
                        resourceName: credentials.region, // Azure uses this
                    } : undefined,
                }),
            });

            clearInterval(progressInterval);
            setScanProgress(100);

            if (!response.ok) {
                throw new Error('Scan failed');
            }

            const data = await response.json();
            setDiscovered(data.agents || []);
            setIsMockData(data.isMockData);
            setStep('results');
        } catch (error) {
            clearInterval(progressInterval);
            console.error('Scan error:', error);
            setScanError('Scan failed. Please check credentials and try again.');
            setStep('credentials');
        }
    };

    const addToRegistry = async (agent: DiscoveredAgent) => {
        try {
            const response = await fetch('/api/manager/agents', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: agent.name,
                    description: `Discovered from ${agent.provider} - AI Model: ${agent.modelId || agent.type}`,
                    trustScore: 85, // Default trust score for discovered agents
                    badges: [{ type: 'AI_ACT', verified: true }], // Auto-verified in discovery demo
                    tags: ['discovered', agent.provider, agent.region]
                }),
            });

            if (response.ok) {
                setAddedAgents(prev => new Set([...prev, agent.id]));
            }
        } catch (error) {
            console.error('Failed to add agent to registry:', error);
        }
    };


    return (
        <main className="min-h-screen py-12 px-6">
            <div className="max-w-4xl mx-auto">
                <Link href="/discover" className="text-sm text-gray-500 hover:text-[var(--primary)] mb-4 inline-block">
                    ← Back to Discovery
                </Link>
                <h1 className="text-4xl font-bold text-white mb-2">
                    Shadow AI <span className="gradient-text">Discovery</span>
                </h1>
                <p className="text-gray-400 mb-8">
                    Scan your cloud infrastructure to discover unmanaged AI agents and add them to Mission Control.
                </p>

                {/* Step 1: Select Provider */}
                {step === 'select' && (
                    <div className="glass-card p-8">
                        <h2 className="text-xl font-semibold text-white mb-6">Select Cloud Provider</h2>
                        <div className="grid grid-cols-2 gap-4">
                            {(Object.entries(PROVIDER_INFO) as [CloudProvider, typeof PROVIDER_INFO.aws][]).map(([key, info]) => (
                                <button
                                    key={key}
                                    onClick={() => setSelectedProvider(key)}
                                    data-testid={`provider-${key}`}
                                    className={`p-6 rounded-xl border ${selectedProvider === key ? 'border-[var(--primary)] bg-[var(--primary)]/10' : `${info.color} bg-[var(--surface-2)]`} text-left transition-all hover:border-[var(--primary)]/50`}
                                >
                                    <span className="text-3xl mb-2 block">{info.icon}</span>
                                    <span className="text-white font-medium">{info.name}</span>
                                </button>
                            ))}
                        </div>
                        <div className="mt-8 flex justify-end">
                            <button
                                onClick={() => setStep('credentials')}
                                disabled={!selectedProvider}
                                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                                data-testid="btn-next-provider"
                            >
                                Next: Enter Credentials →
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 2: Credentials */}
                {step === 'credentials' && selectedProvider && (
                    <div className="glass-card p-8">
                        <h2 className="text-xl font-semibold text-white mb-2">
                            Connect to {PROVIDER_INFO[selectedProvider].name}
                        </h2>
                        <p className="text-gray-400 text-sm mb-6">
                            Provide read-only credentials. We never store your secrets.
                        </p>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Access Key / Client ID</label>
                                <input
                                    type="password"
                                    value={credentials.key}
                                    onChange={e => setCredentials({ ...credentials, key: e.target.value })}
                                    placeholder="••••••••••••••••"
                                    className="w-full px-4 py-3 bg-[var(--surface-2)] border border-[var(--border)] rounded-lg text-white"
                                    data-testid="input-key"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Secret Key / Client Secret</label>
                                <input
                                    type="password"
                                    value={credentials.secret}
                                    onChange={e => setCredentials({ ...credentials, secret: e.target.value })}
                                    placeholder="••••••••••••••••"
                                    className="w-full px-4 py-3 bg-[var(--surface-2)] border border-[var(--border)] rounded-lg text-white"
                                    data-testid="input-secret"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Region</label>
                                <input
                                    type="text"
                                    value={credentials.region}
                                    onChange={e => setCredentials({ ...credentials, region: e.target.value })}
                                    placeholder="e.g., us-east-1, westeurope"
                                    className="w-full px-4 py-3 bg-[var(--surface-2)] border border-[var(--border)] rounded-lg text-white"
                                    data-testid="input-region"
                                />
                            </div>
                        </div>

                        <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg mt-6">
                            <p className="text-amber-400 text-sm">
                                {credentials.key
                                    ? '✓ Credentials will be used for live scan (not stored)'
                                    : '⚠️ No credentials provided. Click "Scan" to use demo data.'}
                            </p>
                        </div>

                        {scanError && (
                            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg mt-4">
                                <p className="text-red-400 text-sm">{scanError}</p>
                            </div>
                        )}

                        <div className="mt-8 flex justify-between">
                            <button onClick={() => setStep('select')} className="btn-secondary">
                                ← Back
                            </button>
                            <button onClick={startScan} className="btn-primary" data-testid="btn-start-scan">
                                🔍 Start Scan
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 3: Scanning */}
                {step === 'scanning' && (
                    <div className="glass-card p-8 text-center">
                        <div className="text-6xl mb-6 animate-pulse">🔍</div>
                        <h2 className="text-xl font-semibold text-white mb-4">Scanning Infrastructure...</h2>
                        <div className="max-w-md mx-auto">
                            <div className="h-2 bg-[var(--surface-2)] rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-[var(--primary)] transition-all duration-300"
                                    style={{ width: `${scanProgress}%` }}
                                />
                            </div>
                            <p className="text-gray-400 mt-4">{scanProgress}% complete</p>
                        </div>
                        <p className="text-xs text-gray-500 mt-6">
                            Analyzing API calls, model deployments, and agent configurations...
                        </p>
                    </div>
                )}

                {/* Step 4: Results */}
                {step === 'results' && (
                    <div className="glass-card p-8">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                                    Discovered Agents
                                    {isMockData && (
                                        <span className="text-[10px] px-2 py-0.5 bg-amber-500/20 text-amber-500 border border-amber-500/30 rounded uppercase tracking-wider font-bold">
                                            Demo Data
                                        </span>
                                    )}
                                </h2>
                                <p className="text-gray-400 text-sm">
                                    Found {discovered.length} unmanaged agent{discovered.length !== 1 ? 's' : ''}
                                </p>
                            </div>
                            <button
                                onClick={() => { setStep('select'); setSelectedProvider(null); }}
                                className="btn-secondary text-sm"
                            >
                                Scan Another Provider
                            </button>
                        </div>

                        <div className="space-y-4">
                            {discovered.map(agent => (
                                <div
                                    key={agent.id}
                                    className={`p-4 rounded-lg border ${PROVIDER_INFO[agent.provider].color} bg-[var(--surface-2)] flex items-center justify-between`}
                                    data-testid="discovered-agent"
                                >
                                    <div className="flex items-center gap-4">
                                        <span className="text-2xl">{PROVIDER_INFO[agent.provider].icon}</span>
                                        <div>
                                            <div className="text-white font-medium">{agent.name}</div>
                                            <div className="text-xs text-gray-500">
                                                {agent.type} • {agent.region} • Active {agent.lastActive}
                                            </div>
                                        </div>
                                    </div>
                                    {addedAgents.has(agent.id) ? (
                                        <span className="px-3 py-1.5 text-xs bg-emerald-500/20 text-emerald-400 rounded-full">
                                            ✓ Added
                                        </span>
                                    ) : (
                                        <button
                                            onClick={() => addToRegistry(agent)}
                                            className="px-3 py-1.5 text-xs bg-[var(--primary)] text-black rounded-lg hover:bg-[var(--primary-hover)] transition-colors"
                                            data-testid="add-to-registry"
                                        >
                                            Add to Registry
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>

                        {addedAgents.size > 0 && (
                            <div className="mt-8 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                                <p className="text-emerald-400 text-sm">
                                    ✓ {addedAgents.size} agent{addedAgents.size !== 1 ? 's' : ''} added to <strong>your Fleet</strong>.
                                    <Link href="/manage" className="underline ml-1">View Your Fleet →</Link>
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </main>
    );
}
