export interface PendingAction {
    id: string;
    agentId: string | null;
    action: string;
    description: string;
    payload: any;
    requestedAt: string;
    status: string;
    reviewedBy: string | null;
    reviewedAt: string | null;
}

export interface ActionRepository {
    getPendingActions(): Promise<PendingAction[]>;
    createAction(data: Omit<PendingAction, 'id' | 'requestedAt' | 'status' | 'reviewedBy' | 'reviewedAt'>): Promise<PendingAction>;
    reviewAction(id: string, status: 'approved' | 'denied', reviewer: string): Promise<PendingAction>;
}
