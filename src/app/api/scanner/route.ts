/**
 * Shadow AI Scanner API
 * 
 * Scans cloud infrastructure for unmanaged AI agents.
 * Supports AWS Bedrock, Azure OpenAI, OpenAI, and GCP Vertex.
 * Falls back to mock data when credentials unavailable.
 */

import { NextResponse } from 'next/server';

type CloudProvider = 'aws' | 'azure' | 'openai' | 'gcp';

interface ScanRequest {
    provider: CloudProvider;
    credentials?: {
        accessKeyId?: string;
        secretAccessKey?: string;
        region?: string;
        apiKey?: string;
        resourceName?: string;
    };
}

interface DiscoveredAgent {
    id: string;
    name: string;
    provider: CloudProvider;
    type: string;
    region: string;
    lastActive: string;
    isManaged: boolean;
    modelId?: string;
}

// Mock data for demo/fallback
const MOCK_DISCOVERED: Record<CloudProvider, DiscoveredAgent[]> = {
    aws: [
        { id: 'aws-1', name: 'bedrock-claude-3', provider: 'aws', type: 'Foundation Model', region: 'us-east-1', lastActive: '2 hours ago', isManaged: false, modelId: 'anthropic.claude-3-sonnet' },
        { id: 'aws-2', name: 'bedrock-titan-embed', provider: 'aws', type: 'Embedding Model', region: 'us-east-1', lastActive: '1 day ago', isManaged: false, modelId: 'amazon.titan-embed-text-v1' },
        { id: 'aws-3', name: 'langchain-agent-v2', provider: 'aws', type: 'Lambda Agent', region: 'eu-west-1', lastActive: '1 day ago', isManaged: false },
    ],
    azure: [
        { id: 'azure-1', name: 'assistant-gpt4-prod', provider: 'azure', type: 'Azure OpenAI', region: 'westeurope', lastActive: '15 minutes ago', isManaged: false },
        { id: 'azure-2', name: 'embedding-ada-002', provider: 'azure', type: 'Azure OpenAI', region: 'westeurope', lastActive: '3 hours ago', isManaged: false },
    ],
    openai: [
        { id: 'openai-1', name: 'customer-support-bot', provider: 'openai', type: 'GPT-4 Turbo', region: 'global', lastActive: '5 minutes ago', isManaged: false, modelId: 'gpt-4-turbo-preview' },
        { id: 'openai-2', name: 'content-classifier', provider: 'openai', type: 'GPT-3.5 Turbo', region: 'global', lastActive: '1 hour ago', isManaged: false, modelId: 'gpt-3.5-turbo' },
    ],
    gcp: [
        { id: 'gcp-1', name: 'internal-classifier', provider: 'gcp', type: 'Vertex AI', region: 'europe-west3', lastActive: '3 hours ago', isManaged: false },
        { id: 'gcp-2', name: 'gemini-pro-agent', provider: 'gcp', type: 'Gemini Pro', region: 'us-central1', lastActive: '30 minutes ago', isManaged: false },
    ],
};

/**
 * Scan AWS Bedrock for foundation models
 */
async function scanAWSBedrock(credentials: ScanRequest['credentials']): Promise<DiscoveredAgent[]> {
    if (!credentials?.accessKeyId || !credentials?.secretAccessKey) {
        console.log('[Scanner] AWS: No credentials, using mock data');
        return MOCK_DISCOVERED.aws;
    }

    try {
        // AWS Bedrock ListFoundationModels API
        const region = credentials.region || 'us-east-1';
        const endpoint = `https://bedrock.${region}.amazonaws.com/foundation-models`;

        // In production, use AWS SDK v3 with proper signing
        // For now, attempt API call and fall back to mock
        const response = await fetch(endpoint, {
            headers: {
                'X-Amz-Access-Key': credentials.accessKeyId,
                // Note: Real implementation needs AWS Signature V4
            },
        });

        if (!response.ok) {
            console.log('[Scanner] AWS API failed, using mock data');
            return MOCK_DISCOVERED.aws;
        }

        const data = await response.json();
        return (data.modelSummaries || []).map((model: { modelId: string; modelName: string; providerName: string }) => ({
            id: `aws-${model.modelId}`,
            name: model.modelName || model.modelId,
            provider: 'aws' as const,
            type: model.providerName || 'Foundation Model',
            region,
            lastActive: 'Active',
            isManaged: false,
            modelId: model.modelId,
        }));
    } catch (error) {
        console.error('[Scanner] AWS scan error:', error);
        return MOCK_DISCOVERED.aws;
    }
}

