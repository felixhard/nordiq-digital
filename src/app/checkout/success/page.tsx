"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Text from "@/components/ui/Text";
import { Iconify } from "@/components/ui/Iconify";
import Logo from "@/components/branding/Logo";
import Link from "next/link";

export default function CheckoutSuccessPage() {
    const router = useRouter();
    const [countdown, setCountdown] = useState(3);

    useEffect(() => {
        // Start countdown immediately
        const interval = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    router.replace("/dashboard");
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [router]);

    return (
        <div className="relative flex flex-col justify-center items-center min-h-[100vh] bg-background">
            <Card width="w-fit" className="bg-background">
                <Logo />
                
                <div className="flex flex-col items-center gap-4 mt-4">
                    <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                        <Iconify icon="material-symbols:check-circle" className="text-4xl text-green-500" />
                    </div>
                    
                    <Text textStyle="h4">Payment Successful!</Text>
                    
                    <Text textStyle="body1" className="text-center max-w-[300px]">
                        Thank you for your subscription. Your account has been upgraded.
                    </Text>
                    
                    <Text textStyle="body2" className="text-content/50">
                        Redirecting to dashboard in {countdown} seconds...
                    </Text>
                    
                    <div className="flex flex-col gap-2 w-[300px] mt-4">
                        <Button 
                            onClick={() => router.replace("/dashboard")}
                            width="w-full"
                        >
                            Go to Dashboard Now
                        </Button>
                    </div>
                </div>
            </Card>

            <Link className="text-content text-[14px] mt-4" href="/">
                Back To Home
            </Link>
        </div>
    );
}
