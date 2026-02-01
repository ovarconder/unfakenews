# 🐛 Debug Login Error - Password ถูกแต่บอกว่า Invalid

## ปัญหา:
- Password ถูกแล้ว แต่ยังขึ้น "Invalid credentials"

## 🔍 Debug Steps:

### 1. เช็ค Password ใน Database

รัน SQL นี้ใน Supabase:

```sql
SELECT 
  email,
  role,
  CASE 
    WHEN password IS NULL THEN '❌ NULL'
    WHEN password LIKE '$2a$%' THEN '✅ bcrypt'
    ELSE '❌ NOT bcrypt'
  END as password_type,
  LEFT(password, 30) as password_preview,
  LENGTH(password) as password_length
FROM "User"
WHERE email = 'admin@unfakenews.asia';
```

**ควรเห็น:**
- password_type: ✅ bcrypt
- password_length: 60
- password_preview: $2a$10$8ViGU...

### 2. ถ้า Password ไม่ใช่ bcrypt

รันนี้:

```sql
UPDATE "User"
SET 
  password = '$2a$10$8ViGUVH2o4NlDZb2wLp2qOTzQSRCF5H.0iHTKZRCbSDk.hIZFXcqm',
  "updatedAt" = NOW()
WHERE email = 'admin@unfakenews.asia';
```

### 3. เช็ค Console Logs

1. เปิด Terminal ที่รัน `npm run dev`
2. ลอง login
3. ดู console logs:

```
🔍 Attempting login: admin@unfakenews.asia
✅ User found: admin@unfakenews.asia Role: ADMIN
🔐 Password hash exists, length: 60
🔐 Hash preview: $2a$10$8ViGUVH2o4Nl...
🔐 bcrypt.compare() result: true/false
```

### 4. ถ้า bcrypt.compare() = false

**สาเหตุที่เป็นไปได้:**

#### A. Password ใน database ไม่ถูกต้อง

**แก้:**
```sql
-- สร้าง hash ใหม่
UPDATE "User"
SET password = '$2a$10$8ViGUVH2o4NlDZb2wLp2qOTzQSRCF5H.0iHTKZRCbSDk.hIZFXcqm'
WHERE email = 'admin@unfakenews.asia';
```

#### B. bcrypt version ไม่ตรงกัน

**แก้:**
```bash
# Reinstall bcryptjs
npm uninstall bcryptjs
npm install bcryptjs@2.4.3
npm run dev
```

#### C. Password field เป็น wrong type

**เช็ค:**
```sql
SELECT 
  column_name, 
  data_type, 
  character_maximum_length
FROM information_schema.columns
WHERE table_name = 'User' AND column_name = 'password';
```

**ควรเป็น:** data_type = `text` หรือ `character varying`

---

## 🧪 Test Manually

### ใน Browser Console:

```javascript
// เปิด https://www.unfakenews.asia
// กด F12 → Console

fetch('/api/auth/callback/credentials', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'admin@unfakenews.asia',
    password: 'admin123',
    csrfToken: 'xxx' // ดูใน form
  })
}).then(r => r.json()).then(console.log);
```

---

## 🔧 แก้แบบ Hardcore

ถ้ายังไม่ได้ ให้ลอง plain text ก่อน (เพื่อ debug):

### 1. แก้ auth-options.ts ชั่วคราว:

```typescript
// Comment bcrypt ออก
// const isValid = await bcrypt.compare(
//   credentials.password,
//   user.password
// );

// ใช้ plain text แทน (ชั่วคราว!)
const isValid = credentials.password === user.password;
```

### 2. อัพเดท password เป็น plain text:

```sql
UPDATE "User"
SET password = 'admin123'
WHERE email = 'admin@unfakenews.asia';
```

### 3. Restart และทดสอบ

```bash
npm run dev
```

ถ้า login ได้ = bcrypt มีปัญหา  
ถ้า login ไม่ได้ = ปัญหาอยู่ที่อื่น

### 4. ถ้า login ได้ด้วย plain text

แสดงว่า bcrypt มีปัญหา:

```bash
# Fix bcrypt
npm uninstall bcryptjs
npm install bcryptjs@2.4.3

# เปลี่ยนกลับใช้ bcrypt
# (uncommment โค้ด)

# อัพเดท password เป็น hash
UPDATE "User"
SET password = '$2a$10$8ViGUVH2o4NlDZb2wLp2qOTzQSRCF5H.0iHTKZRCbSDk.hIZFXcqm'
WHERE email = 'admin@unfakenews.asia';
```

---

## 📋 Checklist:

- [ ] รัน SQL เช็ค password type
- [ ] password เป็น bcrypt hash (starts with $2a$)
- [ ] password length = 60
- [ ] ดู console logs หลัง login
- [ ] bcrypt.compare() result = ?
- [ ] ลอง plain text test (ถ้าจำเป็น)
- [ ] Reinstall bcryptjs

---

## 📄 ไฟล์:

- `check_passwords.sql` - SQL เช็ค passwords
- `lib/auth-options.ts` - มี debug logs แล้ว

---

🔍 **ลองทำตาม checklist แล้วบอกผลครับ!**