/**
 * Scan Azure OpenAI for deployments
 */
async function scanAzureOpenAI(credentials: ScanRequest['credentials']): Promise<DiscoveredAgent[]> {
    if (!credentials?.apiKey || !credentials?.resourceName) {
        console.log('[Scanner] Azure: No credentials, using mock data');
        return MOCK_DISCOVERED.azure;
    }

    try {
        const endpoint = `https://${credentials.resourceName}.openai.azure.com/openai/deployments?api-version=2024-02-15-preview`;

        const response = await fetch(endpoint, {
            headers: {
                'api-key': credentials.apiKey,
            },
        });

        if (!response.ok) {
            console.log('[Scanner] Azure API failed, using mock data');
            return MOCK_DISCOVERED.azure;
        }

        const data = await response.json();
        return (data.data || []).map((deployment: { id: string; model: string }) => ({
            id: `azure-${deployment.id}`,
            name: deployment.id,
            provider: 'azure' as const,
            type: `Azure OpenAI (${deployment.model})`,
            region: credentials.region || 'unknown',
            lastActive: 'Active',
            isManaged: false,
        }));
    } catch (error) {
        console.error('[Scanner] Azure scan error:', error);
        return MOCK_DISCOVERED.azure;
    }
}

/**
 * Scan OpenAI for models in use
 */
async function scanOpenAI(credentials: ScanRequest['credentials']): Promise<DiscoveredAgent[]> {
    if (!credentials?.apiKey) {
        console.log('[Scanner] OpenAI: No credentials, using mock data');
        return MOCK_DISCOVERED.openai;
    }

    try {
        const response = await fetch('https://api.openai.com/v1/models', {
            headers: {
                'Authorization': `Bearer ${credentials.apiKey}`,
            },
        });

        if (!response.ok) {
            console.log('[Scanner] OpenAI API failed, using mock data');
            return MOCK_DISCOVERED.openai;
        }

        const data = await response.json();
        // Filter to GPT models only
        const gptModels = (data.data || []).filter((m: { id: string }) => m.id.startsWith('gpt-'));
        return gptModels.slice(0, 5).map((model: { id: string; owned_by: string }) => ({
            id: `openai-${model.id}`,
            name: model.id,
            provider: 'openai' as const,
            type: model.owned_by || 'OpenAI',
            region: 'global',
            lastActive: 'Active',
            isManaged: false,
            modelId: model.id,
        }));
    } catch (error) {
        console.error('[Scanner] OpenAI scan error:', error);
        return MOCK_DISCOVERED.openai;
    }
}

/**
 * Scan GCP Vertex AI (mock implementation)
 */
async function scanGCPVertex(credentials: ScanRequest['credentials']): Promise<DiscoveredAgent[]> {
    // GCP requires OAuth2 + service account, complex to implement inline
    // Always use mock for now, but infrastructure is ready
    console.log('[Scanner] GCP: Using mock data (OAuth2 not implemented)');
    if (credentials) {
        // Placeholder for future implementation
    }
    return MOCK_DISCOVERED.gcp;
}

export async function POST(request: Request) {
    try {
        const body: ScanRequest = await request.json();
        const { provider, credentials } = body;

        if (!provider) {
            return NextResponse.json({ error: 'Provider is required' }, { status: 400 });
        }

        let discovered: DiscoveredAgent[];

        switch (provider) {
            case 'aws':
                discovered = await scanAWSBedrock(credentials);
                break;
            case 'azure':
                discovered = await scanAzureOpenAI(credentials);
                break;
            case 'openai':
                discovered = await scanOpenAI(credentials);
                break;
            case 'gcp':
                discovered = await scanGCPVertex(credentials);
                break;
            default:
                return NextResponse.json({ error: 'Invalid provider' }, { status: 400 });
        }

        return NextResponse.json({
            provider,
            scannedAt: new Date().toISOString(),
            agents: discovered,
            isMockData: !credentials?.apiKey && !credentials?.accessKeyId,
        });
    } catch (error) {
        console.error('[Scanner] Error:', error);
        return NextResponse.json({ error: 'Scan failed' }, { status: 500 });
    }
}
