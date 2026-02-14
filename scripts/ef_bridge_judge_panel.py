#!/usr/bin/env python3
"""
EF 'The Bridge' SF Residency — Judge Panel Simulation
======================================================
Feeds ALL Berlin AI Labs projects to LLM judges role-playing as
EF selection committee members evaluating for The Bridge Spring 2026.

Program: 8-week hacker house in Bay Area, 40 spots, $250K pre-seed,
         for exceptional young Europeans (graduated 2023+).
Deadline: 15 February 2026.
"""

import json
import requests
import sys
import time
from datetime import datetime

# ─── API Keys ───────────────────────────────────────────────────────────
GROQ_API_KEY = "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"
GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"

PERPLEXITY_API_KEY = "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"
PERPLEXITY_URL = "https://api.perplexity.ai/chat/completions"

# ─── Program Context ───────────────────────────────────────────────────
PROGRAM_CONTEXT = """
## EF 'The Bridge' — SF Residency Spring 2026

**What it is**: 8-week hacker house residency in the San Francisco Bay Area
for exceptional young Europeans who want to start massive companies in the US.

**Key Facts**:
- 40 spots total (April or July 2026 cohort)
- $250K pre-seed investment ($125K for 8% SAFE + $125K MFN SAFE)
- $600K in credits from OpenAI, Anthropic, GitHub
- Full housing & board, flights covered, visa support (O-1)
- Demo Day pitching to top US VCs
- Powered by Entrepreneur First

**What They Want**:
- OUTLIER Europeans — people who continuously outperform their peer group
- Builders: product-obsessive engineers, researchers, hackers
- OR Future CEOs: commercial operators skilled in distribution/growth/sales
- Recent graduates (2023+) or very early career
- No existing team or idea required — program helps you find cofounders
- Must be full-time, in-person, hardcore commitment
- They back "weird tech" too — software, robotics, hardware

**Investment Terms**: $125K for 8% via EF SAFE, plus optional $125K MFN SAFE

**Selection Criteria (from EF's own words)**:
1. "Have you continuously outperformed your peer group?"
2. "Are you an exceptional engineer, researcher, or domain expert?"
3. "Are you a great problem solver, smart, and extremely determined?"
4. "Do you have a clear vision and strong ambition to build in the US?"
5. "We don't need an idea — we need YOU and your potential"

**How it Works**:
1. Cross the Atlantic (flights + visa covered)
2. Find cofounders in the hacker house
3. 8 weeks of mentorship, demos, deadlines, tech resources
4. Pitch for $250K and raise from US VCs
"""

# ─── Founder Profile ──────────────────────────────────────────────────
FOUNDER_PROFILE = """
## Founder: Yami Gopal

**Background**:
- Based in Berlin, Germany (European founder)
- 15+ years global tech experience (NOT a recent grad — this is a risk factor for Bridge)
- Previously Senior Agile Coach at Boehringer Ingelheim, Personio, FlixBus
- Technology consultant for Disney, FedEx
- Solo founder of Berlin AI Labs since 2022
- Full-stack AI builder: ships production products end-to-end
- Deep expertise in EU AI Act compliance, agent governance, blockchain anchoring

**IMPORTANT — Pedigree Concern**:
- NO elite university degree (not Oxford, Stanford, ETH, Imperial, etc.)
- NO traditional "outlier" academic credentials (no PhD, no top-tier research lab)
- NO YC/Techstars/500 Startups alumni status
- NOT a "graduated 2023+" candidate — has 15+ years of industry experience
- The Bridge explicitly targets "young Europeans having graduated in 2023 or later"
- His EDGE is purely output-based: 9+ shipped production products, which is rare

**Technical Profile**:
- Architected and deployed 9+ production AI products on Railway
- Enforces TDD/ATDD across all 15+ repos with self-healing CI/CD
- Published npm packages (agent-pentest), drafted RFC protocols (PoE-A2A)
- Built autonomous agent infrastructure with global rules engine
- Ships fast: can go from zero to deployed product in days

**Key Question for Judges**:
Does the sheer volume and quality of SHIPPED PRODUCTION PRODUCTS compensate for
the lack of traditional pedigree? EF says they want "builders" and "if you can ship,
you're welcome" — but do they actually mean it, or do they default to pedigreed candidates?
"""

