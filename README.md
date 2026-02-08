## 🛑 ARCHITECTURAL ANCHOR
This project is part of the **Berlin AI Automation Studio**. 
It is governed by the global rules in **[berlin-ai-infra](https://github.com/yogami/berlin-ai-infra)**.

---

# AgentOps Mission Control

> Enterprise Discovery Platform for pre-vetted, regulatory-compliant AI agents.

**Live Demo:** [TBD after Railway deploy]

## 🎯 What This Is

A unified "Mission Control" portal showcasing the Berlin AI Labs Agent Ops Suite:
- **Vendor Neutral** - One policy for OpenAI, Anthropic, Azure, and local models
- **Privacy-Preserving Audit** - ZK-proofs verify correctness without storing data
- **Runtime Enforcement** - Block violations before they reach users

## 🏗️ Architecture

```
src/
├── domain/           # Entities & Value Objects (Agent, SearchCriteria)
├── ports/            # Interface definitions (AgentRepository)
├── application/      # Use cases (SearchAgents)
├── infrastructure/   # External clients (CapabilityBrokerClient, TrustVerifierClient)
├── components/       # React components (FleetGrid, AgentCard, SearchBar)
└── app/              # Next.js App Router pages
```

## 🚀 Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e
```

## 📡 API Endpoints

- `GET /api/docs` - Swagger UI
- `GET /api/openapi.json` - OpenAPI spec

## 🔗 Connected Services

| Service | URL | Purpose |
|---------|-----|---------|
| Capability Broker | studio-service-directory-production.up.railway.app | Agent discovery |
| Trust Verifier | agent-trust-verifier-production.up.railway.app | Trust scores |
| ConvoGuard | convo-guard-ai-production.up.railway.app | Compliance demo |

## 📜 License

MIT - Berlin AI Labs
