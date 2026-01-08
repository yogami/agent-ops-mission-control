/**
 * Seed Agents
 * 
 * Static data representing Berlin AI Labs' 8 microservices
 * for the demo. This will be replaced by live Capability Broker data.
 */

import { Agent } from '@/domain/Agent';

export const SEED_AGENTS: Agent[] = [
    {
        id: 'convo-guard-ai',
        name: 'ConvoGuard AI',
        description: 'Real-time policy evaluation, signal detection (suicide, bias, PII), and AI Act guardrails for mental health and enterprise chatbots.',
        category: 'compliance',
        status: 'online',
        trustScore: 95,
        badges: [
            { type: 'AI_ACT', verified: true },
            { type: 'GDPR', verified: true },
            { type: 'DIGA', verified: true },
        ],
        endpointUrl: 'https://convo-guard-ai-production.up.railway.app',
        tags: ['compliance', 'safety', 'mental-health', 'gdpr', 'ai-act'],
        pricePerRequest: 0.001,
        lastHealthCheck: new Date(),
    },
    {
        id: 'agent-trust-verifier',
        name: 'Trust Verifier',
        description: 'DID resolution, Zero-Trust enrollment, and ZK-Credential verification for agent identity.',
        category: 'governance',
        status: 'online',
        trustScore: 92,
        badges: [
            { type: 'SOC2', verified: true },
            { type: 'GDPR', verified: true },
        ],
        endpointUrl: 'https://agent-trust-verifier-production.up.railway.app',
        tags: ['governance', 'trust', 'zk-proofs', 'identity'],
        pricePerRequest: 0.002,
        lastHealthCheck: new Date(),
    },
    {
        id: 'agent-semantic-aligner',
        name: 'Semantic Aligner',
        description: 'Vocabulary mapping, ZK-proven semantic usage, and ontology bridging across AI vendors.',
        category: 'governance',
        status: 'online',
        trustScore: 88,
        badges: [
            { type: 'AI_ACT', verified: true },
        ],
        endpointUrl: 'https://agent-semantic-aligner-production.up.railway.app',
        tags: ['interoperability', 'translation', 'multi-model'],
        pricePerRequest: 0.0015,
        lastHealthCheck: new Date(),
    },
    {
        id: 'agent-deadline-enforcer',
        name: 'Deadline Enforcer',
        description: 'SLA monitoring, breach detection, and timeout orchestration for agent chains.',
        category: 'governance',
        status: 'online',
        trustScore: 90,
        badges: [
            { type: 'SOC2', verified: true },
        ],
        endpointUrl: 'https://agent-deadline-enforcer-production.up.railway.app',
        tags: ['sla', 'monitoring', 'orchestration'],
        pricePerRequest: 0.0005,
        lastHealthCheck: new Date(),
    },
    {
        id: 'agent-fairness-auditor',
        name: 'Fairness Auditor',
        description: 'Offline/async bias auditing, safety scoring, and compliance reporting.',
        category: 'compliance',
        status: 'online',
        trustScore: 87,
        badges: [
            { type: 'AI_ACT', verified: true },
            { type: 'GDPR', verified: true },
        ],
        endpointUrl: 'https://agent-fairness-auditor-production.up.railway.app',
        tags: ['bias', 'fairness', 'audit', 'compliance'],
        pricePerRequest: 0.003,
        lastHealthCheck: new Date(),
    },
    {
        id: 'agent-trust-protocol',
        name: 'Trust Protocol',
        description: 'Reputation protocol for AI agents. Tracks compliance, uptime, and verified identity.',
        category: 'governance',
        status: 'online',
        trustScore: 91,
        badges: [
            { type: 'SOC2', verified: true },
            { type: 'ISO27001', verified: true },
        ],
        endpointUrl: 'https://agent-trust-protocol-production.up.railway.app',
        tags: ['reputation', 'governance', 'trust'],
        pricePerRequest: 0.001,
        lastHealthCheck: new Date(),
    },
    {
        id: 'capability-broker',
        name: 'Capability Broker',
        description: 'Central "Live Phonebook" for the Studio. Handles dynamic service registration and skills-aware routing.',
        category: 'utility',
        status: 'online',
        trustScore: 94,
        badges: [
            { type: 'SOC2', verified: true },
        ],
        endpointUrl: 'https://studio-service-directory-production.up.railway.app',
        tags: ['discovery', 'routing', 'registry'],
        pricePerRequest: 0.0001,
        lastHealthCheck: new Date(),
    },
    {
        id: 'reelberlin-engine',
        name: 'ReelBerlin Engine',
        description: 'End-to-end "URL to Video" pipeline (Scraping → Script → Content DNA → Render).',
        category: 'content',
        status: 'online',
        trustScore: 85,
        badges: [
            { type: 'GDPR', verified: true },
        ],
        endpointUrl: 'https://instagram-reel-poster-production.up.railway.app',
        tags: ['content', 'media', 'video', 'automation'],
        pricePerRequest: 0.05,
        lastHealthCheck: new Date(),
    },
];
