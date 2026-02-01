# 🔧 แก้ปัญหา: ไม่เจอ enum ADMIN

## ❌ Error:
```
invalid input value for enum UserRole: "ADMIN"
หรือ
type "UserRole" does not exist
```

## 🔍 สาเหตุ:
- Database ยังไม่มี enum type `UserRole`
- หรือ enum ไม่มีค่า `ADMIN`

---

## ✅ วิธีแก้ (1 ขั้นตอน):

### รัน SQL นี้ใน Supabase

1. เข้า https://app.supabase.com
2. SQL Editor → New query
3. **Copy-Paste ทั้งหมด:**

```sql
-- สร้าง Enum UserRole
DROP TYPE IF EXISTS "UserRole" CASCADE;

CREATE TYPE "UserRole" AS ENUM (
  'USER',
  'EDITOR',
  'ADMIN',
  'SUPER_ADMIN'
);

-- เพิ่ม/อัพเดท password column
ALTER TABLE "User" 
ADD COLUMN IF NOT EXISTS password TEXT;

-- อัพเดท role column ให้เป็น enum
ALTER TABLE "User" 
ALTER COLUMN role DROP DEFAULT;

ALTER TABLE "User" 
ALTER COLUMN role TYPE "UserRole" 
USING COALESCE(role::"UserRole", 'USER'::"UserRole");

ALTER TABLE "User" 
ALTER COLUMN role SET DEFAULT 'USER'::"UserRole";

-- สร้าง Admin
INSERT INTO "User" (
  id, email, name, password, role, "createdAt", "updatedAt"
)
VALUES (
  gen_random_uuid()::text,
  'admin@unfakenews.asia',
  'Admin User',
  '$2a$10$8ViGUVH2o4NlDZb2wLp2qOTzQSRCF5H.0iHTKZRCbSDk.hIZFXcqm',
  'ADMIN',
  NOW(),
  NOW()
)
ON CONFLICT (email) DO UPDATE 
SET 
  password = '$2a$10$8ViGUVH2o4NlDZb2wLp2qOTzQSRCF5H.0iHTKZRCbSDk.hIZFXcqm',
  role = 'ADMIN',
  "updatedAt" = NOW();

-- สร้าง Author
INSERT INTO "User" (
  id, email, name, password, role, "createdAt", "updatedAt"
)
VALUES (
  gen_random_uuid()::text,
  'author@unfakenews.asia',
  'Author User',
  '$2a$10$uD3awZdd9GEjpVI7OIc7cubr0XeOGlR4HIY30L2zam4HHpl14vvTW',
  'EDITOR',
  NOW(),
  NOW()
)
ON CONFLICT (email) DO UPDATE 
SET password = '$2a$10$uD3awZdd9GEjpVI7OIc7cubr0XeOGlR4HIY30L2zam4HHpl14vvTW';

-- เช็คผลลัพธ์
SELECT unnest(enum_range(NULL::"UserRole")) as role;
SELECT email, role FROM "User";
```

4. กด "Run"

---

## 🎯 ผลลัพธ์ที่จะเห็น:

### Enum Values:
```
USER
EDITOR
ADMIN
SUPER_ADMIN
```

### Users:
```
email                    | role
-------------------------|--------
admin@unfakenews.asia    | ADMIN
author@unfakenews.asia   | EDITOR
```

---

## 🔄 Restart Server

```bash
npm run dev
```

---

## ✅ เสร็จแล้ว!

### Credentials:

| Email | Password | Role |
|-------|----------|------|
| `admin@unfakenews.asia` | `admin123` | ADMIN |
| `author@unfakenews.asia` | `author123` | EDITOR |

---

## 🐛 ถ้ายังเจอ Error:

### Error: "cannot drop type because other objects depend on it"

**วิธีแก้:**

```sql
-- Force drop
DROP TYPE IF EXISTS "UserRole" CASCADE;

-- สร้างใหม่
CREATE TYPE "UserRole" AS ENUM ('USER', 'EDITOR', 'ADMIN', 'SUPER_ADMIN');

-- แล้วรันคำสั่งข้างบนต่อ
```

---

## 📋 เช็คว่ามี Enum หรือยัง:

```sql
-- ดู enum types ทั้งหมด
SELECT typname, enumlabel 
FROM pg_type t
JOIN pg_enum e ON t.oid = e.enumtypid
WHERE typname = 'UserRole'
ORDER BY e.enumsortorder;
```

---

## 📄 ไฟล์ที่สร้าง:

- `create_enum_and_users.sql` - SQL script เต็ม

---

🎉 **เสร็จแล้ว!** รัน SQL แล้ว restart server ครับ
