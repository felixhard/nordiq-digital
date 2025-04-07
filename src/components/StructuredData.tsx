export default function StructuredData() {
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "ArctisDev",
        "description": "Expert web development agency specializing in SaaS platforms, custom web solutions, and AI applications.",
        "url": "https://arctisdev.se",
        "logo": "https://arctisdev.se/logo.png",
        "sameAs": [
            "https://twitter.com/arctisdev",
            "https://linkedin.com/company/arctisdev",
        ],
        "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "",
            "contactType": "customer service",
            "email": "team@arctisdev.se"
        },
        "address": {
            "@type": "PostalAddress",
            "addressCountry": "Sweden"
        }
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
    );
} 