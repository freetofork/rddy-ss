"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useFormState, useFormStatus } from 'react-dom'
import { signup } from '@/app/auth/actions'

export default function SignupForm({ plan }: { plan?: string }) {
    const initialState = {
        message: ''
    }

    const [formState, formAction] = useFormState(signup, initialState)
    const { pending } = useFormStatus()

    return (
        <form action={formAction}>
            <input type="hidden" name="plan" value={plan || 'prod_U7jwhWfAWQuK0z'} />
            <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    name="name"
                    autoComplete="name"
                    required
                />
            </div>
            <div className="grid gap-2 mt-2">
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    name="email"
                    autoComplete="username"
                    required
                />
            </div>
            <div className="grid gap-2 mt-2">
                <Label htmlFor="password">Password</Label>
                <Input
                    id="password"
                    type="password"
                    name="password"
                    autoComplete="new-password"
                    required
                />
            </div>
            <div className="grid gap-2 mt-2">
                <Label htmlFor="amount">Pay What You Want (USD $)</Label>
                <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    min="0"
                    defaultValue="13.99"
                    placeholder="13.99 (or 0 for free)"
                    name="amount"
                    required
                />
                <p className="text-[11px] text-muted-foreground">
                    Suggested $13.99 — enter <strong>0</strong> to get your license key for free.
                </p>
            </div>
            <Button className="w-full mt-4" type="submit" aria-disabled={pending}>
                {pending ? 'Submitting...' : 'Sign up & Get Ruddy'}
            </Button>
            {formState?.message && (
                <p role="status" aria-live="polite" className="text-sm text-red-500 text-center py-2">{formState.message}</p>
            )}
        </form>
    )
}
