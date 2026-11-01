import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from 'next/link'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { createClient } from '@/utils/supabase/server'
import { db } from '@/utils/db/db'
import { licenseKeysTable, usersTable } from '@/utils/db/schema'
import { eq, desc } from 'drizzle-orm'
import { stripe } from '@/utils/stripe/api'
import Stripe from 'stripe'
import crypto from 'crypto'
import { LicenseKeyDisplay } from '@/components/LicenseKeyDisplay'

function generateLicenseKey() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let key = ''
    for (let i = 0; i < 16; i++) {
        if (i > 0 && i % 4 === 0) key += '-'
        key += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return key
}

export default async function SubscribeSuccess({ searchParams }: { searchParams?: { session_id?: string } }) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    let email = user?.email?.toLowerCase().trim()
    let licenseKey: string | null = null

    const sessionId = searchParams?.session_id
    if (sessionId) {
        try {
            const expandedSession = await stripe.checkout.sessions.retrieve(sessionId, {
                expand: ['line_items.data.price.product']
            })
            if (expandedSession.payment_status === 'paid' || expandedSession.status === 'complete') {
                const sessionEmail = (expandedSession.customer_details?.email || email)?.toLowerCase().trim()
                if (sessionEmail) {
                    email = sessionEmail
                    const existing = await db
                        .select()
                        .from(licenseKeysTable)
                        .where(eq(licenseKeysTable.email, sessionEmail))
                        .orderBy(desc(licenseKeysTable.createdAt))

                    if (existing.length > 0) {
                        licenseKey = existing[0].key
                    } else {
                        const lineItem = expandedSession.line_items?.data?.[0]
                        const product = lineItem?.price?.product as Stripe.Product | undefined
                        const planName = product?.name || lineItem?.description || 'Diver'
                        const newKey = generateLicenseKey()

                        await db.insert(licenseKeysTable).values({
                            id: crypto.randomUUID(),
                            key: newKey,
                            email: sessionEmail,
                            plan: planName,
                            isUsed: false,
                        })

                        await db.update(usersTable)
                            .set({ plan: planName })
                            .where(eq(usersTable.email, sessionEmail))

                        licenseKey = newKey
                    }
                }
            }
        } catch (err) {
            console.error("[SubscribeSuccess] Failed to verify session:", err)
        }
    }

    if (!licenseKey && email) {
        const existing = await db
            .select()
            .from(licenseKeysTable)
            .where(eq(licenseKeysTable.email, email))
            .orderBy(desc(licenseKeysTable.createdAt))

        if (existing.length > 0) {
            licenseKey = existing[0].key
        }
    }

    return (
        <div className="flex items-center justify-center bg-muted min-h-screen p-4">
            <Card className="w-full max-w-md mx-auto">
                <CardHeader className="space-y-1 text-center">
                    <div className="flex justify-center py-4">
                        <Link href='/'>
                            <Image src="/ruddy-icon.png" alt="logo" width={50} height={50} className="rounded-xl shadow-md" />
                        </Link>
                    </div>

                    <CardTitle className="text-2xl font-bold">Thank you!</CardTitle>
                    <CardDescription>Your Ruddy license key is ready. Start diving!</CardDescription>
                </CardHeader>

                {licenseKey && (
                    <CardContent>
                        <LicenseKeyDisplay licenseKey={licenseKey} />
                    </CardContent>
                )}

                <CardFooter className="flex-col text-center">
                    <Button asChild className="w-full text-sm">
                        <Link href="/dashboard">
                            Go To Member Area (Dashboard)
                        </Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}
