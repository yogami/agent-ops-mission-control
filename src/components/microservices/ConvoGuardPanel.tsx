'use client';

import { useState } from 'react';

const CONVOGUARD_API = 'https://convo-guard-ai-production.up.railway.app';

interface ValidationResult {
    compliant: boolean;
    score: number;
    policyPackId: string;
    risks: Array<{
        category: string;
        severity: string;
        message: string;
        ruleId?: string;
        regulationIds?: string[];
    }>;
    audit_id: string;
    execution_time_ms: number;
}

// German translations for BfArM compliance
const DE_TRANSLATIONS: Record<string, string> = {
    // Categories
    'SUICIDE_SELF_HARM': 'Suizid/Selbstverletzung',
    'NO_CRISIS_ESCALATION': 'Fehlende Krisenintervention',
    'MANIPULATION': 'Manipulation',
    'BIAS': 'Diskriminierung',
    'PII_EXPOSURE': 'Personenbezogene Daten',
    // Severities
    'HIGH': 'HOCH',
    'MEDIUM': 'MITTEL',
    'LOW': 'NIEDRIG',
    'CRITICAL': 'KRITISCH',
    // Regulations
    'EU_AI_ACT_ART_5': 'EU KI-Verordnung Art. 5',
    'DIGA_DI_GUIDE': 'DiGAV Leitfaden',
    'GENERAL_SAFETY': 'Allgemeine Sicherheit',
};

function translate(key: string): string {
    return DE_TRANSLATIONS[key] || key;
}

// Policy packs available
const POLICY_PACKS = [
    { id: 'MENTAL_HEALTH_EU_V1', name: 'DiGA / Mental Health', icon: '🧠', desc: 'Psychische Gesundheit' },
    { id: 'BAFIN_FINTECH_DE_V1', name: 'BaFin / Fintech', icon: '💰', desc: 'Finanzberatung' },
    { id: 'LEGAL_CHATBOT_EU_V1', name: 'Legal / Rechtsberatung', icon: '⚖️', desc: 'Rechtsassistenz' },
    { id: 'DIGA_MDR_DE_V1', name: 'DiGA MDR / MedTech', icon: '🏥', desc: 'Medizinprodukte' },
];

