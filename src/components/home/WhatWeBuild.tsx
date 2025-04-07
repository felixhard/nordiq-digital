import { FEATURES } from "@/data/features";
import Container from "../ui/Container";
import FadeIn from "../ui/FadeIn";
import SectionHeader from "../ui/SectionHeader";
import Badge from "./Badge";
import FeatureItem from "./FeatureItem";

export default function WhatWeBuild() {
    return (
        <div className="flex flex-col gap-12 items-center justify-center py-20 bg-background-secondary">
            <Container>
                <FadeIn duration={100}>
                    <SectionHeader
                        title="You want it, we build it"
                        badge={<Badge>What we build</Badge>}
                    />
                </FadeIn>

                <FadeIn duration={150}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {FEATURES.map((feature) => (
                            <FeatureItem
                                key={feature.title}
                                title={feature.title}
                                asset={feature.asset}
                                description={feature.description}
                            />
                        ))}
                    </div>
                </FadeIn>

                {/* LÄGG IN FLER BENEFITS HÄR */}
                {/* <FadeIn duration={150}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {FEATURES.map((feature) => (
                            <FeatureItem
                                key={feature.title}
                                title={feature.title}
                                asset={feature.asset}
                                description={feature.description}
                            />
                        ))}
                    </div>
                </FadeIn> */}
            </Container>
        </div>
    );
}