-- Pending Actions Table for Human-in-Loop Workflow
-- Stores actions awaiting human approval/denial

CREATE TABLE IF NOT EXISTS am_pending_actions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id UUID REFERENCES am_agents(id) ON DELETE CASCADE,
    action TEXT NOT NULL,
    description TEXT,
    payload JSONB,
    requested_at TIMESTAMPTZ DEFAULT NOW(),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'denied')),
    reviewed_by TEXT,
    reviewed_at TIMESTAMPTZ
);

-- Indexes for efficient queries
CREATE INDEX IF NOT EXISTS idx_pending_actions_agent ON am_pending_actions(agent_id);
CREATE INDEX IF NOT EXISTS idx_pending_actions_status ON am_pending_actions(status) WHERE status = 'pending';
CREATE INDEX IF NOT EXISTS idx_pending_actions_requested ON am_pending_actions(requested_at DESC);

-- RLS Policies
ALTER TABLE am_pending_actions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Pending actions are publicly readable" ON am_pending_actions
    FOR SELECT USING (true);

CREATE POLICY "Pending actions can be inserted by anyone" ON am_pending_actions
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Pending actions can be updated by anyone" ON am_pending_actions
    FOR UPDATE USING (true);

-- Seed some demo pending actions
INSERT INTO am_pending_actions (action, description, payload, status) VALUES
    ('Deploy Model v2.3', 'Update production model with retrained weights', '{"version": "2.3", "changes": ["improved accuracy", "bias reduction"]}', 'pending'),
    ('Expand Data Access', 'Grant access to customer_orders table for analysis', '{"table": "customer_orders", "access": "read"}', 'pending'),
    ('Update Rate Limits', 'Increase API rate limit from 100/min to 500/min', '{"current": 100, "proposed": 500}', 'approved');
