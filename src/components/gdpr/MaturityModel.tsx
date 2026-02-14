'use client';

/**
 * Agent Maturity Model — 4-level governance system
 * 
 * Level 1: Intern   — Sandbox only, human approval required for every action
 * Level 2: Junior   — Production with guardrails, automated checks + human escalation
 * Level 3: Senior   — Autonomous with monitoring, circuit breakers active
 * Level 4: Principal — Full autonomy, self-monitoring, trusted for critical operations
 */

import { useState } from 'react';

interface AgentMaturityEntry {
    name: string;
    did: string;
    level: 1 | 2 | 3 | 4;
    promotionCriteria: string;
    status: 'active' | 'probation' | 'suspended';
}

const MATURITY_LEVELS = [
    {
        level: 1,
        name: 'Intern',
        color: 'bg-gray-100 text-gray-600 border-gray-200',
        badge: '🔰',
        description: 'Sandbox only. Human approval required for every action.',
        requirements: ['Passes all pentest vectors', 'Zero false negatives on crisis detection', 'GDPR consent handling validated'],
    },
    {
        level: 2,
        name: 'Junior',
        color: 'bg-blue-50 text-blue-700 border-blue-200',
        badge: '🛡️',
        description: 'Production with guardrails. Automated checks + human escalation.',
        requirements: ['7 days with no critical incidents', 'Kill switch tested and verified', 'Circuit breaker thresholds configured'],
    },
    {
        level: 3,
        name: 'Senior',
        color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        badge: '⚡',
        description: 'Autonomous with monitoring. Circuit breakers active.',
        requirements: ['30 days with no incidents', 'All audit trails anchored to chain', 'Trust score > 0.85'],
    },
    {
        level: 4,
        name: 'Principal',
        color: 'bg-purple-50 text-purple-700 border-purple-200',
        badge: '👑',
        description: 'Full autonomy. Self-monitoring, trusted for critical operations.',
        requirements: ['90 days with no incidents', 'Peer-reviewed by 2+ Senior agents', 'Complete PoE chain verified on-chain'],
    },
];

const DEMO_AGENTS: AgentMaturityEntry[] = [
    { name: 'ConvoGuard Validator', did: 'did:web:convoguard.berlin-ai-labs.de', level: 3, promotionCriteria: 'Complete PoE chain for promotion to Principal', status: 'active' },
    { name: 'GDPR Consent Agent', did: 'did:web:gdpr-consent.berlin-ai-labs.de', level: 2, promotionCriteria: '23 more days without incident for Senior', status: 'active' },
    { name: 'Chain Anchor Agent', did: 'did:web:chain-anchor.berlin-ai-labs.de', level: 3, promotionCriteria: 'Peer review pending for Principal', status: 'active' },
    { name: 'Trust Verifier Agent', did: 'did:web:trust-verifier.berlin-ai-labs.de', level: 2, promotionCriteria: 'Kill switch test required', status: 'active' },
    { name: 'Crisis Escalation Agent', did: 'did:web:crisis-escalation.berlin-ai-labs.de', level: 1, promotionCriteria: 'Pending pentest validation', status: 'probation' },
    { name: 'PDP Protocol Agent', did: 'did:web:pdp-protocol.berlin-ai-labs.de', level: 3, promotionCriteria: 'PoE chain verification in progress', status: 'active' },
    { name: 'Transparency Report Agent', did: 'did:web:transparency.berlin-ai-labs.de', level: 1, promotionCriteria: 'Sandbox testing in progress', status: 'active' },
    { name: 'Audit Trail Agent', did: 'did:web:audit-trail.berlin-ai-labs.de', level: 2, promotionCriteria: '14 more days without incident for Senior', status: 'active' },
];

