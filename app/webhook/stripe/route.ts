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

export async function GET() {
    return new Response('Stripe Webhook Endpoint is Running', { status: 200 });
}

export async function POST(req: Request) {
    console.log("[Stripe Webhook] POST hit");
    try {
        const body = await req.text();
        const event = JSON.parse(body);
        console.log(`[Stripe Webhook] Event Type: ${event.type} | ID: ${event.id}`);

        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object as Stripe.Checkout.Session;
                let email = session.customer_details?.email;
                const customerId = session.customer as string;

                console.log(`[Stripe Webhook] Session: ${session.id} | Email: ${email} | Customer: ${customerId}`);

                // Fallback: If email is missing in session details, fetch it from the customer object
                if (!email && customerId) {
                    console.log(`[Stripe Webhook] Fetching customer ${customerId} for email fallback...`);
                    const customer = await stripe.customers.retrieve(customerId);
                    if (!customer.deleted && 'email' in customer) {
                        email = customer.email;
                        console.log(`[Stripe Webhook] Found email from customer object: ${email}`);
                    }
                }

                if (!email) {
                    console.error("[Stripe Webhook] ERROR: Could not determine user email for checkout session");
                    break;
                }

                try {
                    const expandedSession = await stripe.checkout.sessions.retrieve(session.id, {
                        expand: ['line_items.data.price.product']
                    });

                    const lineItem = expandedSession.line_items?.data?.[0];
                    if (!lineItem) {
                        console.error("[Stripe Webhook] ERROR: No line items found in session expansion");
                        break;
                    }

                    const product = lineItem?.price?.product as Stripe.Product | undefined;
                    const planName = product?.name || lineItem?.description || 'Standard';

                    const licenseKey = generateLicenseKey();
                    console.log(`[Stripe Webhook] Plan: ${planName} | License: ${licenseKey}`);

                    await db.insert(licenseKeysTable).values({
                        id: crypto.randomUUID(),
                        key: licenseKey,
                        email: email,
                        plan: planName,
                        isUsed: false
                    });

                    console.log(`[Stripe Webhook] SUCCESS: License key saved for ${email}`);

                    // --- SEND EMAIL ---
                    try {
                        const resendApiKey = process.env.RESEND_API_KEY;
                        if (!resendApiKey) {
                            console.error("[Stripe Webhook] ERROR: RESEND_API_KEY is missing!");
                        } else {
                            const emailRes = await fetch('https://api.resend.com/emails', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${resendApiKey}`
                                },
                                body: JSON.stringify({
                                    from: 'Ruddy <onboarding@resend.dev>',
                                    to: email,
                                    subject: 'Your Ruddy License Key',
                                    html: `
                                        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #F0E6D3; border-radius: 20px; background-color: #FFF5E6;">
                                            <h1 style="color: #4F2C1E;">Welcome to Ruddy! 🦆</h1>
                                            <p style="font-size: 16px; color: #4F2C1E;">Your workspace is ready. Use the license key below to unlock your application:</p>
                                            <div style="background: white; padding: 15px; border-radius: 12px; font-family: monospace; font-size: 20px; font-weight: bold; text-align: center; border: 2px dashed #1A96E8; color: #1A96E8; margin: 20px 0;">
                                                ${licenseKey}
                                            </div>
                                            <p style="font-size: 14px; color: #4F2C1E; opacity: 0.7;">Plan: <strong>${planName}</strong></p>
                                            <hr style="border: none; border-top: 1px solid #F0E6D3; margin: 20px 0;">
                                            <p style="font-size: 12px; color: #4F2C1E; opacity: 0.5;">If you have any questions, just reply to this email.</p>
                                        </div>
                                    `
                                })
                            });

                            if (emailRes.ok) {
                                console.log(`[Stripe Webhook] SUCCESS: Email sent to ${email}`);
                            } else {
                                const emailData = await emailRes.json();
                                console.error("[Stripe Webhook] EMAIL FAILURE:", emailData);
                            }
                        }
                    } catch (emailErr) {
                        console.error("[Stripe Webhook] EMAIL EXCEPTION:", emailErr);
                    }

                } catch (err) {
                    console.error("[Stripe Webhook] CHECKOUT PROCESSING ERROR:", err);
                    throw err;
                }
                break;
            }
            case 'customer.subscription.created':
            case 'customer.subscription.updated': {
                const sub = event.data.object as Stripe.Subscription;
                const customerId = sub.customer as string;
                console.log(`[Stripe Webhook] Sub: ${sub.id} | Event: ${event.type} | Customer: ${customerId}`);

                if (!customerId) {
                    console.error("[Stripe Webhook] ERROR: No customer ID in sub event");
                    break;
                }

                // 1. Update local DB
                try {
                    const result = await db.update(usersTable)
                        .set({ plan: sub.id })
                        .where(eq(usersTable.stripe_id, customerId));

                    // Log more info about the update result
                    console.log(`[Stripe Webhook] DB Update result:`, JSON.stringify(result));
                } catch (dbErr) {
                    console.error("[Stripe Webhook] SUBSCRIPTION DB ERROR:", dbErr);
                }

                // 2. Auto-cancel
                const price = sub.items?.data?.[0]?.price;
                if (!price) {
                    console.warn(`[Stripe Webhook] No price for sub ${sub.id}`);
                    break;
                }

                const interval = price.recurring?.interval;
                const intervalCount = price.recurring?.interval_count || 1;
                const isLongTerm = interval === 'year' || (interval === 'month' && intervalCount > 1);

                if (isLongTerm && !sub.cancel_at_period_end) {
                    console.log(`[Stripe Webhook] Enforcing auto-cancel for ${sub.id}`);
                    try {
                        await stripe.subscriptions.update(sub.id, { cancel_at_period_end: true });
                        console.log(`[Stripe Webhook] SUCCESS: Auto-cancel enabled`);
                    } catch (stripeErr) {
                        console.error(`[Stripe Webhook] STRIPE UPDATE ERROR:`, stripeErr);
                    }
                }
                break;
            }
            default:
                console.log(`[Stripe Webhook] Ignored event: ${event.type}`);
        }

        return new Response('Webhook handled successfully', { status: 200 })
    } catch (err) {
        console.error("[Stripe Webhook] CRITICAL EXCEPTION:", err);
        return new Response(`Webhook Error: ${err instanceof Error ? err.message : "Internal Server Error"}`, { status: 400 });
    }
}
