import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/infrastructure/supabase/server';
import { Agent } from '@/domain/Agent';

export async function GET() {
    try {
        const supabase = getSupabaseServerClient();

        // Fetch agents from Supabase
        const { data, error } = await supabase
            .from('am_agents')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching agents:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        // Map DB rows to Agent domain entity
        const agents: Agent[] = (data || []).map(row => ({
            id: row.id,
            name: row.name,
            description: row.description || '',
            category: row.category || 'utility',
            status: row.health_status || 'online',
            executionStatus: row.status || 'scheduled',
            trustScore: row.trust_score || 0,
            badges: row.badges || [],
            endpointUrl: row.endpoint_url || '',
            tags: row.tags || [],
            userId: row.user_id,
            did: row.did,
            deadline: row.deadline,
            lastAction: row.last_action,
            lastActionAt: row.last_action_at,
            createdAt: row.created_at,
            updatedAt: row.updated_at
        }));

        return NextResponse.json(agents);
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const supabase = getSupabaseServerClient();
        const body = await request.json();

        const { data, error } = await supabase
            .from('am_agents')
            .insert([{
                name: body.name,
                description: body.description,
                category: body.category || 'utility',
                health_status: 'online',
                status: 'scheduled',
                trust_score: body.trustScore || 85,
                tags: body.tags || [],
                endpoint_url: body.endpointUrl || '',
                badges: body.badges || []
            }])
            .select()
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
