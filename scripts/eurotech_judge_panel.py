#!/usr/bin/env python3
"""
Eurotech Federation Fellowship — Judge Panel Simulation
========================================================
Feeds ALL Berlin AI Labs projects to LLM judges role-playing as
Eurotech Federation selection committee members evaluating for Batch 2.

Program: Pan-European fellowship for builders, engineers, and product minds.
Deadline: 28 February 2026.
Criteria: "What you are building", "intellectual honesty", "real execution".
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
## Eurotech Federation Fellowship — Batch 2

**What it is**: Europe's largest student-led tech network (now pan-European fellowship)
bridging technical talent, researchers, and builders to the European startup ecosystem.

**Key Facts**:
- Batch 2 (Cohort 2) starts soon.
- Deadline: 28 February 2026.
- Strategic Partners: Scaleway (Cloud/Credits), EWOR (Entrepreneurship), Raise (VC).
- Focus: "Builders", "Deep-Tech", "European Scale".
- Eligibility: Ambitious individuals, engineers, researchers, product minds. 
  - They mention "under 30" in some documentation (youth focus).
  - NO strict graduation year requirement like EF.
  - They value output and "what you are building" over pedigree.

**What They Want**:
- **Builders**: People who actually ship code, build hardware, or conduct deep research.
- **Agency**: Proven ability to make things happen independently.
- **Intellectual Honesty**: Clear understanding of what they are building and why.
- **Community Spirit**: Willingness to contribute back to the Eurotech network.
- Evaluation is heavily weighted on the projects being built.

**Benefits**:
- Pan-European networking with elite peers (Oxford, ETH, TUM, etc.)
- Mentorship from senior founders and industry leaders.
- Scaleway cloud credits and partner perks.
- Exclusive events and VC bridge.
"""

# ─── Founder Profile ──────────────────────────────────────────────────
# Adjusted for Eurotech: focusing on the "Builder" edge.
FOUNDER_PROFILE = """
## Founder: Yami Gopal

**Background**:
- Based in Berlin, Germany (Heart of European Tech)
- 15+ years global tech experience (Senior background)
- Solo founder of Berlin AI Labs since 2022
- Full-stack AI builder: ships production products end-to-end
- Edge: **Pure Execution**. 9+ shipped production products on Railway.
- Pedigree: NO elite university degree. Output-based outlier.

**Technical Portfolio Summary**:
- 9+ Production AI Products LIVE on Railway.
- 15+ Repos with strict TDD/ATDD and Self-Healing CI/CD.
- Published npm packages (`agent-pentest`).
- Drafted RFC protocols (`PoE-A2A`).
- Built AI governance, compliance, blockchain anchoring, and quantum optimization tools.

**Potential Risk Factor**:
- AGE: Documentation mentions "under 30". Yami has 15+ years experience, which might put him at or slightly above this preference.
- PEDIGREE: Not from a "top tier" university (ETH/TUM), but has out-shipped most students from those schools combined.
"""

# ─── Project Portfolio ─────────────────────────────────────────────────
PROJECTS = """
## Berlin AI Labs — Full Product Portfolio

### 1. ConvoGuard AI
Real-time compliance API middleware for mental health chatbots.
Validates conversations against GDPR, EU AI Act, and DiGA regulations.
- LIVE: convoguard-ai-production.up.railway.app
- 100% crisis detection recall, <20ms latency.

### 2. AgentOps Mission Control
Enterprise dashboard for AI agent fleet governance.
- LIVE: agent-ops-mission-control-production.up.railway.app
- GDPR compliance scoring per agent, kill switch, PII leak detection.

### 3. PoE-A2A Protocol (Veracity Core)
Proof of Execution extension for Google A2A protocol.
- LIVE: pdp-protocol-production.up.railway.app
- Cryptographic trust layer for moving from "prompts" to "execution".

### 4. Agent Pentest CLI
Open-source red-team tool for AI agents. 
- PUBLISHED on npm: `npx agent-pentest`
- 41 automated adversarial attack vectors.

### 5. AI Canary
Real-time AI ecosystem monitoring and competitive intelligence.
- LIVE: ai-canary-production.up.railway.app

### 6. Microcatchment Pro
Field-triage tool for civil engineers — stormwater site assessment.
- LIVE: microcatchment-pro-production.up.railway.app
- Physics-Informed Neural Networks (PINNs) + LiDAR fusion.

### 7. SoulSync (Personal Twin Network)
Privacy-first AI networking at events.
- LIVE: soulsync.up.railway.app
- Pure on-device inference, zero-server architecture.

### 8. CascadeGuard SCF (Quantum SCF Risk Optimizer)
Supply Chain Finance optimizer using hybrid quantum annealing.
- POC Stage: Uses D-Wave + Qiskit.

### 9. Spy Agent / OpenClaw
Adversarial audit tool for multi-agent systems.
- LIVE (private repo).
"""

