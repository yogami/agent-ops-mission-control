/**
 * Enterprise Discovery Platform - Landing Page
 * 
 * "Mission Control" hero + Fleet Overview
 */

'use client';

import { useState } from 'react';
import { SEED_AGENTS } from '@/infrastructure/seedAgents';
import { FleetGrid } from '@/components/FleetGrid';
import { EnterpriseTrialModal } from '@/components/enterprise';
import Link from 'next/link';

export default function HomePage() {
  const [showTrialModal, setShowTrialModal] = useState(false);

  // Use seed data for demo; in production, fetch from Capability Broker
  const agents = SEED_AGENTS;
  const onlineCount = agents.filter(a => a.status === 'online').length;
  const avgTrustScore = Math.round(agents.reduce((sum, a) => sum + a.trustScore, 0) / agents.length);

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-6 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/5 via-transparent to-[var(--secondary)]/5" />

        <div className="relative max-w-7xl mx-auto text-center">
          {/* Company Context Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full border border-[var(--border)] bg-[var(--surface-1)]">
            <span className="status-pulse status-online" />
            <span className="text-sm text-gray-400">
              Viewing as: <span className="text-[var(--primary)] font-medium">Berlin AI Labs</span> • {onlineCount} services operational
            </span>
          </div>

          {/* Main Title */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="gradient-text">EU Compliance</span>
            <br />
            <span className="text-white">Agent Registry</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
            Platform-agnostic governance layer for AI agents on AWS Bedrock, Azure OpenAI, Google Vertex, and more.
            <br />
            <span className="text-[var(--primary)]">Runtime Enforcement. ZK-Privacy. EU AI Act Ready.</span>
          </p>

          {/* Stats Row (Demo Data) */}
          <div className="flex justify-center gap-8 mb-12">
            {[
              { label: 'Your Services', value: agents.length },
              { label: 'Avg Trust', value: `${avgTrustScore}%` },
              { label: 'Verified Badges', value: agents.reduce((sum, a) => sum + a.badges.length, 0) },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            <button
              onClick={() => setShowTrialModal(true)}
              className="btn-primary text-lg px-8 py-4"
              data-testid="enterprise-trial-btn"
            >
              🚀 Start Enterprise Trial
            </button>
            <Link href="/discover/scan" className="btn-secondary text-lg px-8 py-4" data-testid="scan-agents-btn">
              🔍 Scan My Agents
            </Link>
          </div>
          <div className="flex justify-center gap-4">
            <Link href="/discover" className="text-sm text-gray-400 hover:text-[var(--primary)]">
              Browse Registry →
            </Link>
            <Link href="/demo/zk-sla" className="text-sm text-gray-400 hover:text-[var(--primary)]">
              ZK-SLA Demo →
            </Link>
            <Link href="/manage" className="text-sm text-gray-400 hover:text-[var(--primary)]">
              Fleet Management →
            </Link>
          </div>
        </div>
      </section>

      {/* Enterprise Trial Modal */}
      <EnterpriseTrialModal isOpen={showTrialModal} onClose={() => setShowTrialModal(false)} />

      {/* Regulated Industries Focus */}
      <section className="py-24 px-6 border-t border-[var(--border)] bg-[var(--surface-1)]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Built for Regulated Industries</h2>
              <p className="text-lg text-gray-400 mb-8 leading-relaxed">
                Whether you are building healthcare agents subject to MDR/GDPR or financial bots requiring strict audit trails, AgentOps Platform provides the zero-trust primitives you need.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {[
                  { id: '01', title: 'Digital Health', desc: 'Compliance with DiGA & HIPAA standards.', color: 'text-[var(--primary)]' },
                  { id: '02', title: 'FinTech', desc: 'Strict non-repudiation and audit logs.', color: 'text-[var(--secondary)]' },
                  { id: '03', title: 'Government', desc: 'Sovereign agent networks via DIDs.', color: 'text-emerald-500' },
                  { id: '04', title: 'Enterprise AI', desc: 'Cross-department semantic alignment.', color: 'text-amber-500' },
                ].map((item) => (
                  <div key={item.id} className="flex items-start gap-4">
                    <div className={`${item.color} text-xl font-bold font-mono`}>{item.id}</div>
                    <div>
                      <h4 className="text-white font-semibold mb-1">{item.title}</h4>
                      <p className="text-sm text-gray-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex-1 w-full max-w-xl">
              <div className="glass-card p-8 border-[var(--primary)]/20 relative">
                <div className="space-y-4">
                  <div className="h-1.5 w-24 bg-[var(--primary)]/40 rounded-full" />
                  <div className="h-4 w-full bg-white/5 rounded animate-pulse" />
                  <div className="h-4 w-5/6 bg-white/5 rounded animate-pulse delay-75" />
                  <div className="h-4 w-4/6 bg-white/5 rounded animate-pulse delay-150" />
                  <div className="pt-6 flex justify-between">
                    <div className="h-10 w-24 bg-white/5 rounded-lg" />
                    <div className="h-10 w-28 bg-[var(--primary)]/20 border border-[var(--primary)]/30 rounded-lg" />
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 glass-card p-4 border-emerald-500/30">
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
                    <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest">100% Compliant</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Differentiators Section */}
      <section className="py-16 px-6 border-t border-[var(--border)]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-12 text-white">
            AWS builds agents. <span className="gradient-text">We govern them</span> — with EU compliance.
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Vendor Neutral',
                description: 'One policy rulebook for OpenAI, Anthropic, Azure, and local models.',
                icon: '🌐',
              },
              {
                title: 'Privacy-Preserving Audit',
                description: 'ZK-proofs verify correctness without storing sensitive data.',
                icon: '🔐',
              },
              {
                title: 'Runtime Enforcement',
                description: 'Block violations before they reach users, not after.',
                icon: '⚡',
              },
            ].map((item) => (
              <div key={item.title} className="glass-card p-6 text-center">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-gray-400">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fleet Section */}
      <section id="fleet" className="py-16 px-6 border-t border-[var(--border)]">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-white">Your Fleet</h2>
              <p className="text-sm text-gray-500">Agents registered under Berlin AI Labs</p>
            </div>
            <Link href="/discover" className="text-sm text-[var(--primary)] hover:underline">
              Browse Marketplace →
            </Link>
          </div>

          <FleetGrid agents={agents} />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 border-t border-[var(--border)] bg-gradient-to-b from-transparent to-[var(--surface-1)]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to govern your agent fleet?
          </h2>
          <p className="text-gray-400 mb-8">
            Start with a free consultation. Enterprise plans from €99/month.
          </p>
          <a
            href="mailto:hello@berlinailabs.de?subject=AgentOps%20Platform%20Demo"
            className="btn-primary text-lg"
          >
            Contact Sales
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-[var(--border)]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <div>© 2026 Berlin AI Labs. EU Compliance Agent Registry.</div>
          <div className="flex gap-6">
            <a href="https://berlinailabs.de" className="hover:text-[var(--primary)]">Website</a>
            <a href="https://github.com/yogami" className="hover:text-[var(--primary)]">GitHub</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
