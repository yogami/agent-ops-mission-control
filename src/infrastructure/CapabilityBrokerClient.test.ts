import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CapabilityBrokerClient } from './CapabilityBrokerClient';

describe('CapabilityBrokerClient', () => {
    const mockBaseUrl = 'https://mock-broker.com';
    let client: CapabilityBrokerClient;

    beforeEach(() => {
        client = new CapabilityBrokerClient(mockBaseUrl);
        vi.stubGlobal('fetch', vi.fn());
    });

    it('should search agents from Capability Broker', async () => {
        const mockListings = [
            {
                id: '1',
                serviceName: 'Test Service',
                description: 'A test service',
                tags: ['compliance', 'gdpr'],
                pricePerRequest: 0.1,
                endpointUrl: 'https://test.com'
            }
        ];

        vi.mocked(fetch).mockResolvedValueOnce({
            ok: true,
            json: async () => ({ listings: mockListings }),
        } as unknown as Response);

        const agents = await client.search({ query: 'test' });

        expect(agents).toHaveLength(1);
        expect(agents[0].name).toBe('Test Service');
        expect(agents[0].category).toBe('compliance');
        expect(agents[0].badges).toHaveLength(1);
        expect(agents[0].badges[0].type).toBe('GDPR');
        expect(fetch).toHaveBeenCalledWith(expect.stringContaining('q=test'));
    });

    it('should return empty array on failure', async () => {
        vi.mocked(fetch).mockResolvedValueOnce({
            ok: false,
            status: 500,
        } as unknown as Response);

        const agents = await client.search({ query: 'test' });
        expect(agents).toEqual([]);
    });

    it('should return empty array on throw', async () => {
        vi.mocked(fetch).mockRejectedValueOnce(new Error('Network error'));

        const agents = await client.search({ query: 'test' });
        expect(agents).toEqual([]);
    });

    it('should findById by searching all', async () => {
        const mockListings = [
            {
                id: '1',
                serviceName: 'Service 1',
                tags: []
            },
            {
                id: '2',
                serviceName: 'Service 2',
                tags: []
            }
        ];

        vi.mocked(fetch).mockResolvedValueOnce({
            ok: true,
            json: async () => ({ listings: mockListings }),
        } as unknown as Response);

        const agent = await client.findById('2');
        expect(agent).not.toBeNull();
        expect(agent?.name).toBe('Service 2');
    });
});
