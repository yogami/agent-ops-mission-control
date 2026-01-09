import { describe, it, expect, vi } from 'vitest';
import { SupabaseGovernanceRepository } from './SupabaseGovernanceRepository';
import { SupabaseClient } from '@supabase/supabase-js';

describe('SupabaseGovernanceRepository', () => {
    let repo: SupabaseGovernanceRepository;
    let mockSupabase: any;

    beforeEach(() => {
        mockSupabase = {
            from: vi.fn().mockReturnThis(),
            update: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            select: vi.fn().mockReturnThis(),
            single: vi.fn(),
            insert: vi.fn().mockResolvedValue({ error: null }),
        };
        repo = new SupabaseGovernanceRepository(mockSupabase as unknown as SupabaseClient);
    });

    it('should update agent status', async () => {
        mockSupabase.single.mockResolvedValueOnce({ data: { id: '1' }, error: null });
        const result = await repo.updateAgentKillStatus('1', true, 'actor-1', 'time');

        expect(mockSupabase.from).toHaveBeenCalledWith('am_agents');
        expect(mockSupabase.update).toHaveBeenCalledWith(expect.objectContaining({ is_emergency_stopped: true }));
        expect(result.id).toBe('1');
    });

    it('should stop all agents', async () => {
        mockSupabase.select.mockResolvedValueOnce({ data: [{ id: '1' }], error: null });
        const result = await repo.stopAllAgents('actor-1', 'time');

        expect(mockSupabase.update).toHaveBeenCalledWith(expect.objectContaining({ is_emergency_stopped: true }));
        expect(result).toHaveLength(1);
    });

    it('should log kill event', async () => {
        await repo.logKillEvent({ agentId: '1', action: 'stop', actorId: 'u1', timestamp: 't' });
        expect(mockSupabase.from).toHaveBeenCalledWith('am_kill_events');
        expect(mockSupabase.insert).toHaveBeenCalled();
    });
});
