"use client"
import React, { useState } from 'react';
import { Button } from "@/components/ui/button"

declare global {
    namespace JSX {
        interface IntrinsicElements {
            'stripe-pricing-table': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
        }
    }
}

export default function StripePricingTable({ checkoutSessionSecret }: { checkoutSessionSecret: string }) {
    const [isLongTerm, setIsLongTerm] = useState(false);

    const shortTermId = process.env.NEXT_PUBLIC_STRIPE_PRICING_TABLE_ID;
    const longTermId = process.env.NEXT_PUBLIC_STRIPE_PRICING_TABLE_ID_LONG;

    // Fallback to shortTermId if longTermId is missing but toggled
    const pricingTableId = isLongTerm ? (longTermId || shortTermId) : shortTermId;

    return (
        <div className="w-full flex flex-col items-center">
            <div className="flex bg-slate-100 p-1 rounded-full mb-8 shadow-sm border border-slate-200">
                <Button
                    variant={!isLongTerm ? "default" : "ghost"}
                    size="sm"
                    className="rounded-full px-6 transition-all"
                    onClick={() => setIsLongTerm(false)}
                >
                    Standard
                </Button>
                <Button
                    variant={isLongTerm ? "default" : "ghost"}
                    size="sm"
                    className="rounded-full px-6 transition-all"
                    onClick={() => setIsLongTerm(true)}
                >
                    Long-term
                </Button>
            </div>

            <div key={pricingTableId} className="w-full min-h-[400px]">
                <stripe-pricing-table
                    pricing-table-id={pricingTableId}
                    publishable-key={process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}
                    customer-session-client-secret={checkoutSessionSecret}
                >
                </stripe-pricing-table>
            </div>
        </div>
    )
};
