/**
 * Agent Entity
 * 
 * Represents a verified AI agent/tool in the governance platform.
 */

export type AgentStatus = 'online' | 'degraded' | 'offline';
export type AgentCategory = 'compliance' | 'governance' | 'content' | 'utility';

export interface ComplianceBadge {
    type: 'AI_ACT' | 'GDPR' | 'DIGA' | 'SOC2' | 'ISO27001';
    verified: boolean;
    proofUrl?: string;
}

export interface Agent {
    id: string;
    name: string;
    description: string;
    category: AgentCategory;
    status: AgentStatus;
    trustScore: number; // 0-100
    badges: ComplianceBadge[];
    endpointUrl: string;
    tags: string[];
    pricePerRequest?: number;
    lastHealthCheck?: Date;
}

/**
 * Factory function to create an Agent entity
 */
export function createAgent(params: Omit<Agent, 'status' | 'lastHealthCheck'>): Agent {
    return {
        ...params,
        status: 'online',
        lastHealthCheck: new Date(),
    };
}

/**
 * Compute trust score label
 */
export function getTrustScoreLabel(score: number): 'Excellent' | 'Good' | 'Needs Review' {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    return 'Needs Review';
}
