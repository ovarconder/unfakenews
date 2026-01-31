import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calculateReadTime } from "@/lib/gemini";
import { requireRole } from "@/lib/auth";
import { UserRole } from "@prisma/client";

export async function POST(request: NextRequest) {
  try {
    // Check authentication and role
    const user = await requireRole([UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.EDITOR]);

    const body = await request.json();
    const { title, slug, excerpt, content, category, image, featured, lang } = body;

    // สร้าง Post
    const post = await prisma.post.create({
      data: {
        slug,
        category,
        image,
        published: true,
        featured: featured || false,
        authorId: user.id,
        translations: {
          create: {
            lang: lang || "th",
            title,
            excerpt,
            content,
            seoTitle: title,
            seoDesc: excerpt.slice(0, 160),
            readTime: await calculateReadTime(content),
          },
        },
      },
      include: {
        translations: true,
      },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create post" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const posts = await prisma.post.findMany({
      include: {
        author: {
          select: {
            name: true,
            email: true,
          },
        },
        translations: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}
