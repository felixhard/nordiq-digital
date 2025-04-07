import config from "@/config";
import { db } from "@/db";
import { stripe } from "@/lib/stripe";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { SubscriptionTier } from "@prisma/client";
import NextAuth, { DefaultSession } from "next-auth";
import ResendProvider from "next-auth/providers/resend";
import { AdapterUser } from "next-auth/adapters";

// Extend NextAuth's Session type to include a custom user ID field
declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            subscriptionPlan: SubscriptionTier;
            subscriptionStatus?: string;
            subscriptionType?: string;
        } & DefaultSession["user"];
    }
}

// Extend the AdapterUser type to include our custom fields
declare module "next-auth/adapters" {
    interface AdapterUser {
        subscriptionPlan: SubscriptionTier;
        subscriptionStatus?: string;
        subscriptionType?: string;
    }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
    // Configure Prisma adapter for database integration
    adapter: PrismaAdapter(db),

    // Set up Resend as the email provider for authentication
    providers: [
        ResendProvider({
            from: config.resend.admin,
            apiKey: process.env.RESEND_API_KEY,
        }),
    ],

    callbacks: {
        // Handle post-authentication redirects
        // Redirects to dashboard if user lands on home page after auth
        async redirect({ url, baseUrl }) {
            // Always redirect to dashboard after successful authentication
            if (url.startsWith(baseUrl)) {
                return `${baseUrl}/dashboard`;
            }
            // Allow external URLs (like Stripe checkout) to work
            if (url.startsWith("http")) {
                return url;
            }
            // Default to dashboard for any other internal URLs
            return `${baseUrl}/dashboard`;
        },

        // Customize session data with additional user information
        // Fetches and includes user ID, email, and name
        session: async ({ session, user }) => {
            if (session?.user) {
                session.user.id = user.id;
                session.user.email = user.email;
                session.user.name = user.name;
                session.user.subscriptionPlan = user.subscriptionPlan;
                session.user.subscriptionStatus = user.subscriptionStatus ?? undefined;
                session.user.subscriptionType = user.subscriptionType ?? undefined;
            }
            return session;
        },

        // Handle Stripe customer initialization
        // Creates a Stripe customer for new users if they don't have one
        async signIn({ user }) {
            if (user.email) {
                const existingUser = await db.user.findUnique({
                    where: { id: user.id },
                    select: { stripeCustomerId: true, email: true },
                });

                if (existingUser && !existingUser.stripeCustomerId) {
                    try {
                        const customer = await stripe.customers.create({
                            email: user.email,
                        });
                        await db.user.update({
                            where: { id: user.id },
                            data: { stripeCustomerId: customer.id },
                        });
                    } catch (error) {
                        console.error("Error creating Stripe customer:", error);
                    }
                }
            }
            return true;
        },
    },

    // Define custom authentication page routes
    pages: {
        signIn: "/auth/signin",
        signOut: "/auth/signout",
        error: "/auth/error",
        verifyRequest: "/auth/verify-request",
    },

    // Configure session handling to use database strategy
    // Sessions expire after 30 days
    session: {
        strategy: "database",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
});