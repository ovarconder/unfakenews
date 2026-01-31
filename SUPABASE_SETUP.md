# การตั้งค่า Supabase Database - คู่มือภาษาไทย

## ปัญหา: มี DATABASE_URL สองแหล่ง

คุณมี database อยู่สองแหล่ง:
1. Local PostgreSQL ที่ติดตั้งในเครื่อง
2. Supabase (PostgreSQL บน Cloud)

**แนะนำ: ใช้ Supabase เป็นหลัก** เพราะ:
- ✅ ฟรี (ใช้ได้ถึง 500MB)
- ✅ ไม่ต้องติดตั้ง PostgreSQL ในเครื่อง
- ✅ พร้อมใช้ทันที
- ✅ มี Dashboard สำหรับดูข้อมูล
- ✅ พร้อม Deploy ขึ้น Production
- ✅ Backup อัตโนมัติ

## ขั้นตอนการตั้งค่า Supabase

### 1. สร้าง Project ใน Supabase

1. ไปที่ https://supabase.com/
2. สมัครสมาชิก/เข้าสู่ระบบ
3. คลิก **"New Project"**
4. กรอกข้อมูล:
   - **Name**: `unfakenews` (หรือชื่ออื่นที่ต้องการ)
   - **Database Password**: สร้างรหัสผ่านที่แข็งแรง (เก็บไว้ใช้ในภายหลัง)
   - **Region**: เลือก **Singapore** (ใกล้ไทยที่สุด)
5. คลิก **"Create new project"**
6. รอประมาณ 2-3 นาที ระบบจะสร้าง database ให้

### 2. ดึง Connection String

หลังจาก Project สร้างเสร็จ:

1. ไปที่เมนู **Settings** (⚙️)
2. คลิก **Database** ในเมนูด้านซ้าย
3. เลื่อนลงมาที่ส่วน **Connection string**
4. เลือก **URI** หรือ **Connection pooling**
5. คัดลอก Connection String

**ตัวอย่าง Connection String:**
```
postgresql://postgres.xxxxxxxxxxxxx:[YOUR-PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
```

**สำคัญ:** แทนที่ `[YOUR-PASSWORD]` ด้วยรหัสผ่านที่คุณตั้งไว้ตอนสร้าง Project

### 3. แก้ไขไฟล์ `.env`

แก้ไขไฟล์ `.env` ให้มีเพียง **1 DATABASE_URL** เท่านั้น:

