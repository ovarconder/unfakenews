# 📸 Image Upload System - Setup Complete!

## ✅ สิ่งที่ติดตั้งเสร็จแล้ว

### 1. Dependencies
- ✅ `@supabase/supabase-js` - Supabase client library

### 2. Files Created
```
lib/
  └── supabase.ts                          # Supabase client config

components/
  └── admin/
      └── image-uploader.tsx               # Image upload component

app/admin/posts/create/page.tsx            # ✅ Updated with upload button
```

### 3. Features
- ✅ **อัพโหลดรูปจากเครื่อง** → Supabase Storage
- ✅ **หรือใส่ URL รูปภาพ** → จากแหล่งภายนอก (Unsplash, Cloudinary)
- ✅ **Preview รูปภาพ** พร้อมแสดง URL
- ✅ **Validation** - ตรวจสอบประเภทและขนาดไฟล์ (max 5MB)
- ✅ **Error handling** - แจ้งเตือนเมื่อเกิดข้อผิดพลาด
- ✅ **Success feedback** - แสดงสถานะเมื่ออัพโหลดสำเร็จ

---

## 🔧 ขั้นตอนต่อไป: Setup Supabase Storage

### Step 1: สร้าง Storage Bucket

1. เข้า **Supabase Dashboard**: https://app.supabase.com
2. เลือก Project ของคุณ
3. ไปที่เมนู **Storage** (sidebar ด้านซ้าย)
4. คลิก **"New bucket"** (ปุ่มสีเขียว)
5. กรอกข้อมูล:
   ```
   Name: post-images
   ☑️ Public bucket (เปิดเพื่อให้ทุกคนดูรูปได้)
   File size limit: 5242880 (5MB)
   Allowed MIME types: image/jpeg, image/png, image/webp, image/gif
   ```
6. คลิก **"Create bucket"**

### Step 2: เพิ่ม Environment Variables

เพิ่มใน `.env.local`:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL="https://xxxxxxxxxxxxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**หา Credentials:**
1. Supabase Dashboard → **Settings** → **API**
2. คัดลอก:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **Project API keys** → `anon` `public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Step 3: Restart Dev Server

```bash
npm run dev
```

### Step 4: ทดสอบอัพโหลด

1. ไปที่: `http://localhost:3000/admin/posts/create`
2. ในส่วน **"รูปภาพประกอบ"**:
   - คลิก **"เลือกรูปภาพจากเครื่อง"**
   - เลือกรูปภาพ (JPG, PNG, WebP, GIF)
   - รอสักครู่ → จะเห็น ✅ "อัพโหลดสำเร็จ!"
   - รูปภาพจะแสดง Preview
3. เสร็จแล้ว! URL รูปภาพจะถูกบันทึกในฟอร์มอัตโนมัติ

---

## 📖 วิธีใช้งาน

### อัพโหลดรูปภาพ Feature Image:

หน้า **"สร้างบทความใหม่"** จะมี 2 ตัวเลือก:

#### ตัวเลือกที่ 1: อัพโหลดจากเครื่อง (Supabase) 🚀
```
[เลือกรูปภาพจากเครื่อง] 🗑️

✅ อัพโหลดสำเร็จ!

[รูปภาพ Preview พร้อม URL]
```

#### ตัวเลือกที่ 2: ใส่ URL รูปภาพ 🔗
```
https://images.unsplash.com/photo-...

📸 แหล่งรูปภาพแนะนำ:
→ Unsplash (ฟรี)  → Cloudinary
```

### อัพโหลดรูปใน Content (HTML):

ในช่อง **"เนื้อหาข่าว"** สามารถใช้ HTML tag:

```html
<p>เนื้อหาบทความ...</p>

<img src="https://your-url.com/image.jpg" alt="รูปภาพประกอบ" />

<p>เนื้อหาต่อ...</p>
```

**ขั้นตอน:**
1. อัพโหลดรูปผ่าน Supabase (ในส่วน Feature Image)
2. คัดลอก URL ที่ได้
3. วางใน HTML `<img>` tag ในเนื้อหา

---

## 🔍 Technical Details

### Supabase Client (`lib/supabase.ts`)

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

### Image Uploader Component (`components/admin/image-uploader.tsx`)

**Props:**
- `onUpload: (url: string) => void` - Callback เมื่ออัพโหลดสำเร็จ
- `currentImage?: string` - URL รูปภาพปัจจุบัน (สำหรับ preview)
- `label?: string` - ข้อความบนปุ่ม (default: "อัพโหลดรูปภาพ")

**Features:**
- File validation (type, size)
- Upload progress indicator
- Success/error messages
- Image preview with URL display
- Remove image button

### Upload Flow

```
User selects image
    ↓
Validate file type & size
    ↓
Generate unique filename
    ↓
Upload to Supabase Storage
    ↓
Get public URL
    ↓
Display preview
    ↓
Call onUpload(url)
```

### File Naming Convention

