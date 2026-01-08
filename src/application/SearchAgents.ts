/**
 * SearchAgents Use Case
 * 
 * Application layer orchestration for agent discovery.
 */

import { Agent } from '@/domain/Agent';
import { createSearchCriteria, SearchCriteria } from '@/domain/SearchCriteria';
import { AgentRepository } from '@/ports/AgentRepository';

export interface SearchAgentsResult {
    agents: Agent[];
    totalCount: number;
    query: string;
}

export class SearchAgents {
    constructor(private readonly repository: AgentRepository) { }

    async execute(query: string, options?: Partial<Omit<SearchCriteria, 'query'>>): Promise<SearchAgentsResult> {
        const criteria = createSearchCriteria(query, options);
        const agents = await this.repository.search(criteria);

        // Filter by minimum trust score if specified
        const filteredAgents = criteria.minTrustScore
            ? agents.filter(a => a.trustScore >= criteria.minTrustScore!)
            : agents;

        return {
            agents: filteredAgents,
            totalCount: filteredAgents.length,
            query: criteria.query,
        };
    }
}
