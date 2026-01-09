import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/infrastructure/supabase/server';
import { SupabaseGovernanceRepository } from '@/infrastructure/SupabaseGovernanceRepository';
import { ExecuteKillSwitch } from '@/application/ExecuteKillSwitch';

const KILL_WEBHOOK_URL = process.env.KILL_WEBHOOK_URL || null;

function getKillService() {
    const supabase = getSupabaseServerClient();
    const repo = new SupabaseGovernanceRepository(supabase);
    return new ExecuteKillSwitch(repo, KILL_WEBHOOK_URL);
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { agentId, action, actorId } = body;

        if (!agentId || !action || !actorId) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const service = getKillService();
        const agent = await service.executeIndividual(agentId, action, actorId);

        return NextResponse.json({ success: true, agent, action, timestamp: new Date().toISOString() });
    } catch (error) {
        console.error('[Kill Switch API] Error:', error);
        return NextResponse.json({ error: 'Kill switch failed' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { actorId } = body;

        if (!actorId) {
            return NextResponse.json({ error: 'actorId required' }, { status: 400 });
        }

        const service = getKillService();
        const stoppedCount = await service.executeGlobal(actorId);

        return NextResponse.json({ success: true, stoppedCount, timestamp: new Date().toISOString() });
    } catch (error) {
        console.error('[Kill Switch API] Global error:', error);
        return NextResponse.json({ error: 'Global kill failed' }, { status: 500 });
    }
}
