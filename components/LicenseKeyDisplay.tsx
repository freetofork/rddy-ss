"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Check, Copy, Key } from "lucide-react"

export function LicenseKeyDisplay({ licenseKey }: { licenseKey: string }) {
    const [copied, setCopied] = useState(false)

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(licenseKey)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error("Failed to copy license key:", err)
        }
    }

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between gap-2 p-3 rounded-xl bg-muted border border-border font-mono text-sm sm:text-base font-bold tracking-wider text-primary">
                <span className="truncate select-all">{licenseKey}</span>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleCopy}
                    className="shrink-0 gap-1.5 h-8"
                >
                    {copied ? (
                        <>
                            <Check className="h-3.5 w-3.5 text-emerald-600" />
                            <span>Copied</span>
                        </>
                    ) : (
                        <>
                            <Copy className="h-3.5 w-3.5" />
                            <span>Copy</span>
                        </>
                    )}
                </Button>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
                Open the Ruddy desktop app and sign in with your registered email, password, and this license key on first launch.
            </p>
        </div>
    )
}