# ─── Project Portfolio ─────────────────────────────────────────────────
PROJECTS = """
## Berlin AI Labs — Full Product Portfolio

### 1. ConvoGuard AI
Real-time compliance API middleware for mental health chatbots.
Validates conversations against GDPR, EU AI Act, and DiGA regulations.
- 100% crisis detection recall, <20ms latency
- Real inference engine, working API, Playwright E2E tested
- Production URL: convoguard-ai-production.up.railway.app
- TAM: €8.3B digital mental health market, EU AI Act enforcement 2025+
- Status: LIVE, demo-ready

### 2. AgentOps Mission Control
Enterprise dashboard for AI agent fleet governance.
- GDPR compliance scoring per agent
- Emergency kill switch, human-in-the-loop approval workflows
- PII leak detection across agent outputs
- Production URL: agent-ops-mission-control-production.up.railway.app
- Status: LIVE with real data

### 3. PoE-A2A Protocol (Veracity Core)
Proof of Execution extension for Google A2A protocol.
Cryptographic trust layer for the agentic web.
- Ed25519 signed execution claims
- Back-linked hash chains for tamper-proof audit trails
- Optional Solana blockchain anchoring
- RFC draft published, A2A Agent Card live
- Production URL: pdp-protocol-production.up.railway.app
- Status: LIVE, open protocol

### 4. Agent Pentest CLI
Open-source red-team tool for AI agents. Published on npm.
- 41 automated adversarial attack vectors
- Prompt injection, data exfiltration, jailbreak, safety bypass
- Instant safety scoring (A through F grade)
- `npx agent-pentest scan --url <target>`
- Status: PUBLISHED on npm, open source

### 5. AI Canary
Real-time AI ecosystem monitoring and competitive intelligence.
- Tracks competitor launches, new models, industry trends
- Sentiment analysis and smart alerts
- Production URL: ai-canary-production.up.railway.app
- Status: LIVE

### 6. Microcatchment Pro
Field-triage tool for civil engineers — stormwater site assessment.
- Fuses drone LiDAR with Physics-Informed Neural Networks (PINNs)
- Mobile-ready PWA for field use
- Crosshair-based anchoring with GPS validation
- Production URL: microcatchment-pro-production.up.railway.app
- BMW Digital Twin validated
- Status: LIVE, pilot-ready

### 7. SoulSync (Personal Twin Network)
Privacy-first AI networking at events.
- Digital twins match attendees based on compatibility
- ALL data stored on-device — zero-server architecture
- GDPR-perfect by design (no data to leak)
- Production URL: soulsync.up.railway.app
- Status: LIVE, tested at CIC Berlin

### 8. CascadeGuard SCF (Quantum SCF Risk Optimizer)
Capital release engine for supply chain finance.
- Hybrid quantum optimization (D-Wave + Qiskit QAOA)
- Multi-tier risk/ESG scoring for supply chains
- Quantifies savings from transitioning fragile→resilient topologies
- Status: POC Stage, BMW Digital Twin validated

### 9. Spy Agent / OpenClaw
Adversarial audit tool for multi-agent systems.
- Tests agent-to-agent communication security
- OpenClaw: open-source claw-back mechanism for rogue agents
- Status: LIVE (private repo)

### 10. ESCACS Platform
Environmental Site Characterization and Assessment system.
- Risk forecasting, vision expert, asset/permit modules
- Modular microservice architecture
- Status: LIVE (multiple services deployed)

### 11. Berlin Medflow Hub
Federated learning hub for medical data workflows.
- Privacy-preserving ML across hospital networks
- DSGVO-compliant data handling
- Status: LIVE

### 12. InstagramReelPoster (Challenging View)
Production video generation pipeline for social media.
- Voice-to-reel: transcribe voice notes into polished video reels
- AI-powered commentary with multiple channel personas
- DALL-E 3 image gen, smart music selection
- Status: LIVE (private)

### 13. Agent Infrastructure Services
Supporting tools that power the agent fleet:
- Agent Trust Protocol & Verifier: trust scoring for AI agents
- Agent Semantic Aligner: keeps agent outputs aligned to domain schemas
- Agent Deadline Enforcer: SLA monitoring for agent tasks
- Agent Fairness Auditor: bias detection across agent outputs
- Agent Chain Anchor: blockchain anchoring for agent decisions
- Status: All LIVE on Railway
"""

