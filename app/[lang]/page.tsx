import { ArticleCard } from "@/components/article-card";
import { getLocale, type Locale } from "@/lib/i18n";
import { getTranslations } from "@/lib/translations";
import { getAllPosts, getFeaturedPosts } from "@/lib/db/posts";

export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const locale = getLocale(lang);
  const translations = getTranslations(locale);

  // Fetch real posts from database
  const allPosts = await getAllPosts(locale);
  const featuredPostsData = await getFeaturedPosts(locale, 1);
  
  // Use featured post or first post as hero
  const featuredArticle = featuredPostsData[0] || allPosts[0];
  const trendingArticles = allPosts.slice(0, 4);
  const mainArticles = allPosts.slice(1, 4);
  const secondaryArticles = allPosts.slice(4, 10);

  // If no posts in database, show message
  if (!allPosts.length) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">
          {locale === "th" ? "ยังไม่มีบทความ" : "No articles yet"}
        </h2>
        <p className="text-muted-foreground">
          {locale === "th" 
            ? "กรุณาสร้างบทความผ่านหน้า Admin" 
            : "Please create articles through the Admin page"}
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      {featuredArticle && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          <div className="lg:col-span-2">
            <ArticleCard article={featuredArticle} locale={locale} variant="hero" />
          </div>

          {/* Trending Sidebar */}
          {trendingArticles.length > 0 && (
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
          )}
        </div>
      )}

      {/* Latest News Grid */}
      {mainArticles.length > 0 && (
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
      )}

      {/* Secondary News */}
      {secondaryArticles.length > 0 && (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {secondaryArticles.map((article) => (
              <ArticleCard key={article.id} article={article} locale={locale} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
