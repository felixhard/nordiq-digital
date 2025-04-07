import Card from "@/components/ui/Card";
import Logo from "@/components/branding/Logo";
import Link from "next/link";
import Button from "@/components/ui/Button";

export default function page() {
    return (
        <div className="relative flex flex-col justify-center items-center min-h-[100vh] bg-background">
            <Card width="w-fit">
                <Logo />
                
                <div className="flex flex-col items-center gap-4 mt-4">
                    <h2 className="text-xl font-semibold">Checkout Cancelled</h2>
                    <p className="text-content/70 text-center max-w-[300px]">
                        Your checkout process was cancelled. You can try again or return to the home page.
                    </p>
                    
                    <div className="flex flex-col gap-2 w-[300px] mt-4">
                        <Link href="/" className="w-full">
                            <Button width="w-full">
                                Return to Home
                            </Button>
                        </Link>
                        
                        <Link href="/#pricing" className="w-full">
                            <Button width="w-full" variant="ghost">
                                View Plans Again
                            </Button>
                        </Link>
                    </div>
                </div>
            </Card>

            <Link className="text-grey-100 text-[14px] mt-4" href="/">
                Back To Home
            </Link>
        </div>
    );
}
