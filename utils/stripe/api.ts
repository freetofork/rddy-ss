import { Stripe } from 'stripe';
import { db } from '../db/db';
import { usersTable } from '../db/schema';
import { eq } from "drizzle-orm";


export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
const PUBLIC_URL = process.env.NEXT_PUBLIC_WEBSITE_URL || "https://www.ruddy.pro";

export async function getStripePlan(email: string) {
    try {
        const user = await db.select().from(usersTable).where(eq(usersTable.email, email))
        if (!user || user.length === 0 || !user[0].plan || user[0].plan === 'none') return "Free Plan";

        if (!user[0].plan.startsWith('sub_')) {
            return user[0].plan;
        }
        
        const subscription = await stripe.subscriptions.retrieve(user[0].plan);
        const productId = subscription.items.data[0].plan.product as string
        const product = await stripe.products.retrieve(productId)
        return product.name
    } catch (e: any) {
        console.error(`[getStripePlan] Error retrieving plan for ${email}:`, e.message);
        return "No Active Plan";
    }
}

export async function createStripeCustomer(id: string, email: string, name?: string) {
    const customer = await stripe.customers.create({
        name: name ? name : "",
        email: email,
        metadata: {
            supabase_id: id
        }
    });
    // Create a new customer in Stripe
    return customer.id
}

export async function createStripeCheckoutSession(email: string) {
    const user = await db.select().from(usersTable).where(eq(usersTable.email, email))
    const customerSession = await stripe.customerSessions.create({
        customer: user[0].stripe_id,
        components: {
            pricing_table: {
                enabled: true,
            },
        },
    });
    return customerSession.client_secret
}

export async function generateStripeBillingPortalLink(email: string) {
    const user = await db.select().from(usersTable).where(eq(usersTable.email, email))
    const portalSession = await stripe.billingPortal.sessions.create({
        customer: user[0].stripe_id,
        return_url: `${PUBLIC_URL}/dashboard`,
    });
    return portalSession.url
}

export async function createTrialCheckoutSession(email: string | undefined, productId: string) {
    let customerId: string | undefined;
    if (email) {
        try {
            const user = await db.select().from(usersTable).where(eq(usersTable.email, email))
            if (user.length > 0 && user[0].stripe_id) {
                customerId = user[0].stripe_id;
            }
        } catch (dbErr) {
            console.warn("[createTrialCheckoutSession] Failed to fetch user from DB:", dbErr);
        }
    }
    
    // 1. Get the product and its default/active price
    const product = await stripe.products.retrieve(productId, { expand: ['default_price'] })
    let price = product.default_price && typeof product.default_price === 'object'
        ? (product.default_price as Stripe.Price)
        : undefined;

    if (!price || !price.active) {
        const prices = await stripe.prices.list({ product: productId, active: true })
        if (prices.data.length === 0) throw new Error("No active price found for this product")
        // Prefer a custom_unit_amount (PWYW) price if multiple active prices exist
        price = prices.data.find(p => p.custom_unit_amount !== null) || prices.data[0]
    }

    // 2. Identify if it's a subscription (Bubbler, Splash) or a one-time payment (Diver)
    const isSubscription = price.type === 'recurring'
    const isCustomAmount = Boolean(price.custom_unit_amount)

    // 3. Configure the checkout session natively
    const sessionConfig: Stripe.Checkout.SessionCreateParams = {
        ...(customerId ? { customer: customerId } : email ? { customer_email: email } : {}),
        mode: isSubscription ? 'subscription' : 'payment',
        line_items: [{ price: price.id, quantity: 1 }],
        success_url: `${PUBLIC_URL}/subscribe/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: customerId ? `${PUBLIC_URL}/dashboard?canceled=true` : `${PUBLIC_URL}/#pricing`,
        ...(!isCustomAmount ? { allow_promotion_codes: true } : {}),
        ...(isSubscription ? { payment_method_collection: 'if_required' } : {})
    }

    // 4. Force inject the 7-day trial explicitly for subscriptions
    if (isSubscription) {
        sessionConfig.subscription_data = {
            trial_period_days: 7,
            trial_settings: { end_behavior: { missing_payment_method: 'cancel' } }
        }
    }

    try {
        const session = await stripe.checkout.sessions.create(sessionConfig)
        return session.url
    } catch (err: any) {
        // Fallback: if Stripe rejects the stored customerId (e.g. customer deleted or test/live mismatch), retry with customer_email or anonymous
        if (customerId) {
            console.warn("[createTrialCheckoutSession] Retrying checkout without customerId due to error:", err.message);
            delete sessionConfig.customer;
            if (email) {
                sessionConfig.customer_email = email;
            }
            const session = await stripe.checkout.sessions.create(sessionConfig)
            return session.url
        }
        throw err;
    }
}
