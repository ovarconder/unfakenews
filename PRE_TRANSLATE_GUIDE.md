# 🌍 Pre-Translation Guide - SEO Optimization

## ภาพรวม

ระบบแปลภาษาของ UnfakeNews มี 2 กลยุทธ์:

### 1. **ภาษาหลัก (Primary Languages)** - Pre-translate สำหรับ SEO
- 🇹🇭 Thai (th)
- 🇬🇧 English (en)
- 🇨🇳 Chinese (zh)
- 🇯🇵 Japanese (ja)
- 🇪🇸 Spanish (es)

**วิธีการ:** แปลล่วงหน้าทันทีที่เผยแพร่บทความ เพื่อให้ search engines index ได้เลย

### 2. **ภาษารอง (Secondary Languages)** - On-demand Translation
- 🇫🇷 French (fr)
- 🇩🇪 German (de)
- 🇰🇷 Korean (ko)
- 🇷🇺 Russian (ru)
- 🇵🇹 Portuguese (pt)
- 🇸🇦 Arabic (ar)

**วิธีการ:** แปลตอนที่มีผู้เข้าชม ช่วยประหยัดค่า API และเวลา

---

## 🚀 คำสั่ง Pre-Translation

### 1. แปลภาษาหลักทั้งหมด (แนะนำ)

```bash
npm run translate:primary
```

แปล**ทุกบทความ**ที่เผยแพร่แล้ว ไปเป็น 5 ภาษาหลัก

**ผลลัพธ์:**
```
🌍 Pre-translating posts to PRIMARY languages for SEO
   Languages: TH, EN, ZH, JA, ES

📚 Found 4 published posts

📝 Translating post: global-tech-summit-ai-platform
   Source: EN
   ⏭️  EN - Already exists
   🔄 TH - Translating...
   ✅ TH - Success
   🔄 ZH - Translating...
   ✅ ZH - Success
   ...

✨ Primary language translation complete!
```

### 2. แปลทุกภาษา (11 ภาษา)

```bash
npm run translate:all
```

แปล**ทุกบทความ**ไปเป็นทุกภาษา (ใช้เวลานาน + ค่า API สูง)

**เมื่อไหร่ควรใช้:**
- เมื่อมี traffic สูงจากทุกภาษา
- ต้องการ SEO coverage เต็มรูปแบบ
- พร้อมจ่ายค่า API

### 3. แปลบทความเดียว (ภาษาหลัก)

```bash
npm run translate:post -- global-tech-summit-ai-platform
```

แปล**บทความเดียว**ไปเป็นภาษาหลัก 5 ภาษา

**เมื่อไหร่ควรใช้:**
- เพิ่งเผยแพร่บทความใหม่
- ต้องการทดสอบ translation
- แก้ไขบทความแล้วต้องการแปลใหม่

### 4. แปลบทความเดียว (ทุกภาษา)

```bash
npm run translate:post -- global-tech-summit-ai-platform --all
```

แปล**บทความเดียว**ไปเป็นทุกภาษา

### 5. ดูสถานะการแปล

```bash
npm run translate:status
```

แสดงสถานะการแปลของทุกบทความ

**ผลลัพธ์:**
```
📊 Translation Status

Post Translations:
────────────────────────────────────────────────────────────────────────────────
Slug                                     | Translations                           
────────────────────────────────────────────────────────────────────────────────
global-tech-summit-ai-platform           | ✓5/5 primary, +6 secondary
economic-recovery-strong-momentum        | ✓5/5 primary
climate-action-summit-bold-targets       | ✓3/5 primary
cultural-renaissance-new-museum          | ✗ No primary
────────────────────────────────────────────────────────────────────────────────

Total posts: 4
Total translations: 16
Average translations per post: 4.0
```

---

## 📋 Workflow แนะนำ

### สำหรับบทความใหม่

1. **สร้างบทความ** ใน Prisma Studio หรือ Admin Panel
2. **เขียนเนื้อหา** ในภาษาหลัก (English หรือ Thai)
3. **Pre-translate:**
   ```bash
   npm run translate:post -- your-article-slug
   ```
4. **ตรวจสอบ:** เปิดดูในทุกภาษาหลัก
5. **Deploy** หรือ **Publish**

### สำหรับบทความทั้งหมด (ครั้งแรก)

```bash
# 1. ดูสถานะปัจจุบัน
npm run translate:status

# 2. แปลภาษาหลักทั้งหมด
npm run translate:primary

# 3. ตรวจสอบอีกครั้ง
npm run translate:status
```

### Scheduled Translation (อนาคต)

ใช้ Cron job หรือ GitHub Actions:

```yaml
# .github/workflows/translate.yml
name: Pre-translate Primary Languages
on:
  schedule:
    - cron: '0 0 * * *'  # ทุกวันเที่ยงคืน
  workflow_dispatch:      # หรือรันด้วยตัวเอง

jobs:
  translate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm run translate:primary
```

---

## 💰 ประมาณการค่าใช้จ่าย

### Gemini 2.0 Flash (ฟรี tier)

- **Free:** 15 requests/minute (RPM)
- **ราคา:** ~$0.001/request (ถ้าเกิน free tier)

### ตัวอย่างการคำนวณ:

**4 บทความ × 5 ภาษา = 20 translations**

- ใน free tier: **ฟรี**
- เกิน tier: ~$0.02 (20 บาท)