```
Format: {timestamp}-{random}.{extension}
Example: 1738340567890-7x8k3h2.jpg

Path in Supabase: posts/1738340567890-7x8k3h2.jpg
```

### Public URL Format

```
https://your-project.supabase.co/storage/v1/object/public/post-images/posts/1738340567890-7x8k3h2.jpg
```

---

## 💾 Storage Structure

```
Supabase Storage
└── post-images (bucket)
    └── posts/
        ├── 1738340567890-7x8k3h2.jpg
        ├── 1738340598123-9k2m4n1.png
        └── 1738340625456-2p5q8r3.webp
```

---

## 🎨 UI/UX

### Before Upload:
```
┌────────────────────────────────────┐
│ [📤 เลือกรูปภาพจากเครื่อง]        │
│                                    │
│ 📸 รองรับ: JPG, PNG, WebP, GIF    │
│ • ขนาดสูงสุด: 5MB                 │
└────────────────────────────────────┘
```

### During Upload:
```
┌────────────────────────────────────┐
│ [⏳ กำลังอัพโหลด...]              │
└────────────────────────────────────┘
```

### After Upload (Success):
```
┌────────────────────────────────────┐
│ [📤 เลือกรูปภาพจากเครื่อง]  [🗑️] │
│                                    │
│ ✅ อัพโหลดสำเร็จ!                 │
│                                    │
│ ┌──────────────────────────────┐  │
│ │ [รูปภาพ Preview]              │  │
│ │ https://supabase.../image.jpg │  │
│ └──────────────────────────────┘  │
└────────────────────────────────────┘
```

### After Upload (Error):
```
┌────────────────────────────────────┐
│ [📤 เลือกรูปภาพจากเครื่อง]        │
│                                    │
│ ❌ อัพโหลดล้มเหลว: File too large│
└────────────────────────────────────┘
```

---

## 🛡️ Security & Validation

### File Type Validation:
```typescript
Allowed: image/jpeg, image/png, image/webp, image/gif
```

### File Size Limit:
```typescript
Maximum: 5MB (5,242,880 bytes)
```

### Filename Sanitization:
```typescript
// Generate unique, safe filename
const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
```

---

## 📊 Supabase Storage Limits (Free Tier)

| Resource | Limit |
|----------|-------|
| **Storage** | 1 GB |
| **Bandwidth** | 2 GB/month |
| **Max file size** | 50 MB (configurable in bucket settings) |
| **Files** | Unlimited |

---

## 🔧 Troubleshooting

### ปัญหา: "อัพโหลดล้มเหลว"

**สาเหตุที่เป็นไปได้:**

1. **ไม่มี Supabase credentials**
   ```
   Solution: เพิ่ม NEXT_PUBLIC_SUPABASE_URL และ NEXT_PUBLIC_SUPABASE_ANON_KEY ใน .env.local
   ```

2. **ไม่มี bucket ชื่อ `post-images`**
   ```
   Solution: สร้าง bucket ตาม Step 1
   ```

3. **Bucket ไม่เป็น Public**
   ```
   Solution: ไปที่ Storage → post-images → Configuration → ติ๊ก "Public bucket"
   ```

4. **ไฟล์ใหญ่เกิน**
   ```
   Solution: Compress รูปภาพให้เล็กกว่า 5MB ก่อนอัพโหลด
   ```

### ปัญหา: Console แสดง Warning

```
⚠️ Supabase credentials not found. Image upload will not work.
```

**Solution:**
- เพิ่ม environment variables ใน `.env.local`
- Restart dev server

---

## 🚀 Deployment

### Environment Variables (Production)

เพิ่มใน Vercel/hosting platform:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Next.js Config

Update `next.config.ts`:

```typescript
const nextConfig = {
  images: {
    domains: [
      'images.unsplash.com',
      'your-project.supabase.co',  // เพิ่มบรรทัดนี้
    ],
  },
};
```

---

## 📚 Additional Resources

- [Supabase Storage Docs](https://supabase.com/docs/guides/storage)
- [Next.js Image Optimization](https://nextjs.org/docs/basic-features/image-optimization)
- [IMAGE_UPLOAD_GUIDE.md](./IMAGE_UPLOAD_GUIDE.md) - คู่มือเพิ่มเติม

---

## ✅ Summary

**What's Working:**
- ✅ อัพโหลดรูปภาพจากเครื่อง → Supabase Storage
- ✅ หรือใส่ URL รูปภาพจากแหล่งภายนอก
- ✅ Preview รูปภาพ
- ✅ Validation และ Error handling
- ✅ UI/UX สวยงาม พร้อมใช้

**What You Need to Do:**
1. สร้าง Storage Bucket ชื่อ `post-images` ใน Supabase
2. เพิ่ม Environment Variables ใน `.env.local`
3. Restart dev server
4. ทดสอบอัพโหลดรูปภาพ

**Time to Setup:**
⏱️ ประมาณ 5-10 นาที

---

🎉 **พร้อมใช้งานแล้ว!** เริ่มอัพโหลดรูปภาพได้เลยครับ
