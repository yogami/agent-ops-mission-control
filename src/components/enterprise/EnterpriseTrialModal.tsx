'use client';

import { useState } from 'react';

interface EnterpriseTrialModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function EnterpriseTrialModal({ isOpen, onClose }: EnterpriseTrialModalProps) {
    const [formData, setFormData] = useState({
        companyName: '',
        email: '',
        useCase: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        setIsSubmitting(false);
        setIsSuccess(true);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-6">
            <div className="glass-card max-w-lg w-full p-8" data-testid="enterprise-trial-modal">
                {isSuccess ? (
                    <div className="text-center">
                        <div className="text-6xl mb-4">🎉</div>
                        <h2 className="text-2xl font-bold text-white mb-2">Welcome to AgentOps!</h2>
                        <p className="text-gray-400 mb-6">
                            Your 14-day enterprise trial is now active. We&apos;ll reach out within 24 hours to schedule your onboarding call.
                        </p>
                        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg mb-6">
                            <p className="text-emerald-400 text-sm">
                                ✓ Full platform access enabled<br />
                                ✓ Onboarding call scheduled<br />
                                ✓ Dedicated Slack channel created
                            </p>
                        </div>
                        <button onClick={onClose} className="btn-primary">
                            Get Started →
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-white">Start Enterprise Trial</h2>
                                <p className="text-gray-400 text-sm">14 days full access • No credit card required</p>
                            </div>
                            <button onClick={onClose} className="text-gray-400 hover:text-white text-xl">
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Company Name *</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.companyName}
                                    onChange={e => setFormData({ ...formData, companyName: e.target.value })}
                                    placeholder="Acme Corp"
                                    className="w-full px-4 py-3 bg-[var(--surface-2)] border border-[var(--border)] rounded-lg text-white"
                                    data-testid="input-company"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Work Email *</label>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="you@company.com"
                                    className="w-full px-4 py-3 bg-[var(--surface-2)] border border-[var(--border)] rounded-lg text-white"
                                    data-testid="input-email"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Primary Use Case</label>
                                <select
                                    value={formData.useCase}
                                    onChange={e => setFormData({ ...formData, useCase: e.target.value })}
                                    className="w-full px-4 py-3 bg-[var(--surface-2)] border border-[var(--border)] rounded-lg text-white"
                                    data-testid="input-usecase"
                                >
                                    <option value="">Select...</option>
                                    <option value="discovery">Shadow AI Discovery</option>
                                    <option value="compliance">EU AI Act Compliance</option>
                                    <option value="governance">Agent Governance</option>
                                    <option value="audit">Compliance Auditing</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={isSubmitting || !formData.companyName || !formData.email}
                                    className="w-full btn-primary py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                    data-testid="btn-start-trial"
                                >
                                    {isSubmitting ? 'Starting Trial...' : 'Start 14-Day Free Trial'}
                                </button>
                            </div>
                        </form>

                        <p className="text-xs text-gray-500 text-center mt-6">
                            By starting a trial, you agree to our Terms of Service and Privacy Policy.
                        </p>
                    </>
                )}
            </div>
        </div>
    );
}
