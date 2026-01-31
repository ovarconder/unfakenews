# 📱 Social Media Sharing with Rich Previews (OG Tags)

## Overview

ระบบ Social Sharing พร้อม Rich Previews (Thumbnails) สำหรับทุก platform

---

## ✅ What's Implemented

### 1. Open Graph (OG) Tags

Used by: **Facebook, LINE, WhatsApp, LinkedIn, Discord, Slack**

```html
<meta property="og:title" content="หัวข้อบทความ" />
<meta property="og:description" content="สรุปบทความ" />
<meta property="og:image" content="https://yourdomain.com/image.jpg" />
<meta property="og:url" content="https://yourdomain.com/th/posts/slug" />
<meta property="og:type" content="article" />
<meta property="og:site_name" content="UnfakeNews" />
<meta property="og:locale" content="th" />
<meta property="article:published_time" content="2026-01-30T..." />
<meta property="article:author" content="Author Name" />
<meta property="article:section" content="Technology" />
```

### 2. Twitter Cards

Used by: **X (Twitter)**

```html
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:site" content="@UnfakeNews" />
<meta name="twitter:title" content="หัวข้อบทความ" />
<meta name="twitter:description" content="สรุปบทความ" />
<meta name="twitter:image" content="https://yourdomain.com/image.jpg" />
```

### 3. Standard Meta Tags

Used by: **Search Engines, Browsers**

```html
<meta name="description" content="สรุปบทความ" />
<meta name="keywords" content="Technology, news, th" />
<meta name="author" content="Author Name" />
```

---

## 🖼️ Image Requirements

### Recommended Sizes:

| Platform | Optimal Size | Aspect Ratio | Min Size | Max Size |
|----------|-------------|--------------|----------|----------|
| **Facebook** | 1200×630 | 1.91:1 | 600×315 | - |
| **X (Twitter)** | 1200×675 | 16:9 | 300×157 | 4096×4096 |
| **LinkedIn** | 1200×627 | 1.91:1 | 520×272 | - |
| **LINE** | 1200×630 | 1.91:1 | 600×315 | - |
| **WhatsApp** | 1200×630 | 1.91:1 | 600×315 | - |

**Best Universal Size: 1200×630 pixels**

### Image Format:
- ✅ **JPG** (recommended)
- ✅ **PNG**
- ✅ **WebP** (newer platforms)
- ❌ **SVG** (not supported)

### File Size:
- **Max:** 8MB (Facebook), 5MB (Twitter)
- **Recommended:** < 300KB for fast loading

---

## 🚀 How It Works

### 1. Dynamic OG Tags

แต่ละบทความจะมี OG tags ที่ generate อัตโนมัติจาก:

```typescript
// app/[lang]/posts/[slug]/page.tsx
export async function generateMetadata({ params }) {
  const post = await getPostBySlug(params.slug, locale);
  const imageUrl = post.image; // Must be absolute URL!
  
  return {
    openGraph: {
      title: post.translation.seoTitle,
      description: post.translation.seoDesc,
      images: [{
        url: imageUrl,
        width: 1200,
        height: 630,
        alt: post.translation.title,
      }],
      // ... more fields
    },
    twitter: {
      card: "summary_large_image",
      images: [imageUrl],
      // ... more fields
    },
  };
}
```

### 2. Image URL Validation

ระบบจะตรวจสอบว่า image URL เป็น absolute URL:

```typescript
const imageUrl = post.image.startsWith("http") 
  ? post.image 
  : `${baseUrl}${post.image}`;
```

**ตัวอย่าง:**
- ✅ `https://images.unsplash.com/photo-123.jpg`
- ✅ `https://yourdomain.com/uploads/image.jpg`
- ❌ `/uploads/image.jpg` (จะถูกแปลงเป็น absolute)

---

## 🧪 Testing OG Tags

### 1. Facebook Sharing Debugger

ทดสอบ Facebook, LINE, WhatsApp, LinkedIn:

```
https://developers.facebook.com/tools/debug/
```

**วิธีใช้:**
1. ไปที่ link ด้านบน
2. วาง URL บทความของคุณ
3. คลิก **Debug**
4. ดู preview และ OG tags ที่ถูก detect

**ปัญหาที่พบบ่อย:**
- ❌ Image ไม่แสดง → URL ไม่ถูกต้องหรือไม่เป็น absolute URL
- ❌ Cache เก่า → คลิก **Scrape Again**
- ❌ Image too small → ต้องมีขนาดขั้นต่ำ 600×315

### 2. Twitter Card Validator

ทดสอบ X (Twitter):

