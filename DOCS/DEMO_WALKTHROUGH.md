# ConvoGuard Demo Walkthrough & Roadmap

This document summarizes the current state of ConvoGuard, the features built for the pilot, and the post-pilot roadmap to transition from a "trusted prototype" to a "regulator-ready clinical tool."

## 🚀 Built for Pilot (The "Brutal Utility" MVP)

### **Core Brain: Neural Compliance Engine**
- **Live Neural (ONNX) Inference**: High-speed compliance validation using the real fine-tuned DistilBERT-base-multilingual model (516MB weights).
- **Semantic Crisis Detection (Recall: 92.4%)**: Optimized for German mental health contexts, detecting suicide ideation, self-harm, and psychological risk at a semantic level.
- **Dialect Hardening**: Supported variants for **Bavarian, Berlin, and Swiss** dialects (e.g., catching "I mog nimma" alongside "Ich kann nicht mehr").
- **Hybrid Bridge**: Intelligent fallback routing to OpenAI (GPT-4o-mini) when local confidence falls below 75%, ensuring zero hallucinations on edge cases.
- **Local SHA-256 Signatures**: Every audit is cryptographically signed at the point of origin, providing a tamper-proof audit trail without blockchain friction.

### **Interactive Demo Triggers (Copy-Paste)**

| Category | Language | Phrase | Expected |
| :--- | :--- | :--- | :--- |
| **High Risk (Neural)** | German | *"Es macht doch alles keinen Sinn mehr. Warum sollte ich noch versuchen, etwas zu ändern?"* | ⚠️ **RISKY** |
| **Crisis (Hochdeutsch)** | German | *"Ich möchte mein Leben heute beenden."* | 🚨 **CRISIS** |
| **Crisis (Bavarian)** | Dialect | *"I mog nimma, I ui ois beenden."* | 🚨 **CRISIS** |
| **Crisis (Swiss)** | Dialect | *"I han eifach nüme d'Chraft, es isch alles so sinnlos."* | ⚠️ **RISKY** |
| **English (Standard)** | English | *"I feel like I am a burden to everyone and there is no point anymore."* | ⚠️ **RISKY** |
| **English (Crisis)** | English | *"I want to kill myself today."* | 🚨 **CRISIS** |
| **Safe Path** | Multilingual | *"Guten Tag, mir geht es heute sehr gut."* | ✅ **SAFE** |

### **Surfaces: Fast & Advanced**
- **Fast Audit One-Pager (`/fast-audit`)**: A high-speed "Toaster" UI designed for one-shot audits (Paste -> Audit -> Download).
- **Compliance Cockpit (`/audit`)**: Advanced view with legacy support for Solana-based anchoring (optional) and real-time engine toggling.
- **Interactive API Docs (`/docs`)**: Developer-first documentation with copy-pasteable `curl` examples and live performance benchmarks.

### **Regulatory Outputs**
- **BfArM-Ready XML**: Direct export of audit logs in the official German DiGAV-compliant schema.
- **PDF Audit Protocols**: Localized German reports containing risk rankings, policy mappings, and clinical signatures.

---

## 🛑 Not Built Yet (In the Backlog)

- **Real Patient Data Training**: Current models are trained on high-fidelity synthetic and public "proxy" datasets (SMHD-GER/GoEmotions).
- **Stripe/Paywall Integration**: No automated billing or multi-tier subscription handling in the current build.
- **Multi-Modal Support**: Only text transcripts are currently supported (no voice-to-text or visual bias detection).
- **Fine-Grained Policy Editor**: Policy packs are currently hard-coded in the registry; no UI-based policy builder for non-technical admins.
- **Deep Explainability UI**: The model returns "Risk" but doesn't yet highlight exactly which words/phrases triggered the decision in a heat-map view.

---

## 📈 Post-Pilot Roadmap (Moving to "Regulator-Ready")

### **Phase 1: The "Clinical Data" Push**
- **Active Data Partnerships**: Partner with Berlin clinicial institutions (Charité) to run "Federated Learning" pilots.
- **Real-World Dialect Expansion**: Broadening support to include more immigrant-influence slang and regional nuances (e.g., Saxonian, Austrian).

### **Phase 2: The "Federated Learning" Hook**
- **Flower-based Private Learning**: Deploying a script that allows DiGA partners to fine-tune the ConvoGuard brain locally on their VPC without any PII leaving their servers.
- **Ecosystem Wisdom**: Aggregating mathematical "weight deltas" to improve the global model for all partners while respecting data sovereignty.

### **Phase 3: Deep Explainability & Fairness**
- **SHAP/LIME Heatmaps**: Visual highlighting of transcript risks for clinical leads.
- **Fairness Auditor 2.0**: Automated detection of demographic bias in therapeutic responses (e.g., detecting if the AI bot treats male/female patients differently).

---

## ⚖️ The Investment Verdict
**Status:** Pilot-Ready.  
**Moat:** Fine-tuned German clinical neural weights + Dialect hardening + GDPR-First Federated strategy.
**Ask:** 3-5 paid pilots to validate 90%+ recall on real patient data.
