# 🌍 Translation System - Multi-Language Article Management

## 📋 Overview

UnfakeNews รองรับ **15 ภาษา** ด้วยระบบแปลอัตโนมัติที่ฉลาดและประหยัด API calls โดยแบ่งภาษาออกเป็น 2 ประเภท:

### ภาษาหลัก (Primary Languages) - 10 ภาษา
**แปลทั้งบทความทันทีเมื่อสร้าง**

1. 🇹🇭 Thai (th)
2. 🇬🇧 English (en)
3. 🇨🇳 Chinese (zh)
4. 🇯🇵 Japanese (ja)
5. 🇰🇷 Korean (ko)
6. 🇲🇾 Malay (ms)
7. 🇮🇩 Indonesian (id)
8. 🇻🇳 Vietnamese (vi)
9. 🇵🇭 Filipino (tl)
10. 🇪🇸 Spanish (es)

### ภาษารอง (Secondary Languages) - 5 ภาษา
**แปลเฉพาะ metadata ทันที, แปล content เมื่อมีคนอ่าน**

1. 🇫🇷 French (fr)
2. 🇩🇪 German (de)
3. 🇷🇺 Russian (ru)
4. 🇵🇹 Portuguese (pt)
5. 🇸🇦 Arabic (ar)

---

## 🎯 ขั้นตอนการทำงาน

### 1️⃣ เมื่อ Admin สร้างบทความใหม่

```
┌─────────────────────────────────────────┐
│  Admin เขียนบทความภาษาไทย              │
│  - Title: "ปัญญาประดิษฐ์ล้ำยุค..."     │
│  - Excerpt: "Google เปิดตัว..."        │
│  - Content: "<p>เนื้อหาเต็ม...</p>"    │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│  กด "เผยแพร่บทความ"                    │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│  1. บันทึก Original (Thai)             │
│     ลง PostTranslation                  │
└─────────────────────────────────────────┘
                  ↓
        ┌─────────┴─────────┐
        ↓                    ↓
┌──────────────────┐  ┌──────────────────┐
│ Primary (10)     │  │ Secondary (5)    │
│ แปลทั้งบทความ  │  │ แปลเฉพาะ metadata│
└──────────────────┘  └──────────────────┘
        ↓                    ↓
┌──────────────────┐  ┌──────────────────┐
│ Gemini AI        │  │ Gemini AI        │
│ translatePost()  │  │ translateMetadata│
│                  │  │ ()               │
│ Input:           │  │ Input:           │
│ - title          │  │ - title          │
│ - excerpt        │  │ - excerpt        │
│ - content (FULL) │  │                  │
│                  │  │ Output:          │
│ Output:          │  │ - title          │
│ - title          │  │ - excerpt        │
│ - excerpt        │  │ - seoTitle       │
│ - content (FULL) │  │ - seoDesc        │
│ - seoTitle       │  │ - content: ""    │
│ - seoDesc        │  │   (empty!)       │
└──────────────────┘  └──────────────────┘
        ↓                    ↓
┌──────────────────┐  ┌──────────────────┐
│ บันทึก 10        │  │ บันทึก 5         │
│ translations     │  │ translations     │
│ (content เต็ม)   │  │ (content ว่าง)   │
└──────────────────┘  └──────────────────┘
```

---

### 2️⃣ เมื่อผู้อ่านเปิดบทความ

#### **กรณี: ภาษาหลัก (เช่น English, Japanese)**

```
User เปิด: /en/breaking-tech-news
        ↓
ดึง PostTranslation (lang: "en")
        ↓
✅ มี content เต็มแล้ว (แปลไว้ตั้งแต่ตอนสร้าง)
        ↓
แสดงบทความทันที (เร็ว!)
```

#### **กรณี: ภาษารอง (เช่น French, German)**

