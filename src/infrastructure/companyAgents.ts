/**
 * Company-Specific Demo Seed Data
 * 
 * Each company has its own fleet of agents for realistic multi-tenant demo.
 * - Berlin AI Labs: Our internal microservices (the infrastructure)
 * - ReguTech Corp: Sample FinTech customer with compliance agents
 * - Delta Campus: Sample EdTech customer with student-facing agents
 */

import { Agent } from '@/domain/Agent';

// Berlin AI Labs - Our internal microservices (the infrastructure powering Mission Control)
export const BERLIN_AI_LABS_AGENTS: Agent[] = [
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
            { type: 'DATA_RESIDENCY_EU', verified: true },
        ],
        endpointUrl: 'https://convo-guard-ai-production.up.railway.app',
        tags: ['compliance', 'safety', 'mental-health', 'gdpr', 'ai-act'],
        pricePerRequest: 0.001,
        lastHealthCheck: new Date(),
        companyId: 'berlin-ai-labs',
        companyName: 'Berlin AI Labs',
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
            { type: 'DATA_RESIDENCY_EU', verified: true },
        ],
        endpointUrl: 'https://agent-trust-verifier-production.up.railway.app',
        tags: ['governance', 'trust', 'zk-proofs', 'identity'],
        pricePerRequest: 0.002,
        lastHealthCheck: new Date(),
        companyId: 'berlin-ai-labs',
        companyName: 'Berlin AI Labs',
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
        companyId: 'berlin-ai-labs',
        companyName: 'Berlin AI Labs',
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
        companyId: 'berlin-ai-labs',
        companyName: 'Berlin AI Labs',
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
        companyId: 'berlin-ai-labs',
        companyName: 'Berlin AI Labs',
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
        companyId: 'berlin-ai-labs',
        companyName: 'Berlin AI Labs',
    },
];

// ReguTech Corp - Sample FinTech Customer
export const REGUTECH_AGENTS: Agent[] = [
    {
        id: 'regutech-kyc-validator',
        name: 'KYC Validator',
        description: 'Automated Know-Your-Customer verification using document OCR and biometric matching.',
        category: 'compliance',
        status: 'online',
        trustScore: 91,
        badges: [
            { type: 'GDPR', verified: true },
            { type: 'SOC2', verified: true },
        ],
        endpointUrl: 'https://api.regutech.demo/kyc',
        tags: ['kyc', 'fintech', 'identity', 'compliance'],
        pricePerRequest: 0.05,
        lastHealthCheck: new Date(),
        companyId: 'regutech-corp',
        companyName: 'ReguTech Corp',
    },
    {
        id: 'regutech-aml-screener',
        name: 'AML Screener',
        description: 'Real-time anti-money laundering transaction screening against global watchlists.',
        category: 'compliance',
        status: 'online',
        trustScore: 89,
        badges: [
            { type: 'SOC2', verified: true },
            { type: 'DATA_RESIDENCY_EU', verified: true },
        ],
        endpointUrl: 'https://api.regutech.demo/aml',
        tags: ['aml', 'fintech', 'screening', 'watchlist'],
        pricePerRequest: 0.02,
        lastHealthCheck: new Date(),
        companyId: 'regutech-corp',
        companyName: 'ReguTech Corp',
    },
    {
        id: 'regutech-fraud-detector',
        name: 'Fraud Detector',
        description: 'ML-powered transaction fraud detection with explainable risk scores.',
        category: 'governance',
        status: 'online',
        trustScore: 86,
        badges: [
            { type: 'AI_ACT', verified: true },
        ],
        endpointUrl: 'https://api.regutech.demo/fraud',
        tags: ['fraud', 'ml', 'fintech', 'risk'],
        pricePerRequest: 0.01,
        lastHealthCheck: new Date(),
        companyId: 'regutech-corp',
        companyName: 'ReguTech Corp',
    },
    {
        id: 'regutech-customer-support',
        name: 'Support Copilot',
        description: 'GPT-4 powered customer support agent for banking inquiries with PII redaction.',
        category: 'utility',
        status: 'online',
        trustScore: 84,
        badges: [
            { type: 'GDPR', verified: true },
        ],
        endpointUrl: 'https://api.regutech.demo/support',
        tags: ['support', 'chatbot', 'gpt-4', 'banking'],
        pricePerRequest: 0.008,
        lastHealthCheck: new Date(),
        companyId: 'regutech-corp',
        companyName: 'ReguTech Corp',
    },
];

// Delta Campus - Sample EdTech Customer
export const DELTA_CAMPUS_AGENTS: Agent[] = [
    {
        id: 'delta-tutor-bot',
        name: 'AI Tutor',
        description: 'Personalized tutoring assistant for STEM subjects using Claude 3.',
        category: 'content',
        status: 'online',
        trustScore: 88,
        badges: [
            { type: 'AI_ACT', verified: true },
            { type: 'GDPR', verified: true },
        ],
        endpointUrl: 'https://api.deltacampus.demo/tutor',
        tags: ['education', 'tutoring', 'claude', 'stem'],
        pricePerRequest: 0.005,
        lastHealthCheck: new Date(),
        companyId: 'delta-campus',
        companyName: 'Delta Campus',
    },
    {
        id: 'delta-essay-grader',
        name: 'Essay Grader',
        description: 'Automated essay evaluation with rubric-based scoring and feedback generation.',
        category: 'content',
        status: 'online',
        trustScore: 82,
        badges: [
            { type: 'AI_ACT', verified: true },
        ],
        endpointUrl: 'https://api.deltacampus.demo/grader',
        tags: ['education', 'grading', 'nlp', 'assessment'],
        pricePerRequest: 0.01,
        lastHealthCheck: new Date(),
        companyId: 'delta-campus',
        companyName: 'Delta Campus',
    },
    {
        id: 'delta-plagiarism-checker',
        name: 'Plagiarism Checker',
        description: 'Academic integrity verification using semantic similarity and source matching.',
        category: 'compliance',
        status: 'online',
        trustScore: 90,
        badges: [
            { type: 'GDPR', verified: true },
        ],
        endpointUrl: 'https://api.deltacampus.demo/plagiarism',
        tags: ['education', 'integrity', 'plagiarism', 'compliance'],
        pricePerRequest: 0.02,
        lastHealthCheck: new Date(),
        companyId: 'delta-campus',
        companyName: 'Delta Campus',
    },
];

// Combined seed data for all companies
export const ALL_DEMO_AGENTS: Agent[] = [
    ...BERLIN_AI_LABS_AGENTS,
    ...REGUTECH_AGENTS,
    ...DELTA_CAMPUS_AGENTS,
];

// Get agents by company
export function getAgentsByCompany(companyId: string): Agent[] {
    switch (companyId) {
        case 'berlin-ai-labs':
            return BERLIN_AI_LABS_AGENTS;
        case 'regutech-corp':
            return REGUTECH_AGENTS;
        case 'delta-campus':
            return DELTA_CAMPUS_AGENTS;
        default:
            return [];
    }
}

// Demo companies list
export const DEMO_COMPANIES = [
    { id: 'regutech-corp', name: 'ReguTech Corp', industry: 'FinTech' },
    { id: 'delta-campus', name: 'Delta Campus', industry: 'EdTech' },
    { id: 'berlin-ai-labs', name: 'Berlin AI Labs', industry: 'AI Infrastructure', isInternal: true },
];

// For backward compatibility - export the old SEED_AGENTS as a sample customer view
export const SEED_AGENTS = REGUTECH_AGENTS;
