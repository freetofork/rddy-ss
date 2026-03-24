import Link from 'next/link';
import Image from 'next/image';

export const metadata = {
  title: 'Privacy Policy | Ruddy',
  description: 'Privacy Policy and Data Handling procedures for Ruddy and rddy-ss',
};

export default function PrivacyPolicy() {
  return (
    <div className="flex flex-col min-h-[100dvh]">
      <header className="px-4 lg:px-6 h-14 flex items-center bg-background/80 backdrop-blur-md border-b sticky top-0 z-50 transition-colors">
        <Link className="flex items-center justify-center gap-2" href="/">
          <Image src="/ruddy-icon.png" alt="Ruddy" width={28} height={28} className="rounded-md" priority />
          <span className="font-display font-bold text-lg tracking-tighter text-[#4F2C1E]">Ruddy</span>
        </Link>
      </header>

      <main className="flex-1 max-w-4xl mx-auto px-6 py-16 text-[#4F2C1E] font-sans">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">Privacy Policy</h1>
        <p className="text-muted-foreground mb-12 text-sm">Last Updated: March 2026</p>

        <div className="space-y-10 leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold mb-4">1. Local-First Architecture</h2>
            <p className="mb-4">
              <strong>Ruddy is a strictly Local-First desktop application.</strong> This means the core engine (DuckDB) runs exclusively on your local hardware. We do not proxy, intercept, or mirror your databases, queries, or analytical results. Your local data remains entirely on your disk and never touches our servers.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">2. What We Collect (Website & Billing)</h2>
            <p className="mb-4">
              While the Desktop application is offline by default, our licensing and billing website (<code>ruddy.pro</code>) collects the following minimal information strictly to facilitate account access:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-[#4F2C1E]/90">
              <li>
                <strong>Email Addresses:</strong> Used exclusively to deliver your License Key and authenticate your Desktop application.
              </li>
              <li>
                <strong>Payment Information:</strong> Processed entirely by our secure third-party vendor (<strong>Stripe</strong>). We do not store or process full credit card numbers on our own servers.
              </li>
              <li>
                <strong>IP Addresses & User Agents:</strong> Temporarily logged by our industry leading CDN partners solely for DDoS protection and basic security rate-limiting.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">3. Artificial Intelligence (Ruddynie)</h2>
            <p className="mb-4">
              Ruddy features an advanced AI agent (&quot;Ruddynie&quot;). To protect your privacy, Ruddy uses a <strong>Bring Your Own Key (BYOK)</strong> model.
            </p>
            <ul className="list-disc pl-6 space-y-2 text-[#4F2C1E]/90 mb-6">
              <li>
                Your API keys (OpenAI, Anthropic, Gemini, OpenRouter) are securely vaulted in your local macOS Keychain/LocalStorage. They are <strong>never</strong> transmitted to Ruddy&apos;s servers.
              </li>
              <li>
                When you interact with the agent, your prompts and contextual schema are sent <strong>directly</strong> from your computer to your chosen AI provider. You remain fully bound by your chosen provider&apos;s individual Privacy Policy regarding AI training and data retention.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">4. Telemetry and Usage Tracking</h2>
            <p className="mb-6">
              The Ruddy Desktop Application currently employs <strong>zero telemetry</strong>. We do not track your clicks, query execution times, or application usage. If anonymized crash reporting is introduced in the future, it will be strictly opt-in with a 30-day notice period.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">5. Your Rights (GDPR / CCPA)</h2>
            <p className="mb-4">
              You maintain absolute control over the limited data we hold. You have the right to request access to, correction of, or complete erasure of your data.
            </p>
            <p className="mb-4 p-4 bg-[#FFF5E6] border border-[#F0E6D3] rounded-xl text-[#4F2C1E]/90 text-sm">
              <strong>Right to Erasure (&quot;Right to be Forgotten&quot;):</strong> You can instantly permanently delete your email, active License Keys, and active Stripe subscription identifiers by clicking the red <strong>&quot;Delete Account Permanently&quot;</strong> button found securely inside the Account &amp; Subscription modal on your Ruddy Desktop Interface. This executes an unrecoverable hard-delete across our entire Supabase infrastructure.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">6. Contact</h2>
            <p className="mb-4">
              If you have any questions regarding how your data is handled, the security boundaries of the local DuckDB instance, or GDPR compliance inquiries, please engage with our support channels.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