**ครั้งแรก:**
```
User เปิด: /fr/breaking-tech-news
        ↓
ดึง PostTranslation (lang: "fr")
        ↓
✅ มี record แต่ content = "" (แปลไว้แค่ metadata)
        ↓
ระบบตรวจพบ content ว่าง
        ↓
ดึง source translation (Thai หรือ English)
        ↓
เรียก Gemini AI translatePost()
        ↓
แปล content เต็ม
        ↓
UPDATE PostTranslation SET content = "..."
        ↓
แสดงบทความ (ช้าครั้งเดียว ~3-5 วินาที)
```

**ครั้งต่อไป:**
```
User เปิด: /fr/breaking-tech-news
        ↓
ดึง PostTranslation (lang: "fr")
        ↓
✅ มี content เต็มแล้ว (แปลไว้ครั้งแรก)
        ↓
แสดงบทความทันที (เร็ว!)
```

---

## 📊 สรุปข้อมูลที่ถูกแปล

### ภาษาหลัก (Primary) - แปลเมื่อสร้างบทความ

| ส่วนของบทความ | แปลหรือไม่ | บันทึกใน DB |
|--------------|----------|------------|
| **title** | ✅ แปลทันที | ✅ ใช่ |
| **excerpt** | ✅ แปลทันที | ✅ ใช่ |
| **content** | ✅ แปลทันที (FULL HTML) | ✅ ใช่ |
| **seoTitle** | ✅ แปลทันที | ✅ ใช่ |
| **seoDesc** | ✅ แปลทันที | ✅ ใช่ |
| **readTime** | ✅ คำนวณจาก content | ✅ ใช่ |

**ผลลัพธ์:**
- บทความพร้อมใช้งานทันที
- SEO-ready ทันทีเมื่อเผยแพร่
- ไม่มี delay เมื่อผู้อ่านเข้าชม

---

### ภาษารอง (Secondary) - แปล 2 ขั้นตอน

#### **ขั้นที่ 1: เมื่อสร้างบทความ (แปลเฉพาะ Metadata)**

| ส่วนของบทความ | แปลหรือไม่ | บันทึกใน DB |
|--------------|----------|------------|
| **title** | ✅ แปลทันที | ✅ ใช่ |
| **excerpt** | ✅ แปลทันที | ✅ ใช่ |
| **content** | ❌ ยังไม่แปล | ⚠️ บันทึกเป็น "" (empty) |
| **seoTitle** | ✅ แปลทันที | ✅ ใช่ |
| **seoDesc** | ✅ แปลทันที | ✅ ใช่ |
| **readTime** | ⚠️ ใช้ค่าจากภาษาต้นทาง | ✅ ใช่ |

**ผลลัพธ์:**
- บทความปรากฏใน homepage/listing
- มี title และ excerpt ให้คลิก
- SEO metadata พร้อมใช้งาน
- **ยังไม่มี content เต็ม**

#### **ขั้นที่ 2: เมื่อมีผู้อ่านครั้งแรก (แปล Content)**

| ส่วนของบทความ | แปลหรือไม่ | UPDATE ใน DB |
|--------------|----------|-------------|
| **title** | ✅ มีแล้ว | - ไม่ต้อง update |
| **excerpt** | ✅ มีแล้ว | - ไม่ต้อง update |
| **content** | ✅ แปลตอนนี้ (FULL HTML) | ✅ UPDATE |
| **seoTitle** | ✅ มีแล้ว | - ไม่ต้อง update |
| **seoDesc** | ✅ มีแล้ว | - ไม่ต้อง update |
| **readTime** | ✅ คำนวณใหม่จาก content | ✅ UPDATE |

**ผลลัพธ์:**
- Content เต็มพร้อมใช้งาน
- ผู้อ่านคนต่อไปอ่านได้ทันที
- ไม่ต้องแปลซ้ำอีก

---

## 💻 ไฟล์ที่เกี่ยวข้อง

### 1. `lib/gemini.ts`
**ฟังก์ชันแปลภาษาด้วย Gemini AI**

```typescript
// แปลทั้งบทความเต็ม (สำหรับภาษาหลัก)
export async function translatePost(
  input: TranslationInput,
  targetLang: string
): Promise<TranslationResult>

// แปลเฉพาะ metadata (สำหรับภาษารอง)
export async function translateMetadata(
  input: PartialTranslationInput,
  targetLang: string
): Promise<PartialTranslationResult>
```

