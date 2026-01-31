# 📸 ระบบอัพโหลดรูปภาพ - สรุปสั้น

## ✅ สถานะ: ติดตั้งเสร็จแล้ว!

### ไฟล์ที่สร้าง:
```
✅ lib/supabase.ts                      # Supabase client
✅ components/admin/image-uploader.tsx  # Upload component  
✅ app/admin/posts/create/page.tsx      # อัพเดทแล้ว
```

### Dependencies:
```bash
✅ @supabase/supabase-js                # ติดตั้งแล้ว
```

---

## 🔧 ขั้นตอนต่อไป (ทำเพียง 3 ขั้นตอน)

### 1️⃣ สร้าง Storage Bucket ใน Supabase

1. เข้า https://app.supabase.com
2. เลือก Project
3. Storage → New bucket
4. Name: **`post-images`** (ต้องตรงนี้)
5. ✅ Public bucket
6. Create

### 2️⃣ เพิ่ม Environment Variables

ใน `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL="https://xxxxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbG..."
```

หา credentials: Supabase → Settings → API

### 3️⃣ Restart Server

```bash
npm run dev
```

---

## 🎯 วิธีใช้

1. ไปที่ `/admin/posts/create`
2. ส่วน "รูปภาพประกอบ":
   - **อัพโหลดจากเครื่อง** (Supabase)
   - **หรือใส่ URL** (Unsplash, Cloudinary)
3. เลือกรูป → อัพโหลดอัตโนมัติ
4. ✅ เสร็จ!

---

## 📖 เอกสารเพิ่มเติม

- `IMAGE_UPLOAD_SETUP.md` - คู่มือละเอียด
- `ADMIN_CREDENTIALS.md` - Setup Supabase (ส่วนล่าง)
- `IMAGE_UPLOAD_GUIDE.md` - คู่มือต้นฉบับ

---

## ⚡ Quick Reference

**Bucket name:** `post-images`  
**Path:** `posts/{timestamp}-{random}.{ext}`  
**Max size:** 5MB  
**Allowed:** JPG, PNG, WebP, GIF  

---

**ใช้เวลาติดตั้ง:** ⏱️ ~5 นาที  
**พร้อมใช้งาน:** ✅ ใช่
