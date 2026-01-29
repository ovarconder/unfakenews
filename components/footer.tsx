import Link from "next/link";
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import { Locale } from "@/lib/i18n";

interface FooterProps {
  translations: any;
  locale: Locale;
}

export function Footer({ translations, locale }: FooterProps) {
  return (
    <footer className="border-t bg-zinc-50 mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">UnfakeNews</h3>
            <p className="text-sm text-muted-foreground">
              Premium news and magazine platform delivering quality journalism.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">{translations.common.categories}</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href={`/${locale}/category/politics`}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {translations.nav.politics}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/category/business`}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {translations.nav.business}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/category/technology`}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {translations.nav.technology}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/category/culture`}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {translations.nav.culture}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href={`/${locale}/about`}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/contact`}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/privacy`}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/terms`}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Follow Us</h4>
            <div className="flex gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2026 UnfakeNews. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
