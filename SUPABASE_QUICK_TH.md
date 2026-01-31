# 🚀 ตั้งค่า Supabase ง่ายๆ ใน 5 นาที

## สรุปปัญหา

คุณมี DATABASE_URL สองแหล่ง:
1. ❌ Local PostgreSQL ในเครื่อง
2. ✅ Supabase (ควรใช้อันนี้)

**วิธีแก้: ใช้แค่ Supabase อันเดียว!**

---

## ขั้นตอนย่อ (5 นาที)

### 1️⃣ สร้าง Supabase Project (2 นาที)

1. ไป https://supabase.com
2. Sign up / Login
3. คลิก "New Project"
4. ตั้งชื่อ: `unfakenews`
5. ตั้งรหัสผ่าน (เก็บไว้!)
6. เลือก Region: **Singapore**
7. รอ 2-3 นาที

### 2️⃣ ดึง Connection String (1 นาที)

1. Settings ⚙️ → Database
2. เลื่อนลงหา "Connection string"
3. เลือกแท็บ **Transaction**
4. คัดลอก URL

จะได้แบบนี้:
```
postgresql://postgres.xxxx:[YOUR-PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
```

### 3️⃣ แก้ไข .env (1 นาที)

**ลบทุกอย่างในไฟล์ `.env`** แล้วใส่ใหม่:

```env
# วาง Connection String ที่คัดลอกมา (แก้ไขรหัสผ่าน)
DATABASE_URL="postgresql://postgres.xxxx:YourRealPassword@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true"

# เปลี่ยน port จาก 6543 เป็น 5432
DIRECT_URL="postgresql://postgres.xxxx:YourRealPassword@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres"

# Gemini API Key (รับที่: https://makersuite.google.com)
GEMINI_API_KEY="your_key_here"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="run: openssl rand -base64 32"

# Base URL
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

**สำคัญ:**
- แทนที่ `[YOUR-PASSWORD]` ด้วยรหัสผ่านจริง
- เพิ่ม `?pgbouncer=true` ท้าย DATABASE_URL
- มีทั้ง DATABASE_URL (port 6543) และ DIRECT_URL (port 5432)

### 4️⃣ สร้างตารางใน Supabase (1 นาที)

```bash
npm run prisma:generate
npm run prisma:push
npm run prisma:studio
```

เปิด http://localhost:5555 ถ้าเห็นตาราง = สำเร็จ! ✅

---

## สร้างข้อมูลตัวอย่าง

### วิธีง่าย: ใช้ SQL ใน Supabase

1. ไป Supabase Dashboard
2. เปิดเมนู **SQL Editor**
3. คลิก "New query"
4. วางโค้ดจากไฟล์ `supabase-sample-data.sql`
5. กด Run (Cmd+Enter)

จะได้:
- ✅ 2 Users (Admin + Editor)
- ✅ 4 Posts (Tech, Business, Politics, Culture)
- ✅ 4 Translations (ภาษาอังกฤษ)

---

## ทดสอบ

```bash
npm run dev
```

เปิด browser:
- http://localhost:3000/en/posts/global-tech-summit-ai-platform
- http://localhost:3000/th/posts/global-tech-summit-ai-platform (AI แปลอัตโนมัติ!)

---

## ปัญหาที่พบบ่อย

### ❌ เชื่อมต่อไม่ได้

**ตรวจสอบ:**
1. รหัสผ่านถูกต้องหรือไม่?
2. แทนที่ `[YOUR-PASSWORD]` แล้วหรือยัง?
3. เพิ่ม `?pgbouncer=true` หรือยัง?

**แก้:**
```bash
# Reset password ใน Supabase Settings → Database
# แก้ไข .env ใหม่
# รัน: npm run prisma:push
```

### ❌ "Prepared statement already exists"

**แก้:**
เพิ่ม `?pgbouncer=true` ท้าย DATABASE_URL

### ❌ ไม่เห็นตาราง

**แก้:**
```bash
npm run prisma:generate
npm run prisma:push
```

---

## Checklist ก่อนเริ่มใช้

- [ ] สร้าง Supabase Project เรียบร้อย
- [ ] คัดลอก Connection String
- [ ] แก้ไข `.env` (ลบ DATABASE_URL เก่า)
- [ ] แทนที่รหัสผ่านให้ถูกต้อง
- [ ] เพิ่ม `?pgbouncer=true`
- [ ] มีทั้ง DATABASE_URL และ DIRECT_URL
- [ ] รัน `npm run prisma:push`
- [ ] เห็นตารางใน Prisma Studio
- [ ] สร้างข้อมูลตัวอย่าง
- [ ] ทดสอบเปิดหน้าเว็บ

---

## ทำไมต้องใช้ Supabase?

✅ **ฟรี** - 500MB database + 2GB bandwidth  
✅ **ง่าย** - ไม่ต้องติดตั้ง PostgreSQL  
✅ **เร็ว** - Connection pooling พร้อมใช้  
✅ **ปลอดภัย** - SSL + Backup อัตโนมัติ  
✅ **Dashboard** - จัดการข้อมูลได้ง่าย  
✅ **Production Ready** - Deploy ได้เลย  

---

## สรุปสั้นๆ

```bash
# 1. สร้าง Project ที่ supabase.com
# 2. ดึง Connection String
# 3. แก้ไข .env (ใช้แค่ Supabase)
# 4. รัน:
npm run prisma:generate
npm run prisma:push
npm run prisma:studio

# 5. สร้างข้อมูลใน Supabase SQL Editor
# 6. รัน:
npm run dev

# 7. เปิด browser ทดสอบ! 🎉
```

---

## อ่านเพิ่มเติม

📖 **ENV_SETUP_GUIDE.md** - คู่มือละเอียดทุกขั้นตอน  
📖 **SUPABASE_SETUP.md** - เอกสารฉบับสมบูรณ์  
📖 **DATABASE_CLEANUP.md** - ทำความสะอาด config  
📄 **supabase-sample-data.sql** - SQL สร้างข้อมูลตัวอย่าง  

---

## ต้องการความช่วยเหลือ?

1. อ่าน `ENV_SETUP_GUIDE.md` สำหรับขั้นตอนละเอียด
2. ดู `DATABASE_CLEANUP.md` สำหรับการแก้ปัญหา
3. ตรวจสอบ Terminal logs หา error messages

---

**เสร็จแล้ว! คุณมี:**
- ✅ Database เดียว (Supabase)
- ✅ Configuration ที่ชัดเจน
- ✅ พร้อมใช้งาน!

🎉 **Happy Coding!**
