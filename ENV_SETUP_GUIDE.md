# คู่มือตั้งค่า Environment Variables สำหรับ Supabase

## 📋 ขั้นตอนการตั้งค่าแบบละเอียด

### ขั้นที่ 1: สร้าง/เข้า Supabase Project

1. ไปที่ https://supabase.com
2. คลิก "Start your project"
3. Sign in with GitHub (แนะนำ) หรือ Email
4. คลิก "New Project"

### ขั้นที่ 2: กรอกข้อมูล Project

```
Name: unfakenews
Database Password: [สร้างรหัสผ่านที่แข็งแรง]
Region: Southeast Asia (Singapore)
```

**💡 เก็บรหัสผ่านไว้ในที่ปลอดภัย!**

### ขั้นที่ 3: ดึง Connection Strings

หลัง Project สร้างเสร็จ (2-3 นาที):

1. คลิกไอคอน **⚙️ Settings** (ล่างซ้าย)
2. คลิก **Database** ในเมนูด้านซ้าย
3. เลื่อนลงมาหา **Connection string**

### ขั้นที่ 4: คัดลอก Connection Pooling

เลือกแท็บ **Transaction** จะเห็น URL แบบนี้:

```
postgresql://postgres.abcdefghijklmnop:[YOUR-PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
```

**แทนที่ `[YOUR-PASSWORD]` ด้วยรหัสผ่านจริง**

### ขั้นที่ 5: สร้าง Direct Connection URL

เปลี่ยน port จาก `6543` เป็น `5432`:

```
postgresql://postgres.abcdefghijklmnop:[YOUR-PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres
```

### ขั้นที่ 6: แก้ไขไฟล์ `.env`

เปิดไฟล์ `.env` และแทนที่ทุกอย่างด้วย:

```env
# Supabase Database Configuration
DATABASE_URL="postgresql://postgres.abcdefghijklmnop:YourActualPassword@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.abcdefghijklmnop:YourActualPassword@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres"

# Google Gemini API Key
# รับได้ที่: https://makersuite.google.com/app/apikey
GEMINI_API_KEY="your_gemini_api_key_here"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate_with_openssl_rand"

# Application Base URL
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

### ขั้นที่ 7: สร้าง NEXTAUTH_SECRET

เปิด Terminal และรัน:

```bash
openssl rand -base64 32
```

คัดลอกผลลัพธ์ที่ได้มาใส่ใน `NEXTAUTH_SECRET`

### ขั้นที่ 8: ทดสอบการเชื่อมต่อ

```bash
# Generate Prisma Client
npm run prisma:generate

# สร้างตารางใน Supabase
npm run prisma:push

# เปิด Prisma Studio
npm run prisma:studio
```

เปิด http://localhost:5555 ถ้าเห็นตาราง = สำเร็จ! ✅

## 🎯 ตัวอย่างที่สมบูรณ์

### ไฟล์ `.env` ของคุณควรมีหน้าตาแบบนี้:

```env
# =============================================
# Supabase Database
# =============================================
DATABASE_URL="postgresql://postgres.xyzabcdefghijk:MyP@ssw0rd123@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.xyzabcdefghijk:MyP@ssw0rd123@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres"

# =============================================
# Google Gemini AI
# =============================================
GEMINI_API_KEY="AIzaSyAbc123Def456Ghi789Jkl012Mno345Pqr678Stu"

# =============================================
# NextAuth
# =============================================
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4"

# =============================================
# Base URL
# =============================================
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

## 🔍 การตรวจสอบ Connection String

### โครงสร้าง URL:

```
postgresql://[username]:[password]@[host]:[port]/[database]?[options]
```

### ตัวอย่าง Supabase:

```
postgresql://
  postgres.xyzabcdefghijk     ← username
  :MyP@ssw0rd123             ← password
  @aws-0-ap-southeast-1      ← region
  .pooler.supabase.com       ← host
  :6543                      ← port (pooling)
  /postgres                  ← database name
  ?pgbouncer=true            ← options
```

## ⚠️ สิ่งที่ต้องระวัง

### 1. อักขระพิเศษในรหัสผ่าน

ถ้ารหัสผ่านมีอักขระพิเศษ ต้อง encode:

| อักขระ | Encode |
|--------|--------|
| @      | %40    |
| #      | %23    |
| $      | %24    |
| %      | %25    |
| &      | %26    |

**ตัวอย่าง:**
```
รหัสผ่าน: My@Pass#123
Encode: My%40Pass%23123
```

