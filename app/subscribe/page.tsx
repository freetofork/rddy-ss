import Image from "next/image"
import { createClient } from '@/utils/supabase/server'
import { createTrialCheckoutSession } from "@/utils/stripe/api"
import { redirect } from "next/navigation"

export default async function Subscribe({ searchParams }: { searchParams: { plan?: string } }) {
    const supabase = createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    const planId = searchParams.plan || "prod_U7jwhWfAWQuK0z"

    let checkoutUrl: string | null = null
    let errorMessage: string | null = null

    try {
        // Securely invoke Stripe directly
        checkoutUrl = await createTrialCheckoutSession(user?.email, planId)
    } catch (err: any) {
        console.error("[Subscribe] Failed to create Stripe Checkout session:", err)
        errorMessage = err?.message || "Failed to initialize Stripe Checkout."
    }
    
    // Instantly teleport the user out of the app directly into Stripe Checkout
    if (checkoutUrl) {
        redirect(checkoutUrl)
    }

    return (
        <div className="flex flex-col min-h-[100dvh]">
            <header className="px-4 lg:px-6 h-12 flex items-center justify-center bg-background/80 backdrop-blur-md border-b fixed border-b-border w-full z-50">
                <div className="flex items-center gap-3">
                    <Image src="/ruddy-icon.png" alt="Ruddy" width={32} height={32} className="rounded-md shadow-sm" priority />
                    <span className="font-display font-bold text-lg tracking-tighter hidden sm:inline-block">Ruddy</span>
                </div>
            </header>
            <div className="w-full h-screen flex-1 bg-muted flex flex-col items-center justify-center p-4">
                {errorMessage ? (
                    <div className="text-center max-w-md bg-background p-6 rounded-xl border border-border shadow-sm space-y-3">
                        <h1 className="font-bold text-xl text-destructive">Checkout Error</h1>
                        <p className="text-sm text-muted-foreground">{errorMessage}</p>
                    </div>
                ) : (
                    <div className="text-center py-6 md:py-10 lg:py-12 animate-pulse">
                        <h1 className="font-bold text-2xl md:text-4xl text-foreground/80 tracking-tighter">Preparing your secure checkout...</h1>
                    </div>
                )}
            </div>
        </div>
    )
}
