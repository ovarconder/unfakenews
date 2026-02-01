# 🔑 สร้าง Admin User พร้อม Password

## ปัญหา: มีฟิลด์ password แล้วแต่ว่างเปล่า

**สาเหตุ:** User ใน database ยังไม่มี password หรือ password = NULL

---

## ✅ วิธีแก้: เพิ่ม Admin User พร้อม Password

### ขั้นตอนที่ 1: เปิด Supabase SQL Editor

1. เข้า https://app.supabase.com
2. เลือก Project ของคุณ
3. คลิก **SQL Editor** (เมนูซ้าย)
4. คลิก **"New query"**

### ขั้นตอนที่ 2: รัน SQL นี้

**คัดลอกทั้งหมดแล้ววาง:**

```sql
-- สร้าง/อัพเดท Admin User
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
  'admin123',
  'ADMIN',
  NOW(),
  NOW()
)
ON CONFLICT (email) DO UPDATE 
SET 
  password = 'admin123',
  role = 'ADMIN',
  "updatedAt" = NOW();

-- เช็คว่าสร้างสำเร็จ
SELECT id, email, name, password, role 
FROM "User" 
WHERE email = 'admin@unfakenews.asia';
```

### ขั้นตอนที่ 3: กด "Run"

จะเห็นผลลัพธ์:
```
email                    | password  | role
-------------------------|-----------|-------
admin@unfakenews.asia    | admin123  | ADMIN
```

### ขั้นตอนที่ 4: ทดสอบ Login

1. เข้า https://www.unfakenews.asia
2. คลิกโลโก้ 5 ครั้ง (เพื่อเข้าหน้า login)
3. Login ด้วย:
   - **Email:** `admin@unfakenews.asia`
   - **Password:** `admin123`

---

## 🎯 ทำเสร็จแล้ว!

ตอนนี้:
- ✅ มี admin user พร้อม password แล้ว
- ✅ Login ได้ทันที
- ✅ Role = ADMIN

---

## 📋 SQL Scripts อื่นๆ

### ดู Users ทั้งหมด:

```sql
SELECT id, email, name, password, role, "createdAt"
FROM "User"
ORDER BY "createdAt" DESC;
```

### อัพเดท Password ของ User ที่มีอยู่:

```sql
-- แก้ password ของ user ที่มีอยู่
UPDATE "User"
SET 
  password = 'newpassword123',
  "updatedAt" = NOW()
WHERE email = 'your-email@example.com';
```

### เปลี่ยน Role เป็น ADMIN:

```sql
-- เปลี่ยน user ธรรมดาเป็น admin
UPDATE "User"
SET 
  role = 'ADMIN',
  "updatedAt" = NOW()
WHERE email = 'user@example.com';
```

### สร้าง Admin User หลายคน:

```sql
-- สร้าง admin หลายคน
INSERT INTO "User" (id, email, name, password, role, "createdAt", "updatedAt")
VALUES 
  (gen_random_uuid()::text, 'admin1@unfakenews.asia', 'Admin 1', 'password1', 'ADMIN', NOW(), NOW()),
  (gen_random_uuid()::text, 'admin2@unfakenews.asia', 'Admin 2', 'password2', 'ADMIN', NOW(), NOW()),
  (gen_random_uuid()::text, 'editor@unfakenews.asia', 'Editor', 'password3', 'EDITOR', NOW(), NOW())
ON CONFLICT (email) DO NOTHING;
```

### ลบ User:

```sql
-- ลบ user (ระวัง!)
DELETE FROM "User"
WHERE email = 'user-to-delete@example.com';
```

---

## 🔒 Security Notes

### ⚠️ Password เป็น Plain Text!

ตอนนี้ password ถูกเก็บเป็น plain text ซึ่ง **ไม่ปลอดภัย** สำหรับ production

**แนะนำให้แก้:**

1. ติดตั้ง bcrypt:
```bash
npm install bcryptjs
npm install --save-dev @types/bcryptjs
```

2. แก้ไข `lib/auth-options.ts`:

```typescript
import bcrypt from "bcryptjs";

// ในส่วน authorize function:
const isValid = await bcrypt.compare(
  credentials.password, 
  user.password
);

if (!user || !isValid) {
  throw new Error("Invalid credentials");
}
```

3. Hash passwords ใน database:

```sql
-- ใช้ bcrypt online tool: https://bcrypt-generator.com/
-- แล้ว update:
UPDATE "User" 
SET password = '$2a$10$...' -- hashed password
WHERE email = 'admin@unfakenews.asia';
```

---

## 🎓 UserRole ที่มี:

```sql
-- ดู enum values ที่ใช้ได้
SELECT unnest(enum_range(NULL::"UserRole"));
```

Roles ที่มี:
- `USER` - ผู้ใช้ทั่วไป
- `EDITOR` - บรรณาธิการ
- `ADMIN` - แอดมิน
- `SUPER_ADMIN` - ซูเปอร์แอดมิน

---

## 🐛 Troubleshooting

### Q: Login แล้วขึ้น "Invalid credentials"

**A:** เช็ค:
1. Email ถูกต้องหรือไม่
2. Password ตรงกับใน database หรือไม่
3. ดูใน console มี error อะไรหรือไม่

```sql
-- เช็คข้อมูล user
SELECT email, password, role 
FROM "User" 
WHERE email = 'admin@unfakenews.asia';
```

### Q: ขึ้น error "Cannot read properties of null"

**A:** User ไม่มีใน database

```sql
-- เช็คว่ามี user หรือไม่
SELECT COUNT(*) FROM "User";
```

### Q: สร้าง user แล้วแต่ login ไม่ได้

**A:** เช็ค:
1. Password ไม่ว่าง
2. Role = ADMIN หรือ EDITOR
3. Email ถูกต้อง

---

## ✅ Checklist:

- [ ] รัน SQL สร้าง admin user แล้ว
- [ ] เห็นผลลัพธ์แสดง email, password, role
- [ ] ทดสอบ login ได้แล้ว
- [ ] เข้าหน้า /admin ได้

---

## 📄 ไฟล์ที่สร้างไว้:

- **`create_admin_user.sql`** - SQL script พร้อม copy

---

🎉 **เสร็จแล้ว!** ลอง login ด้วย `admin@unfakenews.asia` / `admin123` ได้เลยครับ