### 2. ห้ามมีช่องว่าง

❌ ผิด:
```env
DATABASE_URL = "postgresql://..."
```

✅ ถูก:
```env
DATABASE_URL="postgresql://..."
```

### 3. ใช้ Port ที่ถูกต้อง

- **6543** = Connection Pooling (สำหรับ queries)
- **5432** = Direct Connection (สำหรับ migrations)

## 📝 Checklist

ก่อนดำเนินการต่อ ตรวจสอบว่า:

- [ ] มี Supabase Project แล้ว
- [ ] คัดลอก Connection String ถูกต้อง
- [ ] แทนที่ `[YOUR-PASSWORD]` ด้วยรหัสผ่านจริง
- [ ] เพิ่ม `?pgbouncer=true` ท้าย DATABASE_URL
- [ ] มีทั้ง DATABASE_URL (port 6543) และ DIRECT_URL (port 5432)
- [ ] สร้าง NEXTAUTH_SECRET ด้วย openssl
- [ ] ไม่มีช่องว่างรอบ `=`
- [ ] Encode อักขระพิเศษในรหัสผ่าน (ถ้ามี)

## 🚀 คำสั่งที่ต้องรัน

หลังจากแก้ไข `.env` เรียบร้อย:

```bash
# 1. Generate Prisma Client
npm run prisma:generate

# 2. สร้างตารางใน Supabase
npm run prisma:push

# 3. เปิด Prisma Studio (ตรวจสอบว่าเชื่อมต่อได้)
npm run prisma:studio

# 4. สร้างข้อมูลตัวอย่าง (ใน Prisma Studio)
# หรือใช้ SQL ใน Supabase SQL Editor

# 5. รัน Development Server
npm run dev
```

## 🎨 วิธีสร้างข้อมูลตัวอย่าง

### วิธีที่ 1: ใช้ Prisma Studio

```bash
npm run prisma:studio
```

1. เปิด http://localhost:5555
2. สร้าง User → Post → PostTranslation ตามลำดับ

### วิธีที่ 2: ใช้ Supabase SQL Editor

1. ไปที่ Supabase Dashboard
2. คลิก **SQL Editor** (เมนูซ้าย)
3. คลิก **New query**
4. วางโค้ดจากไฟล์ `supabase-sample-data.sql`
5. คลิก **Run** (หรือกด Cmd/Ctrl + Enter)

## ✅ ทดสอบว่าใช้งานได้

```bash
# รัน dev server
npm run dev

# เปิด browser:
http://localhost:3000/en/posts/global-tech-summit-ai-platform
http://localhost:3000/th/posts/global-tech-summit-ai-platform
```

## ❓ แก้ปัญหา

### "Error: P1001: Can't reach database server"

**สาเหตุ:**
- รหัสผ่านผิด
- Connection String ผิด
- Supabase Project ถูก pause

**วิธีแก้:**
1. ตรวจสอบรหัสผ่านใน Supabase Settings
2. Reset รหัสผ่าน (Settings → Database → Reset password)
3. คัดลอก Connection String ใหม่

### "Prepared statement ... already exists"

**วิธีแก้:**
เพิ่ม `?pgbouncer=true` ท้าย DATABASE_URL

### "prisma:error Error in Prisma Client"

**วิธีแก้:**
```bash
rm -rf node_modules/.prisma
npm run prisma:generate
```

## 📚 อ่านเพิ่มเติม

- `SUPABASE_SETUP.md` - คู่มือ Supabase ฉบับสมบูรณ์
- `DATABASE_CLEANUP.md` - ทำความสะอาด configuration
- `QUICKSTART.md` - เริ่มต้นใช้งาน 5 นาที

## 💡 เคล็ดลับ

1. **ใช้ Password Manager**: เก็บรหัสผ่าน Database ไว้ใน 1Password/Bitwarden
2. **Backup .env**: สำรอง .env ไว้ที่ปลอดภัย (อย่า commit ขึ้น git!)
3. **ใช้ .env.local**: สำหรับ Production
4. **Monitor Usage**: เช็ค Supabase Dashboard เป็นประจำ

---

**หลังจากทำตามนี้เสร็จ คุณจะมี:**
- ✅ Supabase Database พร้อมใช้
- ✅ Environment variables ครบถ้วน
- ✅ Prisma เชื่อมต่อสำเร็จ
- ✅ พร้อม Development!
