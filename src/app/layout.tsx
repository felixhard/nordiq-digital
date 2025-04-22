import AppProviders from "@/providers/appProvider";
import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import { auth } from "./auth";
import "./globals.css";
import { Inter } from "next/font/google";
import StructuredData from "@/components/StructuredData";
import { ThemeProvider } from "@/context/ThemeContext";

const inter = Inter({ subsets: ["latin"] });

// Define metadata for the application
// This will be used by Next.js for SEO and document head
// You can add these to subsequent pages to override these values
// You can also query the database directly using db.blog for example to get dynamic metadata whilst keeping the layout serverside
export const metadata: Metadata = {
    metadataBase: new URL("https://arctisdev.se"),
    title: "ArctisDev - Web Development & SaaS Solutions",
    description: "Expert web development agency specializing in SaaS platforms, custom web solutions, and AI applications. Turn your ideas into reality with our rapid development approach.",
    keywords: "web development, SaaS platforms, AI applications, custom websites, Figma to Frontend, rapid development",
    openGraph: {
        title: "ArctisDev - Web Development & SaaS Solutions",
        description: "Expert web development agency specializing in SaaS platforms, custom web solutions, and AI applications.",
        type: "website",
        url: "https://arctisdev.com",
        images: [
            {
                url: "/og-image.png",
                width: 1200,
                height: 630,
                alt: "ArctisDev",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "ArctisDev - Web Development & SaaS Solutions",
        description: "Expert web development agency specializing in SaaS platforms, custom web solutions, and AI applications.",
        images: ["/og-image.png"],
    },
};

// Root layout component that wraps the entire application
// This is a Next.js specific component that runs on the server
export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    // Get the authentication session
    const session = await auth();

    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <StructuredData />
            </head>
            {/* Apply global styles to the body */}
            <body className="min-h-[100vh] text-content">
                {/* Wrap the app with providers and pass authentication session */}
                <AppProviders session={session}>
                    {/* Client-side theme provider */}
                    <ThemeProvider>
                        {/* Add toast notifications support */}
                        <Toaster />

                        {/* Render child components */}
                        {children}
                    </ThemeProvider>
                </AppProviders>
            </body>
        </html>
    );
}
