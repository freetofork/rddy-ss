import Link from 'next/link';
import Image from 'next/image';
import { Linkedin, MessageCircle } from 'lucide-react';

export const metadata = {
  title: 'Terms of Service | Ruddy',
  description: 'Terms of Service and End User License Agreement for Ruddy',
};

export default function TermsOfService() {
  return (
    <div className="flex flex-col min-h-[100dvh]">
      <header className="px-4 lg:px-6 h-14 flex items-center bg-background/80 backdrop-blur-md border-b sticky top-0 z-50 transition-colors">
        <Link className="flex items-center justify-center gap-2" href="/">
          <Image src="/ruddy-icon.png" alt="Ruddy" width={28} height={28} className="rounded-md" priority />
          <span className="font-display font-bold text-lg tracking-tighter text-[#4F2C1E]">Ruddy</span>
        </Link>
      </header>

      <main className="flex-1 max-w-4xl mx-auto px-6 py-16 text-[#4F2C1E] font-sans">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">Terms of Service</h1>
        <p className="text-muted-foreground mb-12 text-sm">Last Updated: March 2026</p>

        <div className="space-y-10 leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
            <p className="mb-4">
              By <strong>downloading</strong>, <strong>installing</strong>, or <strong>using</strong> the <em>Ruddy</em> macOS desktop‑only application (<strong>the Software</strong>), you agree to be bound by these Terms of Service. If you do not agree, please <strong>do not use</strong> the Software.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">2. The Software & Local Execution</h2>
            <p className="mb-4">
              Ruddy is a desktop‑first analytics and management tool. You acknowledge that:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-[#4F2C1E]/90">
              <li>
                The Software runs queries and executes logic directly on your local hardware <strong>unless</strong> you explicitly configure an external cloud provider (e.g., MotherDuck, generic HTTP inputs).
              </li>
              <li>
                <strong>No native functionality or unintended bugs</strong> can create permanent destructive effects <strong>without</strong> your explicit consent and action. Only you can save or permanently modify your local data.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">3. Pricing and Subscriptions</h2>
            <p className="mb-4">Ruddy offers three plans:</p>
            <ul className="list-disc pl-6 space-y-2 text-[#4F2C1E]/90 mb-6">
              <li><strong>The Bubbler (Monthly)</strong> – $1.25/mo. Auto‑renews each calendar month. Includes a 7-day free trial.</li>
              <li><strong>Splash (6 Months)</strong> – $7.50/6 mo. Auto-renews every 6 months. Includes a 7-day free trial.</li>
              <li><strong>Diver (Pay-Once)</strong> – $15.00 one-time payment for lifetime access. No auto-renewal.</li>
            </ul>

            <h3 className="text-xl font-bold mb-2">3.1 Billing</h3>
            <p className="mb-6">
              Subscriptions are billed securely via <strong>Stripe</strong>. Your billing information must remain accurate; otherwise the license may be suspended.
            </p>

            <h3 className="text-xl font-bold mb-2">3.2 Cancellation</h3>
            <p className="mb-6">
              Cancellations are performed through the <strong>Stripe billing portal</strong> and become effective <strong>at the end of the current billing period</strong>. No prorated refunds are issued.
            </p>

            <h3 className="text-xl font-bold mb-2">3.3 Expirations and Non-Recurring Plans</h3>
            <p className="mb-4">
              Subscription trials (The Bubbler, Splash) will automatically upgrade to paid subscriptions after 7 days unless cancelled. The Pay-Once plan (Diver) does not expire and will never automatically charge you again.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">4. Refunds and Guarantees</h2>
            <p className="mb-4">
              All purchases are <strong>generally final</strong>. However, if the application <strong>fails to launch</strong> within the first <strong>14 days</strong> of purchase and the failure is verified as an irrecoverable technical issue, you may request a tailored resolution by contacting support <strong>with evidence</strong> (see Section 4‑2).
            </p>

            <h3 className="text-xl font-bold mb-2 mt-6">4.2 Evidence Requirements</h3>
            <p className="mb-2">To qualify, you must provide:</p>
            <ol className="list-decimal pl-6 space-y-2 text-[#4F2C1E]/90 mb-4">
              <li>Proof that the system meets the <strong>Minimum Requirements</strong> (see Section 5.2).</li>
              <li>At least <strong>three (3) consecutive</strong> crash logs generated at startup.</li>
            </ol>
            <p className="mb-4 mt-6">
              We do <strong>not</strong> issue refunds for administrative changes of mind.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">5. Hardware Limitations and Performance</h2>
            <p className="mb-6">
              The Software uses your local CPU and RAM (via DuckDB) for all processing.
            </p>

            <h3 className="text-xl font-bold mb-4">5.2 Minimum Requirements</h3>
            <div className="overflow-x-auto mb-8 bg-white border border-[#F0E6D3] rounded-xl shadow-sm">
              <table className="w-full border-collapse text-left text-sm text-[#4F2C1E]/90">
                <thead>
                  <tr className="border-b border-[#F0E6D3] bg-[#FFF5E6]">
                    <th className="py-3 px-4 font-black tracking-tight">Requirement</th>
                    <th className="py-3 px-4 font-black tracking-tight">Minimum</th>
                    <th className="py-3 px-4 font-black tracking-tight">Recommended</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0E6D3]">
                  <tr className="hover:bg-[#FFF5E6]/50 transition-colors">
                    <td className="py-3 px-4 font-bold">OS</td>
                    <td className="py-3 px-4">macOS 12.0 (Monterey)</td>
                    <td className="py-3 px-4">macOS 13.0 (Ventura)</td>
                  </tr>
                  <tr className="hover:bg-[#FFF5E6]/50 transition-colors">
                    <td className="py-3 px-4 font-bold">Processor</td>
                    <td className="py-3 px-4">Intel i5 (8th Gen) <strong>or</strong> Apple Silicon M1</td>
                    <td className="py-3 px-4">Apple Silicon M1 Pro / M2 / M3</td>
                  </tr>
                  <tr className="hover:bg-[#FFF5E6]/50 transition-colors">
                    <td className="py-3 px-4 font-bold">Memory</td>
                    <td className="py-3 px-4">8 GB RAM</td>
                    <td className="py-3 px-4">16 GB RAM or higher</td>
                  </tr>
                  <tr className="hover:bg-[#FFF5E6]/50 transition-colors">
                    <td className="py-3 px-4 font-bold">Storage</td>
                    <td className="py-3 px-4">500 MB free</td>
                    <td className="py-3 px-4">SSD with ≥ 5 GB free (NVMe preferred)</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="text-xl font-bold mb-2">5.3 Liability for Exceeding Limits</h3>
            <p className="mb-4">
              We are <strong>not liable</strong> for crashes, out‑of‑memory errors, or unresponsiveness that result from processing data sets which <strong>exceed</strong> the listed limits. Liability is limited to cases of <strong>gross negligence</strong> on our part.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">6. Telemetry and Analytics</h2>
            <ul className="list-disc pl-6 space-y-2 text-[#4F2C1E]/90 mb-6">
              <li><strong>Current:</strong> No telemetry is collected.</li>
              <li><strong>Future:</strong> We may introduce anonymized crash or performance metrics <strong>only after</strong> publishing a notice on the website and providing a <strong>30‑day opt‑in window</strong>.</li>
              <li>If telemetry is added, the data payload will conform to the schema in the <em>Telemetry Schema</em> section below.</li>
            </ul>

            <h3 className="text-xl font-bold mb-4">Telemetry Schema (JSON example)</h3>
            <div className="bg-[#4F2C1E] text-[#FFF5E6] p-4 rounded-xl overflow-x-auto shadow-inner rounded-br-2xl border border-[#4F2C1E]/20">
              <pre className="font-mono text-xs leading-relaxed">
                {`{
  "timestamp": "2026-10-15T14:32:10Z",
  "os_version": "macOS 14.5",
  "app_build": "2.7.0",
  "event_type": "crash",
  "stack_hash": "a3f5c9b7e1d8",
  "memory_total_mb": 16384,
  "memory_available_mb": 1200,
  "cpu_model": "Apple M2 Pro",
  "exception_type": "EXC_BAD_ACCESS"
}`}
              </pre>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">7. Intellectual Property & License Rights</h2>
            <p className="mb-4">
              The Ruddy Software, its name, visual identity, branding, icons, and proprietary compiled assets are the intellectual property of the Ruddy developers.
            </p>
            <ul className="list-disc pl-6 space-y-2 text-[#4F2C1E]/90">
              <li>You may install and use Ruddy on any macOS device you own.</li>
              <li>You may not explicitly decompile, resell, reverse-engineer, create derivative works, or distribute the application without documented legal authorization.</li>
              <li>You may not share or distribute your license key. Any detection of key sharing, resale, or duplication will result in immediate and unilateral revocation of your license without a refund.</li>
              <li>The license terminates automatically upon breach of any term.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">8. Disclaimer of Warranties</h2>
            <p className="mb-4">
              The Software is provided strictly &quot;AS IS&quot; without warranty of any kind, explicit or implied. We do not guarantee that the software will be error-free, function uninterrupted, or remain compatible with all future macOS releases. In no event shall we be held liable for any damages arising from the use of the Software, including but not limited to loss of data, loss of business revenue, or workflow interruptions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">9. Contact and Support</h2>
            <p className="mb-4">
              Please contact us via our documented community channel on Discord available on the Ruddy website or in the app.
            </p>
          </section>
        </div>

        <div className="mt-16 py-8 border-t border-[#F0E6D3] text-center flex flex-col items-center gap-6">
          <Link href="/" className="inline-flex items-center text-sm font-medium text-[#1A96E8] hover:underline">
            &larr; Back to the Ruddy Desktop Application
          </Link>
          
          <div className="flex items-center justify-center gap-6">
            <a 
              href="https://www.linkedin.com/showcase/ruddy-ide" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group flex flex-col items-center gap-2 text-[#4F2C1E]/60 hover:text-[#0A66C2] transition-colors"
            >
              <div className="p-3 bg-muted rounded-full group-hover:bg-[#0A66C2]/10 transition-colors">
                <Linkedin className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold">LinkedIn</span>
            </a>
            
            <a 
              href="https://discord.gg/azsyQdNPEn" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group flex flex-col items-center gap-2 text-[#4F2C1E]/60 hover:text-[#5865F2] transition-colors"
            >
              <div className="p-3 bg-muted rounded-full group-hover:bg-[#5865F2]/10 transition-colors">
                <MessageCircle className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold">Discord</span>
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