# ─── Judge Personas ────────────────────────────────────────────────────
JUDGES = [
    {
        "name": "Alice Zhang — EF Partner, The Bridge Lead",
        "model": "llama-3.3-70b-versatile",
        "provider": "groq",
        "system_prompt": """You are Alice Zhang, a senior partner at Entrepreneur First who leads
The Bridge SF residency selection. You've evaluated 2,000+ applicants for The Bridge
and selected the 40 per cohort. You know exactly what makes a Bridge founder:

- You care about OUTLIER signal — has this person done things most people can't?
- You value BUILDERS over talkers — can they ship real products?
- You look for US market potential — will this person thrive in SF?
- You assess cofounder potential — will other Bridge residents want to team up?
- You care about SPEED — how fast can they go from 0→1?
- Age/career stage matters: you prefer recent grads (2023+) but make exceptions for exceptional builders

Your job: evaluate the founder's ENTIRE portfolio and determine:
1. Which 1-3 projects would you lead with in The Bridge application?
2. What's the strongest narrative for this founder?
3. Score overall fit for The Bridge (1-100)
4. What concerns would you flag?

Be honest and direct. EF is extremely selective (40 from thousands of applicants).""",
    },
    {
        "name": "Matt Clifford — EF Co-founder & CEO",
        "model": "sonar-pro",
        "provider": "perplexity",
        "system_prompt": """You are Matt Clifford, co-founder and CEO of Entrepreneur First. You
co-founded EF in 2011 to bet on people, not ideas. You've backed 1,000+ founders
and built EF into the world's leading talent investor. You also advise the UK
government on AI policy and sit on the UK's Advanced Research + Invention Agency (ARIA).

For The Bridge specifically, you care about:
- EDGE: what makes this person different from every other smart European engineer?
- AGENCY: do they make things happen or wait for permission?
- AMBITION SCALE: are they thinking big enough for SF/US market?
- TECHNICAL DEPTH: can they build things that are genuinely hard?
- NARRATIVE: can they explain what they do in a way that makes investors lean in?

You've seen thousands of applications. Most fail because they're "smart but not outlier."
You need to see evidence of EXCEPTIONAL output, not just competence.

Evaluate the full portfolio. Pick the 1-3 projects for the application. Score fit (1-100).
Flag any concerns.""",
    },
    {
        "name": "Sarah Chen — YC Partner & Former Bridge Mentor",
        "model": "sonar-reasoning-pro",
        "provider": "perplexity",
        "system_prompt": """You are Sarah Chen, a Y Combinator partner who also serves as a mentor
for EF's Bridge program in SF. You've seen hundreds of European founders try to
"cross the pond" and know exactly what works and what doesn't.

Your perspective:
- You evaluate through the lens of US MARKET FIT — will US customers/VCs care?
- European compliance products are a TOUGH sell in the US (Americans don't care about GDPR)
- BUT: AI safety/trust is HOT in the US right now (executive orders, Senate hearings)
- You look for products with clear revenue potential within 12 months
- You value NETWORK EFFECTS and MOAT over just being technically good

You are SKEPTICAL by default. Most European founders fail in the US because they
optimize for the wrong market. You need to see why THIS founder will succeed in SF.

Evaluate the portfolio. Pick the best 1-3 projects for a US audience.
Score fit for The Bridge (1-100). Be brutally honest about US market viability.""",
    },
    {
        "name": "Dr. James Liu — AI Safety Researcher & EF Technical Advisor",
        "model": "llama-3.3-70b-versatile",
        "provider": "groq",
        "system_prompt": """You are Dr. James Liu, a leading AI safety researcher at a top US
university who advises EF's Bridge program on technical evaluation. Your background
is in formal verification, adversarial ML, and AI governance frameworks.

You evaluate founders on TECHNICAL SOPHISTICATION:
- Is the engineering actually impressive or just CRUD apps with AI branding?
- Are they solving genuinely hard technical problems?
- Is the architecture sound (not just thrown together)?
- Do they understand the AI safety landscape deeply?
- Are they contributing to open standards/protocols?
- Could they publish papers or present at top conferences?

You are TOUGH on technical claims. "100% crisis detection recall" needs proof.
"Hybrid quantum optimization" could be marketing BS. You dig into architecture.

Evaluate the portfolio with a technical lens. Which projects show real engineering depth?
Score technical impressiveness (1-100) and overall Bridge fit (1-100).""",
    },
    {
        "name": "Nikolai Petrov — European VC Scout (Berlin/SF)",
        "model": "gemma2-9b-it",
        "provider": "groq",
        "system_prompt": """You are Nikolai Petrov, a scout for a major European VC fund (Point Nine
Capital) who operates between Berlin and San Francisco. You specifically look
for European founders who can succeed in the US market.

Your unique perspective:
- You know the BERLIN startup scene intimately — what's real vs. hype
- You understand the bridge between EU regulation and US market opportunity
- You look for TIMING: is the market ready for this product NOW?
- You assess FUNDRAISING NARRATIVE: can this founder raise a US Series A?
- You evaluate SOLO FOUNDER RISK: EF wants cofounder matching, which helps

Key insight: The best Bridge applications lead with the PROBLEM, not the product.
European founders often lead with features. US VCs want to hear about the PAIN.

Evaluate the portfolio. Which projects tell the best STORY for US VCs?
Score Bridge fit (1-100). Flag the strongest fundraising narrative.""",
    },
]

