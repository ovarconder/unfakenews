import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { locales, defaultLocale } from "@/lib/i18n";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Check if pathname already has a locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return NextResponse.next();

  // Check for saved language preference in cookies
  const savedLocale = request.cookies.get("preferred-language")?.value;
  const preferredLocale = 
    savedLocale && locales.includes(savedLocale as any) 
      ? savedLocale 
      : defaultLocale;

  // Redirect to preferred locale if no locale in pathname
  if (pathname === "/") {
    const response = NextResponse.redirect(
      new URL(`/${preferredLocale}`, request.url)
    );
    // Save preference in cookie for server-side access
    if (savedLocale) {
      response.cookies.set("preferred-language", savedLocale, {
        maxAge: 60 * 60 * 24 * 365, // 1 year
      });
    }
    return response;
  }

  // For other paths without locale, add preferred locale
  return NextResponse.redirect(
    new URL(`/${preferredLocale}${pathname}`, request.url)
  );
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - auth (auth pages)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|auth|_next/static|_next/image|favicon.ico).*)",
  ],
};