### 2. `app/api/admin/translate-post/route.ts`
**API endpoint สำหรับแปลบทความ**

```typescript
POST /api/admin/translate-post

Body:
{
  "postId": "post-123",
  "targetLanguages": "primary" | "secondary" | "all" | ["en", "ja"]
}

Response:
{
  "success": true,
  "results": [
    { "lang": "en", "status": "success", "type": "full" },
    { "lang": "fr", "status": "success", "type": "metadata-only" }
  ]
}
```

### 3. `lib/db/posts.ts`
**Database query functions**

```typescript
// ดึงบทความและตรวจสอบ content
// ถ้า content ว่าง → แปลทันทีด้วย Gemini
export async function getPostBySlug(
  slug: string,
  lang: Locale
): Promise<PostWithTranslation | null>
```

### 4. `app/admin/posts/create/page.tsx`
**หน้าสร้างบทความใหม่**

```typescript
// เมื่อกด submit:
// 1. บันทึกบทความภาษาไทย
// 2. แปลภาษาหลัก (primary) - full translation
// 3. แปลภาษารอง (secondary) - metadata only
```

---

## 🎨 User Experience

### ภาษาหลัก (Primary)
```
✅ Homepage: แสดง title, excerpt ทันที
✅ Article page: เปิดได้ทันที (ไม่มี delay)
✅ SEO: Google index ได้ทันที
✅ Performance: เร็วทุกครั้ง
```

### ภาษารอง (Secondary)

**ครั้งแรก:**
```
✅ Homepage: แสดง title, excerpt ทันที
⏳ Article page: Loading 3-5 วินาที (แปล content ครั้งแรก)
✅ SEO: Google index metadata ได้ทันที
```

**ครั้งต่อไป:**
```
✅ Homepage: แสดง title, excerpt ทันที
✅ Article page: เปิดได้ทันที (อ่านจาก DB)
✅ SEO: Google index ได้เต็มรูปแบบ
✅ Performance: เร็วเหมือนภาษาหลัก
```

---

## 🚀 ข้อดีของระบบนี้

### 1. ประหยัด API Costs
- ไม่แปลบทความภาษารองที่อาจไม่มีคนอ่าน
- แปลเฉพาะเมื่อมี demand จริง
- ประหยัด ~50% API calls

### 2. SEO-Friendly
- ภาษาหลัก (10 ภาษา): SEO-ready ทันที
- ภาษารอง (5 ภาษา): มี metadata สำหรับ SEO
- Google สามารถ index และแสดงใน search results

### 3. User Experience ดี
- Homepage/listing: แสดงได้ทุกภาษาทันที
- Article page: เร็วสำหรับภาษาหลัก, ช้าครั้งเดียวสำหรับภาษารอง
- Progressive loading: แปลเมื่อต้องการจริงๆ

### 4. Scalable
- เพิ่มภาษาใหม่ง่าย
- สลับภาษาระหว่าง primary/secondary ได้
- รองรับบทความหลายพันฉบับ

---

## 📝 ตัวอย่าง: สร้างบทความใหม่

### 1. Admin เข้าหน้า `/admin/posts/create`

```
Title: ปัญญาประดิษฐ์ล้ำยุค Google เปิดตัว AI รุ่นใหม่
Excerpt: Google เปิดตัวเทคโนโลยี AI ที่ทรงพลังที่สุด...
Content: <p>Google ได้เปิดตัวเทคโนโลยี AI รุ่นใหม่...</p>
```

### 2. กดปุ่ม "เผยแพร่บทความ"