export default function MaturityModel() {
    const [selectedLevel, setSelectedLevel] = useState<number | null>(null);

    const agentsByLevel = (level: number) => DEMO_AGENTS.filter(a => a.level === level);

    return (
        <div className="space-y-6">
            {/* Level Cards */}
            <div className="grid grid-cols-4 gap-3">
                {MATURITY_LEVELS.map(ml => {
                    const agents = agentsByLevel(ml.level);
                    const isSelected = selectedLevel === ml.level;
                    return (
                        <button
                            key={ml.level}
                            onClick={() => setSelectedLevel(isSelected ? null : ml.level)}
                            className={`p-4 rounded-xl border-2 text-left transition-all ${isSelected
                                    ? ml.color.replace('border-', 'border-') + ' ring-2 ring-offset-2 ring-' + ml.color.split('text-')[1]?.split(' ')[0]
                                    : 'border-gray-100 hover:border-gray-200'
                                }`}
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-lg">{ml.badge}</span>
                                <span className="font-bold text-sm">L{ml.level}: {ml.name}</span>
                            </div>
                            <p className="text-xs text-gray-500 mb-3">{ml.description}</p>
                            <div className="flex items-center gap-1">
                                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${ml.color}`}>
                                    {agents.length} agent{agents.length !== 1 ? 's' : ''}
                                </span>
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* Selected Level Details */}
            {selectedLevel !== null && (
                <div className="border border-gray-200 rounded-xl p-6">
                    <h3 className="font-bold text-sm text-gray-900 mb-3">
                        {MATURITY_LEVELS[selectedLevel - 1].badge} Level {selectedLevel} — {MATURITY_LEVELS[selectedLevel - 1].name} Agents
                    </h3>

                    {/* Promotion Criteria */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                        <p className="text-xs font-bold text-gray-500 uppercase mb-2">Promotion Requirements</p>
                        <ul className="space-y-1">
                            {MATURITY_LEVELS[selectedLevel - 1].requirements.map((req, i) => (
                                <li key={i} className="text-sm text-gray-600 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-gray-300 rounded-full" />
                                    {req}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Agents at this level */}
                    <div className="space-y-2">
                        {agentsByLevel(selectedLevel).map(agent => (
                            <div key={agent.did} className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-lg">
                                <div>
                                    <p className="font-semibold text-sm">{agent.name}</p>
                                    <p className="text-xs text-gray-400 font-mono">{agent.did}</p>
                                </div>
                                <div className="text-right">
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${agent.status === 'active' ? 'bg-emerald-100 text-emerald-600' :
                                            agent.status === 'probation' ? 'bg-orange-100 text-orange-600' :
                                                'bg-red-100 text-red-600'
                                        }`}>
                                        {agent.status}
                                    </span>
                                    <p className="text-xs text-gray-400 mt-1">{agent.promotionCriteria}</p>
                                </div>
                            </div>
                        ))}
                        {agentsByLevel(selectedLevel).length === 0 && (
                            <p className="text-sm text-gray-400 text-center py-4">No agents at this level</p>
                        )}
                    </div>
                </div>
            )}

            {/* All Agents Summary */}
            {selectedLevel === null && (
                <div className="border border-gray-200 rounded-xl overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs">Agent</th>
                                <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs">Level</th>
                                <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs">Status</th>
                                <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs">Next Promotion</th>
                            </tr>
                        </thead>
                        <tbody>
                            {DEMO_AGENTS.map(agent => (
                                <tr key={agent.did} className="border-t border-gray-50 hover:bg-gray-50/50">
                                    <td className="px-4 py-3">
                                        <p className="font-semibold">{agent.name}</p>
                                        <p className="text-xs text-gray-400 font-mono">{agent.did}</p>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${MATURITY_LEVELS[agent.level - 1].color}`}>
                                            {MATURITY_LEVELS[agent.level - 1].badge} L{agent.level}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${agent.status === 'active' ? 'bg-emerald-100 text-emerald-600' :
                                                agent.status === 'probation' ? 'bg-orange-100 text-orange-600' :
                                                    'bg-red-100 text-red-600'
                                            }`}>
                                            {agent.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-gray-500 text-xs">{agent.promotionCriteria}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
