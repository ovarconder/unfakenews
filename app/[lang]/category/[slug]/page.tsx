import { ArticleCard } from "@/components/article-card";
import { getLocale, type Locale } from "@/lib/i18n";
import { getTranslations } from "@/lib/translations";

// Mock articles for categories
const categoryArticles: Record<string, any[]> = {
  technology: [
    {
      id: "1",
      title: "Global Tech Summit Unveils Revolutionary AI Platform",
      excerpt:
        "Industry leaders gather to showcase groundbreaking artificial intelligence technologies.",
      category: "Technology",
      author: "Sarah Johnson",
      date: "Jan 29, 2026",
      readTime: "5 min read",
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop",
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
  ],
  business: [
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
  ],
  politics: [
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
  ],
  culture: [
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
  ],
  sports: [
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
  ],
};

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  const locale = getLocale(lang);
  const translations = getTranslations(locale);
  const articles = categoryArticles[slug] || [];

  const categoryName =
    slug.charAt(0).toUpperCase() + slug.slice(1);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">{categoryName}</h1>
        <p className="text-xl text-muted-foreground">
          Latest articles in {categoryName.toLowerCase()}
        </p>
      </div>

      {articles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} locale={locale} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-xl text-muted-foreground">
            No articles found in this category yet.
          </p>
        </div>
      )}
    </div>
  );
}
