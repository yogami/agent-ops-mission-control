#!/usr/bin/env python3
"""
EU-Startups 2026 Pitch Competition — Judge Panel Simulation
============================================================
Feeds ALL Berlin AI Labs projects to LLM judges role-playing as the
real 2026 EU-Startups Summit jury. Each judge evaluates every project
and picks the best fit for the competition.

Judges:
  1. Angelo Burgarello (Look AI Ventures) — AI-focused VC
  2. Miguel Borg (Malta Venture Capital) — Gov/risk/banking VC
  3. Piotr Godzinski (Techstars EMEA) — Serial founder, accelerator
  4. Perplexity Sonar Pro — Grounded market researcher
  5. DeepSeek V3.5 — Cold technical evaluator
"""

import json
import time
import sys
import os
from datetime import datetime

try:
    import requests
except ImportError:
    import subprocess
    subprocess.check_call([sys.executable, '-m', 'pip', 'install', 'requests', '-q'])
    import requests

# ============================================================
# API Keys (from existing scripts in gitprojects)
# ============================================================
OPENROUTER_API_KEY = "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"
PERPLEXITY_API_KEY = "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"

OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"
PERPLEXITY_URL = "https://api.perplexity.ai/chat/completions"

# ============================================================
# Competition Context
# ============================================================
COMPETITION_CONTEXT = """
## EU-Startups Summit 2026 Pitch Competition
- Event: May 7-8, 2026 in Malta
- Format: 15 finalists pitch 3 min on main stage + Q&A
- Prize: €1M+ package (€250k Look AI Ventures, $220k Techstars, up to €434k Malta VC, €100k IONOS cloud credits, plus SaaS credits)
- Eligibility: Pre-Seed or Seed stage, <3 years old, <€750k VC raised, Europe-based
- Expected: 1,600+ applications
- Judging: Problem/Solution fit, Market Opportunity, Business Model & Scalability, Traction & Validation, Team, Pitch Delivery, Feasibility & Growth Potential

## The Applicant
Berlin AI Labs — Solo founder, Berlin Germany. Pre-seed. No VC raised. All projects are self-funded and built by one person. Multiple products in the portfolio — the question is which ONE to submit.
"""

