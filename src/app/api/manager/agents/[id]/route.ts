import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/infrastructure/supabase/server';

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const supabase = getSupabaseServerClient();

        const { data, error } = await supabase
            .from('am_agents')
            .update({
                status: body.executionStatus,
                health_status: body.status,
                last_action: body.lastAction,
                updated_at: new Date().toISOString() // Just to trigget update
            })
            .eq('id', id)
            .select()
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json(data);
    } catch {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const supabase = getSupabaseServerClient();

        const { error } = await supabase
            .from('am_agents')
            .delete()
            .eq('id', id);

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
