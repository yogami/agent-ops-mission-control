import { describe, it, expect } from 'vitest';
import { createAgent, getTrustScoreLabel } from './Agent';

describe('Agent Domain', () => {
    describe('createAgent', () => {
        it('should create an agent with default values', () => {
            const agent = createAgent({ name: 'Test Agent' });

            expect(agent.name).toBe('Test Agent');
            expect(agent.id).toBeDefined();
            expect(agent.category).toBe('utility');
            expect(agent.status).toBe('online');
            expect(agent.executionStatus).toBe('scheduled');
            expect(agent.trustScore).toBe(0);
            expect(agent.badges).toEqual([]);
            expect(agent.lastHealthCheck).toBeInstanceOf(Date);
        });

        it('should override default values when provided', () => {
            const agent = createAgent({
                id: 'custom-id',
                name: 'Custom Agent',
                category: 'compliance',
                status: 'degraded',
                executionStatus: 'running',
                trustScore: 85,
                tags: ['tag1']
            });

            expect(agent.id).toBe('custom-id');
            expect(agent.name).toBe('Custom Agent');
            expect(agent.category).toBe('compliance');
            expect(agent.status).toBe('degraded');
            expect(agent.executionStatus).toBe('running');
            expect(agent.trustScore).toBe(85);
            expect(agent.tags).toContain('tag1');
        });

        it('should generate a random id if none is provided', () => {
            const agent1 = createAgent({ name: 'Agent 1' });
            const agent2 = createAgent({ name: 'Agent 2' });

            expect(agent1.id).not.toBe(agent2.id);
        });
    });

    describe('getTrustScoreLabel', () => {
        it('should return Excellent for scores >= 80', () => {
            expect(getTrustScoreLabel(80)).toBe('Excellent');
            expect(getTrustScoreLabel(100)).toBe('Excellent');
        });

        it('should return Good for scores between 60 and 79', () => {
            expect(getTrustScoreLabel(60)).toBe('Good');
            expect(getTrustScoreLabel(79)).toBe('Good');
        });

        it('should return Needs Review for scores < 60', () => {
            expect(getTrustScoreLabel(59)).toBe('Needs Review');
            expect(getTrustScoreLabel(0)).toBe('Needs Review');
        });
    });
});
