"use client";

import { motion } from "framer-motion";
import { Clock, Share2, Bookmark, Facebook, Twitter, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getLocale } from "@/lib/i18n";
import { getTranslations } from "@/lib/translations";
import { ArticleCard } from "@/components/article-card";

// Mock article data
const article = {
  id: "1",
  title: "Global Tech Summit Unveils Revolutionary AI Platform",
  excerpt:
    "Industry leaders gather to showcase groundbreaking artificial intelligence technologies that promise to reshape the digital landscape.",
  content: `
    <p>The annual Global Tech Summit concluded today with the unveiling of several groundbreaking artificial intelligence platforms that industry experts say will fundamentally reshape how we interact with technology.</p>

    <p>Leading technology companies from around the world gathered at the summit to showcase their latest innovations in AI, machine learning, and automation. The event attracted over 10,000 attendees, including executives, developers, and investors.</p>

    <h2>Revolutionary AI Platform</h2>

    <p>The highlight of the summit was the introduction of a new AI platform that promises to democratize access to advanced machine learning capabilities. The platform, developed through a collaboration between several major tech firms, offers unprecedented processing power and ease of use.</p>

    <p>"This represents a significant leap forward in making AI accessible to businesses of all sizes," said Dr. Sarah Chen, Chief Technology Officer at TechVentures Inc. "We're not just talking about incremental improvements – this is a fundamental shift in how AI can be deployed and utilized."</p>

    <h2>Industry Impact</h2>

    <p>Analysts predict that the new technologies unveiled at the summit will have far-reaching implications across multiple industries, from healthcare to finance to manufacturing. Early adopters are already reporting significant improvements in efficiency and decision-making capabilities.</p>

    <p>The summit also featured panel discussions on AI ethics, data privacy, and the future of work in an increasingly automated world. These conversations highlighted the industry's growing awareness of the need to balance innovation with responsibility.</p>

    <h2>Looking Ahead</h2>

    <p>As the summit concluded, organizers announced plans for next year's event, which will focus on practical implementations and case studies from early adopters of this year's unveiled technologies. The tech community is already buzzing with anticipation for what's to come.</p>
  `,
  category: "Technology",
  author: "Sarah Johnson",
  date: "January 29, 2026",
  readTime: "5 min read",
  image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=800&fit=crop",
};

const relatedArticles = [
  {
    id: "2",
    title: "Economic Recovery Shows Strong Momentum in Q1",
    excerpt:
      "Latest economic indicators suggest robust growth across multiple sectors.",
    category: "Business",
    author: "Michael Chen",
    date: "Jan 28, 2026",
    readTime: "4 min read",
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=600&fit=crop",
  },
  {
    id: "3",
    title: "Climate Action Summit: Nations Commit to Bold Targets",
    excerpt:
      "World leaders announce ambitious plans to combat climate change.",
    category: "Politics",
    author: "Emma Williams",
    date: "Jan 28, 2026",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1569163139394-de4798aa62b6?w=800&h=600&fit=crop",
  },
  {
    id: "4",
    title: "Cultural Renaissance: New Museum Opens Downtown",
    excerpt:
      "State-of-the-art facility celebrates contemporary art with interactive exhibitions.",
    category: "Culture",
    author: "David Martinez",
    date: "Jan 27, 2026",
    readTime: "3 min read",
    image: "https://images.unsplash.com/photo-1565306049090-e5f2c4c8a2b5?w=800&h=600&fit=crop",
  },
];

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ lang: string; id: string }>;
}) {
  const { lang, id } = await params;
  const locale = getLocale(lang);
  const translations = getTranslations(locale);

  return (
    <div className="py-12">
      <article className="container mx-auto px-4 max-w-4xl">
        {/* Article Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            {article.category}
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mt-4 mb-6 leading-tight">
            {article.title}
          </h1>
          <p className="text-xl text-muted-foreground mb-8">{article.excerpt}</p>

          {/* Article Meta */}
          <div className="flex items-center justify-between py-6 border-y">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                {article.author.charAt(0)}
              </div>
              <div>
                <p className="font-semibold">{article.author}</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{article.date}</span>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{article.readTime}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon">
                <Share2 className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Bookmark className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Featured Image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="my-12"
        >
          <img
            src={article.image}
            alt={article.title}
            className="w-full rounded-lg"
          />
        </motion.div>

        {/* Article Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-p:text-foreground prose-p:leading-relaxed prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {/* Share Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 pt-8 border-t"
        >
          <h3 className="font-semibold mb-4">Share this article</h3>
          <div className="flex gap-3">
            <Button variant="outline" size="icon">
              <Facebook className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Twitter className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Linkedin className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      </article>

      {/* Related Articles */}
      <div className="container mx-auto px-4 mt-20">
        <h2 className="text-3xl font-bold mb-8">Related Articles</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {relatedArticles.map((relatedArticle) => (
            <ArticleCard
              key={relatedArticle.id}
              article={relatedArticle}
              locale={locale}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