# ─── Judge Personas ────────────────────────────────────────────────────
JUDGES = [
    {
        "name": "Alex — Founding Member, Eurotech Federation",
        "model": "llama-3.3-70b-versatile",
        "provider": "groq",
        "system_prompt": """You are Alex, a founding member of Eurotech Federation. You founded this
to bring together Europe's best technical minds to build a sovereign tech stack.

- You hate "wantrepreneurs" who only talk. You love "builders" who ship code.
- You care about INTELLECTUAL HONESTY.
- You care about EUROPEAN SCALE. Can this person help build a tech-sovereign Europe?
- You value the community. Will this person be a "Lone Wolf" or contribute to the Federation?
- You are skeptical of credentials but wowed by output.

Evaluate Yami's portfolio. Score fit (1-100). Pick the best 1-2 projects to lead with.""",
    },
    {
        "name": "Sarah — Scaleway Startup Program Advocate",
        "model": "sonar-pro",
        "provider": "perplexity",
        "system_prompt": """You are Sarah, leading the startup advocate team at Scaleway. You look
for technical sophistication and infrastructure-heavy builds that can scale on
European cloud infrastructure.

- You value TECHNICAL DEPTH. Is the engineering actually impressive?
- You look for AI/Compliance fit (very relevant for Scaleway's EU focus).
- You are skeptical of 15+ years experience vs "yield" — has this person stayed relevant?
- You look for projects that need CLOUD RESOURCES (GPU, Compute).

Evaluate the technical portfolio. Which projects show the most technical agency?""",
    },
    {
        "name": "Marc — EWOR Fellowship Lead",
        "model": "llama-3.3-70b-versatile",
        "provider": "groq",
        "system_prompt": """You are Marc, leading the EWOR fellowship selection. You look for
entrepreneurial "outliers" who can build massive companies.

- You care about TAM (Total Addressable Market).
- You look for "Founder-Market Fit".
- You assess if this person is a "Service Provider" or a "Product Builder".
- You want to see "Agency" — did they wait for permission? (Yami clearly didn't).

Evaluate the portfolio for venture potential. Score fit (1-100).""",
    },
    {
        "name": "Lars — Eurotech Peer Fellow (Current Batch 1)",
        "model": "gemma2-9b-it",
        "provider": "groq",
        "system_prompt": """You are Lars, a technical peer fellow in Batch 1 of Eurotech Federation.
You are a hacker at heart, building cool shit.

- You evaluate based on the "COOL SHIT" factor.
- You care about OPEN SOURCE contributions (npm packages are a big plus).
- You look for people you'd want to grab a beer with at a hackathon.
- You are skeptical of "enterprise-speak" — show me the code.

Evaluate the projects. Which ones would the current fellows find most impressive?""",
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
    try:
        response = requests.post(GROQ_URL, headers=headers, json=payload, timeout=180)
        response.raise_for_status()
        return response.json()["choices"][0]["message"]["content"]
    except Exception as e:
        return f"ERROR: {e}"


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
    try:
        response = requests.post(PERPLEXITY_URL, headers=headers, json=payload, timeout=180)
        response.raise_for_status()
        return response.json()["choices"][0]["message"]["content"]
    except Exception as e:
        return f"ERROR: {e}"


# ─── Main ──────────────────────────────────────────────────────────────

def main():
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S CET")
    print("=" * 70)
    print("  EUROTECH FEDERATION FELLOWSHIP — JUDGE PANEL SIMULATION")
    print(f"  Executed: {timestamp}")
    print("=" * 70)

    user_prompt = f"""
{PROGRAM_CONTEXT}

{FOUNDER_PROFILE}

{PROJECTS}

---

## Your Task

You are evaluating Yami Gopal's application for the Eurotech Federation Fellowship (Batch 2).

Answer the following:
1. **TOP PICKS**: Which 1-3 projects should he lead with for THIS fellowship?
2. **FELLOWSHIP FIT SCORE**: Score his overall fit for the Fellowship (1-100).
3. **PEER PERSPECTIVE**: How would the other technical fellows view him?
4. **RISK ASSESSMENT**: Does his background (15+ years exp, no elite uni) hurt or help?
5. **RECOMMENDATION**: ACCEPT, WAITLIST, or REJECT? Why?
6. **STRATEGY**: How should he frame his narrative for the Eurotech community?

Be honest, specific, and direct.
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

        if provider == "groq":
            response = call_groq(model, judge["system_prompt"], user_prompt)
        elif provider == "perplexity":
            response = call_perplexity(model, judge["system_prompt"], user_prompt)
        else:
            response = f"Unknown provider: {provider}"

        print(response)
        sys.stdout.flush()
        results.append({"judge": name, "model": model, "response": response})

        # Delay to avoid rate limits
        if i < len(JUDGES):
            time.sleep(10)

    # ─── Save Results ──────────────────────────────────────────────────
    output_path = "/Users/user1000/gitprojects/agent-ops-mission-control/DOCS/PITCH/EUROTECH_FELLOWSHIP_JUDGE_PANEL.md"
    with open(output_path, "w") as f:
        f.write(f"# Eurotech Federation Fellowship — Judge Panel Simulation\n\n")
        f.write(f"**Executed**: {timestamp}\n\n")
        f.write(f"**Program**: Eurotech Federation Fellowship | Batch 2\n")
        f.write(f"**Deadline**: 28 February 2026\n\n")
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