```
https://cards-dev.twitter.com/validator
```

**วิธีใช้:**
1. ไปที่ link ด้านบน
2. วาง URL บทความของคุณ
3. คลิก **Preview card**

### 3. LinkedIn Post Inspector

ทดสอบ LinkedIn:

```
https://www.linkedin.com/post-inspector/
```

### 4. LINE OG Tag Debugger

ทดสอบ LINE (ไม่มี official tool แต่ใช้ Facebook debugger ได้):

LINE ใช้ OG tags เหมือน Facebook

---

## 🛠️ Implementation Checklist

### ✅ Completed:

- ✅ Open Graph meta tags in `generateMetadata()`
- ✅ Twitter Card meta tags
- ✅ Absolute URL conversion for images
- ✅ Article metadata (author, published time, category)
- ✅ Multi-language support (og:locale)
- ✅ Image dimensions (1200×630)
- ✅ Alt text for accessibility

### 📋 Optional Enhancements:

- [ ] Dynamic OG Image generation (`opengraph-image.tsx`)
- [ ] Video OG tags (สำหรับบทความที่มีวิดีโอ)
- [ ] Multiple images (image gallery)
- [ ] App Deep Links (LINE, Facebook App)

---

## 🎨 Dynamic OG Image (Advanced)

ถ้าต้องการสร้างภาพ OG แบบ dynamic (ไม่ใช้รูปจาก database):

```typescript
// app/[lang]/posts/[slug]/opengraph-image.tsx
import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };

export default async function Image({ params }) {
  const post = await getPostBySlug(params.slug);
  
  return new ImageResponse(
    (
      <div style={{
        width: "100%",
        height: "100%",
        display: "flex",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      }}>
        <div style={{ fontSize: 60, color: "white" }}>
          {post.translation.title}
        </div>
      </div>
    ),
    { ...size }
  );
}
```

**ข้อดี:**
- สร้าง OG image แบบ real-time
- ไม่ต้องเก็บรูปไว้ล่วงหน้า
- Customize ได้ตามต้องการ

**ข้อเสีย:**
- ใช้ Edge Runtime (อาจช้ากว่า)
- จำกัดการใช้ font และ CSS

---

## 📊 Platform-Specific Tips

### Facebook

```typescript
openGraph: {
  type: "article",
  siteName: "UnfakeNews",
  locale: "th_TH", // Format: language_TERRITORY
  images: [{
    url: imageUrl,
    width: 1200,
    height: 630,
    type: "image/jpeg",
  }],
}
```

**Tips:**
- ใช้ aspect ratio 1.91:1 (1200×630)
- ไฟล์ขนาด < 8MB
- Clear cache ด้วย Sharing Debugger

### X (Twitter)

```typescript
twitter: {
  card: "summary_large_image", // Large preview
  site: "@UnfakeNews",
  creator: "@AuthorHandle",
}
```

**Card Types:**
- `summary_large_image` - รูปใหญ่ (แนะนำ)
- `summary` - รูปเล็ก
- `player` - สำหรับวิดีโอ

### LINE

LINE ใช้ OG tags เหมือน Facebook:

```typescript
openGraph: {
  title: "...",
  description: "...",
  images: [{
    url: imageUrl,
    width: 1200,
    height: 630,
  }],
}
```

**Tips:**
- รองรับ UTF-8 (ภาษาไทย, ญี่ปุ่น)
- ใช้รูปสะดุดตา (LINE มีผู้ใช้เยอะในเอเชีย)

### WhatsApp

WhatsApp ใช้ OG tags เหมือน Facebook:

```html
<meta property="og:title" content="..." />
<meta property="og:description" content="..." />
<meta property="og:image" content="..." />
```

**Tips:**
- Preview ใช้เวลาโหลด (อาจช้า)
- ไฟล์รูปควรเล็ก (< 300KB)
- รองรับ HTTPS เท่านั้น

---

## 🔍 Debugging Common Issues

### Issue 1: รูปไม่แสดง

**Possible Causes:**
- ❌ Image URL ไม่เป็น absolute URL
- ❌ Image file ไม่มีอยู่จริง (404)
- ❌ Server ไม่อนุญาตให้ scrape (blocked)
- ❌ Image ขนาดเล็กเกินไป (< 200×200)

**Solution:**
```typescript
// ตรวจสอบว่าเป็น absolute URL
const imageUrl = post.image.startsWith("http") 
  ? post.image 
  : `${process.env.NEXT_PUBLIC_BASE_URL}${post.image}`;

// ตรวจสอบว่า accessible
console.log("OG Image URL:", imageUrl);
```

