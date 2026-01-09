import { ActionRepository, PendingAction } from '@/ports/ActionRepository';
import { SupabaseClient } from '@supabase/supabase-js';

export class SupabaseActionRepository implements ActionRepository {
    constructor(private supabase: SupabaseClient) { }

    async getPendingActions(): Promise<PendingAction[]> {
        const { data, error } = await this.supabase
            .from('am_pending_actions')
            .select('*')
            .order('requested_at', { ascending: false });

        if (error) throw error;
        return (data || []).map(a => this.mapDBToDomain(a));
    }

    async createAction(data: Omit<PendingAction, 'id' | 'requestedAt' | 'status' | 'reviewedBy' | 'reviewedAt'>): Promise<PendingAction> {
        const { data: action, error } = await this.supabase
            .from('am_pending_actions')
            .insert({
                agent_id: data.agentId,
                action: data.action,
                description: data.description,
                payload: data.payload,
            })
            .select()
            .single();

        if (error) throw error;
        return this.mapDBToDomain(action);
    }

    async reviewAction(id: string, status: 'approved' | 'denied', reviewer: string): Promise<PendingAction> {
        const { data: action, error } = await this.supabase
            .from('am_pending_actions')
            .update({
                status,
                reviewed_by: reviewer,
                reviewed_at: new Date().toISOString(),
            })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return this.mapDBToDomain(action);
    }

    private mapDBToDomain(a: any): PendingAction {
        return {
            id: a.id,
            agentId: a.agent_id,
            action: a.action,
            description: a.description,
            payload: a.payload,
            requestedAt: a.requested_at,
            status: a.status,
            reviewedBy: a.reviewed_by,
            reviewedAt: a.reviewed_at,
        };
    }
}
