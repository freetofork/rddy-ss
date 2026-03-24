import Link from 'next/link';
import Image from 'next/image';
import { ExternalLink, ShieldCheck } from 'lucide-react';

export const metadata = {
  title: 'Security Audit | Ruddy',
  description: 'Public security vulnerability audits for the Ruddy desktop ecosystem',
};

export default function SecurityAudit() {
  return (
    <div className="flex flex-col min-h-[100dvh]">
      <header className="px-4 lg:px-6 h-14 flex items-center bg-background/80 backdrop-blur-md border-b sticky top-0 z-50 transition-colors">
        <Link className="flex items-center justify-center gap-2" href="/">
          <Image src="/ruddy-icon.png" alt="Ruddy" width={28} height={28} className="rounded-md" priority />
          <span className="font-display font-bold text-lg tracking-tighter text-[#4F2C1E]">Ruddy</span>
        </Link>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-16 text-[#4F2C1E] font-sans">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-green-100 rounded-2xl flex items-center justify-center border border-green-200 shadow-sm">
            <ShieldCheck className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">Security Audit</h1>
        </div>
        <p className="text-muted-foreground mb-12 text-sm leading-relaxed max-w-2xl">
          At Ruddy, we believe that desktop software accessing local architecture should be aggressively audited. Below are the official unedited <strong>Cargo (Rust)</strong> and <strong>NPM (React)</strong> vulnerability audit tables automatically generated via industry-standard open source scanners.
        </p>

        <div className="space-y-12">
          {/* Backend Table */}
          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
              <span className="px-3 py-1 bg-[#1A96E8] text-white rounded-lg text-xs tracking-widest uppercase font-black">Backend</span>
              Rust/Tauri Native Engine
            </h2>
            <div className="overflow-x-auto bg-white border border-[#F0E6D3] rounded-2xl shadow-sm">
              <table className="w-full border-collapse text-left text-sm text-[#4F2C1E]/90">
                <thead>
                  <tr className="border-b border-[#F0E6D3] bg-[#FFF5E6]">
                    <th className="py-4 px-5 font-black tracking-tight w-1/2">Check</th>
                    <th className="py-4 px-5 font-black tracking-tight w-1/2">Result</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0E6D3]">
                  <tr className="hover:bg-[#FFF5E6]/30 transition-colors">
                    <td className="py-4 px-5 font-bold">CVEs / exploitable vulns</td>
                    <td className="py-4 px-5 font-bold text-green-600 flex items-center gap-2">✅ 0</td>
                  </tr>
                  <tr className="hover:bg-[#FFF5E6]/30 transition-colors">
                    <td className="py-4 px-5 font-bold">Unmaintained crates</td>
                    <td className="py-4 px-5">⚠️ 13 <span className="text-xs text-[#4F2C1E]/50 block mt-1">(all Tauri-owned, Linux GTK stack)</span></td>
                  </tr>
                  <tr className="hover:bg-[#FFF5E6]/30 transition-colors">
                    <td className="py-4 px-5 font-bold">Unsound code</td>
                    <td className="py-4 px-5">⚠️ 1 <span className="text-xs text-[#4F2C1E]/50 block mt-1">(glib, not called by your code)</span></td>
                  </tr>
                  <tr className="hover:bg-[#FFF5E6]/30 transition-colors">
                    <td className="py-4 px-5 font-bold">Your own Rust code</td>
                    <td className="py-4 px-5 font-bold text-green-600">✅ Clean</td>
                  </tr>
                  <tr className="hover:bg-[#FFF5E6]/30 transition-colors bg-[#FFF5E6]/20">
                    <td className="py-4 px-5 font-bold">673 total dependencies scanned</td>
                    <td className="py-4 px-5 font-bold text-green-600">✅ Passed</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Frontend Section */}
          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
              <span className="px-3 py-1 bg-yellow-400 text-yellow-900 rounded-lg text-xs tracking-widest uppercase font-black">Frontend</span>
              React/Node GUI Thread
            </h2>
            
            <div className="bg-white border border-[#F0E6D3] rounded-2xl shadow-sm p-6 mb-4">
              <div className="flex flex-col gap-6">
                <div>
                  <h3 className="font-bold text-lg mb-1 tracking-tight">NPM Security Scan</h3>
                  <p className="text-sm text-[#4F2C1E]/70 mb-4">
                    The frontend interface dependencies were audited successfully using the official Node pipeline.
                  </p>
                  <p className="font-black text-green-600 bg-green-50 px-4 py-2 rounded-lg inline-block border border-green-100 shadow-sm">
                    ✅ 0 vulnerabilities found
                  </p>
                </div>

                <div className="pt-6 border-t border-[#F0E6D3]">
                  <h4 className="text-xs font-black uppercase tracking-widest text-[#4F2C1E]/40 mb-3 block">View Raw Verification Data</h4>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link 
                      href="https://pub-66f67f4a3e74412c91eeedaff15ae554.r2.dev/security-report-frontend.txt"
                      target="_blank"
                      className="flex items-center gap-2 bg-[#FFF5E6]/50 hover:bg-[#FFF5E6] border border-[#F0E6D3] hover:border-[#1A96E8] px-4 py-3 rounded-xl transition-all text-sm font-bold group shadow-sm"
                    >
                      <span className="text-[#4F2C1E]">security-report-frontend.txt</span>
                      <ExternalLink className="w-3.5 h-3.5 text-[#1A96E8] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
                    </Link>
                    <Link 
                      href="https://pub-66f67f4a3e74412c91eeedaff15ae554.r2.dev/security-audit-frontend-2026-03-22.json"
                      target="_blank"
                      className="flex items-center gap-2 bg-[#FFF5E6]/50 hover:bg-[#FFF5E6] border border-[#F0E6D3] hover:border-[#1A96E8] px-4 py-3 rounded-xl transition-all text-sm font-bold group shadow-sm"
                    >
                      <span className="text-[#4F2C1E]">security-audit-frontend.json</span>
                      <ExternalLink className="w-3.5 h-3.5 text-[#1A96E8] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