**ระบบทำงาน:**
```
[✓] บันทึก PostTranslation (lang: "th")
    - title: "ปัญญาประดิษฐ์ล้ำยุค..."
    - content: "<p>Google ได้เปิดตัว...</p>"
    
[⏳] แปลภาษาหลัก (10 ภาษา):
    [✓] en: "Revolutionary AI: Google Unveils..."
    [✓] ja: "革命的AI: Google が新しいAIを発表..."
    [✓] zh: "革命性AI：谷歌推出新AI..."
    [✓] ko, ms, id, vi, tl, es... (7 more)
    
[⏳] แปลภาษารอง (5 ภาษา - metadata only):
    [✓] fr: "IA Révolutionnaire..." (content: "")
    [✓] de: "Revolutionäre KI..." (content: "")
    [✓] ru, pt, ar... (3 more)
    
[✅] สำเร็จ! บทความพร้อมใช้งาน 15 ภาษา
```

### 3. ผลลัพธ์

**Database:**
```sql
SELECT postId, lang, 
       LENGTH(content) as content_length 
FROM PostTranslation 
WHERE postId = 'post-123';

-- Results:
th  | 5000 chars  ✅ Full
en  | 4800 chars  ✅ Full
ja  | 5200 chars  ✅ Full
... (7 more primary)
fr  | 0 chars     ⚠️ Empty (metadata only)
de  | 0 chars     ⚠️ Empty (metadata only)
... (3 more secondary)
```

---

## 🔧 การ Config

### เปลี่ยนภาษาจาก Secondary → Primary

**File: `lib/i18n.ts`**

```typescript
// ย้ายภาษาที่ต้องการจาก secondaryLanguages → primaryLanguages
export const primaryLanguages: Locale[] = [
  "th", "en", "zh", "ja", "ko", 
  "ms", "id", "vi", "tl", "es",
  "fr",  // ← ย้ายจาก secondary
];

export const secondaryLanguages: Locale[] = [
  "de", "ru", "pt", "ar"  // ลบ "fr" ออก
];
```

**ผลลัพธ์:**
- บทความใหม่จะแปลภาษาฝรั่งเศสเต็มรูปแบบทันที
- บทความเก่าจะแปล content เมื่อมีคนอ่านครั้งแรก

---

## 🎯 Best Practices

### 1. เลือกภาษาหลักตาม Traffic
- ดู Google Analytics
- ภาษาที่มี traffic สูง → primary
- ภาษาที่มี traffic ต่ำ → secondary

### 2. Monitor API Usage
```bash
# ดูจำนวน translations ต่อวัน
SELECT DATE(createdAt), 
       COUNT(*) as translations_created
FROM PostTranslation
WHERE createdAt >= NOW() - INTERVAL 7 DAY
GROUP BY DATE(createdAt);
```

### 3. Pre-translate ภาษารอง (Optional)
```bash
# ถ้าต้องการแปล content ล่วงหน้า
npm run translate:post -- <postId> --languages fr,de,ru
```

---

## 📈 Statistics

### API Calls Comparison

**ก่อนใช้ระบบนี้:**
- 1 บทความ × 15 ภาษา × Full translation = **15 API calls**
- 100 บทความ = **1,500 API calls**

**หลังใช้ระบบนี้:**
- 1 บทความ × 10 ภาษาหลัก (full) + 5 ภาษารอง (metadata) = **10 + 5 = 15 API calls**
- แต่ภาษารอง metadata-only มีขนาดเล็กกว่า → ถูกกว่า ~70%
- **ประหยัด: ~35-40% ของต้นทุน API**

---

## 🎉 Summary

| Feature | Primary (10) | Secondary (5) |
|---------|-------------|---------------|
| **แปลเมื่อไหร่** | สร้างบทความ | สร้างบทความ (metadata) + อ่านครั้งแรก (content) |
| **Title** | ✅ ทันที | ✅ ทันที |
| **Excerpt** | ✅ ทันที | ✅ ทันที |
| **Content** | ✅ ทันที | ⏳ เมื่ออ่านครั้งแรก |
| **SEO** | ✅ Full | ✅ Metadata only (เริ่มต้น) |
| **Performance** | 🚀 เร็วทันที | ⏳ ช้าครั้งแรก, เร็วครั้งถัดไป |
| **API Cost** | 💰 ปกติ | 💵 ประหยัด 70% |

---

**🌟 ผลลัพธ์: บทความพร้อมใช้งาน 15 ภาษา โดยประหยัดต้นทุนและมี UX ที่ดี!**
