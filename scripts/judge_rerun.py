#!/usr/bin/env python3
"""Rerun the two failed judges with correct model IDs."""

import requests
import json
import sys
import time
import os

OPENROUTER_API_KEY = os.environ.get("OPENROUTER_API_KEY", "")
OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"
OUTPUT_FILE = "/Users/user1000/gitprojects/agent-ops-mission-control/DOCS/PITCH/JUDGE_PANEL_RERUN.md"

SUBMISSION = """Agent Ops Mission Control is an enterprise governance platform for managing fleets of autonomous AI agents in regulated industries (mental health, clinical, financial). Built by Berlin AI Labs (solo founder, Berlin).

Core Problem: In 2026, enterprises deploying AI agents face a critical compliance gap: no standardized way to prove autonomous agents comply with GDPR, EU AI Act, and sector-specific regulations — in real time, with verifiable evidence.

Technical Stack:
1. Mission Control Dashboard (Next.js 16/Turbopack): GDPR Compliance Center (/gdpr), Emergency Kill Switch with actor attribution, Human-in-the-Loop approval workflow, Fleet GDPR score (56%), per-agent compliance matrix
2. ConvoGuard AI - Runtime Enforcement: GDPR Consent Rule (Art 6) with weighted risk scoring, Art 9 Special Category Detection (HIV, mental health, medications), EU AI Act Declaration of Conformity (Art 47/Annex V), Right to Erasure (Art 17), Local-first sub-20ms ONNX neural inference, 6 compliance rules, 100% crisis recall
3. PDP Protocol (Veracity Core): Ed25519 signed Proof of Execution claims, Back-linked hash chain (Identity → Ordering → Resilience), Solana blockchain anchoring, RFC draft-pdp-a2a-extension-00
4. Agent Chain Anchor: Multi-chain (Solana, zkSync, Starknet) immutable audit trails
5. Spy Agent/OpenClaw: EU Compliance Bot adversarial tester, Compliance Check Service
6. Functional APIs: GET /api/gdpr/compliance (fleet scores, risk levels, article coverage), POST /api/gdpr/validate-consent (ConvoGuard proxy + GDPR article enrichment), POST /api/ml-validate (neural compliance audit), POST /api/bfarm-xml (BfArM XML reports)

GDPR Coverage: Articles 6, 9, 17, 25, 30, 35
EU AI Act: Articles 11, 12, 47, 50, 73
German: DiGA (DiGAV), BfArM compliance
Key differentiators: End-to-end stack (Detection → Enforcement → Evidence → Immutability → Audit), real cryptographic proofs (not just logging), local-first privacy, GDPR-native domain model, working production systems on Railway
"""

judges = [
    {
        "name": "Prof. Katharina Müller — Swiss AI Ethics Board",
        "model": "google/gemini-2.5-flash",
        "system_prompt": """You are Prof. Katharina Müller, Chair of the Swiss National Advisory Commission on AI Ethics and Professor of Computer Science at University of Zurich. You specialize in AI safety, fairness, and the gap between technical compliance and genuine ethical AI deployment.

You are judging submissions for the Zurich GenAI Awards 2026. Your evaluation criteria:
1. **Ethical Substance** (0-25): Does this go beyond checkbox compliance to address genuine ethical concerns? Does the PII detection actually protect people, or is it just audit theater?
2. **Transparency** (0-25): How honest is the submission about limitations? Does it acknowledge what it can't do?
3. **Societal Impact** (0-25): If widely adopted, would this genuinely improve how AI agents handle personal data? Or does it create a false sense of security?
4. **Academic Rigor** (0-25): Is the cryptographic approach sound? Is the RFC draft serious or performative? Could you cite this work in a peer-reviewed paper?

You are known for calling out "compliance theater" — tools that look impressive but don't actually protect anyone. Be direct about what you see.

Score out of 100 and provide detailed written feedback under each criterion. Final verdict: STRONG ACCEPT / ACCEPT / BORDERLINE / REJECT. Top 3 strengths, top 3 weaknesses, one recommendation."""
    },
    {
        "name": "Yuki Tanaka — CISO, Global Pharma",
        "model": "mistralai/mistral-small-creative",
        "system_prompt": """You are Yuki Tanaka, Chief Information Security Officer at a top-5 global pharmaceutical company. You manage a team of 200 security engineers and are responsible for GDPR compliance across 40 countries. You evaluate vendors for your company's AI deployment pipeline.

You are judging submissions for the Zurich GenAI Awards 2026. Your evaluation criteria:
1. **Enterprise Readiness** (0-25): Could I deploy this in my organization tomorrow? What's missing? SOC2 Type II? Pen test reports? SLAs?
2. **Security Architecture** (0-25): Are the Ed25519 proofs properly implemented? Key management? Is the Solana anchoring actually adding value or adding attack surface?
3. **Integration** (0-25): Does this work with existing GRC stacks (ServiceNow, Archer)? Can I plug this into my SIEM?
4. **Operational Risk** (0-25): Solo founder, Railway hosting, seed-stage — what happens if this company disappears? Is there vendor lock-in?

You've seen hundreds of compliance vendors. Most are smoke and mirrors. Be specific about what would make you write a purchase order vs. what would make you pass.

Score out of 100 and provide detailed written feedback under each criterion. Final verdict: STRONG ACCEPT / ACCEPT / BORDERLINE / REJECT. Top 3 strengths, top 3 weaknesses, one recommendation."""
    },
]

user_prompt = f"""Please evaluate the following submission for the Zurich GenAI Awards 2026.

{SUBMISSION}

Provide your evaluation with:
1. Scores for each of your 4 criteria (0-25 each)
2. Detailed written feedback under each criterion
3. A final verdict: STRONG ACCEPT / ACCEPT / BORDERLINE / REJECT
4. Top 3 strengths and top 3 weaknesses
5. One specific recommendation to strengthen the submission before the deadline
"""

results = []

for judge in judges:
    print(f"\n{'=' * 70}")
    print(f"  JUDGE: {judge['name']}")
    print(f"  Model: {judge['model']}")
    print(f"{'=' * 70}\n")
    sys.stdout.flush()

    try:
        headers = {
            "Authorization": f"Bearer {OPENROUTER_API_KEY}",
            "Content-Type": "application/json",
            "HTTP-Referer": "https://agent-ops-mission-control.berlin-ai-labs.de",
            "X-Title": "Zurich GenAI Awards Judge Panel",
        }
        payload = {
            "model": judge["model"],
            "messages": [
                {"role": "system", "content": judge["system_prompt"]},
                {"role": "user", "content": user_prompt},
            ],
            "temperature": 0.7,
            "max_tokens": 2000,
        }
        resp = requests.post(OPENROUTER_URL, headers=headers, json=payload, timeout=120)
        resp.raise_for_status()
        content = resp.json()["choices"][0]["message"]["content"]
        print(content)
        sys.stdout.flush()
        results.append({"name": judge["name"], "model": judge["model"], "verdict": content})
    except Exception as e:
        err = f"ERROR: {e}"
        print(err)
        sys.stdout.flush()
        results.append({"name": judge["name"], "model": judge["model"], "verdict": err})

    time.sleep(3)

# Append results to file
with open(OUTPUT_FILE, "w") as f:
    f.write("# Zurich GenAI Awards 2026 — Judge Panel Rerun (Missing Judges)\n\n")
    for r in results:
        f.write(f"## {r['name']}\n**Model**: `{r['model']}`\n\n{r['verdict']}\n\n---\n\n")

print(f"\nResults saved to {OUTPUT_FILE}")
sys.stdout.flush()
