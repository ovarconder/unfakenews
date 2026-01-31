#!/usr/bin/env ts-node
/**
 * Pre-translate Posts for Primary Languages (SEO Optimization)
 * 
 * This script pre-translates all published posts to primary languages
 * (th, en, zh, ja, es) for better SEO performance.
 * 
 * Usage:
 *   npm run translate:primary
 *   npm run translate:all
 *   npm run translate:post -- <slug>
 */

import { prisma } from "../lib/prisma";
import { translatePost, calculateReadTime } from "../lib/gemini";
import { primaryLanguages, secondaryLanguages, locales } from "../lib/i18n";

type Locale = typeof locales[number];

async function preTranslatePost(postId: string, slug: string, languages: Locale[]) {
  console.log(`\n📝 Translating post: ${slug}`);
  
  // Get the default translation (English or Thai)
  const defaultTranslation = await prisma.postTranslation.findFirst({
    where: {
      postId,
      lang: { in: ["en", "th"] },
    },
  });

  if (!defaultTranslation) {
    console.error(`❌ No default translation found for post: ${slug}`);
    return;
  }

  console.log(`   Source: ${defaultTranslation.lang.toUpperCase()}`);

  for (const lang of languages) {
    // Skip if translation already exists
    const existing = await prisma.postTranslation.findUnique({
      where: {
        postId_lang: {
          postId,
          lang,
        },
      },
    });

    if (existing) {
      console.log(`   ⏭️  ${lang.toUpperCase()} - Already exists`);
      continue;
    }

    try {
      console.log(`   🔄 ${lang.toUpperCase()} - Translating...`);
      
      const result = await translatePost(
        {
          title: defaultTranslation.title,
          content: defaultTranslation.content,
          excerpt: defaultTranslation.excerpt,
        },
        lang
      );

      const readTime = await calculateReadTime(result.content);

      await prisma.postTranslation.create({
        data: {
          postId,
          lang,
          title: result.title,
          content: result.content,
          excerpt: result.excerpt,
          seoTitle: result.seoTitle,
          seoDesc: result.seoDesc,
          readTime,
        },
      });

      console.log(`   ✅ ${lang.toUpperCase()} - Success`);
      
      // Add delay to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`   ❌ ${lang.toUpperCase()} - Error:`, error instanceof Error ? error.message : "Unknown error");
    }
  }
}

async function preTranslatePrimaryLanguages() {
  console.log("🌍 Pre-translating posts to PRIMARY languages for SEO");
  console.log(`   Languages: ${primaryLanguages.join(", ").toUpperCase()}\n`);

  const posts = await prisma.post.findMany({
    where: { published: true },
    select: {
      id: true,
      slug: true,
    },
  });

  console.log(`📚 Found ${posts.length} published posts\n`);

  for (const post of posts) {
    await preTranslatePost(post.id, post.slug, primaryLanguages);
  }

  console.log("\n✨ Primary language translation complete!");
}

async function preTranslateAllLanguages() {
  console.log("🌍 Pre-translating posts to ALL languages");
  console.log(`   Languages: ${locales.join(", ").toUpperCase()}\n`);

  const posts = await prisma.post.findMany({
    where: { published: true },
    select: {
      id: true,
      slug: true,
    },
  });

  console.log(`📚 Found ${posts.length} published posts\n`);

  for (const post of posts) {
    await preTranslatePost(post.id, post.slug, locales as unknown as Locale[]);
  }

  console.log("\n✨ All language translation complete!");
}

async function preTranslateSinglePost(slug: string, allLanguages: boolean = false) {
  console.log(`🌍 Pre-translating post: ${slug}\n`);

  const post = await prisma.post.findUnique({
    where: { slug },
    select: {
      id: true,
      slug: true,
      published: true,
    },
  });

  if (!post) {
    console.error(`❌ Post not found: ${slug}`);
    process.exit(1);
  }

  if (!post.published) {
    console.warn(`⚠️  Warning: Post "${slug}" is not published`);
  }

  const languages = allLanguages ? (locales as unknown as Locale[]) : primaryLanguages;
  await preTranslatePost(post.id, post.slug, languages);

  console.log("\n✨ Translation complete!");
}

async function showTranslationStatus() {
  console.log("📊 Translation Status\n");

  const posts = await prisma.post.findMany({
    where: { published: true },
    include: {
      translations: {
        select: { lang: true },
      },
    },
  });

  console.log("Post Translations:");
  console.log("─".repeat(80));
  console.log(
    `${"Slug".padEnd(40)} | ${"Translations".padEnd(35)}`
  );
  console.log("─".repeat(80));

  for (const post of posts) {
    const langs = post.translations.map((t) => t.lang.toUpperCase()).sort();
    const primary = primaryLanguages.filter((l) => langs.includes(l.toUpperCase()));
    const secondary = secondaryLanguages.filter((l) => langs.includes(l.toUpperCase()));
    
    const status = [
      primary.length > 0 ? `✓${primary.length}/5 primary` : "✗ No primary",
      secondary.length > 0 ? `+${secondary.length} secondary` : "",
    ]
      .filter(Boolean)
      .join(", ");

    console.log(`${post.slug.padEnd(40)} | ${status}`);
  }

  console.log("─".repeat(80));
  console.log(`\nTotal posts: ${posts.length}`);
  
  // Summary
  const totalTranslations = posts.reduce((sum, p) => sum + p.translations.length, 0);
  console.log(`Total translations: ${totalTranslations}`);
  console.log(`Average translations per post: ${(totalTranslations / posts.length).toFixed(1)}`);
}

// Main execution
async function main() {
  const command = process.argv[2];
  const arg = process.argv[3];

  try {
    switch (command) {
      case "primary":
        await preTranslatePrimaryLanguages();
        break;
      case "all":
        await preTranslateAllLanguages();
        break;
      case "post":
        if (!arg) {
          console.error("❌ Please provide a post slug");
          console.log("Usage: npm run translate:post -- <slug>");
          process.exit(1);
        }
        const allLangs = process.argv.includes("--all");
        await preTranslateSinglePost(arg, allLangs);
        break;
      case "status":
        await showTranslationStatus();
        break;
      default:
        console.log("📖 Translation Commands:");
        console.log("");
        console.log("  npm run translate:primary    - Translate all posts to primary languages (th, en, zh, ja, es)");
        console.log("  npm run translate:all        - Translate all posts to ALL languages");
        console.log("  npm run translate:post -- <slug>           - Translate specific post (primary languages)");
        console.log("  npm run translate:post -- <slug> --all    - Translate specific post (all languages)");
        console.log("  npm run translate:status     - Show translation status");
        console.log("");
        console.log("Examples:");
        console.log("  npm run translate:primary");
        console.log("  npm run translate:post -- global-tech-summit-ai-platform");
        console.log("  npm run translate:post -- global-tech-summit-ai-platform --all");
        console.log("");
        break;
    }
  } catch (error) {
    console.error("\n❌ Error:", error instanceof Error ? error.message : "Unknown error");
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
