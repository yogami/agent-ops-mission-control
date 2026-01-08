/**
 * TrustVerifierClient
 * 
 * HTTP client for the agent-trust-verifier service.
 * Fetches trust scores and ZK-proof verification status.
 */

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

const TRUST_VERIFIER_URL = process.env.TRUST_VERIFIER_URL ||
    'https://agent-trust-verifier-production.up.railway.app';

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

    async verifyZkProof(proofUrl: string): Promise<boolean> {
        // Placeholder for ZK proof verification
        // In production, this would validate the cryptographic proof
        return proofUrl.startsWith('zk://');
    }
}
