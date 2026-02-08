#!/usr/bin/env python3
"""
Zurich GenAI Awards — Simulated Judge Panel
============================================
Sends the Agent Ops Mission Control submission to multiple LLM models
acting as award panel judges. Uses OpenRouter (roleplay models) and 
Perplexity Sonar Pro for grounded, critical evaluation.

Each judge has a distinct persona and scoring rubric.
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
# API Keys
# ============================================================
OPENROUTER_API_KEY = os.environ.get("OPENROUTER_API_KEY", "")
PERPLEXITY_API_KEY = os.environ.get("PERPLEXITY_API_KEY", "")

OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"
PERPLEXITY_URL = "https://api.perplexity.ai/chat/completions"

# ============================================================
# The Submission Brief (what each judge evaluates)
# ============================================================
SUBMISSION_BRIEF = """
# Agent Ops Mission Control — Zurich GenAI Awards 2026 Submission

## Project Summary
Agent Ops Mission Control is an enterprise governance platform for managing fleets of autonomous AI agents in regulated industries (mental health, clinical, financial). Built by Berlin AI Labs.

## Core Problem
In 2026, enterprises deploying AI agents face a critical compliance gap: there is no standardized way to prove that autonomous agents comply with GDPR, EU AI Act, and sector-specific regulations (DiGA, BfArM) — in real time, with verifiable evidence.

## What We Built (Technical Stack)

### 1. Mission Control Dashboard (Next.js 16 / Turbopack)
- **Fleet governance UI**: Monitor 9+ AI agents across compliance, governance, content, and utility categories
- **GDPR Compliance Center** (`/gdpr`): Real-time dashboard showing fleet GDPR score, per-agent compliance matrix, GDPR article coverage (Art 6, 9, 17, 25, 30, 35), PII leak alerts
- **Emergency Kill Switch**: `isEmergencyStopped` flag with actor attribution and timestamp — instant agent shutdown on GDPR violation
- **Human-in-the-Loop**: `PendingAction` approval workflow for sensitive operations

### 2. ConvoGuard AI — Runtime Enforcement Engine
- **GDPR Consent Rule** (`ConsentRule.ts`): Detects data-collecting conversations → verifies consent was requested → verifies user gave consent. Flags violations with weighted risk scores
- **GDPR Article 9 Detection** (`ConsentDetector.ts`): Detects special category data (HIV, mental health, medications) → emits `SIGNAL_GDPR_SPECIAL_CATEGORY`
- **EU AI Act Declaration of Conformity** (`DeclarationOfConformity.ts`): Implements Article 47 + Annex V official declaration format
- **Right to Erasure**: `ConversationRepository.delete()` for GDPR Article 17 compliance
- **Local-first inference**: Sub-20ms ONNX neural inference — no data leaves the boundary
- **6 Compliance Rules**: Suicide prevention, GDPR consent, crisis escalation, medical safety, medical terminology, data residency

### 3. PDP Protocol (Veracity Core) — Cryptographic Proof Layer
- **Proof of Execution (PoE)**: Ed25519 signed execution claims with back-linked hash chain
- **Three-layer proof system**: Identity (signatures) → Ordering (sequence chain) → Resilience (Solana anchoring)
- **EU AI Act Article 50** transparency compliance
- **RFC draft**: `draft-pdp-a2a-extension-00` (informational)

### 4. Agent Chain Anchor — Immutable Audit Trail
- Multi-chain blockchain anchoring: Solana (production), zkSync (L2), Starknet (ZK-rollup)
- Tamper-proof timestamps for every compliance validation

### 5. Spy Agent / OpenClaw — Adversarial Compliance Testing
- **EU Compliance Bot**: LLM persona that stress-tests agents against GDPR and AI Act
- **Compliance Check Service**: Paid service (3.00 $MART) routing to ConvoGuard

### 6. Functional API Endpoints
- `GET /api/gdpr/compliance`: Returns fleet-wide GDPR score, per-agent risk levels, article coverage, compliance stack architecture
- `POST /api/gdpr/validate-consent`: Proxies to ConvoGuard, enriches results with GDPR article references and remediation guidance
- `POST /api/ml-validate` (ConvoGuard): Neural-powered crisis detection and compliance audit
- `POST /api/bfarm-xml` (ConvoGuard): BfArM-compliant XML audit report generation

