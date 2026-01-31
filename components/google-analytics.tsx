"use client";

import Script from "next/script";

interface GoogleAnalyticsProps {
  gaId: string;
}

export function GoogleAnalytics({ gaId }: GoogleAnalyticsProps) {
  if (!gaId || gaId === "G-XXXXXXXXXX") {
    return null; // Don't load in development or if not configured
  }

  return (
    <>
      {/* Google tag (gtag.js) */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}', {
            page_path: window.location.pathname,
            send_page_view: true
          });
        `}
      </Script>
    </>
  );
}

// Event tracking functions
export const gaEvent = {
  // Track page view
  pageView: (url: string) => {
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("config", process.env.NEXT_PUBLIC_GA_ID, {
        page_path: url,
      });
    }
  },

  // Track custom events
  event: (action: string, params?: Record<string, any>) => {
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", action, params);
    }
  },

  // Track article views
  viewArticle: (articleId: string, title: string, category: string, language: string) => {
    gaEvent.event("view_article", {
      article_id: articleId,
      article_title: title,
      article_category: category,
      language: language,
    });
  },

  // Track article shares
  shareArticle: (articleId: string, platform: string, language: string) => {
    gaEvent.event("share", {
      content_type: "article",
      item_id: articleId,
      method: platform,
      language: language,
    });
  },

  // Track language changes
  changeLanguage: (from: string, to: string) => {
    gaEvent.event("change_language", {
      language_from: from,
      language_to: to,
    });
  },

  // Track search
  search: (searchTerm: string, language: string) => {
    gaEvent.event("search", {
      search_term: searchTerm,
      language: language,
    });
  },

  // Track user login
  login: (method: string) => {
    gaEvent.event("login", {
      method: method, // "google", "credentials", etc.
    });
  },

  // Track post creation (Admin)
  createPost: (category: string, language: string) => {
    gaEvent.event("create_post", {
      category: category,
      source_language: language,
    });
  },
};

// Type declarations
declare global {
  interface Window {
    gtag: (
      command: string,
      targetId: string,
      config?: Record<string, any>
    ) => void;
    dataLayer: any[];
  }
}
