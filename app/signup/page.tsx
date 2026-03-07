import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from 'next/link'
import Image from 'next/image'
import SignupForm from "@/components/SignupForm"
import ProviderSigninBlock from "@/components/ProviderSigninBlock"

export default function Signup() {
    return (
        <div className="relative flex items-center justify-center min-h-screen bg-muted p-4 md:p-8">
            <div className="container max-w-6xl flex flex-col md:flex-row items-center gap-8 lg:gap-16">

                {/* Left Side: Signup Card */}
                <div className="w-full md:w-1/2 lg:w-2/5 flex justify-center">
                    <Card className="w-full max-w-[400px] bg-background/90 backdrop-blur-xl border-border/50 shadow-2xl overflow-hidden relative group">
                        {/* Subtle gradient overlay for the card */}
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />

                        <CardHeader className="space-y-1 text-center relative z-10">
                            <div className="flex justify-center py-4">
                                <Link href='/'>
                                    <Image src="/ruddy-icon.png" alt="Ruddy logo" width={48} height={48} className="rounded-xl shadow-md transform group-hover:scale-105 transition-transform duration-300" />
                                </Link>
                            </div>

                            <CardTitle className="text-2xl font-black tracking-tight font-display">Signup</CardTitle>
                            <CardDescription className="text-foreground/60">Create your account now!</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-4 relative z-10">
                            <SignupForm />
                            <div className="relative border-t border-border/50 my-2 pt-4">
                                <div className="absolute inset-0 flex items-center justify-center -top-[1.5px]">
                                    <span className="bg-background px-2 text-[10px] uppercase font-bold tracking-widest text-muted-foreground/60">Or continue with</span>
                                </div>
                            </div>
                            <ProviderSigninBlock />
                        </CardContent>
                        <CardFooter className="flex-col text-center relative z-10 pb-8 pt-2">
                            <Link className="text-sm font-medium text-foreground/60 hover:text-primary transition-colors" href="/login">
                                Have an account? <span className="text-primary underline underline-offset-4 decoration-primary/30">Login</span>
                            </Link>
                        </CardFooter>
                    </Card>
                </div>

                {/* Right Side: Featured Video */}
                <div className="w-full md:w-1/2 lg:w-3/5">
                    <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl border border-border/20 bg-black/5">
                        <video
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="w-full h-full object-cover"
                        >
                            <source src="/ruddy_signup.mp4" type="video/mp4" />
                        </video>
                        {/* Professional sheen/overlay */}
                        <div className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-white/10 rounded-2xl" />
                    </div>
                </div>

            </div>
        </div >
    )
}
