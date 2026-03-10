import StripePricingTable from "@/components/StripePricingTable";
import Image from "next/image"
import { createClient } from '@/utils/supabase/server'
import { createStripeCheckoutSession } from "@/utils/stripe/api";
export default async function Subscribe() {
    const supabase = createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()
    const checkoutSessionSecret = await createStripeCheckoutSession(user!.email!)

    return (
        <div className="flex flex-col min-h-[100dvh]">
            <header className="px-4 lg:px-6 h-12 flex items-center justify-center bg-background/80 backdrop-blur-md border-b fixed border-b-border w-full z-50">
                <div className="flex items-center gap-3">
                    <Image src="/ruddy-icon.png" alt="Ruddy" width={32} height={32} className="rounded-md shadow-sm" priority />
                    <span className="font-display font-bold text-lg tracking-tighter hidden sm:inline-block">Ruddy</span>
                </div>
            </header>
            <div className="w-full py-20 lg:py-32 xl:py-40 flex-1 bg-muted">
                <div className="text-center py-6 md:py-10 lg:py-12">
                    <h1 className="font-bold text-2xl md:text-4xl lg:text-5xl tracking-tighter">Choose your plan</h1>
                    <h2 className="pt-4 text-muted-foreground text-sm md:text-base lg:text-lg max-w-2xl mx-auto px-4">Early &quot;Duck&quot; Access. Join our limited first wave of divers with locked-in legacy rates.</h2>
                </div>
                <StripePricingTable checkoutSessionSecret={checkoutSessionSecret} />
            </div>
        </div>
    )
}
