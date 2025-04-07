import Button from "../ui/Button";
import Link from "next/link";

export default function StripePortal() {
    return (
        <div className="flex gap-4">
            {/* Dashboard Button */}
            <Button
                onClick={() => {
                    window.open(
                        "https://billing.stripe.com/p/login/test_dR615r78jdw15iweUU",
                        "_blank"
                    );
                }}
            >
                Dashboard
            </Button>

            {/* Home Button */}
            <Link href="/">
                <Button variant="secondary">Home</Button>
            </Link>
        </div>
    );
}
