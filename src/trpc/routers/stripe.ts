import { db } from "@/db";
import { stripe } from "@/lib/stripe";
import { z } from "zod";
import { privateProcedure, router } from "../trpc";

export const stripeRouter = router({
    // Prepare checkout session for subscription purchase
    prepareCheckout: privateProcedure
        .input(
            z.object({
                email: z.string(),
                planId: z.string(),
            })
        )
        .mutation(async ({ input, ctx }) => {
            if (!ctx.userId) throw new Error("User must be logged in.");

            if (!process.env.BASE_URL) {
                throw new Error(
                    "BASE_URL environment variable is not configured"
                );
            }

            try {
                // Start creating the Stripe checkout session immediately
                // This will run in parallel with our database operations
                const checkoutSessionPromise = (async () => {
                    // Fetch user to get their Stripe customer ID
                    const user = await db.user.findUnique({
                        where: { id: ctx.userId },
                        select: { 
                            id: true, 
                            email: true, 
                            stripeCustomerId: true 
                        }
                    });

                    if (!user) {
                        throw new Error(`User not found. ID: ${ctx.userId}`);
                    }

                    // If user doesn't have a Stripe customer ID, create one
                    let stripeCustomerId = user.stripeCustomerId;
                    if (!stripeCustomerId) {
                        const customer = await stripe.customers.create({
                            email: user.email,
                            metadata: { userId: user.id },
                        });

                        // Update user with new Stripe customer ID
                        await db.user.update({
                            where: { id: user.id },
                            data: { stripeCustomerId: customer.id },
                        });

                        stripeCustomerId = customer.id;
                    }

                    // Create Stripe checkout session
                    return await stripe.checkout.sessions.create({
                        payment_method_types: ["card"],
                        customer: stripeCustomerId,
                        line_items: [
                            {
                                price: input.planId,
                                quantity: 1,
                            },
                        ],
                        mode: "subscription",
                        success_url: new URL(
                            `/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
                            process.env.BASE_URL
                        ).toString(),
                        cancel_url: new URL(
                            "/checkout/cancelled",
                            process.env.BASE_URL
                        ).toString(),
                        metadata: {
                            userId: ctx.userId,
                            email: input.email,
                            planId: input.planId,
                        },
                    });
                })();

                // Wait for the checkout session to be created
                const session = await checkoutSessionPromise;

                return {
                    url: session.url,
                    sessionId: session.id,
                };
            } catch (error) {
                console.error("Stripe checkout error:", error);
                throw new Error(
                    error instanceof Error
                        ? error.message
                        : "Failed to create checkout session"
                );
            }
        }),
});
