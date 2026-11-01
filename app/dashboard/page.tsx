import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { getStripePlan } from "@/utils/stripe/api"
import { db } from "@/utils/db/db"
import { licenseKeysTable } from "@/utils/db/schema"
import { eq, desc } from "drizzle-orm"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CreditCard, Youtube, ShieldCheck, ExternalLink, PlayCircle, Key } from "lucide-react"
import Link from "next/link"
import { LicenseKeyDisplay } from "@/components/LicenseKeyDisplay"

export default async function Dashboard() {
    const supabase = createClient()

    const { data: { user }, error } = await supabase.auth.getUser()
    if (error || !user) {
        redirect('/login')
    }

    const cleanEmail = user.email!.toLowerCase().trim()
    const stripePlan = await getStripePlan(cleanEmail)
    const userLicenses = await db
        .select()
        .from(licenseKeysTable)
        .where(eq(licenseKeysTable.email, cleanEmail))
        .orderBy(desc(licenseKeysTable.createdAt))

    const activeLicense = userLicenses[0]

    return (
        <main className="flex-1 p-6 lg:p-10 bg-muted/30">
            <div className="max-w-6xl mx-auto space-y-8">
                <div>
                    <h1 className="text-3xl font-black tracking-tight font-display">Dashboard</h1>
                    <p className="text-muted-foreground mt-1 text-sm">Welcome back, {user.email}</p>
                </div>

                {/* License Key Card */}
                <Card className="border-primary/20 shadow-md bg-background">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <div>
                            <CardTitle className="text-sm font-bold uppercase tracking-wider text-primary">Your Ruddy License Key</CardTitle>
                            <CardDescription className="text-xs mt-1">
                                Valid for 1 active device at a time
                            </CardDescription>
                        </div>
                        <Key className="h-5 w-5 text-primary" />
                    </CardHeader>
                    <CardContent className="pt-2">
                        {activeLicense ? (
                            <LicenseKeyDisplay licenseKey={activeLicense.key} />
                        ) : (
                            <p className="text-sm text-muted-foreground">
                                Your license key is being generated. Refresh this page in a few seconds or check your email.
                            </p>
                        )}
                    </CardContent>
                </Card>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* Current Plan Card */}
                    <Card className="border-border/50 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Current Plan</CardTitle>
                            <ShieldCheck className="h-4 w-4 text-primary" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-black font-display">{activeLicense?.plan || stripePlan}</div>
                            <p className="text-xs text-muted-foreground mt-1">Active License</p>
                        </CardContent>
                    </Card>

                    {/* How-to's Card */}
                    <Card className="border-border/50 shadow-sm">
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
                                    href="http://www.youtube.com/@ruddyide"
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
