import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPostBySlug } from "@/lib/db/posts";
import { getLocale, locales } from "@/lib/i18n";
import { PostContent } from "./post-content";

// Enable ISR (Incremental Static Regeneration) for SEO
// Revalidate every hour for fresh content
export const revalidate = 3600;

// Generate static paths for primary languages at build time
export async function generateStaticParams() {
  // This will be called at build time
  // Generate paths only for primary languages to optimize build time
  return [];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  const locale = getLocale(lang);
  
  try {
    const post = await getPostBySlug(slug, locale);

    if (!post) {
      return {
        title: "Post Not Found",
      };
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const currentUrl = `${baseUrl}/${locale}/${slug}`;

    // Ensure image URL is absolute
    const imageUrl = post.image.startsWith("http") 
      ? post.image 
      : `${baseUrl}${post.image}`;

    // Generate hreflang tags for all supported languages
    const languages: Record<string, string> = {};
    locales.forEach((lang) => {
      languages[lang] = `${baseUrl}/${lang}/${slug}`;
    });
    languages["x-default"] = `${baseUrl}/en/${slug}`;

    return {
      title: post.translation.seoTitle,
      description: post.translation.seoDesc,
      keywords: [post.category, "news", "UnfakeNews", locale],
      authors: [{ name: post.author.name || post.author.email }],
      creator: post.author.name || "UnfakeNews",
      publisher: "UnfakeNews",
      openGraph: {
        title: post.translation.seoTitle,
        description: post.translation.seoDesc,
        url: currentUrl,
        siteName: "UnfakeNews",
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: post.translation.title,
            type: "image/jpeg",
          },
        ],
        locale: locale,
        type: "article",
        publishedTime: post.createdAt.toISOString(),
        modifiedTime: post.updatedAt.toISOString(),
        authors: [post.author.name || post.author.email],
        section: post.category,
        tags: [post.category, locale],
      },
      twitter: {
        card: "summary_large_image",
        site: "@UnfakeNews",
        creator: `@${post.author.name?.replace(/\s+/g, "") || "UnfakeNews"}`,
        title: post.translation.seoTitle,
        description: post.translation.seoDesc,
        images: {
          url: imageUrl,
          alt: post.translation.title,
        },
      },
      alternates: {
        canonical: currentUrl,
        languages,
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-video-preview": -1,
          "max-image-preview": "large",
          "max-snippet": -1,
        },
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "UnfakeNews",
    };
  }
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  const locale = getLocale(lang);

  try {
    const post = await getPostBySlug(slug, locale);

    if (!post) {
      notFound();
    }

    return <PostContent post={post} locale={locale} slug={slug} />;
  } catch (error) {
    console.error("Error loading post:", error);
    notFound();
  }
}
