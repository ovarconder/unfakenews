import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { translatePost, calculateReadTime } from "@/lib/gemini";
import { primaryLanguages, locales } from "@/lib/i18n";

type Locale = typeof locales[number];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { postId, targetLanguages } = body;

    // ดึง post และ translation ต้นฉบับ
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        translations: {
          where: {
            lang: { in: ["th", "en"] },
          },
        },
      },
    });

    if (!post || post.translations.length === 0) {
      return NextResponse.json(
        { error: "Post or source translation not found" },
        { status: 404 }
      );
    }

    const sourceTranslation = post.translations[0];

    // กำหนดภาษาที่จะแปล
    const languagesToTranslate: Locale[] =
      targetLanguages === "primary"
        ? (primaryLanguages as Locale[])
        : targetLanguages === "all"
        ? (locales as unknown as Locale[])
        : targetLanguages;

    const results = [];

    for (const lang of languagesToTranslate) {
      // ข้ามถ้ามี translation แล้ว
      const existing = await prisma.postTranslation.findUnique({
        where: {
          postId_lang: {
            postId: post.id,
            lang,
          },
        },
      });

      if (existing) {
        results.push({ lang, status: "skipped", message: "Already exists" });
        continue;
      }

      try {
        // แปลด้วย Gemini
        const translated = await translatePost(
          {
            title: sourceTranslation.title,
            content: sourceTranslation.content,
            excerpt: sourceTranslation.excerpt,
          },
          lang
        );

        const readTime = await calculateReadTime(translated.content);

        // บันทึกลง database
        await prisma.postTranslation.create({
          data: {
            postId: post.id,
            lang,
            title: translated.title,
            content: translated.content,
            excerpt: translated.excerpt,
            seoTitle: translated.seoTitle,
            seoDesc: translated.seoDesc,
            readTime,
          },
        });

        results.push({ lang, status: "success" });

        // Delay เพื่อไม่ให้เกิน rate limit
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (error) {
        results.push({
          lang,
          status: "error",
          message: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    return NextResponse.json({
      success: true,
      results,
    });
  } catch (error) {
    console.error("Translation error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Translation failed" },
      { status: 500 }
    );
  }
}
