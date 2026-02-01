# ⚡ Quick Start - อัพเดท Users + bcrypt

## 🎯 ทำแค่ 2 ขั้นตอน:

### 1️⃣ รัน SQL ใน Supabase (Copy-Paste)

เข้า https://app.supabase.com → SQL Editor → New query

**Copy ทั้งหมด:**

```sql
-- อัพเดท Admin (bcrypt)
UPDATE "User"
SET 
  password = '$2a$10$8ViGUVH2o4NlDZb2wLp2qOTzQSRCF5H.0iHTKZRCbSDk.hIZFXcqm',
  "updatedAt" = NOW()
WHERE email = 'admin@unfakenews.asia';

-- อัพเดท Editor (bcrypt)
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
SET password = EXCLUDED.password, "updatedAt" = NOW();

-- เช็คผลลัพธ์
SELECT email, role, LEFT(password, 15) || '...' as pass FROM "User";
```

### 2️⃣ Restart Dev Server

```bash
npm run dev
```

---

## ✅ เสร็จแล้ว!

### Credentials:

| Email | Password | Role |
|-------|----------|------|
| `admin@unfakenews.asia` | `admin123` | ADMIN |
| (editor email) | `editor123` | EDITOR |
| `author@unfakenews.asia` | `author123` | EDITOR |

### Password ถูก encrypt ด้วย bcrypt แล้ว! 🔒

---

📚 **อ่านเพิ่ม:** `BCRYPT_SETUP_COMPLETE.md`
