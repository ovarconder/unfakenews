# ✅ URL Structure Update

## 🔄 Changes Made

### Old URL Structure:
```
/{lang}/posts/{slug}
/{lang}/article/{id}
/{lang}/category/{slug}
```

### New URL Structure:
```
/{lang}/{slug}
```

**เหตุผล:** 
- เว็บมีแค่ content ประเภทเดียว (บทความ)
- URL สั้นลง สวยขึ้น
- SEO-friendly มากขึ้น
- ถ้าในอนาคตมี content ประเภทอื่น ค่อยเพิ่มเฉพาะประเภทนั้น

---

## 📁 Files Changed

### 1. **Created New Route:** `app/[lang]/[slug]/`
- ✅ `page.tsx` - Article page
- ✅ `post-content.tsx` - Article content component

### 2. **Updated Components:**
- ✅ `components/article-card.tsx` - Link to `/{locale}/{slug}`
- ✅ `components/language-switcher.tsx` - Navigate to `/{newLang}/{slug}`

### 3. **Updated Config:**
- ✅ `app/sitemap.ts` - Generate sitemap with new URLs

### 4. **Removed Old Routes:**
- ❌ `app/[lang]/posts/` - Deleted
- ❌ `app/[lang]/article/` - Deleted  
- ❌ `app/[lang]/category/` - Deleted (can add back later if needed)

---

## 🎯 URL Examples

### Homepage:
```
https://yourdomain.com/th
https://yourdomain.com/en
https://yourdomain.com/ja
```

### Article Pages:
```
https://yourdomain.com/th/breaking-tech-news
https://yourdomain.com/en/breaking-tech-news
https://yourdomain.com/ja/breaking-tech-news
```

### Benefits:
- ✅ Clean & simple
- ✅ Language is clear from URL
- ✅ No redundant `/posts/` prefix
- ✅ Same slug across all languages
- ✅ Easy to remember and share

---

## 🔗 Internal Links Updated

### ArticleCard Component:
```typescript
// Before
<Link href={`/${locale}/posts/${article.slug}`}>

// After
<Link href={`/${locale}/${article.slug}`}>
```

### Language Switcher:
```typescript
// Before
router.push(`/${newLang}/posts/${currentSlug}`);

// After
router.push(`/${newLang}/${currentSlug}`);
```

### Sitemap:
```typescript
// Before
url: `${baseUrl}/${lang}/posts/${post.slug}`

// After
url: `${baseUrl}/${lang}/${post.slug}`
```

---

## 📊 Metadata & SEO

### URL in Metadata:
```typescript
const currentUrl = `${baseUrl}/${locale}/${slug}`;

// hreflang tags
languages[lang] = `${baseUrl}/${lang}/${slug}`;
languages["x-default"] = `${baseUrl}/en/${slug}`;
```

### Canonical URL:
```typescript
alternates: {
  canonical: `${baseUrl}/${locale}/${slug}`,
  languages,
}
```

---

## 🚀 Migration Notes

### For Existing Content:
- URLs will automatically update
- Old `/posts/{slug}` URLs will 404
- Consider adding redirects if needed:

```typescript
// In vercel.json or middleware
{
  "redirects": [
    {
      "source": "/:lang/posts/:slug",
      "destination": "/:lang/:slug",
      "permanent": true
    }
  ]
}
```

### For Search Engines:
- Submit new sitemap to Google Search Console
- Old URLs will eventually be replaced
- Canonical tags will guide crawlers

---

## ✅ Testing Checklist

- [ ] Homepage loads: `/th`, `/en`, `/ja`
- [ ] Click article from homepage → Opens `/{lang}/{slug}`
- [ ] Change language → Navigate to `/{newLang}/{slug}`
- [ ] Social share → Correct URL in share links
- [ ] Sitemap generates: `/sitemap.xml`
- [ ] Metadata has correct URLs
- [ ] hreflang tags are correct

---

## 💡 Future Additions

If you need other content types later:

```
/{lang}/videos/{slug}     - For video content
/{lang}/podcasts/{slug}   - For podcasts
/{lang}/events/{slug}     - For events
/{lang}/authors/{slug}    - For author profiles
```

But for articles, keep it simple: `/{lang}/{slug}` ✅

---

**URL structure updated!** 🎉