### Issue 2: Cache ไม่อัปเดต

**Solution:**
1. Facebook: ใช้ Sharing Debugger → **Scrape Again**
2. Twitter: Clear browser cache
3. LINE: รอสักครู่ (LINE cache นาน)

### Issue 3: Title/Description ผิด

**Solution:**
```typescript
// ตรวจสอบ SEO fields
console.log({
  title: post.translation.seoTitle,
  description: post.translation.seoDesc,
});
```

---

## 📝 Best Practices

### 1. Image Guidelines

✅ **DO:**
- ใช้รูป high-quality (1200×630)
- ใช้ absolute URLs
- ใช้ HTTPS
- Optimize ไฟล์ (< 300KB)
- ใส่ alt text

❌ **DON'T:**
- ใช้รูปเบลอหรือคุณภาพต่ำ
- ใช้ relative URLs
- ใช้ HTTP (insecure)
- ใช้รูปขนาดใหญ่เกินไป (> 5MB)

### 2. Text Guidelines

✅ **DO:**
- Title: 60-90 characters
- Description: 150-160 characters
- ใช้ภาษาชัดเจน
- ใส่ keywords

❌ **DON'T:**
- Title ยาวเกินไป (> 100 chars)
- Description ยาวเกินไป (> 200 chars)
- ใช้ special characters มากเกินไป
- Clickbait

### 3. Testing Workflow

```bash
# 1. พัฒนา locally
npm run dev

# 2. ทดสอบ OG tags
# - View page source
# - ตรวจสอบ <meta property="og:...">

# 3. Deploy to staging
vercel --prod

# 4. ทดสอบด้วย validators
# - Facebook Debugger
# - Twitter Validator
# - LinkedIn Inspector

# 5. Share ทดสอบจริง
# - แชร์ไป Facebook
# - Tweet
# - ส่งผ่าน LINE
```

---

## 🚀 Deployment Checklist

### Before Deploy:

- [ ] ตรวจสอบ `NEXT_PUBLIC_BASE_URL` ใน `.env`
- [ ] ตรวจสอบว่าทุก image เป็น absolute URL
- [ ] ทดสอบ OG tags ใน local
- [ ] Optimize images (< 300KB)

### After Deploy:

- [ ] ทดสอบด้วย Facebook Debugger
- [ ] ทดสอบด้วย Twitter Validator
- [ ] แชร์ทดสอบจริงใน Facebook
- [ ] แชร์ทดสอบใน X (Twitter)
- [ ] ส่งผ่าน LINE ให้เพื่อนดู
- [ ] ตรวจสอบ analytics (click-through rate)

---

## 📚 Resources

### Official Documentation:
- [Open Graph Protocol](https://ogp.me/)
- [Twitter Cards](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards)
- [Facebook Sharing](https://developers.facebook.com/docs/sharing/webmasters)
- [Next.js Metadata](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)

### Testing Tools:
- [Facebook Debugger](https://developers.facebook.com/tools/debug/)
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/)
- [OpenGraph.xyz](https://www.opengraph.xyz/) - All-in-one checker

### Image Tools:
- [TinyPNG](https://tinypng.com/) - Compress images
- [Squoosh](https://squoosh.app/) - Image optimization
- [Canva](https://www.canva.com/) - Create OG images
- [OG Image Playground](https://og-playground.vercel.app/) - Test dynamic OG

---

## 🎉 Summary

คุณตอนนี้มี:

✅ **Rich Previews** ทุก platform (FB, X, LINE, WhatsApp, etc.)  
✅ **Dynamic OG Tags** จาก database  
✅ **Absolute URL** validation  
✅ **Multi-language** support  
✅ **SEO Optimized** metadata  
✅ **Testing Tools** ready  

**เมื่อแชร์บทความ จะแสดง:**
- 🖼️ **Thumbnail** สวยๆ (1200×630)
- 📝 **Title** และ **Description**
- 🌐 **URL** พร้อมภาษาที่เลือก
- 👤 **Author** และ **Site Name**

---

## 🧪 Quick Test

```bash
# 1. สร้างบทความทดสอบ
npm run dev
# ไป /admin/posts/create

# 2. ใส่รูป Unsplash
https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=630

# 3. Publish

# 4. ทดสอบ Share
# คัดลอก URL → วางใน Facebook Debugger

# 5. แชร์จริง
# แชร์ไป Facebook/LINE → ดู thumbnail
```

**มี thumbnail แสดงแล้ว!** 🎉📸

มีคำถามเพิ่มเติมถามได้เลยครับ! 😊
