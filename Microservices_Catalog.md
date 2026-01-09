# Berlin AI Studio: Microservices Catalog

## Fleet Management & Governance (Current Workspace)

### Shadow AI Scanner API
- **Endpoint**: `POST /api/scanner`
- **Capabilities**: Scans multi-cloud (AWS, Azure, OpenAI, GCP) for unmanaged agents.
- **Protocol**: HTTP/JSON
- **Storage**: None (Discovery Only)

### Live Anomaly Detection API
- **Endpoint**: `GET /api/anomalies`
- **Capabilities**: Proxies real-time anomaly data from the Trust Protocol service.
- **Protocol**: HTTP/JSON
- **Frequency**: Pollable (30s suggested)

### Kill Switch API
- **Endpoints**: 
  - `POST /api/kill` (Individual agent stop/restore)
  - `PUT /api/kill` (Global panic stop)
- **Capabilities**: Emergency control with database persistence and external webhook integration.
- **Storage**: `am_agents`, `am_kill_events`

### Human-in-Loop (HiL) Actions API
- **Endpoints**: `GET|POST|PATCH /api/actions`
- **Capabilities**: CRUD operations for pending authorization requests.
- **Storage**: `am_pending_actions`

---

## Shared Infrastructure (External)

### Trust Verifier Service
- **URL**: `${TRUST_VERIFIER_URL}`
- **Capabilities**: ZK-Proof verification and trust scoring.

### Capability Broker
- **URL**: `${CAPABILITY_BROKER_URL}`
- **Capabilities**: Discovery and routing for agent tasks.
