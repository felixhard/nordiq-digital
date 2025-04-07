"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Button from "../ui/Button";
import Input from "../ui/Input";
import { isValidEmail } from "@/utils/validation";

// Props type definition for the authentication form
type AuthFormProps = {
    session: any; // Represents the user's session state
};

export default function AuthForm({ session }: AuthFormProps) {
    // State management for email input and loading state
    const [email, setEmail] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    // Handles the email sign-in form submission
    const handleEmailSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // Prevent default form submission behavior

        // Validate email format
        if (!email || !isValidEmail(email)) {
            setError("Please enter a valid email address");
            return;
        }

        setIsLoading(true);
        setError("");

        try {
            // Send POST request to login API endpoint
            const response = await fetch("/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: email.trim().toLowerCase() }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || "Failed to send email");
                return;
            }

            toast.success("Check your email for the login link!");
            setEmail(""); // Clear the email input
        } catch (error) {
            setError("Failed to send email. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    // Redirect to dashboard if user is already authenticated
    useEffect(() => {
        if (session) {
            window.location.href = "/dashboard";
        }
    }, [session]);

    // Render the sign-in form with email input and submit button
    return (
        <form onSubmit={handleEmailSignIn}>
            <div className="flex flex-col gap-4 w-[300px] mt-4">
                <Input
                    label="Email"
                    type="email"
                    name="email"
                    placeholder="jon@example.com"
                    value={email}
                    onChange={(e) => {
                        setEmail(e.target.value);
                        setError("");
                    }}
                    error={error}
                    autoComplete="email"
                    autoFocus
                />

                <Button 
                    type="submit" 
                    isLoading={isLoading} 
                    width="w-full"
                    disabled={isLoading}
                >
                    Sign In
                </Button>
            </div>
        </form>
    );
}
