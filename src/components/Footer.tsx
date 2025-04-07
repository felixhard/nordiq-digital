import Logo from "./branding/Logo";
import Container from "./ui/Container";
import Text from "./ui/Text";
import Link from "next/link";

export default function Footer() {
    const year = new Date().getFullYear();
    const handleScroll = (e: React.MouseEvent, id: string) => {
        e.preventDefault();
        const element = document.getElementById(id);
        element?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <Container>
            <div className="flex flex-col md:flex-row gap-6 items-center justify-between py-12 w-full">
                <div className="flex flex-col gap-2">
                    <Logo onClick={(e) => handleScroll(e, "hero")} />

                    <Text textStyle="body2">
                        Copyright © {year} ArctisDev. All rights reserved.
                    </Text>
                </div>

                <div className="flex w-full md:w-auto gap-12">
                    <div className="flex flex-col gap-4">
                        <Text 
                            textStyle="body2" 
                            onClick={(e) => handleScroll(e, "pricing")}
                            className="cursor-pointer hover:opacity-80"
                        >
                            Pricing
                        </Text>
                    </div>

                    <div className="flex flex-col gap-4">
                        <Text 
                            textStyle="body2" 
                            onClick={(e) => handleScroll(e, "contact")}
                            className="cursor-pointer hover:opacity-80"
                        >
                            Contact
                        </Text>
                    </div>
                </div>
            </div>
        </Container>
    );
}