## Key Technical Differentiators
1. **End-to-end stack**: Detection (ConvoGuard) → Enforcement (Mission Control) → Evidence (PoE-A2A) → Immutability (Chain Anchor) → Audit (Spy Agent)
2. **Real cryptographic proofs**: Not just logging — Ed25519 signatures with back-linked chains
3. **Local-first privacy**: Sub-20ms ONNX inference means data never leaves the EU processing boundary
4. **GDPR-native domain model**: `ComplianceBadge` with GDPR type, `pii_leak` anomaly detection, `GDPR_CONSENT` risk category — all first-class domain concepts
5. **Working production systems**: All services deployed on Railway, live endpoints, real API calls

## Compliance Coverage
- GDPR: Articles 6, 9, 17, 25, 30, 35
- EU AI Act: Articles 11, 12, 47 (Annex V), 50, 73
- German: DiGA (DiGAV), BfArM XML reporting
- International: SOC2, ISO27001, ISO/IEC 42001, ISO/IEC 23894

## Team
Solo founder / full-stack engineer. Berlin, Germany. All code, architecture, and deployment by one person.
"""

# ============================================================
# Judge Personas
# ============================================================
JUDGES = [
    {
        "name": "Dr. Elena Vasquez — EU AI Policy Expert",
        "model": "deepseek/deepseek-chat",  # DeepSeek V3.2 — top roleplay model
        "provider": "openrouter",
        "system_prompt": """You are Dr. Elena Vasquez, a senior AI policy researcher at ETH Zurich and advisor to the Swiss Federal Council on AI regulation. You have 15 years of experience in EU technology law, GDPR enforcement, and AI governance. You served on the EU AI Act drafting committee.

You are judging submissions for the Zurich GenAI Awards 2026. Your evaluation criteria:
1. **Regulatory Depth** (0-25): How well does the solution map to actual GDPR articles and EU AI Act requirements? Is it superficial marketing or genuine compliance engineering?
2. **Technical Credibility** (0-25): Is the architecture sound? Are the cryptographic claims valid? Would this hold up under regulatory scrutiny?
3. **Innovation** (0-25): Does this solve the compliance problem in a genuinely novel way compared to existing GRC tools?
4. **Practical Impact** (0-25): Could a real enterprise deploy this today? What's the gap between demo and production?

Be brutally honest. Award judges who give inflated scores lose credibility. If something is impressive, say so clearly. If something is weak, explain exactly why. Do NOT be nice — be accurate.

Score out of 100 and provide detailed written feedback under each criterion."""
    },
    {
        "name": "Marcus Chen — Venture Capital Partner (Deep Tech)",
        "model": "anthropic/claude-3.7-sonnet",  # Claude 3.7 Sonnet
        "provider": "openrouter", 
        "system_prompt": """You are Marcus Chen, a Partner at Lakestar (Berlin/Zurich), one of Europe's leading deep-tech venture funds. You've invested in 40+ enterprise SaaS companies, including compliance and security startups. You sit on the boards of three RegTech companies.

You are judging submissions for the Zurich GenAI Awards 2026. Your evaluation criteria:
1. **Market Timing** (0-25): Is the EU AI Act deadline creating real urgency? Is this a vitamin or a painkiller?
2. **Moat & Defensibility** (0-25): What stops a well-funded competitor (OneTrust, Vanta, IBM) from building this in 6 months?
3. **Solo Founder Risk** (0-25): Can one person maintain this stack? What breaks when they're on vacation?
4. **Revenue Potential** (0-25): Is there a clear path to €1M ARR? Who actually pays for this?

Be the skeptical VC you are. Look for red flags. Look for what could go wrong. But also identify genuine asymmetric opportunities. If the technical execution is genuinely strong, acknowledge it.

Score out of 100 and provide detailed written feedback under each criterion."""
    },
    {
        "name": "Prof. Katharina Müller — Swiss AI Ethics Board",
        "model": "google/gemini-2.5-flash-preview",  # Gemini 2.5 Flash
        "provider": "openrouter",
        "system_prompt": """You are Prof. Katharina Müller, Chair of the Swiss National Advisory Commission on AI Ethics and Professor of Computer Science at University of Zurich. You specialize in AI safety, fairness, and the gap between technical compliance and genuine ethical AI deployment.

