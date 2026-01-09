# Project Rules: AgentOps Mission Control

This project adheres to the **Berlin AI Studio Gold Standard**.

## 🏗️ Architecture Standard (Next.js 15 DDD)
- **Domain**: `src/domain/*.ts` - Pure business logic and types.
- **Application**: `src/application/*.ts` - Orchestration use cases.
- **Infrastructure**: `src/infrastructure/*.ts` - Adapters for external services (Supabase, Trust Verifier).
- **Presentation**: `src/app/` (Routes) & `src/components/` (UI).

## 🏛️ Database Standard
- **Isolation**: All tables MUST use the `am_` prefix (Agent Manager).
- **Tables**: `am_agents`, `am_kill_events`, `am_pending_actions`.

## 🏗️ Code Quality Standards
- **Test-First**: Write Vitest unit tests for components and domains.
- **Complexity**: Keep functions simple (Cyclomatic complexity ≤ 3).
- **Coverage**: Target ≥ 80% coverage for core logic and components.
- **Linting**: Zero warnings/errors allowed in `src/`.

## 📜 ATDD Protocol
- **Single Source of Truth**: `e2e/*.spec.ts` defines the feature requirements.
- **Verification**: All features MUST pass both local unit tests and production E2E tests before being considered "Done".

## 🚨 Emergency Protocol
- **Kill Switch**: Every agent-modifying action must be logged in `am_kill_events`.
- **HiL**: Critical decisions require an entry in `am_pending_actions`.
