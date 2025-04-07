import { NAV_OPTIONS } from "@/data/navigation";
import Badge from "./home/Badge";
import FlickeringGrid from "./special/FlickeringGrid";
import Button from "./ui/Button";
import Container from "./ui/Container";
import FadeIn from "./ui/FadeIn";
import Text from "./ui/Text";

export default function Hero() {
    const handleScroll = (e: React.MouseEvent, id: string) => {
        e.preventDefault();
        const element = document.getElementById(id);
        element?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <div id="hero" className="relative pointer-events-none">
            <Container>
                <div className="flex flex-col gap-6 items-center justify-center py-40 z-0">
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
                            <Button onClick={(e) => handleScroll(e, "contact")}>Get Started</Button>
                            <Button variant="secondary" onClick={(e) => handleScroll(e, "faq")}>Learn More</Button>
                        </div>
                    </FadeIn>
                </div>
            </Container>

            <div className="w-full h-full absolute top-0 left-0 z-0 opacity-30 pointer-events-none">
                <FlickeringGrid maxOpacity={0.5} color="rgb(255, 255, 255)" />
            </div>
        </div>
    );
}