```env
# ===== Supabase Database (ใช้อันนี้) =====
DATABASE_URL="postgresql://postgres.xxxxxxxxxxxxx:[YOUR-PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true"

# Direct connection (สำหรับ Prisma Migrate)
DIRECT_URL="postgresql://postgres.xxxxxxxxxxxxx:[YOUR-PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres"

# ===== Google Gemini API =====
GEMINI_API_KEY="your_gemini_api_key_here"

# ===== NextAuth =====
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your_nextauth_secret_here"

# ===== Base URL =====
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

**หมายเหตุ:**
- `DATABASE_URL` - ใช้ port 6543 (connection pooling - เร็วกว่า)
- `DIRECT_URL` - ใช้ port 5432 (direct connection - สำหรับ migrations)

### 4. อัปเดต Prisma Schema

แก้ไขไฟล์ `prisma/schema.prisma`:

```prisma
generator client {
  provider = "prisma-client-js"
  output   = "../node_modules/.prisma/client"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

// ... ส่วนที่เหลือเหมือนเดิม
```

### 5. สร้างตารางใน Database

รันคำสั่งเหล่านี้:

```bash
# 1. Generate Prisma Client
npm run prisma:generate

# 2. สร้างตารางใน Supabase
npm run prisma:push

# หรือถ้าต้องการสร้าง migration files
npm run prisma:migrate

# 3. เปิด Prisma Studio เพื่อดูข้อมูล
npm run prisma:studio
```

### 6. ตรวจสอบว่าเชื่อมต่อสำเร็จ

1. รันคำสั่ง `npm run prisma:studio`
2. เปิด browser ที่ http://localhost:5555
3. ถ้าเห็นตาราง `User`, `Post`, `PostTranslation` แสดงว่าเชื่อมต่อสำเร็จ!

## ลบ Local PostgreSQL (ถ้าไม่ต้องการใช้)

ถ้าคุณไม่ต้องการใช้ PostgreSQL ในเครื่อง:

**macOS:**
```bash
# ถ้าติดตั้งผ่าน Homebrew
brew services stop postgresql
brew uninstall postgresql
```

**หรือปล่อยไว้ก็ได้** - ไม่กระทบกับ Supabase

## ดู Database ใน Supabase Dashboard

1. ไปที่ https://supabase.com/dashboard
2. เลือก Project ของคุณ
3. คลิกเมนู **Table Editor**
4. จะเห็นตารางที่สร้างจาก Prisma:
   - `User`
   - `Post`
   - `PostTranslation`

## สร้างข้อมูลตัวอย่าง

### วิธีที่ 1: ใช้ Prisma Studio (แนะนำ)

```bash
npm run prisma:studio
```

1. เปิด http://localhost:5555
2. คลิก `User` → **Add record**
3. กรอกข้อมูล:
   - `email`: admin@unfakenews.com
   - `name`: Admin User
   - `role`: admin
4. คลิก **Save**

5. คลิก `Post` → **Add record**
6. กรอกข้อมูล:
   - `slug`: first-article
   - `category`: Technology
   - `image`: https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200
   - `published`: true
   - `featured`: true
   - `authorId`: (เลือก User ที่สร้างไว้)
7. คลิก **Save**

8. คลิก `PostTranslation` → **Add record**
9. กรอกข้อมูล:
   - `postId`: (เลือก Post ที่สร้างไว้)
   - `lang`: en
   - `title`: Welcome to UnfakeNews
   - `excerpt`: Discover multi-language news platform
   - `content`: 
   ```html
   <p>Welcome to UnfakeNews - premium multi-language news platform.</p>
   <h2>Features</h2>
   <p>Support 11 languages with AI translation.</p>
   ```
   - `seoTitle`: Welcome to UnfakeNews | Multi-Language News
   - `seoDesc`: Premium news platform with 11 language support
   - `readTime`: 3 min read
10. คลิก **Save**

### วิธีที่ 2: ใช้ Supabase SQL Editor

1. ไปที่ Supabase Dashboard
2. คลิกเมนู **SQL Editor**
3. วาง SQL นี้:

```sql
-- สร้าง User
INSERT INTO "User" (id, email, name, role, "emailVerified", image, "createdAt", "updatedAt")
VALUES (
  'user_001',
  'admin@unfakenews.com',
  'Admin User',
  'admin',
  NOW(),
  null,
  NOW(),
  NOW()
);

-- สร้าง Post
INSERT INTO "Post" (id, slug, "authorId", category, image, published, featured, views, "createdAt", "updatedAt")
VALUES (
  'post_001',
  'first-article',
  'user_001',
  'Technology',
  'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200',
  true,
  true,
  0,
  NOW(),
  NOW()
);

-- สร้าง PostTranslation (English)
INSERT INTO "PostTranslation" (id, "postId", lang, title, content, excerpt, "seoTitle", "seoDesc", "readTime", "createdAt", "updatedAt")
VALUES (
  'trans_001',
  'post_001',
  'en',
  'Welcome to UnfakeNews',
  '<p>Welcome to UnfakeNews - your premium multi-language news platform powered by AI translation.</p><h2>Features</h2><p>Our platform supports 11 languages with on-demand translation, ensuring your content reaches a global audience.</p>',
  'Discover the future of multi-language news publishing with AI-powered translation',
  'Welcome to UnfakeNews | Multi-Language News Platform',
  'Premium multi-language news platform with AI-powered translation supporting 11 languages including Thai, English, Japanese, Chinese and more.',
  '3 min read',
  NOW(),
  NOW()
);
```

4. คลิก **Run** (หรือกด Cmd/Ctrl + Enter)

## ทดสอบระบบ

```bash
# รัน development server
npm run dev

# เปิด browser ที่:
# http://localhost:3000/en/posts/first-article (ภาษาอังกฤษ)
# http://localhost:3000/th/posts/first-article (แปลเป็นไทยโดย AI)
# http://localhost:3000/ja/posts/first-article (แปลเป็นญี่ปุ่นโดย AI)
```

## แก้ปัญหาที่พบบ่อย

### 1. เชื่อมต่อ Database ไม่ได้

**ตรวจสอบ:**
- ✅ PASSWORD ใน DATABASE_URL ถูกต้อง
- ✅ ไม่มีช่องว่างหรืออักขระพิเศษที่ไม่ได้ encode
- ✅ Supabase Project ยังไม่ถูก pause (ฟรีแพลนอาจ pause ถ้าไม่ได้ใช้ 7 วัน)

**วิธีแก้:**
```bash
# ทดสอบ connection
npm run prisma:studio
```

### 2. Migration ล้มเหลว

**ใช้ `prisma db push` แทน:**
```bash
npm run prisma:push
```

### 3. "Prepared statement already exists"

**แก้ไข:**
เพิ่ม `?pgbouncer=true` ท้าย DATABASE_URL:
```env
DATABASE_URL="...?pgbouncer=true"
```

### 4. ลืมรหัสผ่าน Database

1. ไปที่ Supabase Dashboard
2. Settings → Database
3. คลิก **Reset database password**
4. ตั้งรหัสผ่านใหม่
5. อัปเดต DATABASE_URL ใน `.env`

## การ Backup ข้อมูล

Supabase ทำ backup อัตโนมัติทุกวัน แต่ถ้าต้องการ export เอง:

1. ไปที่ Supabase Dashboard
2. Settings → Database
3. เลื่อนลงมาที่ **Connection pooling**
4. คัดลอก Connection string
5. รันคำสั่ง:

```bash
# Export ทั้งหมด
pg_dump "postgresql://..." > backup.sql

# Restore
psql "postgresql://..." < backup.sql
```

## สรุป Configuration ที่ถูกต้อง

ไฟล์ `.env` ควรมีเพียง:

```env
# Supabase Database (เลือกใช้อันนี้)
DATABASE_URL="postgresql://postgres.xxxxx:password@xxxxx.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.xxxxx:password@xxxxx.supabase.com:5432/postgres"

# Gemini AI
GEMINI_API_KEY="your_key"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your_secret"

# Base URL
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

**ลบ DATABASE_URL แบบเก่าออกทั้งหมด!**

## ข้อดีของ Supabase

✅ **ฟรี**: 500MB database + 2GB bandwidth  
✅ **ง่าย**: ไม่ต้องติดตั้ง PostgreSQL  
✅ **เร็ว**: Connection pooling built-in  
✅ **ปลอดภัย**: SSL encryption อัตโนมัติ  
✅ **Dashboard**: จัดการข้อมูลได้ง่าย  
✅ **Backup**: สำรองข้อมูลอัตโนมัติ  
✅ **Production Ready**: ใช้ต่อได้เลยตอน deploy  

## ถัดไป

1. ✅ ตั้งค่า Supabase เรียบร้อย
2. ✅ สร้างข้อมูลตัวอย่าง
3. ✅ ทดสอบระบบแปลภาษา
4. 🚀 เริ่มสร้างคอนเทนต์!

หากมีปัญหาหรือข้อสงสัย ให้ดูคู่มือเพิ่มเติมที่:
- `QUICKSTART.md`
- `MULTILANGUAGE_SETUP.md`
