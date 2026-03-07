import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Bell, ReceiptText, User, Settings, HelpCircle, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { } from "@supabase/supabase-js"
import { createClient } from '@/utils/supabase/server'
import { logout } from '@/app/auth/actions'
import { generateStripeBillingPortalLink } from "@/utils/stripe/api"

export default async function DashboardHeaderProfileDropdown() {
    const supabase = createClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    return (
        <nav className="flex items-center">
            <Button variant="ghost" size="icon" className="mr-2">
                <Bell className="h-4 w-4" />
                <span className="sr-only">Notifications</span>
            </Button>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <User className="h-4 w-4" />
                        <span className="sr-only">Open user menu</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none">Account</p>
                            <p className="text-xs leading-none text-muted-foreground">
                                {user?.email}
                            </p>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <Link href="#">
                        <DropdownMenuItem className="cursor-pointer">
                            <HelpCircle className="mr-2 h-4 w-4" />
                            <span>Help</span>
                        </DropdownMenuItem>
                    </Link>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="p-0">
                        <form action={logout} className="w-full">
                            <button type="submit" className="w-full h-full px-2 py-1.5 flex items-center cursor-pointer text-destructive focus:text-destructive" >
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>Log out</span>
                            </button>
                        </form>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </nav>
    )
}
