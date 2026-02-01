# ⚡ แก้ทันที - 3 คำสั่ง

## ปัญหา: ไม่มีคอลัมน์ User.password

## วิธีแก้:

### 1. แก้ DATABASE_URL ใน .env.local

เปิดไฟล์ `.env.local` แล้วหาบรรทัด `DATABASE_URL`

**เปลี่ยนจาก:**
```
...supabase.com:5432/postgres
```

**เป็น:**
```
...supabase.com:6543/postgres?pgbouncer=true
```

### 2. รัน 3 คำสั่งนี้:

```bash
# Push schema to database
npx prisma db push

# Regenerate Prisma Client  
npx prisma generate

# Restart dev server
npm run dev
```

---

## Copy-Paste ได้เลย:

```bash
npx prisma db push && npx prisma generate && npm run dev
```

---

## ถ้าขึ้น warning ให้กด `y` หรือใช้:

```bash
npx prisma db push --accept-data-loss
```

---

🎯 **เท่านี้ก็เสร็จ!** ลอง login ใหม่ได้เลยครับ
