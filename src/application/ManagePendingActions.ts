import { ActionRepository, PendingAction } from '@/ports/ActionRepository';

export class ManagePendingActions {
    constructor(private repo: ActionRepository) { }

    async listActions(): Promise<PendingAction[]> {
        return this.repo.getPendingActions();
    }

    async requestAction(agentId: string | null, action: string, description: string, payload?: any): Promise<PendingAction> {
        return this.repo.createAction({ agentId, action, description, payload });
    }

    async resolveAction(id: string, status: 'approved' | 'denied', reviewer: string): Promise<PendingAction> {
        return this.repo.reviewAction(id, status, reviewer);
    }
}
