"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Locale } from "@/lib/i18n";
import { LanguageSwitcher } from "@/components/language-switcher";
import { PostWithTranslation } from "@/lib/db/posts";
import { SocialShare } from "@/components/social-share";
import { gaEvent } from "@/components/google-analytics";

interface PostContentProps {
  post: PostWithTranslation;
  locale: Locale;
  slug: string;
}

export function PostContent({ post, locale, slug }: PostContentProps) {
  const formattedDate = new Date(post.createdAt).toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Track article view with Google Analytics
  useEffect(() => {
    gaEvent.viewArticle(post.id, post.translation.title, post.category, locale);
  }, [post.id, post.translation.title, post.category, locale]);

  return (
    <div className="py-12">
      <article className="container mx-auto px-4 max-w-4xl">
        {/* Language Switcher */}
        <div className="mb-8 flex justify-end">
          <LanguageSwitcher currentLang={locale} currentSlug={slug} />
        </div>

        {/* Article Header */}
        <AnimatePresence mode="wait">
          <motion.div
            key={locale}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              {post.category}
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mt-4 mb-6 leading-tight font-serif">
              {post.translation.title}
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              {post.translation.excerpt}
            </p>

            {/* Article Meta */}
            <div className="flex items-center justify-between py-6 border-y">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                  {(post.author.name || post.author.email).charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold">{post.author.name || "Anonymous"}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{formattedDate}</span>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{post.translation.readTime}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <SocialShare 
                  title={post.translation.title}
                  excerpt={post.translation.excerpt}
                  locale={locale}
                  articleId={post.id}
                  compact
                />
                <Button variant="outline" size="icon">
                  <Bookmark className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Featured Image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="my-12"
        >
          <img
            src={post.image}
            alt={post.translation.title}
            className="w-full rounded-lg shadow-2xl"
          />
        </motion.div>

        {/* Article Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${locale}-content`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-headings:font-serif prose-p:text-foreground prose-p:leading-relaxed prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6"
            dangerouslySetInnerHTML={{ __html: post.translation.content }}
          />
        </AnimatePresence>

        {/* Share Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 pt-8 border-t"
        >
          <SocialShare 
            title={post.translation.title}
            excerpt={post.translation.excerpt}
            locale={locale}
            articleId={post.id}
          />
        </motion.div>
      </article>
    </div>
  );
}
