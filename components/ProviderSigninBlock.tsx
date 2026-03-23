import { FaGoogle, FaGithub } from "react-icons/fa";
import { signInWithGithub, signInWithGoogle } from '@/app/auth/actions'
import { Button } from "@/components/ui/button"
export default function ProviderSigninBlock({ plan }: { plan?: string }) {
    const isGoogleEnabled = process.env.GOOGLE_OAUTH_CLIENT_ID ? true : false
    const isGithubEnabled = process.env.GITHUB_OAUTH_CLIENT_ID ? true : false
    return (
        <>
            <div className="flex flex-row gap-2">
                {isGoogleEnabled && (
                    <form action={signInWithGoogle} className="basis-full">
                        <input type="hidden" name="plan" value={plan || ''} />
                        <Button variant="outline" aria-label="Sign in with Google" type="submit" className="w-full">
                            <FaGoogle />
                        </Button>
                    </form>
                )}
                {isGithubEnabled && (
                    <form action={signInWithGithub} className="basis-full">
                        <input type="hidden" name="plan" value={plan || ''} />
                        <Button variant="outline" aria-label="Sign in with Github" className="w-full">
                            <FaGithub />
                        </Button>
                    </form>
                )}
            </div>
        </>
    )
}
