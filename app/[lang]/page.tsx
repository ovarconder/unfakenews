import { ArticleCard } from "@/components/article-card";
import { getLocale, type Locale } from "@/lib/i18n";
import { getTranslations } from "@/lib/translations";

// Mock data - replace with actual data fetching
const mockArticles = [
  {
    id: "1",
    title: "Global Tech Summit Unveils Revolutionary AI Platform",
    excerpt:
      "Industry leaders gather to showcase groundbreaking artificial intelligence technologies that promise to reshape the digital landscape.",
    category: "Technology",
    author: "Sarah Johnson",
    date: "Jan 29, 2026",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=800&fit=crop",
    featured: true,
  },
  {
    id: "2",
    title: "Economic Recovery Shows Strong Momentum in Q1",
    excerpt:
      "Latest economic indicators suggest robust growth across multiple sectors with unemployment at historic lows.",
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
      "World leaders announce ambitious plans to combat climate change with innovative renewable energy initiatives.",
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
      "State-of-the-art facility celebrates contemporary art with interactive exhibitions and digital installations.",
    category: "Culture",
    author: "David Martinez",
    date: "Jan 27, 2026",
    readTime: "3 min read",
    image: "https://images.unsplash.com/photo-1565306049090-e5f2c4c8a2b5?w=800&h=600&fit=crop",
  },
  {
    id: "5",
    title: "Champions League Final Preview: Historic Matchup",
    excerpt:
      "Two football giants prepare for an epic showdown in what promises to be one of the greatest finals ever.",
    category: "Sports",
    author: "James Wilson",
    date: "Jan 27, 2026",
    readTime: "4 min read",
    image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=600&fit=crop",
  },
  {
    id: "6",
    title: "Space Exploration: Mars Mission Reaches Milestone",
    excerpt:
      "NASA announces successful deployment of next-generation rover with advanced scientific instruments.",
    category: "Technology",
    author: "Lisa Anderson",
    date: "Jan 26, 2026",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=800&h=600&fit=crop",
  },
];

const trendingArticles = mockArticles.slice(0, 4);

export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const locale = getLocale(lang);
  const translations = getTranslations(locale);
  const featuredArticle = mockArticles[0];
  const mainArticles = mockArticles.slice(1, 4);
  const secondaryArticles = mockArticles.slice(4);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
        <div className="lg:col-span-2">
          <ArticleCard article={featuredArticle} locale={locale} variant="hero" />
        </div>

        {/* Trending Sidebar */}
        <div className="border-l-0 lg:border-l lg:pl-8">
          <h2 className="text-2xl font-bold mb-6 pb-3 border-b">
            {translations.common.trending}
          </h2>
          <div className="space-y-6">
            {trendingArticles.map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                locale={locale}
                variant="compact"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Latest News Grid */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold mb-8 pb-3 border-b">
          {translations.common.latestNews}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mainArticles.map((article) => (
            <ArticleCard key={article.id} article={article} locale={locale} />
          ))}
        </div>
      </div>

      {/* Secondary News */}
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {secondaryArticles.map((article) => (
            <ArticleCard key={article.id} article={article} locale={locale} />
          ))}
        </div>
      </div>
    </div>
  );
}
