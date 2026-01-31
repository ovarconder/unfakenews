# 📊 Google Analytics 4 (GA4) Setup Guide

## Overview

Google Analytics 4 พร้อม Event Tracking, Cookie Consent และ GDPR Compliance

---

## 🚀 Quick Setup

### 1. สร้าง Google Analytics 4 Account

#### Step 1: สร้าง Property

1. ไปที่ [Google Analytics](https://analytics.google.com/)
2. คลิก **Admin** (เกียร์)
3. คลิก **Create Property**
4. ตั้งชื่อ: `UnfakeNews`
5. เลือก timezone: `(GMT+07:00) Bangkok`
6. เลือก currency: `Thai Baht (THB)`
7. คลิก **Next**

#### Step 2: เลือกประเภทธุรกิจ

- Industry category: **News and Media**
- Business size: **Small (1-10 employees)**
- เลือก use cases ที่เหมาะสม
- คลิก **Create**

#### Step 3: สร้าง Data Stream (Web)

1. เลือก **Web**
2. Website URL: `https://yourdomain.com`
3. Stream name: `UnfakeNews Website`
4. คลิก **Create stream**

#### Step 4: คัดลอก Measurement ID

```
Measurement ID: G-XXXXXXXXXX
```

**Copy ID นี้ไว้!**

---

## 🔧 Installation

### 1. เพิ่ม Environment Variable

เพิ่มใน `.env`:

```env
# Google Analytics
NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"
```

เพิ่มใน `.env.example`:

```env
# Google Analytics 4
NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"
```

### 2. ติดตั้งแล้ว ✅

Components พร้อมใช้งานแล้ว:
- ✅ `components/google-analytics.tsx` - GA4 integration
- ✅ `components/cookie-consent.tsx` - Cookie banner
- ✅ Updated `app/layout.tsx` - Load GA4
- ✅ Updated `post-content.tsx` - Track views
- ✅ Updated `social-share.tsx` - Track shares
- ✅ Updated `language-switcher.tsx` - Track language changes

### 3. ทดสอบ

```bash
# เพิ่ม GA_ID ใน .env
echo 'NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"' >> .env

# รัน dev server
npm run dev

# เปิดเบราว์เซอร์
http://localhost:3000
```

**ตรวจสอบ:**
1. Cookie banner ปรากฏหลัง 1 วินาที
2. คลิก **Accept**
3. เปิด DevTools → Console
4. ดู `gtag()` calls

---

## 📊 Events ที่ Track อัตโนมัติ

### 1. Page Views (Auto)

ทุกครั้งที่เปลี่ยนหน้า:
```javascript
gtag('config', 'G-XXXXXXXXXX', {
  page_path: '/th/posts/some-slug'
});
```

### 2. Article Views

เมื่อเปิดบทความ:
```javascript
gaEvent.viewArticle(
  articleId,      // "post_123"
  title,          // "หัวข้อบทความ"
  category,       // "Technology"
  language        // "th"
);
```

**ใน GA4 จะเห็น:**
- Event name: `view_article`
- Parameters:
  - `article_id`
  - `article_title`
  - `article_category`
  - `language`

### 3. Social Shares

เมื่อแชร์บทความ:
```javascript
gaEvent.shareArticle(
  articleId,      // "post_123"
  platform,       // "facebook", "twitter", "line", etc.
  language        // "th"
);
```

**ใน GA4 จะเห็น:**
- Event name: `share`
- Parameters:
  - `content_type`: "article"
  - `item_id`
  - `method`: platform
  - `language`

### 4. Language Changes

เมื่อเปลี่ยนภาษา:
```javascript
gaEvent.changeLanguage(
  from,           // "th"
  to              // "en"
);
```

**ใน GA4 จะเห็น:**
- Event name: `change_language`
- Parameters:
  - `language_from`
  - `language_to`

### 5. User Login

เมื่อ login:
```javascript
gaEvent.login("google");  // or "credentials"
```

### 6. Post Creation (Admin)

เมื่อสร้างบทความ:
```javascript
gaEvent.createPost(category, language);
```

---

## 🎯 Custom Event Examples

### ตัวอย่างการ Track เพิ่มเติม

#### 1. Track Search

```typescript
// ใน search component
import { gaEvent } from "@/components/google-analytics";

const handleSearch = (term: string) => {
  gaEvent.search(term, locale);
  // ... search logic
};
```

#### 2. Track Button Click

```typescript
gaEvent.event("button_click", {
  button_name: "subscribe",
  location: "navbar",
});
```

#### 3. Track Scroll Depth

```typescript
useEffect(() => {
  const handleScroll = () => {
    const scrollPercent = (window.scrollY / document.body.scrollHeight) * 100;
    if (scrollPercent > 75) {
      gaEvent.event("scroll_depth", {
        percent: 75,
        article_id: post.id,
      });
    }
  };
  
  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, []);
```

#### 4. Track Video Play (if you have videos)

```typescript
gaEvent.event("video_play", {
  video_title: "Video Title",
  video_duration: 120,
});
```

---

## 🍪 Cookie Consent (GDPR)

### Features

✅ **Compliant with GDPR** - EU privacy law  
✅ **Cookie banner** - แสดงหลัง 1 วินาที  
✅ **Accept/Decline** - ให้ user เลือก  
✅ **LocalStorage** - จำการตั้งค่า  
✅ **Privacy Policy link** - ลิงก์ไปหน้า privacy  

### How It Works

```typescript
// 1. แสดง banner หลัง 1 วินาที
setTimeout(() => setShowBanner(true), 1000);

// 2. ถ้า user กด Accept
localStorage.setItem("cookie-consent", "accepted");
gtag("consent", "update", {
  analytics_storage: "granted"
});

// 3. ถ้า user กด Decline
localStorage.setItem("cookie-consent", "declined");
// Analytics จะไม่ทำงาน
```

### Customization

แก้ไข `components/cookie-consent.tsx`:

```typescript
// เปลี่ยนข้อความ
<p className="text-sm text-muted-foreground mb-4">
  Your custom message here
</p>

// เปลี่ยนสี
<Button
  onClick={acceptCookies}
  className="bg-your-color"
>
  Accept
</Button>

// เปลี่ยนตำแหน่ง
<motion.div className="fixed top-4 right-4">
  {/* Banner */}
</motion.div>
```

---

## 📈 Viewing Analytics

### Real-Time Reports

1. ไปที่ [Google Analytics](https://analytics.google.com/)
2. เลือก Property: `UnfakeNews`
3. คลิก **Reports** → **Realtime**

**จะเห็น:**
- 👥 Users online now
- 📄 Active pages
- 🌍 User locations
- 📱 Devices

### Event Reports

1. คลิก **Reports** → **Engagement** → **Events**
2. เลือก event: `view_article`, `share`, etc.
3. ดู parameters และ metrics

### Popular Pages

1. คลิก **Reports** → **Engagement** → **Pages and screens**
2. เรียงตาม Views
3. ดูว่าบทความไหนได้รับความนิยม

### Traffic Sources

1. คลิก **Reports** → **Acquisition** → **Traffic acquisition**
2. ดูว่า user มาจากไหน:
   - Direct
   - Organic Search (Google)
   - Social Media
   - Referral

### Demographics

1. คลิก **Reports** → **User** → **Demographics**
2. ดู:
   - Age groups
   - Gender
   - Interests

### Language & Location

1. คลิก **Reports** → **User** → **Tech**
2. ดู:
   - Languages
   - Countries
   - Cities

---

## 🔍 Debug Mode

### Enable Debug Mode

```typescript
// components/google-analytics.tsx
gtag('config', 'G-XXXXXXXXXX', {
  debug_mode: true,  // เพิ่มบรรทัดนี้
  page_path: window.location.pathname,
});
```

### View in Console

เปิด DevTools → Console:

```
[GA4] Event: page_view
[GA4] Event: view_article
[GA4] Parameters: {article_id: "post_123", ...}
```

### Google Analytics DebugView

1. ไปที่ GA4 Dashboard
2. คลิก **Configure** → **DebugView**
3. เปิด website ใน browser ที่ enable debug mode
4. ดู events real-time

---

## 🎨 Custom Dashboards

### Create Dashboard

1. ใน GA4 → **Explore**
2. คลิก **Blank**
3. เลือก metrics:
   - Page views by language
   - Most shared articles
   - Popular categories
   - User engagement

### Example: Article Performance

**Dimensions:**
- Article Title
- Language
- Category

**Metrics:**
- Views
- Shares
- Average engagement time

**Visualization:**
- Table
- Bar chart

---

## 🚀 Advanced Features

### 1. Google Tag Manager (GTM)

แทนที่จะใช้ gtag.js โดยตรง อาจใช้ GTM:

**ข้อดี:**
- จัดการ tags หลายตัว
- ไม่ต้อง deploy ใหม่เพื่อเปลี่ยน tracking
- Visual interface

**Setup:**
1. สร้าง GTM account
2. ติดตั้ง GTM container
3. Add GA4 tag ใน GTM

### 2. Enhanced Ecommerce (ถ้ามีร้านค้า)

Track:
- Product views
- Add to cart
- Purchases

### 3. User ID Tracking

Track logged-in users:

```typescript
gtag('config', 'G-XXXXXXXXXX', {
  user_id: session.user.id
});
```

### 4. Custom Dimensions

เพิ่ม custom dimensions ใน GA4:

1. GA4 → **Configure** → **Custom definitions**
2. คลิก **Create custom dimension**
3. ใช้ใน events:

```typescript
gaEvent.event("view_article", {
  author_role: "editor",  // custom dimension
  word_count: 1500,       // custom metric
});
```

---

## 🔒 Privacy & GDPR

### Compliance Checklist

- ✅ Cookie consent banner
- ✅ Privacy policy page
- ✅ Opt-out mechanism
- ✅ Data retention settings
- ✅ IP anonymization
- ✅ User data deletion

### Enable IP Anonymization

```typescript
gtag('config', 'G-XXXXXXXXXX', {
  anonymize_ip: true
});
```

### Data Retention

1. GA4 → **Admin** → **Data Settings** → **Data Retention**
2. เลือก: **2 months** (ปลอดภัยที่สุด)
3. Save

### Privacy Policy

สร้างหน้า `/privacy`:

```markdown
# Privacy Policy

## Cookies We Use

- Google Analytics: Track website usage
- Essential cookies: Remember language preference

## Your Rights

- Right to access your data
- Right to delete your data
- Right to opt-out

[Contact us] to exercise your rights.
```

---

## 📊 Key Metrics to Monitor

### 1. Engagement

- **Average engagement time**
- **Pages per session**
- **Bounce rate**

### 2. Content Performance

- **Most viewed articles**
- **Most shared articles**
- **Popular categories**

### 3. User Behavior

- **Language preferences**
- **Device breakdown** (mobile vs desktop)
- **Traffic sources**

### 4. Growth

- **New vs returning users**
- **User growth rate**
- **Session trends**

---

## 🧪 Testing Checklist

### Before Deploy:

- [ ] GA_ID เพิ่มใน .env แล้ว
- [ ] Cookie banner แสดงหลัง 1 วินาที
- [ ] Accept/Decline ทำงานได้
- [ ] Page views tracked
- [ ] Article views tracked
- [ ] Share events tracked
- [ ] Language change tracked

### After Deploy:

- [ ] ทดสอบ Realtime reports
- [ ] ดู Events ใน GA4
- [ ] ตรวจสอบ DebugView
- [ ] ทดสอบ Cookie consent
- [ ] ตรวจสอบ Privacy Policy link

---

## 🛠️ Troubleshooting

### Issue 1: Events ไม่แสดงใน GA4

**Solutions:**
1. รอ 24-48 ชั่วโมง (GA4 อาจมี delay)
2. ตรวจสอบ GA_ID ถูกต้อง
3. เปิด DebugView
4. ตรวจสอบ Console errors

### Issue 2: Cookie Banner ไม่แสดง

**Solutions:**
1. Clear localStorage: `localStorage.clear()`
2. Refresh page
3. ตรวจสอบ import ใน layout.tsx

### Issue 3: AdBlock block GA4

**Solutions:**
- ไม่สามารถแก้ได้ (user เลือกที่จะ block)
- ประมาณ 20-30% ของ traffic อาจถูก block
- ถือว่าเป็นเรื่องปกติ

---

## 📚 Resources

### Official Docs:
- [GA4 Documentation](https://support.google.com/analytics/answer/10089681)
- [gtag.js Reference](https://developers.google.com/tag-platform/gtagjs/reference)
- [GA4 Events](https://support.google.com/analytics/answer/9322688)

### Tools:
- [GA4 DebugView](https://support.google.com/analytics/answer/7201382)
- [Google Tag Assistant](https://tagassistant.google.com/)
- [GA4 Query Explorer](https://ga-dev-tools.google/ga4/query-explorer/)

### Privacy:
- [GDPR Compliance](https://gdpr.eu/)
- [Cookie Consent Guide](https://www.cookieyes.com/blog/cookie-consent-banner/)

---

## 🎉 Summary

คุณตอนนี้มี:

✅ **Google Analytics 4** - Fully integrated  
✅ **Event Tracking** - 6 events อัตโนมัติ  
✅ **Cookie Consent** - GDPR compliant  
✅ **Real-time Reports** - ดูได้ทันที  
✅ **Custom Events** - เพิ่มได้ง่าย  
✅ **Multi-language Support** - Track ทุกภาษา  
✅ **Privacy Compliant** - ปลอดภัย  

**Events ที่ Track:**
- 📄 Page views (auto)
- 👁️ Article views
- 📤 Social shares
- 🌐 Language changes
- 🔐 User logins
- ✍️ Post creations

**Next Steps:**
1. เพิ่ม GA_ID ใน .env
2. Deploy to production
3. รอ 24-48 ชั่วโมง
4. ดู Reports ใน GA4!

**พร้อมใช้งาน!** 📊🚀

มีคำถามเพิ่มเติมถามได้เลยครับ! 😊
