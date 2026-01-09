import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CloudScannerClient } from './CloudScannerClient';

describe('CloudScannerClient', () => {
    let client: CloudScannerClient;

    beforeEach(() => {
        client = new CloudScannerClient();
    });

    it('should return mock data for AWS when no credentials provided', async () => {
        const result = await client.scan('aws');
        expect(result).toHaveLength(2);
        expect(result[0].provider).toBe('aws');
    });

    it('should return mock data for Azure when no credentials provided', async () => {
        const result = await client.scan('azure');
        expect(result).toHaveLength(1);
        expect(result[0].provider).toBe('azure');
    });

    it('should throw error for unsupported provider', async () => {
        await expect(client.scan('invalid' as any)).rejects.toThrow('Unsupported provider');
    });
});
