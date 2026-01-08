/**
 * Enterprise Discovery Platform - Landing Page
 * 
 * "Mission Control" hero + Fleet Overview
 */

import { SEED_AGENTS } from '@/infrastructure/seedAgents';
import { FleetGrid } from '@/components/FleetGrid';
import Link from 'next/link';

export default function HomePage() {
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
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full border border-[var(--border)] bg-[var(--surface-1)]">
            <span className="status-pulse status-online" />
            <span className="text-sm text-gray-400">
              {onlineCount} services operational
            </span>
          </div>

          {/* Main Title */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="gradient-text">Agent Governance</span>
            <br />
            <span className="text-white">Platform</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
            Vendor-neutral compliance infrastructure for enterprise AI.
            <br />
            <span className="text-[var(--primary)]">Runtime enforcement. ZK-Privacy. EU-Ready.</span>
          </p>

          {/* Stats Row */}
          <div className="flex justify-center gap-8 mb-12">
            {[
              { label: 'Services', value: agents.length },
              { label: 'Avg Trust', value: `${avgTrustScore}%` },
              { label: 'Badges Verified', value: agents.reduce((sum, a) => sum + a.badges.length, 0) },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex justify-center gap-4">
            <Link href="/discover" className="btn-primary">
              Discover Agents
            </Link>
            <a href="#fleet" className="btn-secondary">
              View Fleet
            </a>
          </div>
        </div>
      </section>

      {/* Differentiators Section */}
      <section className="py-16 px-6 border-t border-[var(--border)]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-12 text-white">
            AWS builds agents. We <span className="gradient-text">govern</span> them.
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
            <h2 className="text-2xl font-bold text-white">Live Fleet</h2>
            <Link href="/discover" className="text-sm text-[var(--primary)] hover:underline">
              Search all →
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
          <div>© 2026 Berlin AI Labs. EU-First AI Infrastructure.</div>
          <div className="flex gap-6">
            <a href="https://berlinailabs.de" className="hover:text-[var(--primary)]">Website</a>
            <a href="https://github.com/yogami" className="hover:text-[var(--primary)]">GitHub</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
