import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: "*",
            allow: "/",
            disallow: ["/api/", "/dashboard/", "/auth/"],
        },
        // @todo: add domain here
        sitemap: "https://arctisdev.se/sitemap.xml",
    };
}
