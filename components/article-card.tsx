"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import { Locale } from "@/lib/i18n";

interface Article {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  image: string;
  featured?: boolean;
}

interface ArticleCardProps {
  article: Article;
  locale: Locale;
  variant?: "default" | "hero" | "compact";
}

export function ArticleCard({
  article,
  locale,
  variant = "default",
}: ArticleCardProps) {
  if (variant === "hero") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Link href={`/${locale}/article/${article.id}`} className="group">
          <div className="relative h-[500px] overflow-hidden rounded-lg">
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10" />
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute bottom-0 left-0 right-0 p-8 z-20 text-white">
              <span className="text-xs font-semibold uppercase tracking-wider mb-3 block">
                {article.category}
              </span>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                {article.title}
              </h1>
              <p className="text-lg text-gray-200 mb-4 line-clamp-2">
                {article.excerpt}
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-300">
                <span>{article.author}</span>
                <span>•</span>
                <span>{article.date}</span>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{article.readTime}</span>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </motion.div>
    );
  }

  if (variant === "compact") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Link
          href={`/${locale}/article/${article.id}`}
          className="group flex gap-4 items-start"
        >
          <div className="w-24 h-24 flex-shrink-0 overflow-hidden rounded">
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {article.category}
            </span>
            <h3 className="font-semibold text-sm mt-1 line-clamp-2 group-hover:text-primary transition-colors">
              {article.title}
            </h3>
            <p className="text-xs text-muted-foreground mt-1">{article.date}</p>
          </div>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Link href={`/${locale}/article/${article.id}`} className="group">
        <div className="overflow-hidden rounded-lg mb-4">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-700"
          />
        </div>
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {article.category}
        </span>
        <h2 className="text-2xl font-bold mt-2 mb-3 leading-tight group-hover:text-primary transition-colors">
          {article.title}
        </h2>
        <p className="text-muted-foreground mb-4 line-clamp-3">
          {article.excerpt}
        </p>
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <span>{article.author}</span>
          <span>•</span>
          <span>{article.date}</span>
          <span>•</span>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{article.readTime}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
