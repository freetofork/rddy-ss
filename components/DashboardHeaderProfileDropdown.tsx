import { createClient } from "@/utils/supabase/server";
import { db } from "@/utils/db/db";
import { supportTicketsTable } from "@/utils/db/schema";
import { desc, eq } from "drizzle-orm";
import DashboardSupportClient, {
    SerializedSupportTicket,
} from "./DashboardSupportClient";

export default async function DashboardHeaderProfileDropdown() {
    const supabase = createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    const cleanEmail = user?.email?.toLowerCase().trim() || "";
    let initialTickets: SerializedSupportTicket[] = [];

    if (cleanEmail) {
        try {
            const rows = await db
                .select()
                .from(supportTicketsTable)
                .where(eq(supportTicketsTable.email, cleanEmail))
                .orderBy(desc(supportTicketsTable.createdAt));

            initialTickets = rows.map((r) => ({
                id: r.id,
                ticketNumber: r.ticketNumber,
                category: r.category,
                message: r.message,
                adminResponse: r.adminResponse ?? null,
                status: r.status,
                isRead: Boolean(r.isRead),
                respondedAt: r.respondedAt ? r.respondedAt.toISOString() : null,
                createdAt: r.createdAt ? r.createdAt.toISOString() : null,
            }));
        } catch (err) {
            console.warn(
                "[DashboardHeaderProfileDropdown] Could not load support_tickets (run migration SQL if table does not exist yet):",
                err
            );
        }
    }

    return (
        <DashboardSupportClient
            userEmail={user?.email || ""}
            initialTickets={initialTickets}
        />
    );
}
