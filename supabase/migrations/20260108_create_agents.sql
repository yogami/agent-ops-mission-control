-- Migration: Create agents table for Mission Control Management
-- Database: Supabase (PostgreSQL)

-- 1. Create the 'agents' table
CREATE TABLE IF NOT EXISTS agents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID DEFAULT auth.uid(),
    name TEXT NOT NULL,
    description TEXT,
    category TEXT DEFAULT 'utility',
    health_status TEXT DEFAULT 'online', -- 'online', 'degraded', 'offline'
    status TEXT DEFAULT 'scheduled',     -- 'scheduled', 'running', 'review', 'completed', 'stopped'
    trust_score NUMERIC(5,2) DEFAULT 85.00,
    badges JSONB DEFAULT '[]'::jsonb,    -- Array of compliance badges
    endpoint_url TEXT,
    tags TEXT[] DEFAULT '{}',
    did TEXT,                            -- Decentralized Identifier
    deadline TIMESTAMPTZ,
    last_action TEXT,
    last_action_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;

-- 3. Create RLS Policies
-- Allow users to see and manage only their own agents
CREATE POLICY "Users can manage own agents" ON agents
    FOR ALL USING (auth.uid() = user_id);

-- Optional: Allow service role to bypass (default behavior for service_role key)

-- 4. Seed with a few demo agents
INSERT INTO agents (name, description, category, status, trust_score, badges, did, deadline, last_action)
VALUES 
('KYC Validator', 'Verifying user identity for financial onboarding', 'compliance', 'running', 92, '[{"type": "AI_ACT", "verified": true}]'::jsonb, 'did:berlin:ai:123', NOW() + INTERVAL '2 hours', 'Processing batch ID #881'),
('Privacy Auditor', 'Scanning outgoing data for PII leakages', 'governance', 'review', 88, '[{"type": "GDPR", "verified": true}]'::jsonb, 'did:berlin:ai:456', NOW() + INTERVAL '5 hours', 'Flagged potential leak in metadata'),
('Medical Scribe', 'Transcribing clinician notes with clinical safety checks', 'utility', 'scheduled', 95, '[{"type": "DIGA", "verified": true}]'::jsonb, 'did:berlin:ai:789', NOW() + INTERVAL '1 day', 'Awaiting clinical approval');
