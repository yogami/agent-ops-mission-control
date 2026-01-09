/**
 * Pending Actions API
 * 
 * CRUD for Human-in-Loop workflow actions.
 * Supports approve/deny with audit trail.
 */

import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/infrastructure/supabase/server';

interface ActionRequest {
    agentId?: string;
    action: string;
    description: string;
    payload?: unknown;
}

interface ReviewRequest {
    actionId: string;
    status: 'approved' | 'denied';
    reviewedBy: string;
    reason?: string;
}

interface DBAction {
    id: string;
    agent_id: string | null;
    action: string;
    description: string;
    payload: unknown;
    requested_at: string;
    status: string;
    reviewed_by: string | null;
    reviewed_at: string | null;
}

// GET - Fetch all pending actions
export async function GET() {
    try {
        const supabase = getSupabaseServerClient();

        const { data: actions, error } = await supabase
            .from('am_pending_actions')
            .select('*')
            .order('requested_at', { ascending: false });

        if (error) {
            console.error('[Actions API] Fetch failed:', error);
            return NextResponse.json({ error: 'Failed to fetch actions' }, { status: 500 });
        }

        // Transform to frontend format
        const formatted = (actions || []).map((a: DBAction) => ({
            id: a.id,
            agentId: a.agent_id,
            action: a.action,
            description: a.description,
            payload: a.payload,
            requestedAt: a.requested_at,
            status: a.status,
            reviewedBy: a.reviewed_by,
            reviewedAt: a.reviewed_at,
        }));

        return NextResponse.json({ actions: formatted });
    } catch (error) {
        console.error('[Actions API] Error:', error);
        return NextResponse.json({ error: 'Failed to fetch actions' }, { status: 500 });
    }
}

// POST - Create new pending action
export async function POST(request: Request) {
    try {
        const body: ActionRequest = await request.json();
        const { agentId, action, description, payload } = body;

        if (!action || !description) {
            return NextResponse.json({ error: 'action and description required' }, { status: 400 });
        }

        const supabase = getSupabaseServerClient();

        const { data, error } = await supabase
            .from('am_pending_actions')
            .insert({
                agent_id: agentId || null,
                action,
                description,
                payload: payload || null,
            })
            .select()
            .single();

        if (error) {
            console.error('[Actions API] Insert failed:', error);
            return NextResponse.json({ error: 'Failed to create action' }, { status: 500 });
        }

        return NextResponse.json({ success: true, action: data });
    } catch (error) {
        console.error('[Actions API] Error:', error);
        return NextResponse.json({ error: 'Failed to create action' }, { status: 500 });
    }
}

// PATCH - Approve or Deny action
export async function PATCH(request: Request) {
    try {
        const body: ReviewRequest = await request.json();
        const { actionId, status, reviewedBy, reason } = body;

        if (!actionId || !status || !reviewedBy) {
            return NextResponse.json({ error: 'actionId, status, and reviewedBy required' }, { status: 400 });
        }

        const supabase = getSupabaseServerClient();
        const timestamp = new Date().toISOString();

        const { data, error } = await supabase
            .from('am_pending_actions')
            .update({
                status,
                reviewed_by: reviewedBy,
                reviewed_at: timestamp,
            })
            .eq('id', actionId)
            .select()
            .single();

        if (error) {
            console.error('[Actions API] Update failed:', error);
            return NextResponse.json({ error: 'Failed to update action' }, { status: 500 });
        }

        // Log decision for audit
        console.log(`[Actions API] Action ${actionId} ${status} by ${reviewedBy}${reason ? `: ${reason}` : ''}`);

        return NextResponse.json({
            success: true,
            action: data,
            reviewedAt: timestamp,
        });
    } catch (error) {
        console.error('[Actions API] Error:', error);
        return NextResponse.json({ error: 'Failed to update action' }, { status: 500 });
    }
}
