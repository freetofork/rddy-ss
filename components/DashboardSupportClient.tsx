"use client";

import { useState, useTransition } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Bell,
    User,
    HelpCircle,
    LogOut,
    UserMinus,
    X,
    Send,
    CheckCircle2,
    MessageSquare,
    Clock,
    Bug,
    Sparkles,
    Copy,
    Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { logout } from "@/app/auth/actions";
import {
    submitSupportTicket,
    markSupportResponsesRead,
} from "@/app/dashboard/support-actions";

export interface SerializedSupportTicket {
    id: string;
    ticketNumber: string;
    category: string;
    message: string;
    adminResponse: string | null;
    status: string;
    isRead: boolean;
    respondedAt: string | null;
    createdAt: string | null;
}

interface DashboardSupportClientProps {
    userEmail: string;
    initialTickets: SerializedSupportTicket[];
}

export default function DashboardSupportClient({
    userEmail,
    initialTickets,
}: DashboardSupportClientProps) {
    const [tickets, setTickets] = useState<SerializedSupportTicket[]>(initialTickets);
    const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
    const [isBellModalOpen, setIsBellModalOpen] = useState(false);

    // Support Form State
    const [category, setCategory] = useState<"Bug Report" | "Feature Request">("Bug Report");
    const [message, setMessage] = useState("");
    const [formError, setFormError] = useState<string | null>(null);
    const [createdTicketNumber, setCreatedTicketNumber] = useState<string | null>(null);
    const [copiedTicket, setCopiedTicket] = useState(false);
    const [isPending, startTransition] = useTransition();

    // Count unread responses (tickets that have an admin_response and isRead === false)
    const unreadResponsesCount = tickets.filter(
        (t) => Boolean(t.adminResponse && t.adminResponse.trim() !== "") && !t.isRead
    ).length;

    const handleOpenBell = () => {
        setIsBellModalOpen(true);
        if (unreadResponsesCount > 0) {
            // Optimistically mark as read in local state and persist in DB
            setTickets((prev) =>
                prev.map((t) =>
                    t.adminResponse ? { ...t, isRead: true } : t
                )
            );
            startTransition(async () => {
                await markSupportResponsesRead();
            });
        }
    };

    const handleOpenSupportModal = () => {
        setFormError(null);
        setCreatedTicketNumber(null);
        setMessage("");
        setCategory("Bug Report");
        setIsSupportModalOpen(true);
    };

    const handleSubmitTicket = (e: React.FormEvent) => {
        e.preventDefault();
        setFormError(null);

        if (!message.trim()) {
            setFormError("Please describe your issue or suggestion before submitting.");
            return;
        }

        startTransition(async () => {
            const res = await submitSupportTicket(category, message);
            if (!res.success || !res.ticketNumber) {
                setFormError(res.error || "Could not submit your request.");
                return;
            }

            const newTicket: SerializedSupportTicket = {
                id: crypto.randomUUID(),
                ticketNumber: res.ticketNumber,
                category,
                message: message.trim(),
                adminResponse: null,
                status: "open",
                isRead: false,
                respondedAt: null,
                createdAt: new Date().toISOString(),
            };

            setTickets((prev) => [newTicket, ...prev]);
            setCreatedTicketNumber(res.ticketNumber);
            setMessage("");
        });
    };

    const handleCopyTicketNumber = (num: string) => {
        navigator.clipboard.writeText(num);
        setCopiedTicket(true);
        setTimeout(() => setCopiedTicket(false), 2000);
    };

    return (
        <>
            <nav className="flex items-center">
                {/* Bell Icon: Notifications & Support Responses */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="mr-2 relative"
                    onClick={handleOpenBell}
                    title="Support Notifications & Responses"
                >
                    <Bell className="h-4 w-4" />
                    {unreadResponsesCount > 0 && (
                        <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#1A96E8] px-1 text-[10px] font-bold text-white shadow-sm">
                            {unreadResponsesCount}
                        </span>
                    )}
                    <span className="sr-only">Notifications</span>
                </Button>

                {/* User Account Dropdown */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <User className="h-4 w-4" />
                            <span className="sr-only">Open user menu</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-52">
                        <DropdownMenuLabel className="font-normal">
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium leading-none">Account</p>
                                <p className="text-xs leading-none text-muted-foreground truncate">
                                    {userEmail}
                                </p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <Link href="#">
                            <DropdownMenuItem className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive">
                                <UserMinus className="mr-2 h-4 w-4" />
                                <span>Delete Account</span>
                            </DropdownMenuItem>
                        </Link>
                        <DropdownMenuItem
                            className="cursor-pointer"
                            onSelect={(e) => {
                                e.preventDefault();
                                handleOpenSupportModal();
                            }}
                        >
                            <HelpCircle className="mr-2 h-4 w-4" />
                            <span>Help &amp; Support</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="p-0">
                            <form action={logout} className="w-full">
                                <button
                                    type="submit"
                                    className="w-full h-full px-2 py-1.5 flex items-center cursor-pointer text-destructive focus:text-destructive"
                                >
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Log out</span>
                                </button>
                            </form>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </nav>

            {/* Help & Support Submission Modal */}
            {isSupportModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-150">
                    <div className="bg-background border border-border rounded-2xl shadow-2xl w-full max-w-lg p-6 relative animate-in zoom-in-95 duration-150">
                        <button
                            onClick={() => setIsSupportModalOpen(false)}
                            className="absolute top-4 right-4 p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>

                        <div className="flex items-center gap-2.5 mb-1">
                            <div className="p-2 rounded-xl bg-primary/10 text-primary">
                                <HelpCircle className="w-5 h-5" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold tracking-tight">Help &amp; Support</h2>
                                <p className="text-xs text-muted-foreground">
                                    Direct line to Ruddy technical staff
                                </p>
                            </div>
                        </div>

                        {createdTicketNumber ? (
                            <div className="mt-5 space-y-4">
                                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-2">
                                    <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                                    <h3 className="text-base font-bold text-foreground">
                                        Request Submitted!
                                    </h3>
                                    <p className="text-xs text-muted-foreground">
                                        Your service tracking number has been generated:
                                    </p>
                                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-background border border-border font-mono text-xs font-bold">
                                        <span>{createdTicketNumber}</span>
                                        <button
                                            type="button"
                                            onClick={() => handleCopyTicketNumber(createdTicketNumber)}
                                            className="text-muted-foreground hover:text-foreground transition-colors"
                                            title="Copy tracking number"
                                        >
                                            {copiedTicket ? (
                                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                                            ) : (
                                                <Copy className="w-3.5 h-3.5" />
                                            )}
                                        </button>
                                    </div>
                                    <p className="text-xs text-muted-foreground pt-1">
                                        When our technical team responds, you will see a notification on the{" "}
                                        <span className="font-semibold text-foreground">Bell icon</span> in the top right corner.
                                    </p>
                                </div>

                                <div className="flex gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="flex-1"
                                        onClick={() => {
                                            setIsSupportModalOpen(false);
                                            setIsBellModalOpen(true);
                                        }}
                                    >
                                        View My Tickets
                                    </Button>
                                    <Button
                                        type="button"
                                        className="flex-1"
                                        onClick={() => setIsSupportModalOpen(false)}
                                    >
                                        Done
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmitTicket} className="mt-4 space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                        Category
                                    </label>
                                    <select
                                        value={category}
                                        onChange={(e) =>
                                            setCategory(e.target.value as "Bug Report" | "Feature Request")
                                        }
                                        className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/30"
                                    >
                                        <option value="Bug Report">Bug Report</option>
                                        <option value="Feature Request">Feature Request</option>
                                    </select>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                        {category === "Bug Report"
                                            ? "Describe the issue"
                                            : "Describe your suggestion"}
                                    </label>
                                    <textarea
                                        rows={5}
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        placeholder={
                                            category === "Bug Report"
                                                ? "Steps to reproduce, expected behavior, or error message..."
                                                : "What feature or workflow improvement would help you most?"
                                        }
                                        className="w-full rounded-lg border border-input bg-background p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                                        required
                                    />
                                </div>

                                {formError && (
                                    <p className="text-xs font-medium text-destructive">{formError}</p>
                                )}

                                <div className="flex justify-end gap-2 pt-1">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setIsSupportModalOpen(false)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={isPending} className="gap-2">
                                        <Send className="w-3.5 h-3.5" />
                                        {isPending ? "Submitting..." : "Submit Ticket"}
                                    </Button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}

            {/* Bell Notifications Pop-up: User Questions & Technical Staff Responses */}
            {isBellModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-150">
                    <div className="bg-background border border-border rounded-2xl shadow-2xl w-full max-w-xl max-h-[82vh] flex flex-col relative animate-in zoom-in-95 duration-150">
                        <div className="p-5 border-b border-border flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                                <div className="p-2 rounded-xl bg-primary/10 text-primary">
                                    <MessageSquare className="w-5 h-5" />
                                </div>
                                <div>
                                    <h2 className="text-base font-bold tracking-tight">
                                        Support Tickets &amp; Responses
                                    </h2>
                                    <p className="text-xs text-muted-foreground">
                                        Your submitted issues, feature requests, and technical staff replies
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsBellModalOpen(false)}
                                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-5 space-y-3">
                            {tickets.length === 0 ? (
                                <div className="text-center py-10 space-y-3">
                                    <Bell className="w-8 h-8 text-muted-foreground/40 mx-auto" />
                                    <div className="space-y-1">
                                        <p className="text-sm font-semibold text-foreground">
                                            No support tickets yet
                                        </p>
                                        <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                                            Need help or have a feature idea? Open Help &amp; Support to send a message to our technical team.
                                        </p>
                                    </div>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => {
                                            setIsBellModalOpen(false);
                                            handleOpenSupportModal();
                                        }}
                                    >
                                        New Support Request
                                    </Button>
                                </div>
                            ) : (
                                tickets.map((t) => {
                                    const hasResponse = Boolean(
                                        t.adminResponse && t.adminResponse.trim() !== ""
                                    );
                                    const isBug = t.category === "Bug Report";
                                    return (
                                        <div
                                            key={t.id}
                                            className="rounded-xl border border-border bg-muted/20 p-4 space-y-3"
                                        >
                                            <div className="flex flex-wrap items-center justify-between gap-2">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-background border border-border">
                                                        {t.ticketNumber}
                                                    </span>
                                                    <span
                                                        className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                                                            isBug
                                                                ? "bg-amber-500/10 text-amber-700"
                                                                : "bg-blue-500/10 text-blue-700"
                                                        }`}
                                                    >
                                                        {isBug ? (
                                                            <Bug className="w-3 h-3" />
                                                        ) : (
                                                            <Sparkles className="w-3 h-3" />
                                                        )}
                                                        {t.category}
                                                    </span>
                                                </div>

                                                <span
                                                    className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                                                        hasResponse
                                                            ? "bg-emerald-500/15 text-emerald-700"
                                                            : "bg-muted text-muted-foreground"
                                                    }`}
                                                >
                                                    {hasResponse ? (
                                                        <>
                                                            <CheckCircle2 className="w-3 h-3" />
                                                            Answered
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Clock className="w-3 h-3" />
                                                            Awaiting Reply
                                                        </>
                                                    )}
                                                </span>
                                            </div>

                                            <div className="space-y-1">
                                                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                                                    Your Message
                                                </p>
                                                <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                                                    {t.message}
                                                </p>
                                            </div>

                                            {hasResponse ? (
                                                <div className="rounded-lg bg-[#1A96E8]/10 border border-[#1A96E8]/25 p-3 space-y-1">
                                                    <p className="text-[11px] font-bold uppercase tracking-wider text-[#1A96E8]">
                                                        Ruddy Technical Staff Response
                                                    </p>
                                                    <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                                                        {t.adminResponse}
                                                    </p>
                                                </div>
                                            ) : (
                                                <p className="text-xs italic text-muted-foreground">
                                                    Our technical team has received your ticket and will respond here soon.
                                                </p>
                                            )}
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        <div className="p-4 border-t border-border flex items-center justify-between bg-muted/10 rounded-b-2xl">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    setIsBellModalOpen(false);
                                    handleOpenSupportModal();
                                }}
                            >
                                + New Ticket
                            </Button>
                            <Button
                                type="button"
                                size="sm"
                                onClick={() => setIsBellModalOpen(false)}
                            >
                                Close
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

