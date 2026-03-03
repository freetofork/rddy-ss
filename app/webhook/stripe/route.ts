import { db } from '@/utils/db/db'
import { usersTable, licenseKeysTable } from '@/utils/db/schema'
import { eq } from "drizzle-orm";
import { stripe } from "@/utils/stripe/api";
import Stripe from 'stripe';

function generateLicenseKey() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let key = '';
    for (let i = 0; i < 16; i++) {
        if (i > 0 && i % 4 === 0) key += '-';
        key += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return key;
}

export async function POST(req: Request) {
    try {
        const body = await req.text(); // Get raw body for potential verification later
        const event = JSON.parse(body);
        console.log(`[Stripe Webhook] Received event: ${event.type}`);

        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object;
                const email = session.customer_details?.email;
                console.log(`[Stripe Webhook] Checkout completed for email: ${email}`);

                if (!email) {
                    console.error("[Stripe Webhook] ERROR: No email found in checkout session details");
                    break;
                }

                try {
                    // Fetch the session with line items to get the plan/product name
                    const expandedSession = await stripe.checkout.sessions.retrieve(session.id, {
                        expand: ['line_items.data.price.product']
                    });

                    const lineItem = expandedSession.line_items?.data[0];
                    const product = lineItem?.price?.product as Stripe.Product | undefined;
                    const planName = product?.name || lineItem?.description || 'Standard';

                    const licenseKey = generateLicenseKey();
                    console.log(`[Stripe Webhook] Generating key for plan: ${planName}`);

                    await db.insert(licenseKeysTable).values({
                        key: licenseKey,
                        email: email,
                        plan: planName,
                        isUsed: false
                    });

                    console.log(`[Stripe Webhook] SUCCESS: License key ${licenseKey} saved to DB for ${email}`);
                } catch (dbErr) {
                    console.error("[Stripe Webhook] DATABASE ERROR:", dbErr);
                    throw dbErr; // Rethrow to trigger the 400 response
                }
                break;
            }
            case 'customer.subscription.created': {
                const sub = event.data.object;
                console.log(`[Stripe Webhook] Subscription created for customer: ${sub.customer}`);
                await db.update(usersTable).set({ plan: sub.id }).where(eq(usersTable.stripe_id, sub.customer));
                break;
            }
            default:
                console.log(`[Stripe Webhook] Info: Ignored event type ${event.type}`);
        }

        return new Response('Success', { status: 200 })
    } catch (err) {
        console.error("[Stripe Webhook] CRITICAL ERROR:", err);
        return new Response(`Webhook error: ${err instanceof Error ? err.message : "Unknown error"}`, {
            status: 400,
        })
    }
}
