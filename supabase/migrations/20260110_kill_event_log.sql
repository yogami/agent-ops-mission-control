-- Kill Switch Event Log
-- Audit trail for emergency stop/restore actions

CREATE TABLE IF NOT EXISTS am_kill_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id UUID REFERENCES am_agents(id) ON DELETE SET NULL,
    action TEXT NOT NULL CHECK (action IN ('stop', 'restore', 'global_stop')),
    actor_id TEXT NOT NULL,
    webhook_response JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add kill switch columns to agents table
ALTER TABLE am_agents ADD COLUMN IF NOT EXISTS is_emergency_stopped BOOLEAN DEFAULT FALSE;
ALTER TABLE am_agents ADD COLUMN IF NOT EXISTS stopped_at TIMESTAMPTZ;
ALTER TABLE am_agents ADD COLUMN IF NOT EXISTS stopped_by TEXT;

-- Index for efficient queries
CREATE INDEX IF NOT EXISTS idx_kill_events_agent ON am_kill_events(agent_id);
CREATE INDEX IF NOT EXISTS idx_kill_events_created ON am_kill_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_agents_emergency ON am_agents(is_emergency_stopped) WHERE is_emergency_stopped = true;

-- RLS Policies
ALTER TABLE am_kill_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Kill events are publicly readable" ON am_kill_events
    FOR SELECT USING (true);

CREATE POLICY "Kill events can be inserted by anyone" ON am_kill_events
    FOR INSERT WITH CHECK (true);