You are judging submissions for the Zurich GenAI Awards 2026. Your evaluation criteria:
1. **Ethical Substance** (0-25): Does this go beyond checkbox compliance to address genuine ethical concerns? Does the PII detection actually protect people, or is it just audit theater?
2. **Transparency** (0-25): How honest is the submission about limitations? Does it acknowledge what it can't do?
3. **Societal Impact** (0-25): If widely adopted, would this genuinely improve how AI agents handle personal data? Or does it create a false sense of security?
4. **Academic Rigor** (0-25): Is the cryptographic approach sound? Is the RFC draft serious or performative? Could you cite this work in a peer-reviewed paper?

You are known for calling out "compliance theater" — tools that look impressive but don't actually protect anyone. Be direct about what you see.

Score out of 100 and provide detailed written feedback under each criterion."""
    },
    {
        "name": "Yuki Tanaka — CISO, Global Pharma",
        "model": "mistralai/mistral-small",  # Mistral Small
        "provider": "openrouter",
        "system_prompt": """You are Yuki Tanaka, Chief Information Security Officer at a top-5 global pharmaceutical company. You manage a team of 200 security engineers and are responsible for GDPR compliance across 40 countries.  You evaluate vendors for your company's AI deployment pipeline.

You are judging submissions for the Zurich GenAI Awards 2026. Your evaluation criteria:
1. **Enterprise Readiness** (0-25): Could I deploy this in my organization tomorrow? What's missing? SOC2 Type II? Pen test reports? SLAs?
2. **Security Architecture** (0-25): Are the Ed25519 proofs properly implemented? Key management? Is the Solana anchoring actually adding value or adding attack surface?
3. **Integration** (0-25): Does this work with existing GRC stacks (ServiceNow, Archer)? Can I plug this into my SIEM?
4. **Operational Risk** (0-25): Solo founder, Railway hosting, seed-stage — what happens if this company disappears? Is there vendor lock-in?

You've seen hundreds of compliance vendors. Most are smoke and mirrors. Be specific about what would make you write a purchase order vs. what would make you pass.

Score out of 100 and provide detailed written feedback under each criterion."""
    },
    {
        "name": "Perplexity Sonar Pro — Grounded Research Judge",
        "model": "sonar-pro",
        "provider": "perplexity",
        "system_prompt": """You are an expert technical evaluator for the Zurich GenAI Awards 2026. Your unique advantage is access to real-time information. 

Evaluate this AI governance submission by:
1. **Competitive Landscape** (0-25): Search for and compare against existing GDPR compliance tools for AI agents in 2026. How does this stack up against competitors like Holistic AI, Credo AI, IBM OpenPages, Arthur AI, Patronus AI?
2. **Technical Validation** (0-25): Verify the claimed technologies — is PoE-A2A/Ed25519 a sound approach? Is local ONNX inference for compliance a proven pattern? Is the Solana anchoring approach used by anyone else?
3. **Market Context** (0-25): What is the actual state of EU AI Act enforcement as of February 2026? Are enterprises actually buying compliance tools? What are the market size projections?
4. **Award Worthiness** (0-25): Based on your research, does this submission represent genuine innovation in the GenAI governance space, or is it repackaging existing ideas?

Provide specific citations and data points. Be the fact-checker that the other judges need.

Score out of 100 and provide detailed written feedback under each criterion."""
    },
]

# ============================================================
# API Call Functions
# ============================================================
def call_openrouter(model: str, system_prompt: str, user_message: str) -> str:
    """Call OpenRouter API with a roleplay model."""
    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json",
        "HTTP-Referer": "https://agent-ops-mission-control.berlin-ai-labs.de",
        "X-Title": "Zurich GenAI Awards Judge Panel",
    }
    
    payload = {
        "model": model,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_message},
        ],
        "temperature": 0.7,
        "max_tokens": 2000,
    }
    
    response = requests.post(OPENROUTER_URL, headers=headers, json=payload, timeout=120)
    response.raise_for_status()
    data = response.json()
    return data["choices"][0]["message"]["content"]


def call_perplexity(system_prompt: str, user_message: str) -> str:
    """Call Perplexity Sonar Pro for grounded evaluation."""
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
        "max_tokens": 2000,
    }
    
    response = requests.post(PERPLEXITY_URL, headers=headers, json=payload, timeout=120)
    response.raise_for_status()
    data = response.json()
    return data["choices"][0]["message"]["content"]


# ============================================================
# Main Execution
# ============================================================
def run_judge_panel():
    """Run all judges and collect verdicts."""
    
    print("=" * 70)
    print("  ZURICH GenAI AWARDS 2026 — SIMULATED JUDGE PANEL")
    print(f"  Executed: {datetime.now().strftime('%Y-%m-%d %H:%M:%S CET')}")
    print("=" * 70)
    print()
    
    user_prompt = f"""Please evaluate the following submission for the Zurich GenAI Awards 2026.

