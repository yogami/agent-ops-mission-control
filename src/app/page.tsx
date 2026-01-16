'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-950 via-emerald-950 to-gray-950">
      {/* Hero Section */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-emerald-400 text-sm mb-8">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span>EU AI Act · BfArM · DiGAV Ready</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
            Clinical <span className="text-emerald-400">Compliance</span><br />
            for Mental Health AI
          </h1>

          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-12">
            Real-time validation of AI therapy conversations.
            Detect suicide risk, bias, and policy violations.
            Generate <strong className="text-white">BfArM-ready audit reports</strong> in one click.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/audit"
              className="px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold rounded-lg transition-all transform hover:scale-105"
            >
              Start Compliance Audit →
            </Link>
            <a
              href="mailto:contact@berlin-ai-labs.de"
              className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/20 rounded-lg transition-all"
            >
              Book a Demo
            </a>
          </div>
        </div>
      </section>

      {/* Value Props */}
      <section className="py-24 px-6 bg-black/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-16">
            Why Digital Health Teams Choose Us
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 bg-white/5 border border-white/10 rounded-2xl">
              <div className="text-4xl mb-4">🛡️</div>
              <h3 className="text-xl font-semibold text-white mb-3">Real-Time Risk Detection</h3>
              <p className="text-gray-400">
                AI analyzes every conversation for suicide ideation, manipulation, and bias —
                before the patient sees the response.
              </p>
            </div>

            <div className="p-8 bg-white/5 border border-white/10 rounded-2xl">
              <div className="text-4xl mb-4">📋</div>
              <h3 className="text-xl font-semibold text-white mb-3">1-Click Audit Reports</h3>
              <p className="text-gray-400">
                Generate regulator-ready compliance documentation.
                BfArM, EU AI Act Article 5, DiGAV — all mapped automatically.
              </p>
            </div>

            <div className="p-8 bg-white/5 border border-white/10 rounded-2xl">
              <div className="text-4xl mb-4">🔐</div>
              <h3 className="text-xl font-semibold text-white mb-3">Tamper-Proof Audit Trail</h3>
              <p className="text-gray-400">
                Every validation is cryptographically anchored.
                Immutable proof that your safety layer was active.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof / Urgency */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            EU AI Act is Here. Are You Ready?
          </h2>
          <p className="text-lg text-gray-400 mb-12">
            Mental health chatbots are classified as <strong className="text-red-400">high-risk AI systems</strong>.
            Non-compliance means fines up to €35 million or 7% of global revenue.
          </p>

          <Link
            href="/audit"
            className="inline-flex px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold rounded-lg transition-all"
          >
            Check Your AI Compliance Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-gray-500 text-sm">
            © 2026 Berlin AI Labs · DiGA Compliance Copilot
          </div>
          <div className="flex gap-6 text-gray-500 text-sm">
            <a href="mailto:contact@berlin-ai-labs.de" className="hover:text-white transition-colors">Contact</a>
            <span>Berlin, Germany</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
