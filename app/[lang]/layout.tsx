import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { getLocale, locales, type Locale } from "@/lib/i18n";
import { getTranslations } from "@/lib/translations";

export async function generateStaticParams() {
  return locales.map((locale) => ({ lang: locale }));
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = getLocale(lang);
  const translations = getTranslations(locale);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar translations={translations} locale={locale} />
      <main className="flex-1">{children}</main>
      <Footer translations={translations} locale={locale} />
    </div>
  );
}
