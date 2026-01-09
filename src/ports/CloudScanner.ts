export type CloudProvider = 'aws' | 'azure' | 'openai' | 'gcp';

export interface DiscoveredAgent {
    id: string;
    name: string;
    provider: CloudProvider;
    type: string;
    region: string;
    lastActive: string;
    isManaged: boolean;
    modelId?: string;
}

export interface ScannerCredentials {
    accessKeyId?: string;
    secretAccessKey?: string;
    region?: string;
    apiKey?: string;
    resourceName?: string;
}

export interface CloudScanner {
    scan(provider: CloudProvider, credentials?: ScannerCredentials): Promise<DiscoveredAgent[]>;
}
