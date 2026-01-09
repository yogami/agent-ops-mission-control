import { GovernanceRepository, KillSwitchEvent } from '@/ports/GovernanceRepository';
import { SupabaseClient } from '@supabase/supabase-js';

export class SupabaseGovernanceRepository implements GovernanceRepository {
    constructor(private supabase: SupabaseClient) { }

    async updateAgentKillStatus(agentId: string, isStopped: boolean, actorId: string, timestamp: string): Promise<any> {
        const updateData = isStopped
            ? { is_emergency_stopped: true, stopped_at: timestamp, stopped_by: actorId }
            : { is_emergency_stopped: false, stopped_at: null, stopped_by: null };

        const { data, error } = await this.supabase
            .from('am_agents')
            .update(updateData)
            .eq('id', agentId)
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    async stopAllAgents(actorId: string, timestamp: string): Promise<any[]> {
        const { data, error } = await this.supabase
            .from('am_agents')
            .update({ is_emergency_stopped: true, stopped_at: timestamp, stopped_by: actorId })
            .eq('is_emergency_stopped', false)
            .select();

        if (error) throw error;
        return data || [];
    }

    async logKillEvent(event: KillSwitchEvent): Promise<void> {
        const { error } = await this.supabase
            .from('am_kill_events')
            .insert({
                agent_id: event.agentId,
                action: event.action,
                actor_id: event.actorId,
                created_at: event.timestamp,
            });

        if (error) {
            console.error('[SupabaseGovernanceRepository] Event log failed:', error);
        }
    }
}
