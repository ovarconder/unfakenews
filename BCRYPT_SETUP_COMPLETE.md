# 🔐 อัพเดท Users พร้อม bcrypt + เพิ่ม Author

## ✅ สิ่งที่ทำเสร็จแล้ว:

### 1. สร้าง bcrypt hashes
- ✅ hash password ด้วย bcrypt (rounds: 10)
- ✅ สร้าง SQL script พร้อม hashes

### 2. อัพเดท auth-options.ts
- ✅ เพิ่ม `import bcrypt`
- ✅ เปลี่ยนจาก plain text comparison → bcrypt.compare()
- ✅ เพิ่มการเช็ค null password

### 3. สร้าง SQL scripts
- ✅ `update_users_secure.sql` - SQL พร้อม bcrypt hashes
- ✅ `hash-passwords.mjs` - script สำหรับ hash passwords

---

## 📝 ขั้นตอนต่อไป (2 ขั้นตอน):

### ขั้นที่ 1: รัน SQL ใน Supabase

1. เข้า https://app.supabase.com
2. SQL Editor → New query
3. คัดลอกจากไฟล์ `update_users_secure.sql`:

```sql
-- อัพเดท Admin
UPDATE "User"
SET 
  password = '$2a$10$8ViGUVH2o4NlDZb2wLp2qOTzQSRCF5H.0iHTKZRCbSDk.hIZFXcqm',
  "updatedAt" = NOW()
WHERE email = 'admin@unfakenews.asia';

-- อัพเดท Editor
UPDATE "User"
SET 
  password = '$2a$10$GZqfF4AdlFSv1KFUASeehOX9RpVQn6KMFgG6W46XNA61pBRhla4oG',
  "updatedAt" = NOW()
WHERE role = 'EDITOR';

-- เพิ่ม Author
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
SET password = EXCLUDED.password;

-- เช็คผลลัพธ์
SELECT email, name, role, LEFT(password, 10) || '...' as password_hash
FROM "User"
ORDER BY role;
```

4. กด "Run"

### ขั้นที่ 2: Restart Dev Server

```bash
# Terminal
npm run dev
```

---

## 🎉 เสร็จแล้ว!

### Credentials ที่ใช้ได้:

#### 1. Admin
- Email: `admin@unfakenews.asia`
- Password: `admin123`
- Role: ADMIN

#### 2. Editor
- Email: (email editor ที่มีอยู่)
- Password: `editor123`
- Role: EDITOR

#### 3. Author (ใหม่!)
- Email: `author@unfakenews.asia`
- Password: `author123`
- Role: EDITOR

---

## 🔒 Security Features

### ✅ ที่ทำแล้ว:
- ✅ **bcrypt hashing** - Password ถูก encrypt แล้ว
- ✅ **Salt rounds: 10** - ความปลอดภัยระดับ standard
- ✅ **bcrypt.compare()** - เปรียบเทียบแบบปลอดภัย
- ✅ **Null checking** - ป้องกัน null password

### 💾 Password ใน Database:
```
admin123  → $2a$10$8ViGUVH2o4NlDZb2wLp2qOTzQSRCF5H.0iHTKZRCbSDk.hIZFXcqm
editor123 → $2a$10$GZqfF4AdlFSv1KFUASeehOX9RpVQn6KMFgG6W46XNA61pBRhla4oG
author123 → $2a$10$uD3awZdd9GEjpVI7OIc7cubr0XeOGlR4HIY30L2zam4HHpl14vvTW
```

### 🛡️ ทำไมปลอดภัย:
1. **One-way hash** - ไม่สามารถ decrypt กลับได้
2. **Unique salt** - แต่ละ password มี salt ไม่เหมือนกัน
3. **Slow hashing** - ป้องกัน brute force attack
4. **Industry standard** - ใช้กันทั่วโลก

---

## 📄 ไฟล์ที่สร้าง:

1. ✅ `update_users_secure.sql` - SQL พร้อม bcrypt hashes
2. ✅ `hash-passwords.mjs` - Script hash passwords
3. ✅ `lib/auth-options.ts` - อัพเดทใช้ bcrypt แล้ว

---

## 🧪 ทดสอบ:

### 1. ทดสอบ hash password ใหม่:
```bash
node hash-passwords.mjs
```

### 2. ทดสอบ login:
1. เข้า https://www.unfakenews.asia
2. คลิกโลโก้ 5 ครั้ง
3. ลอง login ด้วย credentials ข้างบน

---

## 🔧 หาก Password เปลี่ยน:

### สร้าง hash ใหม่:

```javascript
// แก้ไข hash-passwords.mjs
const passwords = {
  admin: 'new_password_here',
  editor: 'another_password',
};

// รัน
node hash-passwords.mjs
```

### อัพเดทใน Database:

```sql
UPDATE "User"
SET password = 'NEW_HASH_HERE'
WHERE email = 'admin@unfakenews.asia';
```

---

## 📊 เปรียบเทียบ:

| | เดิม (Plain Text) | ใหม่ (bcrypt) |
|---|---|---|
| **ปลอดภัย** | ❌ | ✅ |
| **Database** | `admin123` | `$2a$10$8ViGU...` |
| **ถ้า DB รั่ว** | Hacker รู้ password ทันที | ไม่สามารถ decrypt ได้ |
| **Brute Force** | ง่าย | ยากมาก (slow hashing) |
| **Standard** | ไม่ | ✅ Industry standard |

---

## ✅ Checklist:

- [x] ติดตั้ง bcryptjs แล้ว
- [x] แก้ไข auth-options.ts แล้ว
- [x] สร้าง SQL scripts แล้ว
- [x] Hash passwords แล้ว
- [ ] **รัน SQL ใน Supabase** ← ทำต่อ
- [ ] **Restart dev server** ← ทำต่อ
- [ ] **ทดสอบ login**

---

🎯 **ทำต่อ:** รัน SQL ใน Supabase แล้ว restart server ได้เลยครับ!
