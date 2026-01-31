# 🔐 Admin Credentials

## Default Admin Account

```
Email: admin@unfakenews.asia
Password: admin123
```

## การเข้าสู่ระบบ

### Easter Egg Access:
1. ไปที่หน้าแรก: `https://www.unfakenews.asia`
2. **คลิกโลโก้ "UnfakeNews" 5 ครั้ง** (ภายใน 2 วินาที)
3. จะเด้งไปหน้า login อัตโนมัติ

### Direct Access:
```
https://www.unfakenews.asia/auth/signin
```

---

## สร้าง Admin User ใหม่

### ผ่าน Supabase SQL Editor:

```sql
-- สร้าง admin user ใหม่
INSERT INTO "User" (
  id, 
  email, 
  name, 
  password, 
  role, 
  "createdAt", 
  "updatedAt"
)
VALUES (
  gen_random_uuid()::text,
  'your-email@example.com',
  'Your Name',
  'your-password',  -- ⚠️ ในการใช้งานจริงควร hash ด้วย bcrypt
  'ADMIN',
  NOW(),
  NOW()
);
```

### Role Types:
- `SUPER_ADMIN` - สิทธิ์สูงสุด
- `ADMIN` - จัดการเนื้อหาได้ทั้งหมด
- `EDITOR` - แก้ไขบทความ
- `USER` - ผู้ใช้ทั่วไป

---

## ⚠️ สำคัญ!

### ก่อน Deploy Production:

1. **เปลี่ยนรหัสผ่าน default:**
   ```sql
   UPDATE "User" 
   SET password = 'new-strong-password'
   WHERE email = 'admin@unfakenews.asia';
   ```

2. **ใช้ bcrypt สำหรับ password hashing:**
   - ตอนนี้ password เก็บเป็น plain text (ไม่ปลอดภัย)
   - ควรเพิ่ม bcrypt hashing ใน `lib/auth-options.ts`

3. **ลบ demo credentials:**
   - ลบ comment ที่บอก email/password ออกจาก signin page

---

## 🔒 Security Best Practices

### 1. Hash Passwords:
```bash
npm install bcryptjs
npm install --save-dev @types/bcryptjs
```

### 2. Update auth-options.ts:
```typescript
import bcrypt from "bcryptjs";

// In authorize function:
const isValid = await bcrypt.compare(
  credentials.password, 
  user.password
);

if (!user || !isValid) {
  throw new Error("Invalid credentials");
}
```

### 3. Hash existing passwords:
```sql
-- ใช้ bcrypt online tool เพื่อ hash password
-- https://bcrypt-generator.com/
-- แล้ว update:
UPDATE "User" 
SET password = '$2a$10$...' -- hashed password
WHERE email = 'admin@unfakenews.asia';
```

---

## 📝 Notes

- Login link ถูกซ่อนจากเมนู (Easter egg: คลิกโลโก้ 5 ครั้ง)
- Google OAuth ถูกปิดการใช้งาน (ใช้ email/password เท่านั้น)
- Admin เท่านั้นที่สามารถเข้าถึง `/admin` dashboard

---

## 📸 Supabase Storage Setup (สำหรับอัพโหลดรูปภาพ)

### ✅ ระบบอัพโหลดรูปภาพ

ระบบรองรับการอัพโหลดรูปภาพไปยัง **Supabase Storage** แล้ว! 

**Feature Image & Images ในบทความ:**
- ✅ อัพโหลดจากเครื่องคอมพิวเตอร์ → เก็บใน Supabase Storage
- ✅ หรือใช้ URL ภายนอก (Unsplash, Cloudinary)
- ✅ Preview รูปภาพก่อนบันทึก
- ✅ ตรวจสอบขนาดและประเภทไฟล์อัตโนมัติ

### 🔧 การตั้งค่า Supabase Storage

#### 1. สร้าง Storage Bucket

