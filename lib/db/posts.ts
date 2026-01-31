import { prisma } from "@/lib/prisma";
import { translatePost, calculateReadTime, TranslationInput } from "@/lib/gemini";
import { Locale } from "@/lib/i18n";

export interface PostWithTranslation {
  id: string;
  slug: string;
  category: string;
  image: string;
  published: boolean;
  featured: boolean;
  views: number;
  author: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
  };
  translation: {
    title: string;
    content: string;
    excerpt: string;
    seoTitle: string;
    seoDesc: string;
    readTime: string;
    lang: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export async function getPostBySlug(
  slug: string,
  lang: Locale
): Promise<PostWithTranslation | null> {
  try {
    const post = await prisma.post.findUnique({
      where: { slug, published: true },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        translations: {
          where: { lang },
        },
      },
    });

    if (!post) {
      return null;
    }

    // If translation doesn't exist, create it using Gemini
    let translation = post.translations[0];

    if (!translation) {
      // Get the default language translation (English or Thai)
      const defaultTranslation = await prisma.postTranslation.findFirst({
        where: {
          postId: post.id,
          lang: { in: ["en", "th"] },
        },
      });

      if (!defaultTranslation) {
        throw new Error("No default translation found for this post");
      }

      // Translate using Gemini (full translation)
      const translationInput: TranslationInput = {
        title: defaultTranslation.title,
        content: defaultTranslation.content,
        excerpt: defaultTranslation.excerpt,
      };

      const geminiResult = await translatePost(translationInput, lang);
      const readTime = await calculateReadTime(geminiResult.content);

      // Save the new translation to database
      translation = await prisma.postTranslation.create({
        data: {
          postId: post.id,
          lang,
          title: geminiResult.title,
          content: geminiResult.content,
          excerpt: geminiResult.excerpt,
          seoTitle: geminiResult.seoTitle,
          seoDesc: geminiResult.seoDesc,
          readTime,
        },
      });
    } else if (!translation.content || translation.content.trim() === "") {
      // Translation exists but content is empty (metadata-only translation)
      // This happens for secondary languages - translate content on-demand
      const defaultTranslation = await prisma.postTranslation.findFirst({
        where: {
          postId: post.id,
          lang: { in: ["en", "th"] },
        },
      });

      if (!defaultTranslation) {
        throw new Error("No default translation found for this post");
      }

      // Translate only the content
      const translationInput: TranslationInput = {
        title: defaultTranslation.title,
        content: defaultTranslation.content,
        excerpt: defaultTranslation.excerpt,
      };

      const geminiResult = await translatePost(translationInput, lang);
      const readTime = await calculateReadTime(geminiResult.content);

      // Update the existing translation with full content
      translation = await prisma.postTranslation.update({
        where: {
          postId_lang: {
            postId: post.id,
            lang,
          },
        },
        data: {
          content: geminiResult.content,
          readTime,
        },
      });
    }

    return {
      id: post.id,
      slug: post.slug,
      category: post.category,
      image: post.image,
      published: post.published,
      featured: post.featured,
      views: post.views,
      author: post.author,
      translation: {
        title: translation.title,
        content: translation.content,
        excerpt: translation.excerpt,
        seoTitle: translation.seoTitle,
        seoDesc: translation.seoDesc,
        readTime: translation.readTime,
        lang: translation.lang,
      },
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    };
  } catch (error) {
    console.error("Error fetching post:", error);
    throw error;
  }
}

export async function getAllPosts(lang: Locale, limit?: number) {
  try {
    const posts = await prisma.post.findMany({
      where: { published: true },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        translations: true, // Get ALL translations
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    // Map posts and provide translation fallback
    const mappedPosts = posts.map((post) => {
      // Try to find translation for requested language
      let translation = post.translations.find((t) => t.lang === lang);

      // Fallback hierarchy: requested lang -> en -> th -> any available
      if (!translation) {
        translation = post.translations.find((t) => t.lang === "en") ||
                     post.translations.find((t) => t.lang === "th") ||
                     post.translations[0];
      }

      // Skip posts with no translation at all
      if (!translation) {
        return null;
      }

      return {
        id: post.id,
        slug: post.slug,
        category: post.category,
        image: post.image,
        published: post.published,
        featured: post.featured,
        views: post.views,
        author: post.author,
        translation: {
          title: translation.title,
          content: translation.content,
          excerpt: translation.excerpt,
          seoTitle: translation.seoTitle,
          seoDesc: translation.seoDesc,
          readTime: translation.readTime,
          lang: translation.lang,
        },
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
      };
    });

    // Filter out null posts
    return mappedPosts.filter((post) => post !== null) as any[];
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
}

export async function getFeaturedPosts(lang: Locale, limit: number = 6) {
  try {
    const posts = await prisma.post.findMany({
      where: { published: true, featured: true },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        translations: true, // Get ALL translations
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    const mappedPosts = posts.map((post) => {
      let translation = post.translations.find((t) => t.lang === lang);

      // Fallback hierarchy
      if (!translation) {
        translation = post.translations.find((t) => t.lang === "en") ||
                     post.translations.find((t) => t.lang === "th") ||
                     post.translations[0];
      }

      if (!translation) {
        return null;
      }

      return {
        id: post.id,
        slug: post.slug,
        category: post.category,
        image: post.image,
        published: post.published,
        featured: post.featured,
        views: post.views,
        author: post.author,
        translation: {
          title: translation.title,
          content: translation.content,
          excerpt: translation.excerpt,
          seoTitle: translation.seoTitle,
          seoDesc: translation.seoDesc,
          readTime: translation.readTime,
          lang: translation.lang,
        },
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
      };
    });

    return mappedPosts.filter((post) => post !== null) as any[];
  } catch (error) {
    console.error("Error fetching featured posts:", error);
    return [];
  }
}

export async function getPostsByCategory(
  category: string,
  lang: Locale,
  limit?: number
) {
  try {
    const posts = await prisma.post.findMany({
      where: { published: true, category },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        translations: true, // Get ALL translations
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    const mappedPosts = posts.map((post) => {
      let translation = post.translations.find((t) => t.lang === lang);

      // Fallback hierarchy
      if (!translation) {
        translation = post.translations.find((t) => t.lang === "en") ||
                     post.translations.find((t) => t.lang === "th") ||
                     post.translations[0];
      }

      if (!translation) {
        return null;
      }

      return {
        id: post.id,
        slug: post.slug,
        category: post.category,
        image: post.image,
        published: post.published,
        featured: post.featured,
        views: post.views,
        author: post.author,
        translation: {
          title: translation.title,
          content: translation.content,
          excerpt: translation.excerpt,
          seoTitle: translation.seoTitle,
          seoDesc: translation.seoDesc,
          readTime: translation.readTime,
          lang: translation.lang,
        },
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
      };
    });

    return mappedPosts.filter((post) => post !== null) as any[];
  } catch (error) {
    console.error("Error fetching posts by category:", error);
    return [];
  }
}

export async function incrementPostViews(slug: string) {
  try {
    await prisma.post.update({
      where: { slug },
      data: { views: { increment: 1 } },
    });
  } catch (error) {
    console.error("Error incrementing post views:", error);
  }
}

export async function getAllPostsForSitemap() {
  try {
    return await prisma.post.findMany({
      where: { published: true },
      select: {
        slug: true,
        updatedAt: true,
      },
    });
  } catch (error) {
    console.error("Error fetching posts for sitemap:", error);
    return [];
  }
}
