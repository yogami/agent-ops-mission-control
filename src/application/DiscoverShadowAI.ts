import { CloudScanner, CloudProvider, DiscoveredAgent, ScannerCredentials } from '@/ports/CloudScanner';

export class DiscoverShadowAI {
    constructor(private scanner: CloudScanner) { }

    async execute(provider: CloudProvider, credentials?: ScannerCredentials): Promise<{
        agents: DiscoveredAgent[];
        isMockData: boolean;
        scannedAt: string;
    }> {
        const agents = await this.scanner.scan(provider, credentials);
        const isMockData = this.detectMockData(provider, credentials);

        return {
            agents,
            isMockData,
            scannedAt: new Date().toISOString(),
        };
    }

    private detectMockData(provider: CloudProvider, credentials?: ScannerCredentials): boolean {
        if (!credentials) return true;
        if (provider === 'aws') return !credentials.accessKeyId;
        if (provider === 'azure') return !credentials.apiKey;
        if (provider === 'openai') return !credentials.apiKey;
        return true; // GCP is always mock for now
    }
}
