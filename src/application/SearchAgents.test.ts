import { describe, it, expect, vi } from 'vitest';
import { SearchAgents } from './SearchAgents';
import { AgentRepository } from '@/ports/AgentRepository';
import { createAgent } from '@/domain/Agent';

describe('SearchAgents Use Case', () => {
    const mockAgents = [
        createAgent({ name: 'Agent A', trustScore: 90 }),
        createAgent({ name: 'Agent B', trustScore: 70 }),
    ];

    const mockRepository: AgentRepository = {
        search: vi.fn().mockResolvedValue(mockAgents),
        findById: vi.fn(),
        findAll: vi.fn(),
    };

    it('should search agents and return results', async () => {
        const useCase = new SearchAgents(mockRepository);
        const result = await useCase.execute('agent');

        expect(result.agents).toHaveLength(2);
        expect(result.totalCount).toBe(2);
        expect(result.query).toBe('agent');
        expect(mockRepository.search).toHaveBeenCalledWith(expect.objectContaining({
            query: 'agent'
        }));
    });

    it('should filter agents by minimum trust score', async () => {
        const useCase = new SearchAgents(mockRepository);
        const result = await useCase.execute('agent', { minTrustScore: 80 });

        expect(result.agents).toHaveLength(1);
        expect(result.agents[0].name).toBe('Agent A');
        expect(result.totalCount).toBe(1);
    });
});
