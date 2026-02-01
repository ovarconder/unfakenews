# 🚨 Prisma db push ค้าง - แก้ด้วย SQL โดยตรง

## ปัญหา: `npx prisma db push` ค้าง

เกิดเพราะ DATABASE_URL ยังใช้ port 5432 ทำให้ connection timeout

---

## ✅ วิธีแก้ที่ง่ายกว่า: ใช้ Supabase SQL Editor

### ขั้นตอนที่ 1: เข้า Supabase SQL Editor

1. เข้า https://app.supabase.com
2. เลือก Project ของคุณ
3. คลิก **SQL Editor** (เมนูซ้าย)
4. คลิก **"New query"**

### ขั้นตอนที่ 2: รัน SQL นี้

คัดลอกทั้งหมดแล้ววางใน SQL Editor:

```sql
-- เพิ่มคอลัมน์ password ในตาราง User (ถ้ายังไม่มี)
ALTER TABLE "User" 
ADD COLUMN IF NOT EXISTS password TEXT;

-- เช็คว่าเพิ่มสำเร็จ
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'User';
```

### ขั้นตอนที่ 3: กด "Run" หรือ Ctrl+Enter

จะเห็นผลลัพธ์:
```
column_name    | data_type
---------------+-----------------
id             | text
name           | text
email          | text
emailVerified  | timestamp
image          | text
password       | text          ← เพิ่มใหม่
role           | user_defined
createdAt      | timestamp
updatedAt      | timestamp
```

### ขั้นตอนที่ 4: Regenerate Prisma Client

กลับมาที่ terminal:

```bash
# Kill prisma process ที่ค้าง (ถ้ายังค้างอยู่)
Ctrl+C

# Regenerate Prisma Client
npx prisma generate

# Restart dev server
npm run dev
```

---

## 🎯 ทำเสร็จแล้ว!

ตอนนี้:
- ✅ Database มีคอลัมน์ `password` แล้ว
- ✅ ไม่ต้อง `db push` (ข้าม connection issue)
- ✅ พร้อมใช้งาน

---

## 🔧 แก้ DATABASE_URL (ทำควบคู่ไป)

เพื่อไม่ให้เจอปัญหาครั้งหน้า แก้ `.env.local`:

**เปลี่ยนจาก:**
```env
DATABASE_URL="postgresql://...supabase.com:5432/postgres"
```

**เป็น:**
```env
DATABASE_URL="postgresql://...supabase.com:6543/postgres?pgbouncer=true"
```

---

## 📋 SQL Script เพิ่มเติม (Optional)

### ตรวจสอบตาราง User:

```sql
-- ดูโครงสร้างตาราง User
\d "User"

-- หรือ
SELECT * FROM information_schema.columns 
WHERE table_name = 'User';
```

### ตรวจสอบว่ามี Admin user หรือยัง:

```sql
-- ดู users ทั้งหมด
SELECT id, email, name, role, password 
FROM "User";
```

### สร้าง Admin user (ถ้ายังไม่มี):

```sql
-- สร้าง admin user
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
  'admin@unfakenews.asia',
  'Admin User',
  'admin123',  -- ⚠️ ในการใช้งานจริงควร hash ด้วย bcrypt
  'ADMIN',
  NOW(),
  NOW()
)
ON CONFLICT (email) DO UPDATE 
SET 
  password = EXCLUDED.password,
  role = EXCLUDED.role,
  "updatedAt" = NOW();
```

---

## 🐛 Troubleshooting

### Q: ขึ้น error "relation User does not exist"

**A:** ตาราง User ยังไม่ถูกสร้าง ให้รัน SQL นี้ก่อน:

```sql
-- ดูว่ามีตารางอะไรบ้าง
SELECT tablename FROM pg_tables 
WHERE schemaname = 'public';
```

ถ้าไม่มีตาราง User เลย แสดงว่าต้องสร้างทั้งหมด:

**วิธีแก้:**
1. แก้ DATABASE_URL ให้ใช้ port 6543 ก่อน
2. แล้วค่อยรัน `npx prisma db push`

หรือใช้ SQL สร้างตารางเอง (ดู `CREATE_TABLES.sql`)

### Q: SQL รันแล้วไม่มีอะไรเกิดขึ้น

**A:** อาจจะมีคอลัมน์อยู่แล้ว ลองเช็ค:

```sql
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'User' AND column_name = 'password';
```

---

## ✅ Checklist:

- [ ] รัน SQL ใน Supabase SQL Editor แล้ว
- [ ] เห็นคอลัมน์ `password` ในผลลัพธ์
- [ ] รัน `npx prisma generate` แล้ว
- [ ] Restart dev server แล้ว
- [ ] แก้ DATABASE_URL เป็น port 6543 แล้ว (สำหรับครั้งหน้า)

---

## 🎉 ข้อดีของวิธีนี้:

- ✅ ไม่ต้องรอ `db push` ค้าง
- ✅ แก้ได้ทันที (30 วินาที)
- ✅ ควบคุมได้เอง 100%
- ✅ เห็นผลลัพธ์ชัดเจน

---

🚀 **เสร็จแล้ว!** Restart server แล้วลอง login ได้เลยครับ
