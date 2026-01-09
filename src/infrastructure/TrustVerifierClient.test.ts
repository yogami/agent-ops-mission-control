import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TrustVerifierClient } from './TrustVerifierClient';

describe('TrustVerifierClient', () => {
    const mockBaseUrl = 'https://mock-verifier.com';
    let client: TrustVerifierClient;

    beforeEach(() => {
        client = new TrustVerifierClient(mockBaseUrl);
        vi.stubGlobal('fetch', vi.fn());
    });

    it('should fetch trust score from Trust Verifier', async () => {
        const mockResponse = {
            agentId: 'agent-1',
            score: 95,
            breakdown: {
                verified: { points: 10, max: 10 },
                gdpr: { points: 10, max: 10 },
                uptime: { points: 5, max: 10 }
            }
        };

        vi.mocked(fetch).mockResolvedValueOnce({
            ok: true,
            json: async () => mockResponse,
        } as unknown as Response);

        const result = await client.getTrustScore('agent-1');

        expect(result).toEqual(mockResponse);
        expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/api/trustscore/agent-1'));
    });

    it('should return null on failure', async () => {
        vi.mocked(fetch).mockResolvedValueOnce({
            ok: false,
            status: 404,
        } as unknown as Response);

        const result = await client.getTrustScore('agent-1');
        expect(result).toBeNull();
    });

    it('should return null on throw', async () => {
        vi.mocked(fetch).mockRejectedValueOnce(new Error('Network error'));

        const result = await client.getTrustScore('agent-1');
        expect(result).toBeNull();
    });

    it('should verify ZK proof based on URL prefix', async () => {
        expect(await client.verifyZkProof('zk://proof123')).toBe(true);
        expect(await client.verifyZkProof('https://invalid.com')).toBe(false);
    });
});