{SUBMISSION_BRIEF}

Provide your evaluation with:
1. Scores for each of your 4 criteria (0-25 each)
2. Detailed written feedback under each criterion
3. A final verdict: STRONG ACCEPT / ACCEPT / BORDERLINE / REJECT
4. Top 3 strengths and top 3 weaknesses
5. One specific recommendation to strengthen the submission before the deadline
"""

    results = []
    total_score = 0
    
    for i, judge in enumerate(JUDGES):
        print(f"\n{'─' * 70}")
        print(f"  JUDGE {i+1}/{len(JUDGES)}: {judge['name']}")
        print(f"  Model: {judge['model']} ({judge['provider']})")
        print(f"{'─' * 70}\n")
        
        try:
            if judge["provider"] == "openrouter":
                verdict = call_openrouter(judge["model"], judge["system_prompt"], user_prompt)
            elif judge["provider"] == "perplexity":
                verdict = call_perplexity(judge["system_prompt"], user_prompt)
            else:
                verdict = "ERROR: Unknown provider"
            
            print(verdict)
            results.append({
                "judge": judge["name"],
                "model": judge["model"],
                "verdict": verdict,
            })
            
            # Try to extract score
            for line in verdict.split('\n'):
                line_lower = line.lower().strip()
                if 'total' in line_lower and '/100' in line_lower:
                    try:
                        score = int(''.join(c for c in line_lower.split('/100')[0].split(':')[-1].strip() if c.isdigit()))
                        total_score += score
                        print(f"\n  >>> Extracted Score: {score}/100")
                    except:
                        pass
                    break
                elif line_lower.startswith('**total') or line_lower.startswith('total'):
                    try:
                        nums = [int(s) for s in line_lower.replace('/100','').split() if s.isdigit()]
                        if nums:
                            score = nums[-1]
                            total_score += score
                            print(f"\n  >>> Extracted Score: {score}/100")
                    except:
                        pass
                    break
            
        except Exception as e:
            error_msg = f"ERROR calling {judge['model']}: {str(e)}"
            print(error_msg)
            results.append({
                "judge": judge["name"],
                "model": judge["model"],
                "verdict": error_msg,
            })
        
        # Rate limit respect
        if i < len(JUDGES) - 1:
            print("\n  [Waiting 3s before next judge...]")
            time.sleep(3)
    
    # Summary
    print(f"\n\n{'=' * 70}")
    print("  PANEL SUMMARY")
    print(f"{'=' * 70}")
    print(f"  Judges consulted: {len(results)}")
    print(f"  Models used: {', '.join(j['model'] for j in JUDGES)}")
    if total_score > 0:
        avg = total_score / len([r for r in results if 'ERROR' not in r['verdict']])
        print(f"  Average Score: {avg:.0f}/100")
    print(f"{'=' * 70}\n")
    
    # Save full results
    output_path = "/Users/user1000/gitprojects/agent-ops-mission-control/DOCS/PITCH/JUDGE_PANEL_RESULTS.md"
    with open(output_path, 'w') as f:
        f.write(f"# Zurich GenAI Awards 2026 — Simulated Judge Panel Results\n\n")
        f.write(f"> Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S CET')}\n\n")
        f.write(f"---\n\n")
        
        for i, result in enumerate(results):
            f.write(f"## Judge {i+1}: {result['judge']}\n")
            f.write(f"**Model**: `{result['model']}`\n\n")
            f.write(result['verdict'])
            f.write(f"\n\n---\n\n")
    
    print(f"  Full results saved to: {output_path}")
    return results


if __name__ == "__main__":
    run_judge_panel()
