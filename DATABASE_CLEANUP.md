# คู่มือทำความสะอาด Database Configuration

## ปัญหา: มี DATABASE_URL หลายแหล่ง

ตอนนี้คุณอาจมี:
- ❌ DATABASE_URL สำหรับ Local PostgreSQL
- ❌ DATABASE_URL สำหรับ Supabase
- ❌ ไฟล์ `.env` และ `.env.local` ปะปนกัน

## วิธีแก้: เก็บแค่ Supabase เท่านั้น

### ขั้นตอนที่ 1: ลบไฟล์เก่า (ถ้ามี)

```bash
# ลบ .env.local ถ้ามี
rm .env.local

# สำรอง .env เดิม (เผื่อต้องการดูข้อมูลเก่า)
cp .env .env.backup
```

### ขั้นตอนที่ 2: สร้าง .env ใหม่

ลบทุกอย่างใน `.env` และใส่เฉพาะ **Supabase** เท่านั้น:

```bash
# แก้ไขไฟล์ .env ให้มีเนื้อหาตามนี้:
```

```env
# ===== Supabase Database (ใช้อันนี้อันเดียว) =====
DATABASE_URL="postgresql://postgres.xxxxxxxxxxxxx:[YOUR-PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.xxxxxxxxxxxxx:[YOUR-PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres"

# ===== Google Gemini API =====
GEMINI_API_KEY="your_gemini_api_key_here"

# ===== NextAuth =====
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your_nextauth_secret_here"

# ===== Base URL =====
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

### ขั้นตอนที่ 3: ดึง Connection String จาก Supabase

1. เข้า https://supabase.com/dashboard
2. เลือก Project ของคุณ
3. ไปที่ **Settings** (⚙️) → **Database**
4. เลื่อนลงมาหา **Connection string**
5. เลือกแท็บ **URI**
6. คัดลอก Connection string

**ตัวอย่างที่ได้:**
```
postgresql://postgres.abcdefghijklmnop:your_password_here@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
```

### ขั้นตอนที่ 4: แก้ไข DATABASE_URL

**แบบเดิม (ผิด):**
```env
# อย่าใช้แบบนี้
DATABASE_URL="postgresql://user:password@localhost:5432/unfakenews"
```

**แบบใหม่ (ถูกต้อง):**
```env
# ใช้จาก Supabase
DATABASE_URL="postgresql://postgres.abcdefghijklmnop:your_password@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.abcdefghijklmnop:your_password@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres"
```

**สังเกต:**
- Port **6543** = Connection Pooling (เร็ว, ใช้สำหรับ queries)
- Port **5432** = Direct Connection (ใช้สำหรับ migrations)
- เพิ่ม `?pgbouncer=true` ต่อท้าย DATABASE_URL

### ขั้นตอนที่ 5: อัปเดต Prisma Schema

แก้ไข `prisma/schema.prisma`:

```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")      // ใช้ Connection Pooling
  directUrl = env("DIRECT_URL")        // ใช้ Direct Connection สำหรับ migrations
}
```

### ขั้นตอนที่ 6: สร้างตารางใน Supabase

```bash
# 1. Generate Prisma Client
npm run prisma:generate

# 2. สร้างตารางใน Supabase
npm run prisma:push

# 3. เปิด Prisma Studio เพื่อตรวจสอบ
npm run prisma:studio
```

### ขั้นตอนที่ 7: ตรวจสอบว่าใช้งานได้

```bash
# เปิด Prisma Studio
npm run prisma:studio
```

เปิด browser ที่ http://localhost:5555

ถ้าเห็นตารางเหล่านี้ แสดงว่าเชื่อมต่อสำเร็จ:
- ✅ User
- ✅ Post
- ✅ PostTranslation

## Checklist การทำความสะอาด

- [ ] ลบ .env.local (ถ้ามี)
- [ ] สำรอง .env เดิม → .env.backup
- [ ] ดึง Connection String จาก Supabase
- [ ] สร้าง .env ใหม่ตามตัวอย่าง
- [ ] แก้ไข DATABASE_URL และ DIRECT_URL
- [ ] อัปเดต prisma/schema.prisma เพิ่ม directUrl
- [ ] รัน `npm run prisma:generate`
- [ ] รัน `npm run prisma:push`
- [ ] รัน `npm run prisma:studio` เพื่อตรวจสอบ
- [ ] ลองสร้าง User, Post, PostTranslation
- [ ] รัน `npm run dev` และทดสอบ

## เปรียบเทียบ: Local vs Supabase

### Local PostgreSQL
❌ ต้องติดตั้ง PostgreSQL ในเครื่อง  
❌ ต้องจัดการ backup เอง  
❌ ไม่มี Dashboard สวยๆ  
❌ ต้อง setup ใหม่ตอน deploy  
❌ ต้องจัดการ security เอง  

### Supabase PostgreSQL
✅ ไม่ต้องติดตั้งอะไร  
✅ Backup อัตโนมัติทุกวัน  
✅ มี Dashboard จัดการข้อมูล  
✅ ใช้ต่อได้เลยตอน deploy  
✅ SSL encryption built-in  
✅ Connection pooling พร้อมใช้  
✅ ฟรี 500MB + 2GB bandwidth  

## คำถามที่พบบ่อย

### Q1: ถ้าใช้ Supabase แล้ว จะต้องถอน PostgreSQL ในเครื่องไหม?

**A:** ไม่จำเป็น แต่ถ้าไม่ได้ใช้ก็ถอนได้:

```bash
# macOS (Homebrew)
brew services stop postgresql
brew uninstall postgresql

