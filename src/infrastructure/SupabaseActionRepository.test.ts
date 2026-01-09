import { describe, it, expect, vi } from 'vitest';
import { SupabaseActionRepository } from './SupabaseActionRepository';
import { SupabaseClient } from '@supabase/supabase-js';

describe('SupabaseActionRepository', () => {
    let repo: SupabaseActionRepository;
    let mockSupabase: any;

    beforeEach(() => {
        mockSupabase = {
            from: vi.fn().mockReturnThis(),
            select: vi.fn().mockReturnThis(),
            order: vi.fn().mockReturnThis(),
            insert: vi.fn().mockReturnThis(),
            update: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            single: vi.fn(),
        };
        repo = new SupabaseActionRepository(mockSupabase as unknown as SupabaseClient);
    });

    it('should get pending actions', async () => {
        mockSupabase.order.mockResolvedValueOnce({ data: [{ id: '1', agent_id: 'a1' }], error: null });
        const result = await repo.getPendingActions();

        expect(result).toHaveLength(1);
        expect(result[0].agentId).toBe('a1');
    });

    it('should create action', async () => {
        mockSupabase.single.mockResolvedValueOnce({ data: { id: '1', agent_id: 'a1' }, error: null });
        const result = await repo.createAction({ agentId: 'a1', action: 'test', description: 'desc', payload: {} });

        expect(mockSupabase.insert).toHaveBeenCalled();
        expect(result.id).toBe('1');
    });

    it('should review action', async () => {
        mockSupabase.single.mockResolvedValueOnce({ data: { id: '1', status: 'approved' }, error: null });
        const result = await repo.reviewAction('1', 'approved', 'rev-1');

        expect(mockSupabase.update).toHaveBeenCalledWith(expect.objectContaining({ status: 'approved' }));
        expect(result.status).toBe('approved');
    });
});
