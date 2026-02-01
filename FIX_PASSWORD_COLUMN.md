# 🚨 แก้ Error: ไม่มีคอลัมน์ User.password

## ❌ Error ที่เจอ:
```
Column 'User.password' does not exist
```

## 🔍 สาเหตุ:
Database ใน Supabase ยังไม่มีคอลัมน์ `password` ในตาราง `User`

---

## ✅ วิธีแก้ (2 ขั้นตอน):

### ขั้นที่ 1: แก้ Database URL (สำคัญมาก!)

เปิดไฟล์ `.env.local` หรือ `.env`

**เปลี่ยนจาก:**
```env
DATABASE_URL="postgresql://...supabase.com:5432/postgres"
```

**เป็น:**
```env
DATABASE_URL="postgresql://...supabase.com:6543/postgres?pgbouncer=true"
```

**หมายเหตุ:** แก้ 2 อย่าง
- Port: `5432` → `6543`
- เพิ่ม: `?pgbouncer=true`

### ขั้นที่ 2: Push Schema ไปที่ Database

```bash
# Push schema changes to database
npx prisma db push

# ถ้าขึ้น warning ให้กด y หรือใช้:
npx prisma db push --accept-data-loss
```

คำสั่งนี้จะ:
- ✅ เพิ่มคอลัมน์ `password` ในตาราง `User`
- ✅ สร้างตารางที่ขาด (ถ้ามี)
- ✅ อัพเดท schema ให้ตรงกับ Prisma

### ขั้นที่ 3: Restart Dev Server

```bash
# กด Ctrl+C เพื่อหยุด
# แล้วรันใหม่
npm run dev
```

---

## 📋 ขั้นตอนเต็ม (Copy-Paste ได้เลย):

```bash
# 1. หยุด dev server (Ctrl+C)

# 2. Push schema
npx prisma db push

# 3. Restart
npm run dev
```

---

## 🔍 ตรวจสอบว่า Push สำเร็จ:

หลังรัน `npx prisma db push` ควรเห็น:

```
✔ Your database is now in sync with your Prisma schema.
```

---

## 🐛 ถ้าเจอ Error: Can't reach database server

**สาเหตุ:** DATABASE_URL ยังใช้ port 5432

**วิธีแก้:**
1. เปิด `.env.local`
2. เปลี่ยน port เป็น `6543`
3. เพิ่ม `?pgbouncer=true`
4. ลองรัน `npx prisma db push` อีกครั้ง

---

## 🎯 ตัวอย่าง DATABASE_URL ที่ถูกต้อง:

```env
# ❌ เดิม (ไม่ได้)
DATABASE_URL="postgresql://postgres.abc:pass@aws-0-region.pooler.supabase.com:5432/postgres"

# ✅ ใหม่ (ใช้ได้)
DATABASE_URL="postgresql://postgres.abc:pass@aws-0-region.pooler.supabase.com:6543/postgres?pgbouncer=true"
```

---

## 📊 Schema ที่จะถูก Push:

### User Table จะมี:
- ✅ `id` (String)
- ✅ `email` (String, unique)
- ✅ `name` (String, nullable)
- ✅ `password` (String, nullable) ← **เพิ่มใหม่**
- ✅ `role` (UserRole enum)
- ✅ `image` (String, nullable)
- ✅ `emailVerified` (DateTime, nullable)
- ✅ `createdAt` (DateTime)
- ✅ `updatedAt` (DateTime)

---

## ⚠️ Warning: Data Loss

ถ้าขึ้น warning:
```
⚠️  There will be data loss.
  • The migration will add a unique constraint covering the columns `[email]` on the table `User`.
```

**ไม่ต้องกังวล!** ถ้า:
- Database ว่างอยู่
- หรือมี admin user เดียว
- เป็นครั้งแรกที่ push

**กด `y` หรือใช้:**
```bash
npx prisma db push --accept-data-loss
```

---

## ✅ Checklist:

- [ ] แก้ `DATABASE_URL` ใช้ port `6543` แล้ว
- [ ] มี `?pgbouncer=true` ท้าย URL แล้ว
- [ ] รัน `npx prisma db push` แล้ว
- [ ] เห็น "✔ Your database is now in sync"
- [ ] Restart dev server แล้ว
- [ ] ทดสอบ login

---

## 🎓 เข้าใจเพิ่มเติม:

### ทำไมต้อง push?

- Prisma Schema (ไฟล์ `schema.prisma`) = แบบแปลนบ้าน
- Database = บ้านจริง
- `prisma db push` = สร้างบ้านตามแบบแปลน

### ความแตกต่าง:

| Command | ใช้เมื่อ | ผลลัพธ์ |
|---------|----------|---------|
| `prisma db push` | Development, prototype | อัพเดท DB ตาม schema |
| `prisma migrate dev` | Development, tracked | สร้าง migration file + อัพเดท DB |
| `prisma migrate deploy` | Production | รัน migrations ที่มีอยู่ |

**แนะนำ:** ใช้ `db push` ใน development ก่อน พอเสร็จแล้วค่อยใช้ `migrate`

---

## 🚀 หลังแก้เสร็จ:

1. ✅ Database มีคอลัมน์ `password` แล้ว
2. ✅ Login ด้วย email/password ได้แล้ว
3. ✅ Admin credentials ใช้งานได้:
   - Email: `admin@unfakenews.asia`
   - Password: `admin123`

---

## 📞 ยังไม่ได้?

ถ้ายังเจอ error บอกผม:
1. Error message ที่เจอ
2. ผลลัพธ์จาก `npx prisma db push`
3. DATABASE_URL หน้าตาอย่างไร (ปิด password)

---

🎉 **เสร็จแล้ว!** Push schema แล้วลอง login ใหม่ได้เลยครับ
