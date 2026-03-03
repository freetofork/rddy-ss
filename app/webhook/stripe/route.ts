import { db } from '@/utils/db/db'
import { usersTable, licenseKeysTable } from '@/utils/db/schema'
import { eq } from "drizzle-orm";

// Helper to generate a 16-character license key (XXXX-XXXX-XXXX-XXXX)
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

        switch (event.type) {
            // Add this case to handle the checkout completion
            case 'checkout.session.completed': {
                const session = event.data.object;
                const email = session.customer_details?.email;
                if (email) {
                    const licenseKey = generateLicenseKey();
                    await db.insert(licenseKeysTable).values({
                        id: crypto.randomUUID(), // Works in Node.js 19+ / Web APIs
                        key: licenseKey,
                        email: email,
                        is_used: false
                    });
                    console.log(`Generated license key ${licenseKey} for ${email}`);
                    // Suggestion: If you set up an email service later, call it here!
                }
                break;
            }
            case 'customer.subscription.created':
                console.log("Subscription created")
                await db.update(usersTable).set({ plan: event.data.object.id }).where(eq(usersTable.stripe_id, event.data.object.customer));
                break;
            case 'customer.subscription.updated':
            case 'customer.subscription.deleted':
                break;
            default:
                console.log(`Unhandled event type ${event.type}`);
        }

        return new Response('Success', { status: 200 })
    } catch (err) {
        return new Response(`Webhook error: ${err instanceof Error ? err.message : "Unknown error"}`, {
            status: 400,
        })
    }
}
