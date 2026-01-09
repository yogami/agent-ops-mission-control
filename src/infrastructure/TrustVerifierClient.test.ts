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

    it('should fetch anomalies and map them', async () => {
        const mockAnomalies = [
            { id: '1', type: 'drift', severity: 'critical', message: 'Test', detected_at: '2026-01-01T00:00:00Z', resolved: false }
        ];

        vi.mocked(fetch).mockResolvedValueOnce({
            ok: true,
            json: async () => mockAnomalies,
        } as unknown as Response);

        const result = await client.getAnomalies();
        expect(result).toHaveLength(1);
        expect(result[0].id).toBe('1');
        expect(result[0].detectedAt).toBe('2026-01-01T00:00:00Z');
    });

    it('should return mock anomalies on failure', async () => {
        vi.mocked(fetch).mockResolvedValueOnce({
            ok: false,
        } as unknown as Response);

        const result = await client.getAnomalies();
        expect(result.length).toBeGreaterThan(0);
        expect(result[0].id).toBe('a1');
    });
});