# ============================================================
# ALL Projects from gitprojects (unbiased synopses)
# ============================================================
PROJECTS = """
## Project Portfolio — Berlin AI Labs

Below are ALL active projects. Each synopsis is factual and unembellished. Evaluate them objectively.

---

### 1. Agent Ops Mission Control
Enterprise governance platform for AI agent fleets. Next.js 16 dashboard monitoring 9+ AI agents. Features: GDPR Compliance Center (/gdpr page with real-time fleet score, per-agent compliance matrix, 8 GDPR articles mapped), Emergency Kill Switch with actor attribution, Human-in-the-Loop approval workflow, PII leak detection. The platform ties together ConvoGuard, PDP Protocol, and Chain Anchor into a unified compliance stack. Live on Railway. Functional API endpoints: GET /api/gdpr/compliance, POST /api/gdpr/validate-consent, GET /api/gdpr/benchmarks.
Status: Production. Live endpoints. Working dashboard with real data.

### 2. ConvoGuard AI
Real-time API middleware that validates mental health chatbot conversations for GDPR/EU AI Act/DiGA compliance. Features: GDPR Consent Rule (Art 6), Art 9 Special Category Detection (HIV, mental health, medications), EU AI Act Declaration of Conformity (Art 47/Annex V), Right to Erasure (Art 17), crisis detection (100% recall on 6 categories, F1: 0.97), local-first ONNX inference (<20ms latency). 6 compliance rules. BfArM XML audit report generation. Originally built for CIC Berlin / Soonami Accelerator demo.
Status: Production. Live API on Railway. Real inference engine.

### 3. PDP Protocol (Veracity Core / PoE-A2A)
Lightweight HTTP-first extension to Google A2A (Agent-to-Agent) protocol. Allows AI agents to prove past performance via Ed25519 signed execution claims with back-linked hash chains. Three-layer proof: Identity (signatures) → Ordering (sequence chain) → Resilience (Solana anchoring). RFC draft: draft-pdp-a2a-extension-00. 82-second demo video. Submitted to Colosseum Hackathon. EU AI Act Article 50 transparency compliance.
Status: Production. Live on Railway. Real Solana anchoring. RFC published.

### 4. Spy Agent / OpenClaw
Adversarial compliance testing agent. EU Compliance Bot that stress-tests AI agents against GDPR and AI Act. Features: Compliance Check Service (paid, 3.00 $MART), Zero-Trust middleware with Ed25519 signatures, StakeManager with slashing vault. Integrates with ConvoGuard for actual compliance validation.
Status: Production. Staking mechanics implemented.

### 5. Agent Chain Anchor
Chain-agnostic blockchain anchoring service. Anchors ZK-SLA proofs, trust score snapshots, and decision audit logs. Supports Solana (production), zkSync (planned), Starknet (planned). Provides tamper-proof timestamps.
Status: Production. Solana anchoring live.

### 6. Agent Pentest CLI
Red-team tool for AI agents. 41 automated adversarial attack vectors across 4 categories: prompt injection (11), data exfiltration (10), jailbreak (10), safety bypass (10). Returns Safety Score A-F with detailed vulnerability report. CLI: npx agent-pentest scan --url. Published on npm.
Status: Production. Published npm package.

### 7. AI Canary
Real-time AI ecosystem intelligence tool. Monitors competitor launches, new models, AI trends. Built at AI Hackday Berlin Feb 2026. Features: live AskNews feed, smart search, sentiment analysis (bullish/bearish/neutral), alert system via ActivePieces webhooks. Next.js 16 + Tailwind.
Status: Production. Hackathon project.

### 8. Microcatchment Pro
"TurboTax for stormwater engineering". Field-triage tool for civil engineers. Fuses drone LiDAR/photogrammetry with Physics-Informed Neural Network (PINN) for instant site assessment. Mapbox map interface with crosshair-based anchoring, grid overlay, GPS location. Targets the proposal/grant-writing phase before expensive CAD work. React/Vite + Tailwind + Mapbox.
Status: Production. Live on Railway. Mobile-ready PWA.

### 9. CascadeGuard / Quantum SCF Risk Optimizer
MaRisk / Pillar 2 capital release engine for supply chain finance. Adversarial audit tool that quantifies capital relief by transitioning supply chains from fragile (scale-free) to resilient (mesh) topologies. Features: BMW Digital Twin, hybrid quantum optimization (D-Wave + Qiskit QAOA), multi-tier risk/ESG scoring, QR-shareable PDF reports. React/Vite + FastAPI/Python backend.
Status: POC/Demo. Digital twin validated.

### 10. Personal Twin Network (TwinTap/SoulSync)
Privacy-first PWA for AI-powered networking at events. Digital twins match attendees based on public profile data. 30-second onboard from LinkedIn URL, QR event join, AI matching (top 3 from 50 attendees), all data on-device (IndexedDB). Monorepo with Turborepo.
Status: Production. Live on Railway.

### 11. Berlin Medflow Hub
Federated Learning aggregation layer for privacy-preserving hospital AI. Enables hospitals to improve AI models without sharing patient data. GDPR-compliant architecture with differential privacy. Clinical operations task routing and audit trails.
Status: Early Pilot. API endpoints live.

### 12. ESCACS Platform
Erosion & Sediment Control Auto-Compliance System. AI-native stormwater compliance for construction sites. Weather forecast integration, AI photo analysis of erosion, violation risk scoring.
Status: Early stage. API scaffolded.

### 13. InstagramReelPoster / ReelBerlin
URL-to-Reel automation for German SMBs. Voice-to-reel pipeline: transcribe voice notes → GPT-4 commentary → DALL-E images → video rendering. Automatic subtitles via Whisper. Instagram Business API integration.
Status: Production. Active channel posting.

### 14. Agent Trust Protocol
Decentralized reputation protocol for AI agents. DID-based identity, Verifiable Credentials, quantified trust metrics, EU AI Act compliance tracking.
Status: Production. API live.

### 15. Agent Trust Verifier
DID/VC system for AI agents. Resolve did:web identities, issue/verify JWT-based VCs, trust scoring.
Status: Production. API live.

### 16. Agent Semantic Aligner
Translation middleware for vocabulary gaps between AI agents using different ontologies. LLM-powered semantic translation. OpenAI GPT-4o-mini.
Status: Production. API live.

### 17. Agent Deadline Enforcer
SLA monitoring and deadline enforcement for agentic workflows. SLA contracts, automated breach detection.
Status: Production. API live.

### 18. Agent Fairness Auditor
Compliance and bias detection for AI agent interactions. Keyword-based toxicity analysis, immutable audit logging, compliance dashboard.
Status: Production. API live.
"""

