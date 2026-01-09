import { describe, it, expect, vi } from 'vitest';
import { ManagePendingActions } from './ManagePendingActions';
import { ActionRepository } from '@/ports/ActionRepository';

describe('ManagePendingActions', () => {
    let repo: ActionRepository;
    let service: ManagePendingActions;

    beforeEach(() => {
        repo = {
            getPendingActions: vi.fn().mockResolvedValue([]),
            createAction: vi.fn().mockResolvedValue({ id: '1' }),
            reviewAction: vi.fn().mockResolvedValue({ id: '1', status: 'approved' }),
        };
        service = new ManagePendingActions(repo);
    });

    it('should list actions', async () => {
        await service.listActions();
        expect(repo.getPendingActions).toHaveBeenCalled();
    });

    it('should request action', async () => {
        await service.requestAction('a1', 'act', 'desc');
        expect(repo.createAction).toHaveBeenCalled();
    });

    it('should resolve action', async () => {
        await service.resolveAction('1', 'approved', 'u1');
        expect(repo.reviewAction).toHaveBeenCalled();
    });
});
