"use server"
import { createClient } from '@/utils/supabase/server'
import { redirect } from "next/navigation"
import { revalidatePath } from 'next/cache'
import { createStripeCustomer, createTrialCheckoutSession } from '@/utils/stripe/api'
import { db } from '@/utils/db/db'
import { usersTable, licenseKeysTable } from '@/utils/db/schema'
import { eq } from 'drizzle-orm'
import crypto from 'crypto'

function generateLicenseKey() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let key = ''
    for (let i = 0; i < 16; i++) {
        if (i > 0 && i % 4 === 0) key += '-'
        key += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return key
}


const PUBLIC_URL = process.env.NEXT_PUBLIC_WEBSITE_URL || "https://www.ruddy.pro"

export async function resetPassword(currentState: { message: string }, formData: FormData) {
    const supabase = createClient()
    const passwordData = {
        password: formData.get('password') as string,
        confirm_password: formData.get('confirm_password') as string,
        code: formData.get('code') as string
    }
    if (passwordData.password !== passwordData.confirm_password) {
        return { message: "Passwords do not match" }
    }

    const { data } = await supabase.auth.exchangeCodeForSession(passwordData.code)

    let { error } = await supabase.auth.updateUser({
        password: passwordData.password
    })
    if (error) {
        return { message: error.message }
    }
    redirect(`/forgot-password/reset/success`)
}


export async function forgotPassword(currentState: { message: string }, formData: FormData) {
    const supabase = createClient()
    const email = formData.get('email') as string
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${PUBLIC_URL}/forgot-password/reset` })

    if (error) {
        return { message: error.message }
    }
    redirect(`/forgot-password/success`)
}


export async function signup(currentState: { message: string }, formData: FormData) {
    const supabase = createClient()

    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
        name: formData.get('name') as string,
    }

    const rawAmount = formData.get('amount') as string | null
    const parsedAmount = rawAmount !== null && rawAmount.trim() !== '' ? parseFloat(rawAmount) : 13.99
    if (isNaN(parsedAmount) || parsedAmount < 0) {
        return { message: "Please enter a valid amount ($0 or at least $0.50)." }
    }
    if (parsedAmount > 0 && parsedAmount < 0.5) {
        return { message: "For paid checkouts, Stripe requires a minimum of $0.50 (or enter 0 for free)." }
    }

    // Block alias trick instantly
    if (data.email.includes('+')) {
        return { message: "Email aliases containing '+' are not permitted for registration." };
    }

    // Check if user exists in our database first
    const existingDBUser = await db.select().from(usersTable).where(eq(usersTable.email, data.email))

    if (existingDBUser.length > 0) {
        return { message: "An account with this email already exists. Please login instead." }
    }

    // TrueList Email Verification
    if (process.env.TRUELIST_API_KEY) {
        try {
            const truelistRes = await fetch('https://api.truelist.io/v1/verify', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${process.env.TRUELIST_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: data.email })
            });

            if (truelistRes.ok) {
                const validation = await truelistRes.json();
                const result = String(validation.result || validation.status || '').toLowerCase();
                const isDisposable = validation.disposable === true || result === 'disposable';
                const isInvalid = result === 'invalid' || result === 'undeliverable';
                
                if (isInvalid || isDisposable) {
                     return { message: "Please provide a valid, non-disposable email address." };
                }
            } else {
                console.warn(`TrueList API returned status ${truelistRes.status}`);
            }
        } catch (e) {
            console.error("TrueList API fetch error:", e);
            // Fail open strategy: assume valid if network/API fails
        }
    }

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
            emailRedirectTo: `${PUBLIC_URL}/auth/callback`,
            data: {
                email_confirm: process.env.NODE_ENV !== 'production',
                full_name: data.name
            }
        }
    })

    if (signUpError) {
        if (signUpError.message.includes("already registered")) {
            return { message: "An account with this email already exists. Please login instead." }
        }
        return { message: signUpError.message }
    }

    if (!signUpData?.user) {
        return { message: "Failed to create user" }
    }

    try {
        // create Stripe Customer Record using signup response data
        const stripeID = await createStripeCustomer(signUpData.user.id, signUpData.user.email!, data.name)

        // Create record in DB
        await db.insert(usersTable).values({
            id: signUpData.user.id,
            name: data.name,
            email: signUpData.user.email!,
            stripe_id: stripeID,
            plan: 'none'
        })
    } catch (err) {
        console.error("Error in signup:", err instanceof Error ? err.message : "Unknown error")
        return { message: "Failed to setup user account" }
    }

    const plan = (formData.get('plan') as string) || 'prod_U7jwhWfAWQuK0z';
    revalidatePath("/", "layout")

    if (parsedAmount === 0) {
        try {
            const cleanEmail = signUpData.user.email!.toLowerCase().trim()
            const licenseKey = generateLicenseKey()
            await db.insert(licenseKeysTable).values({
                id: crypto.randomUUID(),
                key: licenseKey,
                email: cleanEmail,
                plan: 'Diver',
                isUsed: false,
            })
            await db.update(usersTable)
                .set({ plan: 'Diver' })
                .where(eq(usersTable.email, signUpData.user.email!))
        } catch (err) {
            console.error("Failed to generate free license key:", err)
            return { message: "Failed to generate license key" }
        }
        redirect('/subscribe/success')
    }
    
    let checkoutUrl: string | null = null;
    let stripeError: string = "";
    const amountCents = Math.round(parsedAmount * 100);

    if (plan) {
        try {
            checkoutUrl = await createTrialCheckoutSession(data.email, plan, amountCents);
        } catch (e: any) {
            console.error("Failed to create checkout session:", e);
            stripeError = e.message || "Unknown Stripe SDK Error";
        }
    } 
    
    if (checkoutUrl) {
        redirect(checkoutUrl);
    } else if (stripeError) {
        redirect(`/login?message=Stripe Error: ${encodeURIComponent(stripeError)}`);
    } else {
        redirect(`/login?message=System Diagnostics: Plan[${plan || 'EMPTY'}] | Url[${checkoutUrl || 'NULL'}] | Stripe[${stripeError || 'EMPTY'}]`);
    }
}


export async function loginUser(currentState: { message: string }, formData: FormData) {
    const supabase = createClient()

    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }

    const { error } = await supabase.auth.signInWithPassword(data)

    if (error) {
        return { message: error.message }
    }

    revalidatePath('/', 'layout')
    redirect('/dashboard')
}


export async function logout() {
    const supabase = createClient()
    const { error } = await supabase.auth.signOut()
    redirect('/')
}


export async function signInWithGoogle(formData?: FormData) {
    const supabase = createClient()
    const plan = formData?.get('plan') as string;
    const redirectToUrl = plan 
        ? `${PUBLIC_URL}/auth/callback?next=/subscribe?plan=${plan}`
        : `${PUBLIC_URL}/auth/callback`;

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: redirectToUrl,
        },
    })

    if (data.url) {
        redirect(data.url) // use the redirect API for your server framework
    }
}


export async function signInWithGithub(formData?: FormData) {
    const supabase = createClient()
    const plan = formData?.get('plan') as string;
    const redirectToUrl = plan 
        ? `${PUBLIC_URL}/auth/callback?next=/subscribe?plan=${plan}`
        : `${PUBLIC_URL}/auth/callback`;

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
            redirectTo: redirectToUrl,
        },
    })

    if (data.url) {
        redirect(data.url) // use the redirect API for your server framework
    }

}
