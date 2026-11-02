"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Check, Copy, Eye, EyeOff } from "lucide-react"

export function LicenseKeyDisplay({ licenseKey }: { licenseKey: string }) {
    const [copied, setCopied] = useState(false)
    const [isVisible, setIsVisible] = useState(false)

    const maskedKey = licenseKey.replace(/[A-Za-z0-9]/g, "•")

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
                <span className="truncate select-all">
                    {isVisible ? licenseKey : maskedKey}
                </span>
                <div className="flex items-center gap-1.5 shrink-0">
                    <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => setIsVisible((prev) => !prev)}
                        className="h-8 w-8"
                        title={isVisible ? "Hide license key" : "Show license key"}
                    >
                        {isVisible ? (
                            <EyeOff className="h-3.5 w-3.5" />
                        ) : (
                            <Eye className="h-3.5 w-3.5" />
                        )}
                        <span className="sr-only">
                            {isVisible ? "Hide license key" : "Show license key"}
                        </span>
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={handleCopy}
                        className="h-8 w-8"
                        title={copied ? "Copied!" : "Copy license key"}
                    >
                        {copied ? (
                            <Check className="h-3.5 w-3.5 text-emerald-600" />
                        ) : (
                            <Copy className="h-3.5 w-3.5" />
                        )}
                        <span className="sr-only">Copy license key</span>
                    </Button>
                </div>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
                Open the Ruddy desktop app and sign in with your registered email, password, and this license key on first launch.
            </p>
        </div>
    )
}

