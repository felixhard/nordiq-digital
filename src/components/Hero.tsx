import { useTheme } from "@/context/ThemeContext";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { NAV_OPTIONS } from "@/data/navigation";
import Badge from "./home/Badge";
import FlickeringGrid from "./special/FlickeringGrid";
import Button from "./ui/Button";
import Container from "./ui/Container";
import FadeIn from "./ui/FadeIn";
import Text from "./ui/Text";
import { SubtleGrid } from "./special/FlickeringGrid";

export default function Hero() {
    const handleScroll = (e: React.MouseEvent, id: string) => {
        e.preventDefault();
        const element = document.getElementById(id);
        element?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <div id="hero" className="relative pointer-events-none">
            <Container>
                <div className="flex flex-col gap-6 items-center justify-center py-40 relative z-10">
                    <FadeIn duration={100}>
                        <Badge>Welcome to ArctisDev</Badge>
                    </FadeIn>

                    <FadeIn duration={150}>
                        <Text textStyle="h1" className="text-center pb-4">
                            Have an idea but <br /> don't know where to start?
                        </Text>
                    </FadeIn>

                    <FadeIn duration={200}>
                        <Text textStyle="body1" alignment="center">
                            We are here to help you build your dream project.
                        </Text>
                    </FadeIn>

                    {/* You can use the email lead or the buttons for CTA  */}
                    {/* <EmailLead /> */}

                    <FadeIn duration={250}>
                        <div className="flex gap-4 items-center pointer-events-auto">
                            <Button 
                                onClick={(e) => handleScroll(e, "contact")}
                                className="bg-primary backdrop-blur-md"
                            >
                                Get Started
                            </Button>
                            <Button 
                                variant="secondary" 
                                onClick={(e) => handleScroll(e, "faq")}
                                className="bg-background-secondary backdrop-blur-md"
                            >
                                Learn More
                            </Button>
                        </div>
                    </FadeIn>
                </div>
            </Container>

            <div className="absolute inset-0 overflow-hidden z-0">
                <FlickeringGrid maxOpacity={0.5} />
            </div>
        </div>
    );
}