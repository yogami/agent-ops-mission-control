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
    type: 'AI_ACT' | 'GDPR' | 'DIGA' | 'SOC2' | 'ISO27001' | 'DATA_RESIDENCY_EU';
    verified: boolean;
    proofUrl?: string;
}

// Enterprise: Anomaly Detection
export type AnomalyType = 'drift' | 'policy_violation' | 'performance' | 'pii_leak';
export type AnomalySeverity = 'low' | 'medium' | 'high' | 'critical';

export interface Anomaly {
    id: string;
    type: AnomalyType;
    severity: AnomalySeverity;
    message: string;
    detectedAt: string;
    resolved?: boolean;
}

// Enterprise: Human-in-Loop
export type ActionStatus = 'pending' | 'approved' | 'denied';

export interface PendingAction {
    id: string;
    action: string;
    description: string;
    payload?: unknown;
    requestedAt: string;
    status: ActionStatus;
    reviewedBy?: string;
    reviewedAt?: string;
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
    companyId?: string;
    companyName?: string;
    did?: string | null;

    deadline?: string | null;
    lastAction?: string | null;
    lastActionAt?: string | null;
    createdAt?: string;
    updatedAt?: string;

    // Enterprise: Kill Switch
    isEmergencyStopped?: boolean;
    stoppedAt?: string;
    stoppedBy?: string;

    // Enterprise: Anomaly Detection
    anomalies?: Anomaly[];

    // Enterprise: Human-in-Loop
    pendingActions?: PendingAction[];
}

/**
 * Factory function to create an Agent entity
 */
export function createAgent(params: Partial<Agent> & { name: string }): Agent {
    const { id, name, ...rest } = params;

    return {
        description: '',
        category: 'utility',
        status: 'online',
        executionStatus: 'scheduled',
        trustScore: 0,
        badges: [],
        endpointUrl: '',
        tags: [],
        lastHealthCheck: new Date(),
        ...rest,
        id: id || Math.random().toString(36).substring(7),
        name: name,
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
