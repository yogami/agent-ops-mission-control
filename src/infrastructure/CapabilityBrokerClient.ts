/**
 * CapabilityBrokerClient
 * 
 * HTTP client for the studio-service-directory (Capability Broker) API.
 * Implements the AgentRepository port.
 */

import { Agent, ComplianceBadge } from '@/domain/Agent';
import { SearchCriteria } from '@/domain/SearchCriteria';
import { AgentRepository } from '@/ports/AgentRepository';

interface ServiceListing {
    id: string;
    serviceName: string;
    description: string;
    tags: string[];
    pricePerRequest: number;
    endpointUrl: string;
}

interface BrokerSearchResponse {
    listings: ServiceListing[];
}

const CAPABILITY_BROKER_URL = process.env.CAPABILITY_BROKER_URL ||
    'https://studio-service-directory-production.up.railway.app';

/**
 * Map tags to compliance badges
 */
function mapTagsToBadges(tags: string[]): ComplianceBadge[] {
    const badgeMap: Record<string, ComplianceBadge['type']> = {
        'gdpr': 'GDPR',
        'ai-act': 'AI_ACT',
        'diga': 'DIGA',
        'soc2': 'SOC2',
        'iso27001': 'ISO27001',
    };

    return tags
        .filter(tag => badgeMap[tag.toLowerCase()])
        .map(tag => ({
            type: badgeMap[tag.toLowerCase()],
            verified: true,
        }));
}

/**
 * Infer category from tags
 */
function inferCategory(tags: string[]): Agent['category'] {
    const tagSet = new Set(tags.map(t => t.toLowerCase()));
    if (tagSet.has('compliance') || tagSet.has('safety')) return 'compliance';
    if (tagSet.has('governance') || tagSet.has('trust')) return 'governance';
    if (tagSet.has('content') || tagSet.has('media')) return 'content';
    return 'utility';
}

export class CapabilityBrokerClient implements AgentRepository {
    private baseUrl: string;

    constructor(baseUrl?: string) {
        this.baseUrl = baseUrl || CAPABILITY_BROKER_URL;
    }

    async search(criteria: SearchCriteria): Promise<Agent[]> {
        try {
            const params = new URLSearchParams();
            params.set('q', criteria.query);
            if (criteria.tags?.length) {
                params.set('tags', criteria.tags.join(','));
            }

            const response = await fetch(`${this.baseUrl}/api/registry/search?${params}`);

            if (!response.ok) {
                console.error('Capability Broker search failed:', response.status);
                return [];
            }

            const data: BrokerSearchResponse = await response.json();
            return this.mapListingsToAgents(data.listings);
        } catch (error) {
            console.error('Capability Broker request failed:', error);
            return [];
        }
    }

    async findAll(): Promise<Agent[]> {
        return this.search({ query: '' });
    }

    async findById(id: string): Promise<Agent | null> {
        const all = await this.findAll();
        return all.find(a => a.id === id) || null;
    }

    private mapListingsToAgents(listings: ServiceListing[]): Agent[] {
        return listings.map(listing => ({
            id: listing.id,
            name: listing.serviceName,
            description: listing.description,
            category: inferCategory(listing.tags),
            status: 'online' as const,
            trustScore: 85, // Default score, will be enriched by TrustVerifier
            badges: mapTagsToBadges(listing.tags),
            endpointUrl: listing.endpointUrl,
            tags: listing.tags,
            pricePerRequest: listing.pricePerRequest,
            lastHealthCheck: new Date(),
        }));
    }
}
