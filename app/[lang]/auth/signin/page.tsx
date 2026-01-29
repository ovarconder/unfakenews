import { getLocale } from "@/lib/i18n";
import { getTranslations } from "@/lib/translations";
import SignInForm from "./signin-form";

export default async function SignInPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const locale = getLocale(lang);
  const translations = getTranslations(locale);
  return <SignInForm locale={locale} translations={translations} />;
}
