"use server";

import { createClient } from "@/utils/supabase/server";
import { db } from "@/utils/db/db";
import { supportTicketsTable } from "@/utils/db/schema";
import { and, eq, isNotNull } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import crypto from "crypto";

function generateCrmTicketNumber(category: string): string {
    const prefix = category === "Feature Request" ? "REQ" : "BUG";
    const year = new Date().getFullYear();
    const digits = Math.floor(10000 + Math.random() * 90000);
    return `RDY-${prefix}-${year}-${digits}`;
}

export async function submitSupportTicket(
    category: "Bug Report" | "Feature Request",
    message: string
): Promise<{ success: boolean; ticketNumber?: string; error?: string }> {
    try {
        const supabase = createClient();
        const {
            data: { user },
            error: authErr,
        } = await supabase.auth.getUser();

        if (authErr || !user?.email) {
            return { success: false, error: "You must be logged in to submit a request." };
        }

        const trimmedMsg = message.trim();
        if (!trimmedMsg) {
            return { success: false, error: "Please describe your issue or suggestion." };
        }

        const validCategory = category === "Feature Request" ? "Feature Request" : "Bug Report";
        const ticketNumber = generateCrmTicketNumber(validCategory);
        const cleanEmail = user.email.toLowerCase().trim();

        await db.insert(supportTicketsTable).values({
            id: crypto.randomUUID(),
            ticketNumber,
            email: cleanEmail,
            category: validCategory,
            message: trimmedMsg,
            status: "open",
            isRead: false,
        });

        revalidatePath("/dashboard");
        return { success: true, ticketNumber };
    } catch (err) {
        console.error("[SupportTicket] Failed to submit ticket:", err);
        return {
            success: false,
            error: "Failed to submit your ticket. Please ensure the support_tickets table is created.",
        };
    }
}

export async function markSupportResponsesRead(): Promise<{ success: boolean }> {
    try {
        const supabase = createClient();
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user?.email) {
            return { success: false };
        }

        const cleanEmail = user.email.toLowerCase().trim();
        await db
            .update(supportTicketsTable)
            .set({ isRead: true })
            .where(
                and(
                    eq(supportTicketsTable.email, cleanEmail),
                    isNotNull(supportTicketsTable.adminResponse),
                    eq(supportTicketsTable.isRead, false)
                )
            );

        revalidatePath("/dashboard");
        return { success: true };
    } catch (err) {
        console.error("[SupportTicket] Failed to mark responses read:", err);
        return { success: false };
    }
}