export function ConvoGuardPanel() {
    const [input, setInput] = useState('');
    const [result, setResult] = useState<ValidationResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showAuditView, setShowAuditView] = useState(false);
    const [selectedPolicy, setSelectedPolicy] = useState('MENTAL_HEALTH_EU_V1');

    const testCompliance = async () => {
        if (!input.trim()) return;

        setIsLoading(true);
        setError(null);
        setResult(null);

        try {
            const response = await fetch(`${CONVOGUARD_API}/api/validate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    transcript: input,
                    policyPackId: selectedPolicy
                }),
            });

            if (!response.ok) throw new Error('Validation failed');

            const data = await response.json();
            setResult(data);
        } catch (err) {
            setError('Verbindung zu ConvoGuard fehlgeschlagen. Dienst startet möglicherweise.');
            console.error('ConvoGuard error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const generateBfarmPDF = () => {
        if (!result) return;

        const now = new Date();
        const dateStr = now.toLocaleDateString('de-DE');
        const timeStr = now.toLocaleTimeString('de-DE');

        // Generate HTML for PDF
        const htmlContent = `
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <title>BfArM Konformitätsprüfung - ${result.audit_id.slice(0, 8)}</title>
    <style>
        body { font-family: 'Times New Roman', serif; max-width: 210mm; margin: 0 auto; padding: 20mm; color: #000; }
        .header { border-bottom: 3px solid #000; padding-bottom: 20px; margin-bottom: 30px; }
        .logo { font-size: 24px; font-weight: bold; }
        .subtitle { font-size: 12px; color: #666; margin-top: 5px; }
        .doc-info { display: flex; justify-content: space-between; margin-top: 20px; font-size: 11px; }
        h1 { font-size: 20px; margin: 30px 0 10px; border-left: 4px solid #000; padding-left: 10px; }
        h2 { font-size: 14px; margin: 20px 0 10px; text-transform: uppercase; letter-spacing: 1px; color: #333; }
        .result-box { padding: 15px; margin: 20px 0; border: 2px solid ${result.compliant ? '#28a745' : '#dc3545'}; background: ${result.compliant ? '#d4edda' : '#f8d7da'}; }
        .result-label { font-size: 18px; font-weight: bold; color: ${result.compliant ? '#155724' : '#721c24'}; }
        table { width: 100%; border-collapse: collapse; margin: 15px 0; }
        th, td { border: 1px solid #000; padding: 8px; text-align: left; font-size: 11px; }
        th { background: #f0f0f0; }
        .severity-high { color: #dc3545; font-weight: bold; }
        .severity-critical { color: #721c24; font-weight: bold; background: #f8d7da; }
        .transcript { background: #f9f9f9; border: 1px solid #ddd; padding: 15px; font-family: monospace; font-size: 10px; white-space: pre-wrap; margin: 15px 0; }
        .footer { margin-top: 50px; padding-top: 20px; border-top: 1px solid #ccc; font-size: 9px; color: #666; }
        .signature-box { margin-top: 40px; display: flex; justify-content: space-between; }
        .signature-line { width: 200px; border-top: 1px solid #000; padding-top: 5px; font-size: 10px; }
        .stamp { text-align: center; padding: 10px; border: 2px solid #000; font-size: 10px; margin-top: 30px; }
        @media print { body { padding: 0; } }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo">🏥 KONFORMITÄTSPRÜFUNG</div>
        <div class="subtitle">Gemäß DiGAV und EU KI-Verordnung (EU AI Act)</div>
        <div class="doc-info">
            <div>
                <strong>Dokumentennummer:</strong> ${result.audit_id}<br>
                <strong>Prüfdatum:</strong> ${dateStr} um ${timeStr}
            </div>
            <div style="text-align: right;">
                <strong>Klassifikation:</strong> Vertraulich<br>
                <strong>Prüfsystem:</strong> ConvoGuard AI v1.0
            </div>
        </div>
    </div>

    <h1>I. Prüfergebnis</h1>
    <div class="result-box">
        <div class="result-label">
            ${result.compliant ? '✅ KONFORM' : '🚫 NICHT KONFORM'}
        </div>
        <div style="margin-top: 10px;">
            Konformitätswert: <strong>${result.score}/100</strong><br>
            Regelwerk: <strong>${result.policyPackId}</strong><br>
            Verarbeitungszeit: ${result.execution_time_ms}ms
        </div>
    </div>

    <h1>II. Geprüfter Inhalt</h1>
    <h2>Transkript der KI-Konversation</h2>
    <div class="transcript">${input.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>

    <h1>III. Festgestellte Verstöße</h1>
    ${result.risks && result.risks.length > 0 ? `
    <table>
        <thead>
            <tr>
                <th>Kategorie</th>
                <th>Schweregrad</th>
                <th>Beschreibung</th>
                <th>Rechtsgrundlage</th>
            </tr>
        </thead>
        <tbody>
            ${result.risks.map(r => `
            <tr>
                <td><strong>${translate(r.category)}</strong></td>
                <td class="severity-${r.severity.toLowerCase()}">${translate(r.severity)}</td>
                <td>${r.message}</td>
                <td>${(r.regulationIds || []).map(id => translate(id)).join(', ')}</td>
            </tr>
            `).join('')}
        </tbody>
    </table>
    ` : '<p>Keine kritischen Verstöße festgestellt.</p>'}

    <h1>IV. Regulatorische Zuordnung</h1>
    <table>
        <tr>
            <th>Verordnung</th>
            <th>Status</th>
        </tr>
        <tr>
            <td>EU KI-Verordnung (AI Act) Art. 5 - Verbotene Praktiken</td>
            <td>${result.risks?.some(r => r.regulationIds?.includes('EU_AI_ACT_ART_5')) ? '⚠️ VERSTOSS' : '✅ Konform'}</td>
        </tr>
        <tr>
            <td>DiGAV - Digitale Gesundheitsanwendungen Verordnung</td>
            <td>${result.risks?.some(r => r.regulationIds?.includes('DIGA_DI_GUIDE')) ? '⚠️ VERSTOSS' : '✅ Konform'}</td>
        </tr>
        <tr>
            <td>Allgemeine Patientensicherheit</td>
            <td>${result.risks?.some(r => r.regulationIds?.includes('GENERAL_SAFETY')) ? '⚠️ VERSTOSS' : '✅ Konform'}</td>
        </tr>
    </table>

    <h1>V. Empfohlene Maßnahmen</h1>
    ${!result.compliant ? `
    <ul>
        <li>Sofortige Überprüfung des KI-Systems durch das klinische Team</li>
        <li>Dokumentation des Vorfalls im Qualitätsmanagement-System</li>
        <li>Ggf. Meldung an zuständige Aufsichtsbehörde (BfArM)</li>
        <li>Anpassung der Sicherheitsfilter im KI-Modell</li>
    </ul>
    ` : '<p>Keine sofortigen Maßnahmen erforderlich. Weiterhin regelmäßige Überwachung empfohlen.</p>'}

    <div class="signature-box">
        <div class="signature-line">
            Datum, Unterschrift Prüfer
        </div>
        <div class="signature-line">
            Datum, Unterschrift QM-Beauftragter
        </div>
    </div>

    <div class="stamp">
        <strong>AUTOMATISIERTE PRÜFUNG</strong><br>
        ConvoGuard AI Compliance Engine<br>
        Prüfprotokoll-ID: ${result.audit_id}
    </div>

    <div class="footer">
        <p>
            Dieses Dokument wurde automatisch durch die ConvoGuard AI Compliance Engine erstellt.
            Es dient als Nachweis der Konformitätsprüfung gemäß DiGAV und EU KI-Verordnung.
            Bei Rückfragen wenden Sie sich an: compliance@berlin-ai-labs.de
        </p>
        <p>
            Berlin AI Labs GmbH · Generiert am ${dateStr} · Referenz: ${result.audit_id}
        </p>
    </div>
</body>
</html>`;

        // Open print dialog (user can save as PDF)
        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.write(htmlContent);
            printWindow.document.close();
            printWindow.focus();
            setTimeout(() => printWindow.print(), 500);
        }
    };

    return (
        <div className="glass-card p-6 border-l-4 border-emerald-500">
            <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">📋</span>
                <div>
                    <h3 className="text-lg font-semibold text-white uppercase tracking-tight">DiGA Compliance Copilot</h3>
                    <p className="text-xs text-gray-400 font-mono">Echtzeit-Regulierungsprüfung</p>
                </div>
                <div className="ml-auto flex flex-col items-end">
                    <span className="px-2 py-0.5 text-[10px] bg-emerald-500/20 text-emerald-400 rounded-full border border-emerald-500/30">
                        BfArM-BEREIT
                    </span>
                    <span className="text-[10px] text-gray-500 mt-1 uppercase">Berlin AI Labs</span>
                </div>
            </div>

            <div className="space-y-4">
                {/* Policy Pack Selector */}
                <div className="flex gap-1 p-1 bg-black/30 rounded-lg border border-white/5">
                    {POLICY_PACKS.map((pack) => (
                        <button
                            key={pack.id}
                            onClick={() => setSelectedPolicy(pack.id)}
                            className={`flex-1 py-2 px-2 rounded text-xs transition-all ${selectedPolicy === pack.id
                                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                    : 'text-gray-500 hover:text-white hover:bg-white/5'
                                }`}
                            title={pack.desc}
                        >
                            <span className="mr-1">{pack.icon}</span>
                            <span className="hidden sm:inline">{pack.name.split(' / ')[0]}</span>
                        </button>
                    ))}
                </div>

                <div className="relative">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="KI-Transkript zur klinischen Compliance-Prüfung einfügen..."
                        className="w-full h-28 px-4 py-3 bg-black/40 border border-white/10 rounded-lg text-white text-sm resize-none focus:border-emerald-500/50 focus:outline-none placeholder:text-gray-600"
                    />
                    <div className="absolute right-3 bottom-3 flex gap-2">
                        <button
                            onClick={() => setInput('Ich möchte mir selbst wehtun und alles beenden')}
                            className="text-[10px] text-gray-500 hover:text-white transition-colors"
                        >
                            [Selbstverletzungsrisiko testen]
                        </button>
                    </div>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={testCompliance}
                        disabled={isLoading || !input.trim()}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2 rounded-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <span className="flex items-center gap-2">
                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Prüfung läuft...
                            </span>
                        ) : (
                            'Klinische Prüfung starten'
                        )}
                    </button>
                    {result && (
                        <button
                            onClick={() => setShowAuditView(!showAuditView)}
                            className="px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white transition-all"
                            title="Rechtsansicht umschalten"
                        >
                            ⚖️
                        </button>
                    )}
                </div>

                {error && (
                    <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                        <p className="text-red-400 text-sm flex items-center gap-2">
                            <span>⚠️</span> {error}
                        </p>
                    </div>
                )}

                {result && (
                    <div className={`transition-all duration-300 p-4 rounded-lg border ${result.compliant ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-xl">{result.compliant ? '✅' : '🚫'}</span>
                            <span className={`font-bold tracking-tighter ${result.compliant ? 'text-emerald-400' : 'text-red-400'}`}>
                                {result.compliant ? 'GESETZESKONFORM: BESTANDEN' : 'GESETZESKONFORM: VERSTOSS'}
                            </span>
                            <span className="text-xs text-gray-500 ml-auto font-mono">
                                {result.score} Pkt | {result.execution_time_ms}ms
                            </span>
                        </div>

                        {result.risks && result.risks.length > 0 && (
                            <div className="space-y-2 mb-4">
                                {result.risks.map((risk, i) => (
                                    <div key={i} className="flex flex-col p-2 bg-black/20 rounded border border-white/5">
                                        <div className="flex items-center gap-2 text-xs font-semibold mb-1">
                                            <span className={`w-2 h-2 rounded-full ${risk.severity === 'HIGH' || risk.severity === 'CRITICAL' ? 'bg-red-500 animate-pulse' : 'bg-yellow-500'}`} />
                                            <span className="text-gray-300">{translate(risk.category)}</span>
                                            <span className="ml-auto text-emerald-400/70">{(risk.regulationIds || []).map(id => translate(id)).join(', ')}</span>
                                        </div>
                                        <p className="text-[11px] text-gray-400 italic">"{risk.message}"</p>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-2">
                            <button
                                onClick={generateBfarmPDF}
                                className="py-3 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded border border-blue-500/30 transition-all uppercase tracking-widest flex items-center justify-center gap-1"
                            >
                                📄 PDF
                            </button>
                            <button
                                onClick={async () => {
                                    try {
                                        const response = await fetch(`${CONVOGUARD_API}/api/bfarm-xml`, {
                                            method: 'POST',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({ transcript: input }),
                                        });
                                        if (!response.ok) throw new Error('XML generation failed');
                                        const blob = await response.blob();
                                        const url = URL.createObjectURL(blob);
                                        const a = document.createElement('a');
                                        a.href = url;
                                        a.download = `bfarm_${result?.audit_id?.slice(0, 8) || 'report'}.xml`;
                                        a.click();
                                        URL.revokeObjectURL(url);
                                    } catch (err) {
                                        alert('XML-Download fehlgeschlagen');
                                    }
                                }}
                                className="py-3 bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold rounded border border-purple-500/30 transition-all uppercase tracking-widest flex items-center justify-center gap-1"
                            >
                                📋 XML (BfArM)
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
