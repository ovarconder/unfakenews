import { MetadataRoute } from "next";
import { getAllPostsForSitemap } from "@/lib/db/posts";
import { locales } from "@/lib/i18n";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  try {
    const posts = await getAllPostsForSitemap();

    // Static pages for all languages
    const staticPages: MetadataRoute.Sitemap = locales.flatMap((lang) => [
      {
        url: `${baseUrl}/${lang}`,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 1,
        alternates: {
          languages: Object.fromEntries(
            locales.map((locale) => [locale, `${baseUrl}/${locale}`])
          ),
        },
      },
      {
        url: `${baseUrl}/${lang}/category/politics`,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 0.8,
      },
      {
        url: `${baseUrl}/${lang}/category/business`,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 0.8,
      },
      {
        url: `${baseUrl}/${lang}/category/technology`,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 0.8,
      },
      {
        url: `${baseUrl}/${lang}/category/culture`,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 0.8,
      },
      {
        url: `${baseUrl}/${lang}/category/sports`,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 0.8,
      },
    ]);

    // Post pages for all languages
    const postPages: MetadataRoute.Sitemap = posts.flatMap((post) =>
      locales.map((lang) => ({
        url: `${baseUrl}/${lang}/${post.slug}`,
        lastModified: post.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.9,
        alternates: {
          languages: Object.fromEntries(
            locales.map((locale) => [
              locale,
              `${baseUrl}/${locale}/${post.slug}`,
            ])
          ),
        },
      }))
    );

    return [...staticPages, ...postPages];
  } catch (error) {
    console.error("Error generating sitemap:", error);
    // Return basic sitemap if database is not available
    return locales.map((lang) => ({
      url: `${baseUrl}/${lang}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    }));
  }
}
