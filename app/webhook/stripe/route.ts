import { db } from '@/utils/db/db'
import { usersTable, licenseKeysTable } from '@/utils/db/schema'
import { eq } from "drizzle-orm";

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
        const event = await req.json()
        console.log(`Webhook received event: ${event.type}`);

        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object;
                const email = session.customer_details?.email;
                if (email) {
                    const licenseKey = generateLicenseKey();
                    await db.insert(licenseKeysTable).values({
                        id: crypto.randomUUID(),
                        key: licenseKey,
                        email: email,
                    });
                    console.log(`SUCCESS: Generated license key ${licenseKey} for ${email}`);
                } else {
                    console.error("ERROR: No email found in checkout session details");
                }
                break;
            }
            case 'customer.subscription.created': {
                const sub = event.data.object;
                console.log(`Subscription created for customer: ${sub.customer}`);
                await db.update(usersTable).set({ plan: sub.id }).where(eq(usersTable.stripe_id, sub.customer));
                break;
            }
            default:
                console.log(`Info: Ignored event type ${event.type}`);
        }

        return new Response('Success', { status: 200 })
    } catch (err) {
        console.error("Webhook processing error:", err);
        return new Response(`Webhook error: ${err instanceof Error ? err.message : "Unknown error"}`, {
            status: 400,
        })
    }
}
