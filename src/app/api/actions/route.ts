import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/infrastructure/supabase/server';
import { SupabaseActionRepository } from '@/infrastructure/SupabaseActionRepository';
import { ManagePendingActions } from '@/application/ManagePendingActions';

function getActionService() {
    const supabase = getSupabaseServerClient();
    const repo = new SupabaseActionRepository(supabase);
    return new ManagePendingActions(repo);
}

export async function GET() {
    try {
        const service = getActionService();
        const actions = await service.listActions();
        return NextResponse.json({ actions });
    } catch (error) {
        console.error('[Actions API] GET Error:', error);
        return NextResponse.json({ error: 'Failed to fetch actions' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { agentId, action, description, payload } = body;

        if (!action || !description) {
            return NextResponse.json({ error: 'action and description required' }, { status: 400 });
        }

        const service = getActionService();
        const data = await service.requestAction(agentId || null, action, description, payload);

        return NextResponse.json({ success: true, action: data });
    } catch (error) {
        console.error('[Actions API] POST Error:', error);
        return NextResponse.json({ error: 'Failed to create action' }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    try {
        const body = await request.json();
        const { actionId, status, reviewedBy, reason } = body;

        if (!actionId || !status || !reviewedBy) {
            return NextResponse.json({ error: 'actionId, status, and reviewedBy required' }, { status: 400 });
        }

        const service = getActionService();
        const data = await service.resolveAction(actionId, status, reviewedBy);

        console.log(`[Actions API] Action ${actionId} ${status} by ${reviewedBy}${reason ? `: ${reason}` : ''}`);

        return NextResponse.json({ success: true, action: data });
    } catch (error) {
        console.error('[Actions API] PATCH Error:', error);
        return NextResponse.json({ error: 'Failed to update action' }, { status: 500 });
    }
}
