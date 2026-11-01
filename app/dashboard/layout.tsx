import DashboardHeader from "@/components/DashboardHeader";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { createClient } from '@/utils/supabase/server'
import { redirect } from "next/navigation"
import { db } from '@/utils/db/db'
import { usersTable, licenseKeysTable } from '@/utils/db/schema'
import { eq } from "drizzle-orm";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Ruddy - Member Area",
    description: "Manage your Ruddy license key and workspace access.",
    icons: {
        icon: "/ruddy-icon.png?v=2",
        shortcut: "/ruddy-icon.png?v=2",
        apple: "/ruddy-icon.png?v=2",
    },
};

export default async function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    // Check if user has plan selected. If not redirect to subscibe
    const supabase = createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user?.email) {
        return redirect('/login')
    }

    // check user plan or license key in db
    const checkUserInDB = await db.select().from(usersTable).where(eq(usersTable.email, user.email))
    const checkLicenseInDB = await db.select().from(licenseKeysTable).where(eq(licenseKeysTable.email, user.email.toLowerCase().trim()))

    const hasPlan = checkUserInDB.length > 0 && checkUserInDB[0].plan && checkUserInDB[0].plan !== "none"
    const hasLicense = checkLicenseInDB.length > 0

    if (!hasPlan && !hasLicense) {
        console.log("User has no plan selected or license key")
        return redirect('/subscribe')
    }


    return (
        <>
            <DashboardHeader />
            {children}
        </>
    );
}
