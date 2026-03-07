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
                        id: crypto.randomUUID(),
                        key: licenseKey,
                        email: email,
                        plan: planName,
                        isUsed: false
                    });

                    console.log(`[Stripe Webhook] SUCCESS: License key ${licenseKey} saved to DB for ${email}`);

                    // --- NEW: SEND EMAIL VIA RESEND ---
                    try {
                        const resendApiKey = process.env.RESEND_API_KEY;
                        if (!resendApiKey) {
                            console.error("[Stripe Webhook] ERROR: RESEND_API_KEY is missing from environment variables!");
                        } else {
                            console.log(`[Stripe Webhook] Sending license email to ${email}...`);
                            const emailRes = await fetch('https://api.resend.com/emails', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${resendApiKey}`
                                },
                                body: JSON.stringify({
                                    from: 'Ruddy <onboarding@resend.dev>', // You can update this once you verify a domain
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

                            const emailData = await emailRes.json();
                            if (emailRes.ok) {
                                console.log(`[Stripe Webhook] SUCCESS: Email sent! ID: ${emailData.id}`);
                            } else {
                                console.error("[Stripe Webhook] EMAIL FAILURE:", emailData);
                            }
                        }
                    } catch (emailErr) {
                        console.error("[Stripe Webhook] EMAIL ERROR:", emailErr);
                        // We don't throw here because the license is already saved in DB
                    }

                } catch (dbErr) {
                    console.error("[Stripe Webhook] DATABASE ERROR:", dbErr);
                    throw dbErr; // Rethrow to trigger the 400 response
                }
                break;
            }
            case 'customer.subscription.created': {
                const sub = event.data.object as Stripe.Subscription;
                console.log(`[Stripe Webhook] Subscription created for customer: ${sub.customer}`);

                // 1. Update local DB with subscription ID
                await db.update(usersTable).set({ plan: sub.id }).where(eq(usersTable.stripe_id, sub.customer as string));

                // 2. Auto-cancel long-term plans (quarterly, semi-annual, yearly) at period end
                const price = sub.items.data[0].price;
                const interval = price.recurring?.interval;
                const intervalCount = price.recurring?.interval_count || 1;

                // isLongTerm: billed in 'year' OR billed in 'month' but > 1 (3 for quarterly, 6 for semi-annual)
                const isLongTerm = interval === 'year' || (interval === 'month' && intervalCount > 1);

                if (isLongTerm) {
                    console.log(`[Stripe Webhook] Enforcing auto-cancel for long-term plan: ${sub.id} (${intervalCount} ${interval})`);
                    await stripe.subscriptions.update(sub.id, {
                        cancel_at_period_end: true
                    });
                }
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