**100 บทความ × 5 ภาษา = 500 translations**

- ประมาณ: ~$0.50 (15 บาท)

**100 บทความ × 11 ภาษา = 1,100 translations**

- ประมาณ: ~$1.10 (33 บาท)

### ข้อแนะนำ:

- ✅ **ภาษาหลัก**: ฟรีหรือราคาถูกมาก
- ⚠️ **ทุกภาษา**: ควรใช้เมื่อจำเป็นจริงๆ
- 💡 **On-demand**: ภาษารองแปลตอนมีคนเข้าชม

---

## 🎯 SEO Strategy

### เพื่อ SEO ที่ดีที่สุด:

1. **Pre-translate ภาษาหลัก 5 ภาษา**
   - Search engines index ได้ทันที
   - ไม่มี delay เวลา crawl
   - Better Core Web Vitals

2. **เปิด ISR (Incremental Static Regeneration)**
   ```typescript
   // app/[lang]/posts/[slug]/page.tsx
   export const revalidate = 3600; // ✅ Already configured
   ```

3. **Submit Sitemap**
   - Sitemap มี URLs ทุกภาษาหลัก
   - Google จะ index ได้เร็วขึ้น

4. **Hreflang Tags**
   - ระบบใส่ hreflang อัตโนมัติ
   - Google รู้จักภาษาทางเลือก

### ภาษารอง (Secondary):

- แปล on-demand เมื่อมีผู้เข้าชม
- Cache ใน database
- ครั้งต่อไปโหลดเร็ว
- ประหยัดค่า API

---

## 🔧 Troubleshooting

### Error: "No default translation found"

**สาเหตุ:** บทความไม่มีภาษา English หรือ Thai

**แก้ไข:**
```bash
# สร้าง translation ภาษาหลักใน Prisma Studio
# หรือใช้ SQL:
INSERT INTO "PostTranslation" (id, "postId", lang, title, content, excerpt, "seoTitle", "seoDesc")
VALUES (...);
```

### Error: "Rate limit exceeded"

**สาเหตุ:** เกิน 15 RPM ของ Gemini API

**แก้ไข:**
- รอ 1 นาที
- Script มี delay 1 วินาทีระหว่างแปล
- ถ้าต้องการเร็วขึ้น: upgrade Gemini API quota

### Error: "Translation response missing required fields"

**สาเหตุ:** Gemini API ตอบกลับไม่ครบ

**แก้ไข:**
- ลองรันใหม่
- ตรวจสอบ GEMINI_API_KEY
- ดู logs ใน console

---

## 📊 การติดตาม (Monitoring)

### ดูการใช้ API

1. ไป https://makersuite.google.com
2. ดู **Usage & Billing**
3. Monitor requests/day

### ตรวจสอบ Database

```sql
-- Count translations per language
SELECT lang, COUNT(*) as count 
FROM "PostTranslation" 
GROUP BY lang 
ORDER BY count DESC;

-- Posts without primary language coverage
SELECT p.slug, COUNT(pt.id) as translation_count
FROM "Post" p
LEFT JOIN "PostTranslation" pt ON p.id = pt."postId"
WHERE p.published = true
GROUP BY p.id, p.slug
HAVING COUNT(pt.id) < 5;
```

### Vercel Analytics

ตรวจสอบ:
- Page views by language
- Translation API response time
- Error rates

---

## 🚀 Best Practices

### 1. แปลทันทีหลังเผยแพร่

```bash
# หลัง publish บทความใหม่
npm run translate:post -- new-article-slug
```

### 2. Batch Translation กลางคืน

ตั้ง cron job แปลอัตโนมัติ:
```bash
0 2 * * * cd /path/to/project && npm run translate:primary
```

### 3. Monitor Translation Quality

- สุ่มตรวจสอบ translations
- ถ้าคุณภาพไม่ดี: แก้ไข Gemini prompt
- หรือ: manual translation override

### 4. Cache Management

- Translations cache ถาวรใน database
- ถ้าต้องการแปลใหม่: ลบแล้วรันสคริปต์ใหม่

---

## 📝 Example Workflow

### Scenario: เพิ่งเผยแพร่บทความใหม่

```bash
# 1. ตรวจสอบบทความใหม่
npm run translate:status

# 2. แปลภาษาหลัก
npm run translate:post -- new-article

# 3. ตรวจสอบผลลัพธ์
# เปิด browser:
# - https://yoursite.com/en/posts/new-article
# - https://yoursite.com/th/posts/new-article
# - https://yoursite.com/ja/posts/new-article

# 4. ถ้าพอใจ -> Done!
# ถ้าต้องการภาษาเพิ่ม:
npm run translate:post -- new-article --all
```

---

## 🎉 สรุป

### ภาษาหลัก (5 ภาษา)
- ✅ Pre-translate สำหรับ SEO
- ✅ Search engines index ได้เลย
- ✅ ประหยัดค่าใช้จ่าย

### ภาษารอง (6 ภาษา)
- ✅ On-demand translation
- ✅ Cache ใน database
- ✅ ไม่เสีย API ถ้าไม่มีคนดู

### คำสั่งที่ใช้บ่อย
```bash
npm run translate:primary     # แปลภาษาหลักทั้งหมด
npm run translate:post -- slug # แปลบทความเดียว
npm run translate:status      # ดูสถานะ
```

**Happy Translating! 🌍**
