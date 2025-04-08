// Import necessary dependencies
import { getTierFromPriceId, getTierName } from "@/config";
import { db } from "@/db";
import { sendEmail } from "@/lib/resend";
import { stripe } from "@/lib/stripe";
import { SubscriptionTier } from "@prisma/client";
import { headers } from "next/headers";
import Stripe from "stripe";

// Get the webhook secret from environment variables
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

// Define the POST handler for Stripe webhooks
export async function POST(request: Request) {
    try {
        console.log("Webhook received - processing request");
        
        // Get the raw request body as text
        const body = await request.text();
        const signature = headers().get("stripe-signature");

        if (!signature) {
            console.error("No Stripe signature found in request headers");
            return new Response(
                JSON.stringify({ error: "No signature found" }),
                { status: 400 }
            );
        }

        // Log request details for debugging
        console.log("Request details:", {
            signature,
            bodyLength: body.length,
            webhookSecretLength: webhookSecret?.length || 0,
            hasWebhookSecret: !!webhookSecret,
            headers: Object.fromEntries(headers().entries()),
        });

        // Verify the webhook signature to ensure it's from Stripe
        let event: Stripe.Event;
        try {
            event = stripe.webhooks.constructEvent(
                body,
                signature,
                webhookSecret
            );
            console.log("Successfully constructed Stripe event");
        } catch (err) {
            console.error("Webhook signature verification failed:", err);
            // Log more details about the error
            if (err instanceof Error) {
                console.error("Error details:", {
                    message: err.message,
                    name: err.name,
                    stack: err.stack,
                });
            }
            return new Response(
                JSON.stringify({ 
                    error: "Webhook signature verification failed",
                    details: err instanceof Error ? err.message : "Unknown error"
                }),
                { status: 400 }
            );
        }

        console.log("Webhook event type:", event.type);
        console.log("Webhook event data:", JSON.stringify(event.data, null, 2));

        // Handle different types of subscription events
        switch (event.type) {
            case "customer.subscription.deleted":
                // Handle subscription cancellation
                const deletedSubscription = event.data
                    .object as Stripe.Subscription;
                console.log("Processing subscription deletion:", {
                    type: event.type,
                    subscriptionId: deletedSubscription.id,
                });

                // Find user BEFORE updating
                const cancelledUser = await db.user.findFirst({
                    where: { subscriptionId: deletedSubscription.id },
                });

                console.log("Found user for cancellation:", cancelledUser?.id);

                // Update user record to remove subscription details
                await db.user.updateMany({
                    where: { subscriptionId: deletedSubscription.id },
                    data: {
                        subscriptionStatus: "cancelled",
                        subscriptionId: null,
                        subscriptionPlan: "FREE" as SubscriptionTier,
                    },
                });

                console.log("Updated user subscription status to cancelled");

                // Send cancellation email
                if (cancelledUser?.email) {
                    await sendEmail({
                        to: cancelledUser.email,
                        subject: "Subscription Cancelled",
                        text: "Your subscription has been cancelled. We are sorry to see you go!",
                        html: `
                            <h1>Subscription Cancelled</h1>
                            <p>Your subscription has been cancelled. We're sorry to see you go!</p>
                            <p>You can resubscribe at any time to regain access to premium features.</p>
                        `,
                    });
                }
                break;

            case "customer.subscription.updated":
                // Handle subscription updates
                const updatedSubscription = event.data
                    .object as Stripe.Subscription;
                console.log("Processing subscription update:", {
                    type: event.type,
                    subscriptionId: updatedSubscription.id,
                    status: updatedSubscription.status,
                });
                
                // Update the subscription status in our database
                await db.user.updateMany({
                    where: { subscriptionId: updatedSubscription.id },
                    data: {
                        subscriptionStatus: updatedSubscription.status,
                    },
                });
                
                console.log("Updated subscription status in database");
                break;

            case "checkout.session.completed":
                // Handle successful checkout completion
                const session = event.data.object as Stripe.Checkout.Session;
                console.log("Processing checkout completion:", {
                    sessionId: session.id,
                    customerId: session.customer,
                    subscriptionId: session.subscription,
                    metadata: session.metadata,
                });

                if (!session.subscription) {
                    console.error("No subscription ID found in session");
                    break;
                }

                // Fetch the complete subscription details from Stripe
                const subscription = await stripe.subscriptions.retrieve(
                    session.subscription as string
                );

                console.log("Retrieved subscription details:", {
                    subscriptionId: subscription.id,
                    status: subscription.status,
                    items: subscription.items.data.map(item => ({
                        priceId: item.price.id,
                        interval: item.price.recurring?.interval,
                    })),
                });

                // Get the subscription interval (monthly/yearly)
                const subscriptionType =
                    subscription.items.data[0]?.price.recurring?.interval ||
                    null;

                // Find the user by their Stripe customer ID
                const user = await db.user.findFirst({
                    where: {
                        stripeCustomerId: session.customer as string,
                    },
                });

                console.log("Found user for subscription:", {
                    userId: user?.id,
                    email: user?.email,
                    stripeCustomerId: user?.stripeCustomerId,
                    currentSubscriptionPlan: user?.subscriptionPlan,
                    currentSubscriptionStatus: user?.subscriptionStatus,
                });

                // Handle the case where the user is not found
                if (!user) {
                    console.error(
                        "User not found for Stripe customer:",
                        session.customer
                    );
                    break;
                }

                // Get the price ID from the subscription
                const priceId = subscription.items.data[0]?.price.id;
                const subscriptionTier = getTierFromPriceId(priceId);
                const tierName = getTierName(subscriptionTier);

                console.log("Subscription details:", {
                    priceId,
                    subscriptionTier,
                    tierName,
                    subscriptionType,
                });

                try {
                    // Update user's subscription information in database
                    const updatedUser = await db.user.update({
                        where: {
                            id: user.id,
                        },
                        data: {
                            subscriptionId: session.subscription as string,
                            subscriptionPlan: subscriptionTier,
                            subscriptionStatus: "active",
                            subscriptionType: subscriptionType,
                        },
                    });

                    console.log("Successfully updated user subscription in database:", {
                        userId: updatedUser.id,
                        subscriptionId: updatedUser.subscriptionId,
                        subscriptionPlan: updatedUser.subscriptionPlan,
                        subscriptionStatus: updatedUser.subscriptionStatus,
                        subscriptionType: updatedUser.subscriptionType,
                    });

                    // Send welcome email
                    if (user.email) {
                        await sendEmail({
                            to: user.email,
                            subject: "Welcome to ArctisDev!",
                            text: `Thank you for subscribing to our ${tierName} plan!`,
                            html: `
                                <h1>Welcome to ArctisDev!</h1>
                                <p>Thank you for subscribing to our ${tierName} plan!</p>
                                <p>You now have access to all ${tierName} features.</p>
                                <p>Subscription type: ${subscriptionType}</p>
                            `,
                        });
                    }
                } catch (error) {
                    console.error("Error updating user subscription:", error);
                    throw error;
                }
                break;
        }

        // Return success response
        return new Response(JSON.stringify({ received: true }), {
            status: 200,
        });
    } catch (error) {
        // Log and return error response if something goes wrong
        console.error("Webhook error:", error);
        return new Response(
            JSON.stringify({ error: "Webhook handler failed" }),
            {
                status: 400,
            }
        );
    }
}
