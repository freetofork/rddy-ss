import { Stripe } from 'stripe';
import { db } from '../db/db';
import { usersTable } from '../db/schema';
import { eq } from "drizzle-orm";


export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
const PUBLIC_URL = process.env.NEXT_PUBLIC_WEBSITE_URL || "https://www.ruddy.pro";

export async function getStripePlan(email: string) {
    try {
        const user = await db.select().from(usersTable).where(eq(usersTable.email, email))
        if (!user || user.length === 0 || !user[0].plan) return "Free Plan";
        
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

export async function createTrialCheckoutSession(email: string, productId: string) {
    const user = await db.select().from(usersTable).where(eq(usersTable.email, email))
    
    // 1. Get the price for the specific plan
    const prices = await stripe.prices.list({ product: productId, active: true })
    if (prices.data.length === 0) throw new Error("No active price found for this product")
    const price = prices.data[0]

    // 2. Identify if it's a subscription (Bubbler, Splash) or a one-time payment (Diver)
    const isSubscription = price.type === 'recurring'

    // 3. Configure the checkout session natively
    const sessionConfig: Stripe.Checkout.SessionCreateParams = {
        customer: user[0].stripe_id,
        mode: isSubscription ? 'subscription' : 'payment',
        line_items: [{ price: price.id, quantity: 1 }],
        success_url: `${PUBLIC_URL}/dashboard?success=true`,
        cancel_url: `${PUBLIC_URL}/dashboard?canceled=true`,
        payment_method_collection: 'if_required',
    }

    // 4. Force inject the 7-day trial explicitly for subscriptions
    if (isSubscription) {
        sessionConfig.subscription_data = {
            trial_period_days: 7,
            trial_settings: { end_behavior: { missing_payment_method: 'cancel' } }
        }
    }

    const session = await stripe.checkout.sessions.create(sessionConfig)
    return session.url
}
