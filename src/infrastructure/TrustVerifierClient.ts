/**
 * TrustVerifierClient
 * 
 * HTTP client for the agent-trust-verifier service.
 * Fetches trust scores, ZK-proof verification, and anomaly detection.
 */

import { Anomaly, AnomalySeverity, AnomalyType } from '@/domain/Agent';

interface TrustScoreResponse {
    agentId: string;
    score: number;
    breakdown?: {
        verified: { points: number; max: number };
        gdpr: { points: number; max: number };
        uptime: { points: number; max: number };
    };
    zkProofUrl?: string;
}

interface AnomalyResponse {
    id: string;
    type: string;
    severity: string;
    message: string;
    detected_at: string;
    resolved?: boolean;
}

const TRUST_VERIFIER_URL = process.env.TRUST_VERIFIER_URL ||
    'https://agent-trust-verifier-production.up.railway.app';

// Fallback mock anomalies when Trust Verifier unavailable
const MOCK_ANOMALIES: Anomaly[] = [
    { id: 'a1', type: 'drift', severity: 'high', message: 'Model accuracy dropped 15% in last 24h', detectedAt: new Date().toISOString() },
    { id: 'a2', type: 'policy_violation', severity: 'critical', message: 'Agent accessed restricted data category', detectedAt: new Date(Date.now() - 3600000).toISOString() },
    { id: 'a3', type: 'pii_leak', severity: 'medium', message: 'Potential PII detected in output logs', detectedAt: new Date(Date.now() - 7200000).toISOString() },
    { id: 'a4', type: 'performance', severity: 'low', message: 'Response latency increased by 200ms', detectedAt: new Date(Date.now() - 86400000).toISOString(), resolved: true },
];

export class TrustVerifierClient {
    private baseUrl: string;

    constructor(baseUrl?: string) {
        this.baseUrl = baseUrl || TRUST_VERIFIER_URL;
    }

    async getTrustScore(agentId: string): Promise<TrustScoreResponse | null> {
        try {
            const response = await fetch(`${this.baseUrl}/api/trustscore/${agentId}`);

            if (!response.ok) {
                console.error('Trust Verifier request failed:', response.status);
                return null;
            }

            return await response.json();
        } catch (error) {
            console.error('Trust Verifier request failed:', error);
            return null;
        }
    }

    async getAnomalies(): Promise<Anomaly[]> {
        try {
            const response = await fetch(`${this.baseUrl}/api/anomalies`);

            if (!response.ok) {
                console.log('[TrustVerifier] Anomalies endpoint unavailable, using mock data');
                return MOCK_ANOMALIES;
            }

            const data: AnomalyResponse[] = await response.json();
            return data.map(a => ({
                id: a.id,
                type: a.type as AnomalyType,
                severity: a.severity as AnomalySeverity,
                message: a.message,
                detectedAt: a.detected_at,
                resolved: a.resolved,
            }));
        } catch (error) {
            console.log('[TrustVerifier] Anomalies fetch failed, using mock data:', error);
            return MOCK_ANOMALIES;
        }
    }

    async verifyZkProof(proofUrl: string): Promise<boolean> {
        // Placeholder for ZK proof verification
        // In production, this would validate the cryptographic proof
        return proofUrl.startsWith('zk://');
    }
}
