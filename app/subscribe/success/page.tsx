import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

import Link from 'next/link'
import Image from 'next/image'

import ProviderSigninBlock from '@/components/ProviderSigninBlock'
import LoginForm from "@/components/LoginForm"
import { Button } from "@/components/ui/button"
export default function SubscribeSuccess() {
    return (
        <div className="flex items-center justify-center bg-muted min-h-screen">
            <Card className="w-[350px] mx-auto">
                <CardHeader className="space-y-1">
                    <div className="flex justify-center py-4">
                        <Link href='/'>
                            <Image src="/ruddy-icon.png" alt="logo" width={50} height={50} className="rounded-xl shadow-md" />
                        </Link>
                    </div>

                    <CardTitle className="text-2xl font-bold">Thank you!</CardTitle>
                    <CardDescription>Start diving!</CardDescription>
                </CardHeader>

                <CardFooter className="flex-col text-center">
                    <Button className="w-full text-sm " >
                        <Link href="/dashboard">
                            Go To Dashboard
                        </Link>
                    </Button>
                </CardFooter>
            </Card>
        </div >

    )
}
