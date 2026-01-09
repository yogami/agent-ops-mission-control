import { CloudScanner, CloudProvider, DiscoveredAgent, ScannerCredentials } from '@/ports/CloudScanner';

const MOCK_DISCOVERED: Record<CloudProvider, DiscoveredAgent[]> = {
    aws: [
        { id: 'aws-1', name: 'bedrock-claude-3', provider: 'aws', type: 'Foundation Model', region: 'us-east-1', lastActive: '2 hours ago', isManaged: false, modelId: 'anthropic.claude-3-sonnet' },
        { id: 'aws-2', name: 'bedrock-titan-embed', provider: 'aws', type: 'Embedding Model', region: 'us-east-1', lastActive: '1 day ago', isManaged: false, modelId: 'amazon.titan-embed-text-v1' },
    ],
    azure: [
        { id: 'azure-1', name: 'assistant-gpt4-prod', provider: 'azure', type: 'Azure OpenAI', region: 'westeurope', lastActive: '15 minutes ago', isManaged: false },
    ],
    openai: [
        { id: 'openai-1', name: 'customer-support-bot', provider: 'openai', type: 'GPT-4 Turbo', region: 'global', lastActive: '5 minutes ago', isManaged: false, modelId: 'gpt-4-turbo-preview' },
    ],
    gcp: [
        { id: 'gcp-1', name: 'internal-classifier', provider: 'gcp', type: 'Vertex AI', region: 'europe-west3', lastActive: '3 hours ago', isManaged: false },
    ],
};

export class CloudScannerClient implements CloudScanner {
    async scan(provider: CloudProvider, credentials?: ScannerCredentials): Promise<DiscoveredAgent[]> {
        switch (provider) {
            case 'aws':
                return this.scanAWS(credentials);
            case 'azure':
                return this.scanAzure(credentials);
            case 'openai':
                return this.scanOpenAI(credentials);
            case 'gcp':
                return this.scanGCP(credentials);
            default:
                throw new Error(`Unsupported provider: ${provider}`);
        }
    }

    private async scanAWS(credentials?: ScannerCredentials): Promise<DiscoveredAgent[]> {
        if (!credentials?.accessKeyId || !credentials?.secretAccessKey) {
            return MOCK_DISCOVERED.aws;
        }
        // Simplified implementation for the exercise
        return MOCK_DISCOVERED.aws;
    }

    private async scanAzure(credentials?: ScannerCredentials): Promise<DiscoveredAgent[]> {
        if (!credentials?.apiKey || !credentials?.resourceName) {
            return MOCK_DISCOVERED.azure;
        }
        return MOCK_DISCOVERED.azure;
    }

    private async scanOpenAI(credentials?: ScannerCredentials): Promise<DiscoveredAgent[]> {
        if (!credentials?.apiKey) {
            return MOCK_DISCOVERED.openai;
        }
        return MOCK_DISCOVERED.openai;
    }

    private async scanGCP(credentials?: ScannerCredentials): Promise<DiscoveredAgent[]> {
        return MOCK_DISCOVERED.gcp;
    }
}
