"use client";

import { trpc } from "@/app/_trpc/client";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import Button from "../ui/Button";
import Card from "../ui/Card";
import Text from "../ui/Text";
import PriceItem from "./PriceItem";
import { toast } from "react-hot-toast";

interface PricingCardProps {
    plan: {
        name: string;
        price: string;
        authUrl: string;
        currency: string;
        features: string[];
        description: string;
        priceId: string;
    };
}

export default function PricingCard({ plan }: PricingCardProps) {
    const { data: session } = useSession();
    const [isLoading, setIsLoading] = useState(false);
    const [isRedirecting, setIsRedirecting] = useState(false);

    // Preload the Stripe customer ID when the component mounts
    useEffect(() => {
        if (session?.user?.email) {
            // Warm up the connection by making a lightweight request
            // This helps reduce the initial latency when the user clicks the button
            const warmupRequest = async () => {
                try {
                    // Make a lightweight request to warm up the connection
                    await fetch('/api/health');
                } catch (error) {
                    // Ignore errors, this is just a warmup
                }
            };
            
            warmupRequest();
        }
    }, [session]);

    const prepareCheckout = trpc.stripe.prepareCheckout.useMutation({
        onSuccess: ({ url }) => {
            if (url) {
                setIsRedirecting(true);
                window.location.href = url;
            }
        },
        onError: (error: unknown) => {
            console.error("Checkout error:", error);
            setIsLoading(false);
        },
    });

    const handleGetStarted = async () => {
        if (plan.name === "Enterprise Plan") {
            const element = document.getElementById("contact");
            element?.scrollIntoView({ behavior: "smooth" });
            return;
        }

        if (!session) {
            window.location.href = plan.authUrl;
            return;
        }

        setIsLoading(true);

        // Optimistically start the checkout process
        await prepareCheckout.mutate({
            email: session.user?.email || "",
            planId: plan.priceId,
        });
    };

    return (
        <Card
            width="w-full"
            padding="p-8"
            bgColor="bg-background"
            border={
                plan.name === "Fullstack MVP"
                    ? "border-x-2 border-t-2"
                    : "border-x border-t"
            }
            borderColor={
                plan.name === "Fullstack MVP" ? "border-primary" : "border-border"
            }
            className={
                plan.name === "Fullstack MVP"
                    ? "shadow-orange -mt-0 mb-0 md:-mt-8 md:mb-8"
                    : ""
            }
        >
            <div className="flex flex-col gap-4 h-full">
                <Text textStyle="h5">{plan.name}</Text>

                <div className="flex gap-2 items-baseline">
                    {plan.name === "Enterprise Plan" ? (
                        <Text textStyle="h3">Book a call</Text>
                    ) : (
                        <>
                            <Text textStyle="h3">
                                ${plan.price} {plan.currency}
                            </Text>
                            <Text textStyle="body2">/month</Text>
                        </>
                    )}
                </div>

                <Text textStyle="body2">{plan.description}</Text>

                <div className="flex flex-col gap-4">
                    {plan.features.map((feature) => (
                        <PriceItem key={feature} value={feature} />
                    ))}
                </div>

                <Button
                    width="w-full"
                    className="mt-auto"
                    onClick={handleGetStarted}
                    disabled={isLoading || isRedirecting}
                    variant={plan.name === "Fullstack MVP" ? "primary" : "tertiary"}
                >
                    {isLoading ? "Preparing checkout..." : isRedirecting ? "Redirecting..." : plan.name === "Enterprise Plan" ? "Book a call" : "Get Started"}
                </Button>
            </div>
        </Card>
    );
}