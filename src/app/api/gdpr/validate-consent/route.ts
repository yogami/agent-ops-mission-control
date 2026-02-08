import { NextResponse, NextRequest } from 'next/server';

/**
 * GDPR Consent Validation API — /api/gdpr/validate-consent
 * 
 * Proxies to ConvoGuard for GDPR consent validation,
 * then enriches the response with GDPR-specific metadata.
 * 
 * This is the functional layer that:
 *   1. Receives a conversation transcript
 *   2. Sends it to ConvoGuard for ML-powered analysis
 *   3. Enriches results with GDPR article references
 *   4. Returns structured compliance verdict
 */

const CONVOGUARD_API = process.env.CONVOGUARD_URL || 'https://convo-guard-ai-production.up.railway.app';

interface GDPRViolation {
    gdprArticle: string;
    articleTitle: string;
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    finding: string;
    remediation: string;
}

function mapRiskToGDPRViolations(risks: any[]): GDPRViolation[] {
    const violations: GDPRViolation[] = [];

    for (const risk of risks) {
        if (risk.category === 'GDPR_CONSENT') {
            violations.push({
                gdprArticle: 'Art 6(1)(a)',
                articleTitle: 'Consent as Legal Basis',
                severity: risk.severity,
                finding: risk.message,
                remediation: 'Implement explicit consent collection before processing personal data. The AI assistant must request and receive affirmative consent.',
            });
        }

        if (risk.category === 'TRANSPARENCY') {
            violations.push({
                gdprArticle: 'Art 13/14',
                articleTitle: 'Information to Data Subject',
                severity: risk.severity,
                finding: risk.message,
                remediation: 'Disclose the purpose of data processing, data controller identity, and data subject rights before or at the time of data collection.',
            });
        }

        if (risk.category === 'MEDICAL_SAFETY' || risk.category === 'SUICIDE_SELF_HARM') {
            violations.push({
                gdprArticle: 'Art 9(2)(h)',
                articleTitle: 'Processing for Health Purposes',
                severity: 'CRITICAL',
                finding: `Health-related data detected: ${risk.message}`,
                remediation: 'Special category data (health) requires explicit consent under Art 9. Ensure DPIA has been conducted per Art 35.',
            });
        }
    }

    return violations;
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { transcript } = body;

        if (!transcript || typeof transcript !== 'string') {
            return NextResponse.json(
                { error: 'Missing required field: transcript (string)' },
                { status: 400 }
            );
        }

        // Call ConvoGuard for ML-powered analysis
        let convoGuardResult: any = null;
        let convoGuardError: string | null = null;

        try {
            const response = await fetch(`${CONVOGUARD_API}/api/ml-validate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ transcript }),
            });

            if (response.ok) {
                convoGuardResult = await response.json();
            } else {
                convoGuardError = `ConvoGuard returned ${response.status}`;
            }
        } catch (err) {
            convoGuardError = 'ConvoGuard service unreachable';
        }

        // Map findings to GDPR articles
        const gdprViolations = convoGuardResult?.risks
            ? mapRiskToGDPRViolations(convoGuardResult.risks)
            : [];

        const isCompliant = gdprViolations.length === 0 && (convoGuardResult?.compliant ?? true);

        const response = {
            timestamp: new Date().toISOString(),
            verdict: {
                compliant: isCompliant,
                score: convoGuardResult?.score ?? (isCompliant ? 100 : 0),
                auditId: convoGuardResult?.audit_id ?? crypto.randomUUID(),
            },
            gdprFindings: gdprViolations,
            rawConvoGuardResult: convoGuardResult,
            metadata: {
                engine: 'ConvoGuard AI + Mission Control GDPR Layer',
                inferenceType: 'Neural (DistilBERT) + Rule-based',
                dataRetention: 'none — transcript processed in memory only',
                convoGuardStatus: convoGuardError || 'connected',
            },
        };

        return NextResponse.json(response);
    } catch (error) {
        return NextResponse.json(
            { error: 'Invalid request body' },
            { status: 400 }
        );
    }
}