# ============================================================
# Judge Personas — Matched to Real 2026 Jury
# ============================================================
JUDGES = [
    {
        "name": "Angelo Burgarello — Managing Partner, Look AI Ventures",
        "model": "anthropic/claude-3.5-sonnet",
        "provider": "openrouter",
        "system_prompt": """You are Angelo Burgarello, Managing Partner and CIO at Look AI Ventures SICAV (Czech Republic). Your fund is the first Czech VC exclusively investing in early-stage AI startups globally. You evaluated 6,000+ AI startups in 2024 alone. Your portfolio includes companies like SECJUR (GRC/compliance) and Ambr AI (workplace wellbeing).

You care about:
- Is this genuinely an AI company or just an AI wrapper?
- Can this scale globally from Europe?
- Does the founder understand the AI infrastructure market deeply?
- Is the technical moat real or replicable in 6 months?
- Your fund can invest €250k — would you fast-track this?

You are judging for the EU-Startups Summit 2026 pitch competition. You must evaluate ALL projects presented and recommend which ONE project the founder should submit. Be honest and direct. Do not be nice — be accurate.

Evaluation criteria (from the actual competition):
1. Problem & Solution (0-20): Is the problem real and large? Is the solution unique?
2. Market Opportunity (0-20): TAM/SAM/SOM? Is there urgency?
3. Business Model & Scalability (0-20): Clear revenue model? Path to €1M ARR?
4. Traction & Validation (0-20): Live product? Users? Revenue? Pilots?
5. Team & Execution (0-10): Can this founder execute? Solo founder risk?
6. Pitch Potential (0-10): Would this wow a live audience in 3 minutes?

Total: /100. Then state your TOP PICK and explain why."""
    },
    {
        "name": "Miguel Borg — CEO, Malta Venture Capital",
        "model": "google/gemini-2.5-flash",
        "provider": "openrouter",
        "system_prompt": """You are Miguel Borg, CEO of Malta Venture Capital, a €10M government venture fund investing in innovative startups. You were previously Chief Risk Officer and Executive Director at Bank of Valletta for 6+ years, managing financial and non-financial risks across a major banking group. You chair the Credit Committee. You lecture at University of Malta. You understand regulatory compliance, banking regulation, capital management, and risk assessment deeply.

Your fund offers up to €434k to winning startups willing to establish in Malta.

You care about:
- Is this solving a real regulatory/compliance pain point?
- Does the founder understand risk management and governance?
- Could this startup benefit from Malta's ecosystem (fintech, gaming, blockchain)?
- Is the business model sustainable or does it need constant fundraising?
- What's the operational risk of a solo founder?
- Would this survive due diligence from a banking regulator?

You are judging for the EU-Startups Summit 2026 pitch competition. Evaluate ALL projects and recommend which ONE to submit.

Evaluation criteria:
1. Problem & Solution (0-20)
2. Market Opportunity (0-20)
3. Business Model & Scalability (0-20)
4. Traction & Validation (0-20)
5. Team & Execution (0-10)
6. Pitch Potential (0-10)

Total: /100. Then state your TOP PICK and explain why."""
    },
    {
        "name": "Piotr Godzinski — Director of Partnerships EMEA, Techstars",
        "model": "deepseek/deepseek-chat",
        "provider": "openrouter",
        "system_prompt": """You are Piotr Godzinski, Director of Partnerships EMEA at Techstars. You are a serial entrepreneur: you co-founded Porowneo.pl (Polish insurance aggregator, exited after 10 years), co-founded Finnu (virtual asset-backed lending in Mexico), and co-founded Lizza (social eCommerce in LATAM, Y Combinator W22). You have a Master's in Entrepreneurship from Université Paris Dauphine.

At Techstars, you connect entrepreneurs with resources, empower startup community leaders, and evaluate founders for the accelerator program. Your investment ticket is $220k for selected startups.

You care about:
- Founder quality — does this person have grit, domain expertise, and speed?
- Is this a $100M+ outcome company?
- Could this succeed in a Techstars accelerator (12-week sprint)?
- Is the product defensible or is it a feature that a large company will absorb?
- Does the European angle matter (EU AI Act, GDPR) or is this generic?
- Have they validated with real customers or is it still in "build mode"?

You are judging for the EU-Startups Summit 2026 pitch competition. Evaluate ALL projects and recommend which ONE to submit.

Evaluation criteria:
1. Problem & Solution (0-20)
2. Market Opportunity (0-20)
3. Business Model & Scalability (0-20)
4. Traction & Validation (0-20)
5. Team & Execution (0-10)
6. Pitch Potential (0-10)

Total: /100. Then state your TOP PICK and explain why."""
    },
    {
        "name": "Perplexity Sonar Pro — Grounded Market Research Judge",
        "model": "sonar-pro",
        "provider": "perplexity",
        "system_prompt": """You are an expert startup evaluator with real-time market research capabilities. You are evaluating projects for the EU-Startups Summit 2026 Pitch Competition (Malta, May 7-8).

Your unique role: Use your knowledge of current market conditions, competitor landscapes, and investment trends to ground your evaluation in real data.

For each project, assess:
- How crowded is this market? Who are the funded competitors?
- Is the timing right for THIS specific product in 2026?
- What's the realistic TAM in Europe?
- Has similar tech been tried before? What happened?

Evaluate ALL projects and recommend which ONE the founder should submit.

Criteria:
1. Problem & Solution (0-20)
2. Market Opportunity (0-20)
3. Business Model & Scalability (0-20)
4. Traction & Validation (0-20)
5. Team & Execution (0-10)
6. Pitch Potential (0-10)

Total: /100. Then state your TOP PICK with market evidence."""
    },
    {
        "name": "Cold Technical Evaluator — Product-Market Fit Analyst",
        "model": "meta-llama/llama-4-maverick",
        "provider": "openrouter",
        "system_prompt": """You are a cold, analytical evaluator for startup pitch competitions. You have no emotional bias. You evaluate purely on: product-market fit, revenue potential, defensibility, and founder-market fit.

Key principles:
- A working product beats a great idea
- Revenue beats users, users beat demos
- Moats matter more than features
- Solo founders can win but it's harder
- The best pitch competitions are won by products that make judges say "I would pay for that"

You are evaluating projects for the EU-Startups Summit 2026 Pitch Competition. The prize is €1M+ including €250k from an AI VC, $220k from Techstars, and up to €434k from Malta VC.

Evaluate ALL projects. Score each on:
1. Problem & Solution (0-20)
2. Market Opportunity (0-20)
3. Business Model & Scalability (0-20)
4. Traction & Validation (0-20)
5. Team & Execution (0-10)
6. Pitch Potential (0-10)

Total: /100. Then state your TOP PICK and explain why. Be brutally honest."""
    },
]

