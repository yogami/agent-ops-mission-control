/**
 * Agent Entity
 * 
 * Represents a verified AI agent/tool in the governance platform.
 * Consolidates Marketplace (Discovery) and Management (Kanban) data.
 */

export type AgentStatus = 'online' | 'degraded' | 'offline';
export type AgentCategory = 'compliance' | 'governance' | 'content' | 'utility';
export type ExecutionStatus = 'scheduled' | 'running' | 'review' | 'completed' | 'stopped';

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
    status: AgentStatus; // Registry health status
    executionStatus?: ExecutionStatus; // Kanban process status
    trustScore: number; // 0-100
    badges: ComplianceBadge[];
    endpointUrl: string;
    tags: string[];
    pricePerRequest?: number;
    lastHealthCheck?: Date;

    // Management focused fields (ported from agent-suite-website)
    userId?: string;
    did?: string | null;
    deadline?: string | null;
    lastAction?: string | null;
    lastActionAt?: string | null;
    createdAt?: string;
    updatedAt?: string;
}

/**
 * Factory function to create an Agent entity
 */
export function createAgent(params: Partial<Agent> & { name: string }): Agent {
    return {
        id: params.id || Math.random().toString(36).substring(7),
        name: params.name,
        description: params.description || '',
        category: params.category || 'utility',
        status: params.status || 'online',
        executionStatus: params.executionStatus || 'scheduled',
        trustScore: params.trustScore || 0,
        badges: params.badges || [],
        endpointUrl: params.endpointUrl || '',
        tags: params.tags || [],
        lastHealthCheck: new Date(),
        ...params,
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
