import { describe, it, expect, vi } from 'vitest';
import { DiscoverShadowAI } from './DiscoverShadowAI';
import { CloudScanner } from '@/ports/CloudScanner';

describe('DiscoverShadowAI', () => {
    const mockScanner: CloudScanner = {
        scan: vi.fn().mockResolvedValue([{ id: '1', provider: 'aws' }]),
    };

    it('should identify mock data when no credentials provided', async () => {
        const service = new DiscoverShadowAI(mockScanner);
        const result = await service.execute('aws');

        expect(result.isMockData).toBe(true);
        expect(result.agents).toHaveLength(1);
    });

    it('should identify live data when credentials provided', async () => {
        const service = new DiscoverShadowAI(mockScanner);
        const result = await service.execute('openai', { apiKey: 'sk-123' });

        expect(result.isMockData).toBe(false);
    });
});