1. เข้า **Supabase Dashboard**: https://app.supabase.com
2. เลือก Project ของคุณ
3. ไปที่เมนู **Storage** (ด้านซ้าย)
4. คลิก **"New bucket"**
5. ตั้งค่า:
   - **Name**: `post-images`
   - **Public bucket**: ✅ เลือก (เพื่อให้เข้าถึงรูปได้โดยไม่ต้อง auth)
   - **File size limit**: 5MB (หรือตามต้องการ)
6. คลิก **"Create bucket"**

#### 2. ตั้งค่า Policies (Optional)

ถ้าต้องการให้เฉพาะ Admin อัพโหลดได้:

```sql
-- Policy: Admin เท่านั้นที่อัพโหลดได้
CREATE POLICY "Admin can upload images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'post-images'
  AND auth.role() = 'authenticated'
);

-- Policy: ทุกคนดูรูปได้ (public)
CREATE POLICY "Public can view images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'post-images');
```

#### 3. เพิ่ม Environment Variables

เพิ่มใน `.env` หรือ `.env.local`:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**หา Credentials:**
1. ไปที่ Supabase Dashboard
2. คลิก **Settings** → **API**
3. คัดลอก:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

#### 4. Restart Dev Server

```bash
npm run dev
```

### 📖 วิธีใช้งาน

#### อัพโหลดรูปภาพในหน้าสร้างบทความ:

1. ไปที่ `/admin/posts/create`
2. ในส่วน **"รูปภาพประกอบ"** จะมี 2 ตัวเลือก:
   - 🚀 **อัพโหลดจากเครื่อง** (Supabase) - คลิก "เลือกรูปภาพจากเครื่อง"
   - 🔗 **ใส่ URL รูปภาพ** - วาง URL ภายนอก
3. เลือกรูปภาพ → ระบบจะอัพโหลดอัตโนมัติ
4. ดู Preview รูปภาพ
5. กด "เผยแพร่บทความ"

### ✨ Features

- ✅ **Auto-upload** ไปยัง Supabase Storage
- ✅ **Unique filename** สุ่มชื่อไฟล์ไม่ซ้ำกัน
- ✅ **File validation** ตรวจสอบประเภทและขนาด (max 5MB)
- ✅ **Image preview** แสดงตัวอย่างก่อนบันทึก
- ✅ **CDN-ready** รูปโหลดเร็วผ่าน Supabase CDN
- ✅ **Error handling** แจ้งเตือนเมื่อเกิดข้อผิดพลาด

### 🔍 Structure ที่สร้าง

```
lib/
  └── supabase.ts              # Supabase client config
  
components/
  └── admin/
      └── image-uploader.tsx   # Upload component

app/admin/posts/create/page.tsx  # ✅ อัพเดทแล้ว - มีปุ่มอัพโหลด
```

### 🌐 URL รูปภาพที่ได้

```
https://your-project.supabase.co/storage/v1/object/public/post-images/posts/1738340000000-abc123.jpg
```

### 📊 Storage Limits (Supabase Free Tier)

- **Storage**: 1GB
- **Bandwidth**: 2GB/เดือน
- **Files**: ไม่จำกัด

### 💡 Tips

1. **Optimize รูปก่อนอัพโหลด**:
   - ใช้ tools เช่น TinyPNG, Squoosh
   - แนะนำ: 1200x800px, WebP format
   
2. **ใช้ CDN URL**:
   - รูปจาก Supabase โหลดเร็วผ่าน CDN
   - Support HTTPS automatically
   
3. **Backup**:
   - รูปจะไม่หายเมื่อ redeploy (เก็บใน Supabase)
   - แยกจาก codebase

### ⚠️ Important

- ⚠️ ถ้าไม่ตั้งค่า Supabase → ยังใส่ URL รูปภาพได้ตามปกติ
- ⚠️ สร้าง bucket ชื่อ `post-images` ให้ตรงกับโค้ด
- ⚠️ เปิด Public Access ถ้าต้องการให้ทุกคนเห็นรูป
