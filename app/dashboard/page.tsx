import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { getStripePlan } from "@/utils/stripe/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CreditCard, Youtube, ShieldCheck, ExternalLink, PlayCircle } from "lucide-react"
import Link from "next/link"

export default async function Dashboard() {
    const supabase = createClient()

    const { data: { user }, error } = await supabase.auth.getUser()
    if (error || !user) {
        redirect('/login')
    }

    const stripePlan = await getStripePlan(user.email!)

    return (
        <main className="flex-1 p-6 lg:p-10 bg-muted/30">
            <div className="max-w-6xl mx-auto space-y-8">
                <div>
                    <h1 className="text-3xl font-black tracking-tight font-display">Dashboard</h1>
                    <p className="text-muted-foreground mt-1 text-sm">Welcome back, {user.email}</p>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {/* Current Plan Card */}
                    <Card className="border-border/50 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Current Plan</CardTitle>
                            <ShieldCheck className="h-4 w-4 text-primary" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-black font-display">{stripePlan}</div>
                            <p className="text-xs text-muted-foreground mt-1">Active Subscription</p>
                        </CardContent>
                    </Card>

                    {/* Manage Subscription Card */}
                    <Card className="md:col-span-2 lg:col-span-1 border-border/50 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Subscription</CardTitle>
                            <CreditCard className="h-4 w-4 text-primary" />
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm text-foreground/80 leading-relaxed">
                                Need to update your billing details or cancel your plan? You can manage your subscription directly in the Stripe portal.
                            </p>
                            <Button asChild className="w-full" variant="outline">
                                <a
                                    href="https://billing.stripe.com/p/login/test_9B6aEXaU18QUftyaihbbG00"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-2"
                                >
                                    Manage in Stripe <ExternalLink className="h-3 w-3" />
                                </a>
                            </Button>
                        </CardContent>
                    </Card>

                    {/* How-to's Card */}
                    <Card className="lg:col-span-1 border-border/50 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Learning Center</CardTitle>
                            <Youtube className="h-4 w-4 text-red-500" />
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm text-foreground/80 leading-relaxed">
                                Master Ruddy with our detailed video tutorials and how-to guides on YouTube.
                            </p>
                            <Button asChild className="w-full bg-[#FF0000] hover:bg-[#CC0000] text-white">
                                <a
                                    href="https://www.youtube.com/@ruddyapp"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-2"
                                >
                                    Watch Tutorials <PlayCircle className="h-4 w-4" />
                                </a>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </main>
    )
}
