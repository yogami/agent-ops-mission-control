import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/infrastructure/supabase/server';

interface SubmissionPayload {
    name: string;
    description?: string;
    endpointUrl?: string;
    category?: 'compliance' | 'governance' | 'content' | 'utility';
    claimedBadges?: string[];
    tosAccepted: boolean;
}

export async function POST(request: Request) {
    try {
        const body: SubmissionPayload = await request.json();

        // Validate required fields
        if (!body.name || body.name.trim().length === 0) {
            return NextResponse.json({ error: 'Agent name is required' }, { status: 400 });
        }

        if (!body.tosAccepted) {
            return NextResponse.json({ error: 'Terms of Service must be accepted' }, { status: 400 });
        }

        const supabase = getSupabaseServerClient();

        const { data, error } = await supabase
            .from('am_pending_agents')
            .insert([{
                name: body.name.trim(),
                description: body.description || '',
                endpoint_url: body.endpointUrl || '',
                category: body.category || 'utility',
                claimed_badges: body.claimedBadges || [],
                status: 'pending_vetting',
            }])
            .select()
            .single();

        if (error) {
            console.error('Supabase error:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({
            id: data.id,
            status: 'pending_vetting',
            message: 'Agent submitted successfully. Vetting pipeline initiated.',
        });
    } catch {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