# หรือปล่อยไว้ก็ได้ ไม่กระทบอะไร
```

### Q2: ข้อมูลเก่าที่ Local จะหายไหม?

**A:** ถ้าคุณมีข้อมูลสำคัญใน Local:

1. Export ออกมาก่อน:
```bash
# ใช้ Connection String เดิม
pg_dump "postgresql://localhost:5432/unfakenews" > backup.sql
```

2. Import เข้า Supabase:
```bash
# ใช้ Connection String ของ Supabase
psql "postgresql://postgres.xxx..." < backup.sql
```

### Q3: ต้องเสียเงินไหม?

**A:** Supabase ฟรีแพลนให้:
- 500MB database storage
- 2GB bandwidth/เดือน
- Unlimited API requests
- 50,000 monthly active users

**เพียงพอมากสำหรับ Development และ Small-Medium sites!**

### Q4: ถ้าเกิน limit จะเกิดอะไรขึ้น?

**A:** 
- Free tier จะ **pause** project อัตโนมัติ
- Upgrade เป็น Pro ($25/เดือน) ได้ตลอดเวลา
- หรือย้ายไปใช้ database provider อื่น

### Q5: Supabase ปลอดภัยไหม?

**A:** ใช่!
- ✅ SSL encryption
- ✅ Row Level Security (RLS)
- ✅ SOC 2 Type II certified
- ✅ HIPAA compliant
- ✅ Backup อัตโนมัติ

## ไฟล์ที่ต้องแก้ไข (สรุป)

```
✏️ .env                      - แก้ไข DATABASE_URL
✏️ prisma/schema.prisma      - เพิ่ม directUrl
✅ prisma.config.ts           - ใช้ของเดิมได้เลย
✅ lib/prisma.ts              - ใช้ของเดิมได้เลย
✅ lib/db/posts.ts            - ใช้ของเดิมได้เลย
```

## สรุป

### เปลี่ยนจาก:
```env
# Local PostgreSQL (เก่า)
DATABASE_URL="postgresql://user:pass@localhost:5432/db"
```

### เป็น:
```env
# Supabase (ใหม่)
DATABASE_URL="postgresql://postgres.xxx:pass@xxx.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.xxx:pass@xxx.supabase.com:5432/postgres"
```

### แล้วรัน:
```bash
npm run prisma:generate
npm run prisma:push
npm run prisma:studio
```

### ทดสอบ:
```bash
npm run dev
# เข้า http://localhost:3000
```

## ตัวอย่าง .env ที่สมบูรณ์

```env
# Supabase Database
DATABASE_URL="postgresql://postgres.abcdefghijklmnop:MyStr0ngP@ssw0rd@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.abcdefghijklmnop:MyStr0ngP@ssw0rd@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres"

# Gemini API (รับจาก: https://makersuite.google.com)
GEMINI_API_KEY="AIzaSyAbc123def456ghi789jkl012mno345pqr"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0"

# Base URL
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

---

**หลังจากทำตามนี้เสร็จ คุณจะมี:**
- ✅ Database เดียว (Supabase)
- ✅ Configuration ที่ชัดเจน
- ✅ ไม่สับสนอีกต่อไป
- ✅ พร้อม Development และ Production!

**ต้องการความช่วยเหลือเพิ่มเติม?**
ดูไฟล์ `SUPABASE_SETUP.md` สำหรับคู่มือโดยละเอียด
