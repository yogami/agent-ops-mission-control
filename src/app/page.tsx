'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-950 to-gray-950">
      {/* Hero Section */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-full text-blue-400 text-sm mb-8">
            <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
            <span>12 microservices live · EU AI Act · GDPR · DiGAV · BfArM</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
            AI Compliance <span className="text-blue-400">Firewall</span>
          </h1>

          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-4">
            Real-time enforcement for autonomous AI agents under EU AI Act &amp; GDPR.
          </p>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-12">
            Paste any AI conversation → get a compliance verdict in milliseconds
            → download regulator-ready documentation. No setup required.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/fast-audit"
              className="px-8 py-4 bg-blue-500 hover:bg-blue-400 text-white font-semibold rounded-lg transition-all transform hover:scale-105 shadow-lg shadow-blue-500/25"
            >
              Try It Now — Paste a Transcript →
            </Link>
            <Link
              href="/benchmarks"
              className="px-8 py-4 bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 rounded-lg transition-all font-semibold"
            >
              📊 View Benchmarks
            </Link>
          </div>
        </div>
      </section>

      {/* What It Does — Three Pillars */}
      <section className="py-24 px-6 bg-black/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-4">
            One Firewall. Three Layers.
          </h2>
          <p className="text-gray-500 text-center mb-16 max-w-xl mx-auto">
            Every AI agent conversation passes through detection, cryptographic proof, and regulatory reporting.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 bg-white/5 border border-white/10 rounded-2xl">
              <div className="text-4xl mb-4">🛡️</div>
              <h3 className="text-xl font-semibold text-white mb-3">Detect</h3>
              <p className="text-gray-400">
                Sub-20ms neural inference (DistilBERT ONNX) catches crisis risk, consent gaps,
                and policy violations <strong className="text-white">before they reach the user</strong>.
                No data leaves the processing boundary.
              </p>
            </div>

            <div className="p-8 bg-white/5 border border-white/10 rounded-2xl">
              <div className="text-4xl mb-4">🔐</div>
              <h3 className="text-xl font-semibold text-white mb-3">Prove</h3>
              <p className="text-gray-400">
                Every compliance check is SHA-256 signed and anchored to Solana.
                Tamper-proof, <strong className="text-white">cryptographic evidence</strong> for
                regulatory non-repudiation.
              </p>
            </div>

            <div className="p-8 bg-white/5 border border-white/10 rounded-2xl">
              <div className="text-4xl mb-4">📋</div>
              <h3 className="text-xl font-semibold text-white mb-3">Report</h3>
              <p className="text-gray-400">
                BfArM XML, EU AI Act Article 47 declarations, PDF audit reports —
                <strong className="text-white"> regulator-ready documentation</strong> generated
                in one click.
              </p>
            </div>
          </div>

          {/* Verified Metrics */}
          <div className="grid grid-cols-3 gap-6 mt-16">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400">{'<'}20ms</div>
              <div className="text-sm text-gray-500 mt-1">Neural Inference (ONNX)</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400">97%</div>
              <div className="text-sm text-gray-500 mt-1">Crisis Detection F1 (n=312)</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400">12</div>
              <div className="text-sm text-gray-500 mt-1">Live Microservices</div>
            </div>
          </div>
        </div>
      </section>

      {/* Urgency + CTA */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            EU AI Act Takes Effect August 2026
          </h2>
          <p className="text-lg text-gray-400 mb-8">
            AI systems in healthcare, finance, and insurance are classified <strong className="text-red-400">high-risk</strong>.
            Non-compliance means fines up to <strong className="text-white">€35 million</strong>.
            No production-ready governance solution exists today.
          </p>
          <p className="text-gray-500 mb-12">
            We independently built the architecture that the Cloud Security Alliance later confirmed
            in their Agentic Trust Framework — agent identity, behavioral auditing, data governance,
            incident response. <strong className="text-white">We shipped production code first.</strong>
          </p>

          <Link
            href="/fast-audit"
            className="inline-flex px-8 py-4 bg-blue-500 hover:bg-blue-400 text-white font-semibold rounded-lg transition-all shadow-lg shadow-blue-500/25"
          >
            Check Your AI Compliance Now →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-gray-500 text-sm">
            © 2026 Berlin AI Labs · Compliance Firewall for AI Agents
          </div>
          <div className="flex gap-6 text-gray-500 text-sm">
            <Link href="/gdpr" className="hover:text-blue-400 transition-colors">GDPR Center</Link>
            <Link href="/transparency" className="hover:text-blue-400 transition-colors">Transparency</Link>
            <Link href="/benchmarks" className="hover:text-blue-400 transition-colors">Benchmarks</Link>
            <Link href="/audit" className="hover:text-white transition-colors">Audit</Link>
            <a href="https://berlinailabs.de" className="hover:text-white transition-colors">berlinailabs.de</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
