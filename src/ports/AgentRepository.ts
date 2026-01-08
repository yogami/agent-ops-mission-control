/**
 * AgentRepository Port
 * 
 * Interface for agent data access. Implementations can be:
 * - CapabilityBrokerClient (live API)
 * - InMemoryAgentRepository (testing)
 */

import { Agent } from '@/domain/Agent';
import { SearchCriteria } from '@/domain/SearchCriteria';

export interface AgentRepository {
    /**
     * Search for agents matching criteria
     */
    search(criteria: SearchCriteria): Promise<Agent[]>;

    /**
     * Get all registered agents
     */
    findAll(): Promise<Agent[]>;

    /**
     * Get a single agent by ID
     */
    findById(id: string): Promise<Agent | null>;
}
