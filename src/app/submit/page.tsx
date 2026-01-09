/**
 * Agent Submission Page
 * 
 * Multi-step form for vendors to submit agents for vetting.
 * Steps: Details → Compliance Declaration → Confirmation
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';

type Step = 1 | 2 | 3;
type ComplianceBadgeType = 'GDPR' | 'AI_ACT' | 'DIGA' | 'DATA_RESIDENCY_EU' | 'SOC2' | 'ISO27001';

interface FormData {
    name: string;
    description: string;
    endpointUrl: string;
    category: 'compliance' | 'governance' | 'content' | 'utility';
    claimedBadges: ComplianceBadgeType[];
    tosAccepted: boolean;
}

export default function SubmitPage() {
    const [step, setStep] = useState<Step>(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [formData, setFormData] = useState<FormData>({
        name: '',
        description: '',
        endpointUrl: '',
        category: 'utility',
        claimedBadges: [],
        tosAccepted: false,
    });

    const handleBadgeToggle = (badge: ComplianceBadgeType) => {
        setFormData(prev => ({
            ...prev,
            claimedBadges: prev.claimedBadges.includes(badge)
                ? prev.claimedBadges.filter(b => b !== badge)
                : [...prev.claimedBadges, badge],
        }));
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        setSubmitError('');

        try {
            const response = await fetch('/api/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Submission failed');
            }

            setSubmitSuccess(true);
        } catch (err) {
            setSubmitError(err instanceof Error ? err.message : 'Submission failed');
        } finally {
            setIsSubmitting(false);
        }
    };

    const isStep1Valid = formData.name.trim().length > 0;
    const isStep2Valid = formData.claimedBadges.length > 0;
    const isStep3Valid = formData.tosAccepted;

    if (submitSuccess) {
        return (
            <main className="min-h-screen py-12 px-6">
                <div className="max-w-2xl mx-auto text-center">
                    <div className="text-7xl mb-6">✅</div>
                    <h1 className="text-3xl font-bold text-white mb-4">Agent Submitted!</h1>
                    <p className="text-gray-400 mb-8">
                        Your agent has been submitted for vetting. Our automated pipeline will verify compliance with your claimed certifications.
                    </p>
                    <div className="glass-card p-6 mb-8 text-left">
                        <h3 className="text-lg font-semibold text-white mb-4">Vetting Pipeline Status</h3>
                        <div className="space-y-3">
                            {['Trust Verifier', 'Fairness Auditor', 'ConvoGuard Check', 'Scorecard Generation'].map((stage, i) => (
                                <div key={stage} className="flex items-center gap-3">
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${i === 0 ? 'bg-amber-500 animate-pulse' : 'bg-gray-700'}`}>
                                        {i === 0 ? '⏳' : '⏸️'}
                                    </div>
                                    <span className={i === 0 ? 'text-white' : 'text-gray-500'}>{stage}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <Link href="/discover" className="btn-primary">Back to Registry</Link>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen py-12 px-6">
            <div className="max-w-2xl mx-auto">
                <Link href="/discover" className="text-sm text-gray-500 hover:text-[var(--primary)] mb-4 inline-block">
                    ← Back to Discovery
                </Link>
                <h1 className="text-4xl font-bold text-white mb-2">
                    Submit Your <span className="gradient-text">Agent</span>
                </h1>
                <p className="text-gray-400 mb-8">
                    Register your AI agent in the EU Compliance Agent Registry. All submissions undergo automated vetting.
                </p>

                {/* Progress Steps */}
                <div className="flex items-center gap-4 mb-12">
                    {[1, 2, 3].map((s) => (
                        <div key={s} className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step === s ? 'bg-[var(--primary)] text-black' :
                                    step > s ? 'bg-emerald-500 text-white' : 'bg-[var(--surface-2)] text-gray-500'
                                }`}>
                                {step > s ? '✓' : s}
                            </div>
                            <span className={step === s ? 'text-white' : 'text-gray-500'}>
                                {s === 1 ? 'Details' : s === 2 ? 'Compliance' : 'Confirm'}
                            </span>
                            {s < 3 && <div className="w-12 h-0.5 bg-[var(--border)]" />}
                        </div>
                    ))}
                </div>

                {/* Step 1: Agent Details */}
                {step === 1 && (
                    <div className="glass-card p-6">
                        <h2 className="text-xl font-semibold text-white mb-6">Agent Details</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Agent Name *</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="e.g., My Compliance Agent"
                                    className="w-full px-4 py-3 bg-[var(--surface-2)] border border-[var(--border)] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[var(--primary)]"
                                    data-testid="input-name"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="What does your agent do?"
                                    rows={3}
                                    className="w-full px-4 py-3 bg-[var(--surface-2)] border border-[var(--border)] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[var(--primary)]"
                                    data-testid="input-description"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Endpoint URL</label>
                                <input
                                    type="url"
                                    value={formData.endpointUrl}
                                    onChange={(e) => setFormData({ ...formData, endpointUrl: e.target.value })}
                                    placeholder="https://your-agent.example.com"
                                    className="w-full px-4 py-3 bg-[var(--surface-2)] border border-[var(--border)] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[var(--primary)]"
                                    data-testid="input-endpoint"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Category</label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value as FormData['category'] })}
                                    className="w-full px-4 py-3 bg-[var(--surface-2)] border border-[var(--border)] rounded-lg text-white focus:outline-none focus:border-[var(--primary)]"
                                    data-testid="input-category"
                                >
                                    <option value="utility">Utility</option>
                                    <option value="compliance">Compliance</option>
                                    <option value="governance">Governance</option>
                                    <option value="content">Content</option>
                                </select>
                            </div>
                        </div>
                        <div className="mt-8 flex justify-end">
                            <button
                                onClick={() => setStep(2)}
                                disabled={!isStep1Valid}
                                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                                data-testid="btn-next-1"
                            >
                                Next: Compliance →
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 2: Compliance Declaration */}
                {step === 2 && (
                    <div className="glass-card p-6">
                        <h2 className="text-xl font-semibold text-white mb-2">Compliance Self-Declaration</h2>
                        <p className="text-gray-400 text-sm mb-6">Select the compliance certifications your agent claims. These will be verified during vetting.</p>
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { type: 'GDPR' as ComplianceBadgeType, label: 'GDPR', desc: 'EU Data Protection' },
                                { type: 'AI_ACT' as ComplianceBadgeType, label: 'EU AI Act', desc: 'Regulation 2024/1689' },
                                { type: 'DIGA' as ComplianceBadgeType, label: 'DiGA', desc: 'German Health Apps' },
                                { type: 'DATA_RESIDENCY_EU' as ComplianceBadgeType, label: 'EU Data Residency', desc: 'Data stored in EU' },
                                { type: 'SOC2' as ComplianceBadgeType, label: 'SOC2', desc: 'Security Controls' },
                                { type: 'ISO27001' as ComplianceBadgeType, label: 'ISO 27001', desc: 'Info Security' },
                            ].map((badge) => (
                                <button
                                    key={badge.type}
                                    onClick={() => handleBadgeToggle(badge.type)}
                                    data-testid={`badge-${badge.type}`}
                                    className={`p-4 rounded-lg border text-left transition-all ${formData.claimedBadges.includes(badge.type)
                                            ? 'border-[var(--primary)] bg-[var(--primary)]/10'
                                            : 'border-[var(--border)] bg-[var(--surface-2)] hover:border-[var(--primary)]/50'
                                        }`}
                                >
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className={formData.claimedBadges.includes(badge.type) ? 'text-[var(--primary)]' : 'text-gray-400'}>
                                            {formData.claimedBadges.includes(badge.type) ? '✓' : '○'}
                                        </span>
                                        <span className="font-medium text-white">{badge.label}</span>
                                    </div>
                                    <p className="text-xs text-gray-500">{badge.desc}</p>
                                </button>
                            ))}
                        </div>
                        <div className="mt-8 flex justify-between">
                            <button onClick={() => setStep(1)} className="btn-secondary" data-testid="btn-back-2">
                                ← Back
                            </button>
                            <button
                                onClick={() => setStep(3)}
                                disabled={!isStep2Valid}
                                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                                data-testid="btn-next-2"
                            >
                                Next: Confirm →
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 3: Confirmation */}
                {step === 3 && (
                    <div className="glass-card p-6">
                        <h2 className="text-xl font-semibold text-white mb-6">Review & Submit</h2>
                        <div className="space-y-4 mb-6">
                            <div className="flex justify-between py-2 border-b border-[var(--border)]">
                                <span className="text-gray-400">Agent Name</span>
                                <span className="text-white">{formData.name}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-[var(--border)]">
                                <span className="text-gray-400">Category</span>
                                <span className="text-white capitalize">{formData.category}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-[var(--border)]">
                                <span className="text-gray-400">Claimed Badges</span>
                                <span className="text-white">{formData.claimedBadges.join(', ') || 'None'}</span>
                            </div>
                        </div>

                        <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg mb-6">
                            <p className="text-amber-400 text-sm">
                                ⚠️ Your agent will undergo automated vetting via our Trust Verifier, Fairness Auditor, and ConvoGuard pipeline.
                                False claims may result in rejection.
                            </p>
                        </div>

                        <label className="flex items-start gap-3 mb-6 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.tosAccepted}
                                onChange={(e) => setFormData({ ...formData, tosAccepted: e.target.checked })}
                                className="mt-1"
                                data-testid="checkbox-tos"
                            />
                            <span className="text-sm text-gray-400">
                                I confirm that the information provided is accurate and I accept the EU Compliance Agent Registry Terms of Service.
                            </span>
                        </label>

                        {submitError && (
                            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg mb-6">
                                <p className="text-red-400 text-sm">{submitError}</p>
                            </div>
                        )}

                        <div className="flex justify-between">
                            <button onClick={() => setStep(2)} className="btn-secondary" data-testid="btn-back-3">
                                ← Back
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={!isStep3Valid || isSubmitting}
                                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                                data-testid="btn-submit"
                            >
                                {isSubmitting ? 'Submitting...' : 'Submit for Vetting'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
