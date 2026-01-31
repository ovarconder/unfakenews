"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Facebook, 
  Twitter, 
  Linkedin, 
  Mail, 
  Link2, 
  MessageCircle,
  Share2,
  Check
} from "lucide-react";
import { Locale, languageNames } from "@/lib/i18n";
import { gaEvent } from "@/components/google-analytics";

interface SocialShareProps {
  title: string;
  excerpt: string;
  locale: Locale;
  compact?: boolean;
}

export function SocialShare({ title, excerpt, locale, compact = false, articleId }: SocialShareProps) {
  const [copied, setCopied] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  // Get current URL (works on client-side)
  const url = typeof window !== "undefined" ? window.location.href : "";
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedText = encodeURIComponent(`${title}\n\n${excerpt}`);

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    line: `https://social-plugins.line.me/lineit/share?url=${encodedUrl}`,
    whatsapp: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedText}%0A%0A${encodedUrl}`,
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      
      // Track copy link event
      if (articleId) {
        gaEvent.shareArticle(articleId, "copy_link", locale);
      }
    } catch (error) {
      alert("❌ ไม่สามารถคัดลอกลิงก์ได้");
    }
  };

  const openShare = (platform: keyof typeof shareLinks) => {
    if (platform === "email") {
      window.location.href = shareLinks[platform];
    } else {
      window.open(shareLinks[platform], "_blank", "width=600,height=400");
    }
    setShowMenu(false);
  };

  // Compact version (icon only)
  if (compact) {
    return (
      <div className="relative">
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => setShowMenu(!showMenu)}
        >
          <Share2 className="h-4 w-4" />
        </Button>

        {showMenu && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setShowMenu(false)}
            />
            <div className="absolute right-0 mt-2 w-48 bg-background border rounded-lg shadow-lg z-50 p-2">
              <ShareButton
                icon={<Facebook className="h-4 w-4" />}
                label="Facebook"
                onClick={() => openShare("facebook")}
              />
              <ShareButton
                icon={<Twitter className="h-4 w-4" />}
                label="X (Twitter)"
                onClick={() => openShare("twitter")}
              />
              <ShareButton
                icon={<Linkedin className="h-4 w-4" />}
                label="LinkedIn"
                onClick={() => openShare("linkedin")}
              />
              <ShareButton
                icon={<MessageCircle className="h-4 w-4" />}
                label="WhatsApp"
                onClick={() => openShare("whatsapp")}
                color="text-green-600"
              />
              <ShareButton
                icon={<MessageCircle className="h-4 w-4" />}
                label="LINE"
                onClick={() => openShare("line")}
                color="text-green-500"
              />
              <ShareButton
                icon={<Mail className="h-4 w-4" />}
                label="Email"
                onClick={() => openShare("email")}
              />
              <div className="border-t my-1" />
              <ShareButton
                icon={copied ? <Check className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}
                label={copied ? "คัดลอกแล้ว!" : "Copy Link"}
                onClick={handleCopyLink}
                color={copied ? "text-green-600" : ""}
              />
            </div>
          </>
        )}
      </div>
    );
  }

  // Full version
  const shareText = locale === "th" 
    ? "แชร์บทความนี้" 
    : locale === "zh" 
    ? "分享这篇文章"
    : locale === "ja"
    ? "この記事をシェア"
    : "Share this article";

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">{shareText}</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Facebook */}
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={() => openShare("facebook")}
        >
          <Facebook className="h-4 w-4 mr-2 text-blue-600" />
          Facebook
        </Button>

        {/* X (Twitter) */}
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={() => openShare("twitter")}
        >
          <Twitter className="h-4 w-4 mr-2 text-sky-500" />
          X (Twitter)
        </Button>

        {/* LinkedIn */}
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={() => openShare("linkedin")}
        >
          <Linkedin className="h-4 w-4 mr-2 text-blue-700" />
          LinkedIn
        </Button>

        {/* WhatsApp */}
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={() => openShare("whatsapp")}
        >
          <MessageCircle className="h-4 w-4 mr-2 text-green-600" />
          WhatsApp
        </Button>

        {/* LINE (เหมาะสำหรับไทย-ญี่ปุ่น) */}
        {["th", "ja", "id", "tl", "ms", "vi"].includes(locale) && (
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => openShare("line")}
          >
            <MessageCircle className="h-4 w-4 mr-2 text-green-500" />
            LINE
          </Button>
        )}

        {/* Email */}
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={() => openShare("email")}
        >
          <Mail className="h-4 w-4 mr-2" />
          Email
        </Button>

        {/* Copy Link */}
        <Button
          variant={copied ? "default" : "outline"}
          className="w-full justify-start"
          onClick={handleCopyLink}
        >
          {copied ? (
            <>
              <Check className="h-4 w-4 mr-2" />
              {locale === "th" ? "คัดลอกแล้ว!" : "Copied!"}
            </>
          ) : (
            <>
              <Link2 className="h-4 w-4 mr-2" />
              {locale === "th" ? "คัดลอกลิงก์" : "Copy Link"}
            </>
          )}
        </Button>
      </div>

      {/* Language indicator */}
      <p className="text-xs text-muted-foreground">
        {languageNames[locale].flag} {languageNames[locale].native} • {url}
      </p>
    </div>
  );
}

// Helper component for compact menu items
function ShareButton({ 
  icon, 
  label, 
  onClick, 
  color = "" 
}: { 
  icon: React.ReactNode; 
  label: string; 
  onClick: () => void;
  color?: string;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors text-left"
    >
      <span className={color}>{icon}</span>
      <span>{label}</span>
    </button>
  );
}
