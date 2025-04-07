import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // Example code - Below we use fetch to get the blog data from the tRPC API and map the slugs to their relevant
    // URLs so that we can then supply Google Search Console with a dynamic sitemap to crawl. This will live at https://myurl.com/sitemap.xml
    // Fetch blogs data from the tRPC API
    // try {
    //     const blogResponse = await fetch(
    //         "https://myurl.com/api/trpc/blog.findMany"
    //     );
    //     const blogData = await blogResponse.json();
    //     const blog = blogData.result.data;

    //     const blogUrls = (blog || []).map((blog: any) => ({
    //         url: `https://myurl.com/${blog.slug}`,
    //         lastModified: new Date().toISOString(),
    //         changeFrequency: "weekly" as const,
    //         priority: 0.7,
    //     }));
    // } catch (error) {
    //     console.error("Error fetching blog data:", error);
    // }

    // Return combined sitemap
    return [
        {
            url: "https://arctisdev.se",
            lastModified: new Date(),
            changeFrequency: "yearly",
            priority: 1,
        },
        {
            url: "https://arctisdev.se/#why-us",
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.8,
        },
        {
            url: "https://arctisdev.se/#pricing",
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.9,
        },
        {
            url: "https://arctisdev.se/#contact",
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.8,
        },
        {
            url: "https://arctisdev.se/#faq",
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.7,
        },
        // ...blogUrls,
    ];
}
