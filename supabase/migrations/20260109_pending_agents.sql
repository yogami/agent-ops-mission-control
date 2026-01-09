-- Create table for pending agent submissions
CREATE TABLE am_pending_agents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    endpoint_url TEXT,
    category TEXT DEFAULT 'utility',
    claimed_badges TEXT[] DEFAULT '{}',
    status TEXT DEFAULT 'pending_vetting',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE am_pending_agents ENABLE ROW LEVEL SECURITY;

-- Allow service role full access
CREATE POLICY "Service role has full access" ON am_pending_agents
    FOR ALL USING (auth.role() = 'service_role');

-- Allow public read access for transparency
CREATE POLICY "Public can view pending agents" ON am_pending_agents
    FOR SELECT USING (true);