# ─── API Call Functions ────────────────────────────────────────────────

def call_groq(model, system_prompt, user_prompt):
    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json",
    }
    payload = {
        "model": model,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
        "max_tokens": 4000,
        "temperature": 0.7,
    }
    response = requests.post(GROQ_URL, headers=headers, json=payload, timeout=180)
    response.raise_for_status()
    return response.json()["choices"][0]["message"]["content"]


def call_perplexity(model, system_prompt, user_prompt):
    headers = {
        "Authorization": f"Bearer {PERPLEXITY_API_KEY}",
        "Content-Type": "application/json",
    }
    payload = {
        "model": model,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
        "max_tokens": 4000,
        "temperature": 0.7,
    }
    response = requests.post(PERPLEXITY_URL, headers=headers, json=payload, timeout=180)
    response.raise_for_status()
    return response.json()["choices"][0]["message"]["content"]


# ─── Main ──────────────────────────────────────────────────────────────

def main():
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S CET")
    print("=" * 70)
    print("  EF 'THE BRIDGE' SF RESIDENCY — JUDGE PANEL SIMULATION")
    print(f"  Executed: {timestamp}")
    print("=" * 70)

    user_prompt = f"""
{PROGRAM_CONTEXT}

{FOUNDER_PROFILE}

{PROJECTS}

---

## Your Task

You are evaluating Yami Gopal's application to EF's The Bridge SF Residency (Spring 2026).

Given his FULL portfolio of 13+ production AI products, answer:

1. **TOP PICKS**: Which 1-3 projects should he LEAD with in the application? Why?
2. **NARRATIVE**: What's the strongest 2-sentence pitch for The Bridge application?
3. **BRIDGE FIT SCORE**: Score his overall fit for The Bridge (1-100). Justify.
4. **STRENGTHS**: What makes him stand out from other applicants?
5. **CONCERNS**: What would give you pause? What's missing?
6. **RECOMMENDATION**: ACCEPT, WAITLIST, or REJECT for The Bridge? Why?
7. **APPLICATION STRATEGY**: Any specific advice for the application itself?

Be honest, specific, and direct. This is a real decision with real consequences.
"""

    results = []

    for i, judge in enumerate(JUDGES, 1):
        name = judge["name"]
        model = judge["model"]
        provider = judge["provider"]

        print(f"\n{'─' * 70}")
        print(f"  JUDGE {i}/{len(JUDGES)}: {name}")
        print(f"  Model: {model} ({provider})")
        print(f"{'─' * 70}")

        try:
            if provider == "groq":
                response = call_groq(model, judge["system_prompt"], user_prompt)
            elif provider == "perplexity":
                response = call_perplexity(model, judge["system_prompt"], user_prompt)
            else:
                response = f"Unknown provider: {provider}"

            print(response)
            sys.stdout.flush()
            results.append({"judge": name, "model": model, "response": response})

            # Delay between judges to avoid rate limits
            if i < len(JUDGES):
                print("\n  ⏳ Waiting 15s before next judge...")
                sys.stdout.flush()
                time.sleep(15)

        except Exception as e:
            error_msg = f"ERROR: {e}"
            print(error_msg)
            results.append({"judge": name, "model": model, "response": error_msg})

    # ─── Save Results ──────────────────────────────────────────────────
    output_path = "/Users/user1000/gitprojects/agent-ops-mission-control/DOCS/PITCH/EF_BRIDGE_JUDGE_PANEL.md"
    with open(output_path, "w") as f:
        f.write(f"# EF 'The Bridge' SF Residency — Judge Panel Simulation\n\n")
        f.write(f"**Executed**: {timestamp}\n\n")
        f.write(f"**Program**: The Bridge Residency in San Francisco | Spring 2026\n")
        f.write(f"**Deadline**: 15 February 2026\n")
        f.write(f"**Investment**: $250K ($125K for 8% SAFE + $125K MFN)\n\n")
        f.write("---\n\n")

        for i, r in enumerate(results, 1):
            f.write(f"## Judge {i}: {r['judge']}\n")
            f.write(f"**Model**: `{r['model']}`\n\n")
            f.write(r["response"])
            f.write("\n\n---\n\n")

    print(f"\n{'=' * 70}")
    print(f"  Results saved to: {output_path}")
    print(f"{'=' * 70}")


if __name__ == "__main__":
    main()
