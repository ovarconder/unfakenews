"use client";

import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Check, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Locale, locales, languageNames, isRTL, saveLanguagePreference } from "@/lib/i18n";
import { gaEvent } from "@/components/google-analytics";

interface LanguageSwitcherProps {
  currentLang: Locale;
  currentSlug?: string;
  originalPostId?: string;
}

export function LanguageSwitcher({ currentLang, currentSlug, originalPostId }: LanguageSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleLanguageChange = (newLang: Locale) => {
    // Save language preference
    saveLanguagePreference(newLang);
    
    // Track language change
    gaEvent.changeLanguage(currentLang, newLang);
    
    // For article pages, redirect to home page of new language
    // (simpler than trying to find translated slug which may not exist)
    if (currentSlug) {
      router.push(`/${newLang}`);
    } else {
      // For other pages, reconstruct the path with new language
      const segments = pathname.split("/").filter(Boolean);
      segments[0] = newLang;
      router.push(`/${segments.join("/")}`);
    }
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 min-w-[160px] justify-between"
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">{languageNames[currentLang].flag}</span>
          <span className="font-medium">{languageNames[currentLang].native}</span>
        </div>
        <ChevronDown
          className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Dropdown - แสดงทุกภาษา */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 mt-2 w-64 bg-background border rounded-lg shadow-lg z-50 overflow-hidden"
            >
              <div className="p-2 border-b bg-muted/50">
                <p className="text-xs font-semibold text-muted-foreground px-2 py-1">
                  เลือกภาษา • Select Language
                </p>
              </div>
              <div className="max-h-[400px] overflow-y-auto p-2">
                {locales.map((lang) => (
                  <button
                    key={lang}
                    onClick={() => handleLanguageChange(lang)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md transition-colors ${
                      currentLang === lang
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted"
                    } ${isRTL(lang) ? "flex-row-reverse" : ""}`}
                  >
                    <div className={`flex items-center gap-3 ${isRTL(lang) ? "flex-row-reverse" : ""}`}>
                      <span className="text-lg">{languageNames[lang].flag}</span>
                      <div className="flex flex-col items-start">
                        <span className="font-medium text-sm">
                          {languageNames[lang].native}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {languageNames[lang].english}
                        </span>
                      </div>
                    </div>
                    {currentLang === lang && (
                      <Check className="h-4 w-4" />
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// Compact version for navbar
export function LanguageSwitcherCompact({ currentLang }: { currentLang: Locale }) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleLanguageChange = (newLang: Locale) => {
    // Track language change with Google Analytics
    const currentLocale = pathname.split("/")[1] as Locale;
    gaEvent.changeLanguage(currentLocale, newLang);
    
    // Save language preference
    saveLanguagePreference(newLang);
    
    // Reconstruct path with new language
    const segments = pathname.split("/").filter(Boolean);
    segments[0] = newLang;
    const newPath = `/${segments.join("/")}`;
    
    console.log('[Language Switch] From:', pathname, 'To:', newPath);
    router.push(newPath);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-muted transition-colors"
      >
        <span className="text-base">{languageNames[currentLang].flag}</span>
        <span className="text-sm font-medium">{languageNames[currentLang].native}</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 mt-2 bg-background border rounded-lg shadow-lg z-50 overflow-hidden min-w-[240px]"
            >
              <div className="p-2 border-b bg-muted/50">
                <p className="text-xs font-semibold text-muted-foreground px-2 py-1">
                  เลือกภาษา • Select Language
                </p>
              </div>
              <div className="max-h-[400px] overflow-y-auto p-2">
                {locales.map((lang) => (
                  <button
                    key={lang}
                    onClick={() => handleLanguageChange(lang)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-md transition-colors text-sm ${
                      currentLang === lang
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">{languageNames[lang].flag}</span>
                      <span>{languageNames[lang].native}</span>
                    </div>
                    {currentLang === lang && <Check className="h-4 w-4" />}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
