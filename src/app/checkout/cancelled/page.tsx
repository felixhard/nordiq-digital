import Card from "@/components/ui/Card";
import Logo from "@/components/branding/Logo";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Text from "@/components/ui/Text";

export default function page() {
    return (
        <div className="relative flex flex-col justify-center items-center min-h-[100vh] bg-background">
            <Card width="w-fit" className="bg-background">
                <Logo />
                
                <div className="flex flex-col items-center gap-4 mt-4">
                    <Text textStyle="h4">Checkout Cancelled</Text>
                    <Text textStyle="body1" className="text-content/70 text-center max-w-[300px]">
                        Your checkout process was cancelled. You can try again or return to the home page.
                    </Text>
                    
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

            <Link className="text-content text-[14px] mt-4" href="/">
                Back To Home
            </Link>
        </div>
    );
}
