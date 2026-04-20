"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CloudDownload, X, AlertTriangle } from "lucide-react";
import Image from "next/image";

export function DownloadModal() {
  const [isOpen, setIsOpen] = useState(false);

  const handleDownload = () => {
    window.location.href = "https://pub-66f67f4a3e74412c91eeedaff15ae554.r2.dev/Ruddy_1.0.0-rc.3_aarch64.dmg";
    // Close modal after a short delay
    setTimeout(() => setIsOpen(false), 2000);
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="gap-2 shadow-lg shadow-[#1A96E8]/20 bg-[#1A96E8] hover:bg-[#137ABE] text-white"
      >
        <CloudDownload className="w-4 h-4" /> Download for macOS
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#FFF5E6] rounded-[32px] shadow-2xl w-full max-w-lg p-8 relative animate-in zoom-in-95 duration-200 border border-[#F0E6D3]/50">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-6 right-6 p-2 hover:bg-black/5 rounded-xl transition-colors"
            >
              <X className="w-5 h-5 text-[#4F2C1E]/50" />
            </button>

            <div className="flex flex-col items-center text-center space-y-4">
              <Image src="/ruddy-icon.png" alt="Ruddy" width={64} height={64} className="rounded-xl shadow-md mb-2" />

              <h2 className="text-2xl font-black text-[#4F2C1E] tracking-tight">
                Almost there!
              </h2>

              <div className="bg-amber-50 border border-amber-200 p-5 rounded-2xl w-full text-left space-y-3">
                <div className="flex items-center gap-2 text-amber-900 font-bold">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                  <h3>Initial Launch Instructions</h3>
                </div>

                <p className="text-sm text-amber-900/80 leading-relaxed font-medium">
                  Because Ruddy is a brand new application, macOS Gatekeeper might show an &quot;unverified developer&quot; warning on your first launch.
                </p>

                <div className="bg-amber-200/40 p-3 rounded-xl border border-amber-200/60 mt-2">
                  <p className="text-sm font-bold text-amber-900">
                    To open Ruddy the first time:
                  </p>
                  <ol className="list-decimal pl-5 text-sm text-amber-900/80 mt-2 font-medium space-y-1">
                    <li>Go to your <span className="font-bold">Applications</span> folder</li>
                    <li><span className="font-bold">Right-Click</span> (or Control-Click) the Ruddy app</li>
                    <li>Select <span className="font-bold">&quot;Open&quot;</span> from the menu</li>
                    <li>Click <span className="font-bold">&quot;Open anyway&quot;</span> on the prompt</li>
                  </ol>
                </div>
                
                <div className="bg-red-50/50 p-3 rounded-xl border border-red-200/60 mt-3">
                  <p className="text-xs font-bold text-red-900 mb-1 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    If macOS says the app is &quot;Damaged&quot;:
                  </p>
                  <p className="text-[11px] text-red-900/80 leading-tight mb-2">
                    Apple aggressively flags early-access apps. Open your <span className="font-bold">Terminal</span> and run this exact command to remove the quarantine flag:
                  </p>
                  <code className="block bg-red-900/10 text-red-900 px-2.5 py-1.5 rounded-lg text-[10px] font-mono break-all selection:bg-red-200">
                    xattr -cr /Applications/Ruddy.app
                  </code>
                </div>

                <p className="text-xs text-amber-900/60 italic font-medium mt-2">
                  After doing this once, you can open it normally forever!
                </p>
              </div>

              <Button
                onClick={handleDownload}
                className="w-full h-12 text-base font-bold bg-[#1A96E8] hover:bg-[#137ABE] text-white shadow-xl shadow-[#1A96E8]/25 rounded-xl mt-4"
              >
                I understand, start download!
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