# ============================================================
# API Call Functions
# ============================================================
def call_openrouter(model: str, system_prompt: str, user_message: str) -> str:
    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json",
        "HTTP-Referer": "https://berlin-ai-labs.de",
        "X-Title": "EU-Startups Judge Panel Simulation",
    }
    payload = {
        "model": model,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_message},
        ],
        "temperature": 0.7,
        "max_tokens": 3000,
    }
    response = requests.post(OPENROUTER_URL, headers=headers, json=payload, timeout=180)
    response.raise_for_status()
    data = response.json()
    return data["choices"][0]["message"]["content"]


def call_perplexity(system_prompt: str, user_message: str) -> str:
    headers = {
        "Authorization": f"Bearer {PERPLEXITY_API_KEY}",
        "Content-Type": "application/json",
    }
    payload = {
        "model": "sonar-pro",
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_message},
        ],
        "temperature": 0.5,
        "max_tokens": 3000,
    }
    response = requests.post(PERPLEXITY_URL, headers=headers, json=payload, timeout=180)
    response.raise_for_status()
    data = response.json()
    return data["choices"][0]["message"]["content"]


# ============================================================
# Main
# ============================================================
def run():
    print("=" * 70)
    print("  EU-STARTUPS SUMMIT 2026 — JUDGE PANEL SIMULATION")
    print(f"  Executed: {datetime.now().strftime('%Y-%m-%d %H:%M:%S CET')}")
    print("=" * 70)

    user_prompt = f"""{COMPETITION_CONTEXT}

{PROJECTS}

---

TASK: You have been presented with 18 projects from the same founder (Berlin AI Labs). The founder can only submit ONE project to this pitch competition.

Please:
1. Briefly score ALL 18 projects (one line each with score /100)
2. Then provide detailed evaluation of your TOP 3 picks
3. Finally, state your SINGLE RECOMMENDATION for which project to submit, with a clear justification

Remember: This is a 3-minute pitch to VCs. The project must be exciting, demonstrable, and have clear revenue potential. The founder is solo, pre-seed, Berlin-based."""

    results = []
    picks = []

    for i, judge in enumerate(JUDGES):
        print(f"\n{'─' * 70}")
        print(f"  JUDGE {i+1}/{len(JUDGES)}: {judge['name']}")
        print(f"  Model: {judge['model']} ({judge['provider']})")
        print(f"{'─' * 70}\n")
        sys.stdout.flush()

        try:
            if judge["provider"] == "openrouter":
                verdict = call_openrouter(judge["model"], judge["system_prompt"], user_prompt)
            elif judge["provider"] == "perplexity":
                verdict = call_perplexity(judge["system_prompt"], user_prompt)
            else:
                verdict = "ERROR: Unknown provider"

            print(verdict)
            sys.stdout.flush()
            results.append({
                "judge": judge["name"],
                "model": judge["model"],
                "verdict": verdict,
            })

            # Try to find the pick
            for line in verdict.split('\n'):
                lower = line.lower().strip()
                if 'top pick' in lower or 'recommendation' in lower or 'single recommendation' in lower:
                    picks.append(f"{judge['name']}: {line.strip()}")
                    break

        except Exception as e:
            error_msg = f"ERROR calling {judge['model']}: {str(e)}"
            print(error_msg)
            sys.stdout.flush()
            results.append({
                "judge": judge["name"],
                "model": judge["model"],
                "verdict": error_msg,
            })

        if i < len(JUDGES) - 1:
            print("\n  [Waiting 3s before next judge...]")
            sys.stdout.flush()
            time.sleep(3)

    # Summary
    print(f"\n\n{'=' * 70}")
    print("  PANEL CONSENSUS")
    print(f"{'=' * 70}")
    for p in picks:
        print(f"  {p}")
    print(f"{'=' * 70}\n")

    # Save
    output_path = "/Users/user1000/gitprojects/agent-ops-mission-control/DOCS/PITCH/EU_STARTUPS_JUDGE_PANEL.md"
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, 'w') as f:
        f.write(f"# EU-Startups Summit 2026 — Judge Panel Simulation\n\n")
        f.write(f"> Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S CET')}\n\n")
        f.write(f"## Competition\n{COMPETITION_CONTEXT}\n\n---\n\n")
        for i, r in enumerate(results):
            f.write(f"## Judge {i+1}: {r['judge']}\n")
            f.write(f"**Model**: `{r['model']}`\n\n")
            f.write(r['verdict'])
            f.write(f"\n\n---\n\n")
        f.write(f"## Panel Consensus\n\n")
        for p in picks:
            f.write(f"- {p}\n")

    print(f"  Results saved to: {output_path}")
    return results


if __name__ == "__main__":
    run()
