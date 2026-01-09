/**
 * Kill Switch API
 * 
 * Emergency stop/restore endpoint for agents.
 * Persists to Supabase and fires webhook for external integrations.
 */

import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/infrastructure/supabase/server';

interface KillRequest {
    agentId: string;
    action: 'stop' | 'restore';
    actorId: string;
}

// Webhook endpoint for external notifications (e.g., Slack, PagerDuty, AWS revocation)
const KILL_WEBHOOK_URL = process.env.KILL_WEBHOOK_URL || null;

async function fireWebhook(payload: KillRequest & { timestamp: string }) {
    if (!KILL_WEBHOOK_URL) {
        console.log('[Kill Switch] No webhook configured, skipping external notification');
        return { success: true, skipped: true };
    }

    try {
        const response = await fetch(KILL_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                event: payload.action === 'stop' ? 'EMERGENCY_STOP' : 'AGENT_RESTORED',
                agentId: payload.agentId,
                actorId: payload.actorId,
                timestamp: payload.timestamp,
                source: 'AgentOps Mission Control',
            }),
        });

        return { success: response.ok, status: response.status };
    } catch (error) {
        console.error('[Kill Switch] Webhook failed:', error);
        return { success: false, error: String(error) };
    }
}

export async function POST(request: Request) {
    try {
        const body: KillRequest = await request.json();
        const { agentId, action, actorId } = body;

        if (!agentId || !action || !actorId) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const supabase = getSupabaseServerClient();
        const timestamp = new Date().toISOString();

        // Update agent in database
        const updateData = action === 'stop'
            ? { is_emergency_stopped: true, stopped_at: timestamp, stopped_by: actorId }
            : { is_emergency_stopped: false, stopped_at: null, stopped_by: null };

        const { data: agent, error: updateError } = await supabase
            .from('am_agents')
            .update(updateData)
            .eq('id', agentId)
            .select()
            .single();

        if (updateError) {
            console.error('[Kill Switch] DB update failed:', updateError);
            return NextResponse.json({ error: 'Failed to update agent' }, { status: 500 });
        }

        // Log the kill event
        const { error: logError } = await supabase
            .from('am_kill_events')
            .insert({
                agent_id: agentId,
                action,
                actor_id: actorId,
                created_at: timestamp,
            });

        if (logError) {
            console.error('[Kill Switch] Event log failed:', logError);
            // Non-critical, continue
        }

        // Fire webhook for external systems
        const webhookResult = await fireWebhook({ agentId, action, actorId, timestamp });

        return NextResponse.json({
            success: true,
            agent,
            action,
            timestamp,
            webhook: webhookResult,
        });
    } catch (error) {
        console.error('[Kill Switch] Error:', error);
        return NextResponse.json({ error: 'Kill switch failed' }, { status: 500 });
    }
}

// Global kill - stop all agents
export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { actorId } = body;

        if (!actorId) {
            return NextResponse.json({ error: 'actorId required' }, { status: 400 });
        }

        const supabase = getSupabaseServerClient();
        const timestamp = new Date().toISOString();

        // Stop all active agents
        const { data: agents, error } = await supabase
            .from('am_agents')
            .update({
                is_emergency_stopped: true,
                stopped_at: timestamp,
                stopped_by: actorId
            })
            .eq('is_emergency_stopped', false)
            .select();

        if (error) {
            console.error('[Kill Switch] Global kill failed:', error);
            return NextResponse.json({ error: 'Global kill failed' }, { status: 500 });
        }

        // Log global kill event
        await supabase.from('am_kill_events').insert({
            agent_id: null, // null = global
            action: 'global_stop',
            actor_id: actorId,
            created_at: timestamp,
        });

        // Fire webhook
        await fireWebhook({ agentId: 'ALL', action: 'stop', actorId, timestamp });

        return NextResponse.json({
            success: true,
            stoppedCount: agents?.length || 0,
            timestamp,
        });
    } catch (error) {
        console.error('[Kill Switch] Global error:', error);
        return NextResponse.json({ error: 'Global kill failed' }, { status: 500 });
    }
}
