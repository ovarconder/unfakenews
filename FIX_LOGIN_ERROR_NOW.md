# 🚨 แก้ Login Error ทันที - 2 วิธี

## ปัญหา: MaxClientsInSessionMode error ยังอยู่

เพราะว่า:
- ❌ ยังไม่ได้เพิ่ม `DIRECT_URL` ใน `.env.local`
- ❌ ยังไม่ได้ restart server หลังแก้ไข

---

## 🚀 วิธีที่ 1: แก้ถาวร (แนะนำ) - ใช้เวลา 2 นาที

### ขั้นตอนที่ 1: เพิ่ม DIRECT_URL

1. เปิดไฟล์ `.env.local` (ถ้าไม่มีให้สร้างใหม่)

2. เพิ่มบรรทัดนี้:

```env
DIRECT_URL="postgresql://postgres.xxxxx:password@aws-0-region.pooler.supabase.com:6543/postgres?pgbouncer=true"
```

### วิธีหา DIRECT_URL จาก Supabase:

**ขั้นตอน:**
1. เข้า https://app.supabase.com
2. เลือก Project ของคุณ
3. ไปที่ **Settings** (เมนูซ้าย)
4. คลิก **Database**
5. เลื่อนลงไปส่วน **Connection string**
6. เลือก Tab **"Transaction"** (ไม่ใช่ Session)
7. เลือก **"URI"**
8. คัดลอก URL ที่ได้

**URL จะมีหน้าตาประมาณนี้:**
```
postgresql://postgres.[project-ref]:[password]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
```

9. เพิ่ม `?pgbouncer=true` ท้าย URL:
```
postgresql://postgres.[project-ref]:[password]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

### ขั้นตอนที่ 2: แก้ schema กลับ

```bash
# ใน terminal
code prisma/schema.prisma
```

แก้เป็น:
```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")  # เพิ่มบรรทัดนี้กลับมา
}
```

### ขั้นตอนที่ 3: Regenerate และ Restart

```bash
# 1. Regenerate Prisma Client
npx prisma generate

# 2. Restart dev server (กด Ctrl+C แล้วรันใหม่)
npm run dev
```

### ขั้นตอนที่ 4: ทดสอบ Login

เข้าไปที่ https://www.unfakenews.asia แล้วลอง login อีกครั้ง

---

## ⚡ วิธีที่ 2: แก้ชั่วคราว - ใช้ได้ทันที (ไม่แนะนำ)

ถ้าหา DIRECT_URL ไม่เจอ หรือไม่อยากทำตอนนี้ ใช้วิธีนี้ก่อน:

### แก้: เปลี่ยน DATABASE_URL ให้ใช้ Transaction mode

1. เปิด `.env.local`

2. แก้ `DATABASE_URL` ให้เปลี่ยน port จาก `5432` → `6543`:

```env
# เดิม (Session mode - จะ error)
DATABASE_URL="postgresql://postgres.xxx:pass@aws-0-region.pooler.supabase.com:5432/postgres"

# ใหม่ (Transaction mode - ไม่ error)
DATABASE_URL="postgresql://postgres.xxx:pass@aws-0-region.pooler.supabase.com:6543/postgres?pgbouncer=true"
```

**สังเกต:**
- เปลี่ยน port: `5432` → `6543`
- เพิ่ม `?pgbouncer=true` ท้าย URL

3. Restart dev server:

```bash
npm run dev
```

**⚠️ ข้อเสีย:**
- ถ้ารัน `prisma migrate` จะมีปัญหา
- ควรทำวิธีที่ 1 เพื่อความถาวร

---

## 🔍 เช็คว่า .env.local มีอะไรบ้าง

```bash
# ใน terminal
cat .env.local
```

ควรมี:
```env
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://...6543/postgres?pgbouncer=true"
NEXTAUTH_URL="https://www.unfakenews.asia"
NEXTAUTH_SECRET="..."
GEMINI_API_KEY="..."
```

---

## 🐛 Troubleshooting

### 1. ไม่มีไฟล์ .env.local

**วิธีแก้:**
```bash
# สร้างไฟล์ใหม่
touch .env.local

# คัดลอกจาก .env
cp .env .env.local

# แก้ไข .env.local
code .env.local
```

### 2. หา Transaction URL ไม่เจอใน Supabase

**วิธีแก้:**
ถ้าใน Supabase Dashboard ไม่มี Tab "Transaction" แสดงว่าต้องสร้างเอง:

เปลี่ยนจาก Session URL:
```
postgresql://postgres.abc:pass@aws-0-region.pooler.supabase.com:5432/postgres
```

เป็น Transaction URL:
```
postgresql://postgres.abc:pass@aws-0-region.pooler.supabase.com:6543/postgres?pgbouncer=true
```

**เปลี่ยน 2 อย่าง:**
1. Port: `5432` → `6543`
2. เพิ่ม: `?pgbouncer=true`

### 3. Restart แล้วยัง error

**วิธีแก้:**
```bash
# 1. Kill all node processes
killall node

# 2. Clear cache
rm -rf .next

# 3. Restart
npm run dev
```

### 4. Error: Environment variable not found: DIRECT_URL

**วิธีแก้:**
ใช้วิธีที่ 2 (แก้ชั่วคราว) ก่อน หรือเพิ่ม `DIRECT_URL` ใน `.env.local`

---

## ✅ Checklist

เช็คให้ครบ:

- [ ] มีไฟล์ `.env.local` หรือ `.env`
- [ ] มี `DIRECT_URL` ใน `.env.local` (วิธีที่ 1)
- [ ] หรือแก้ `DATABASE_URL` ให้ใช้ port 6543 (วิธีที่ 2)
- [ ] มี `?pgbouncer=true` ท้าย URL
- [ ] รัน `npx prisma generate`
- [ ] Restart dev server แล้ว
- [ ] ทดสอบ login

---

## 📞 ติดปัญหา?

**บอกผมว่า:**
1. ใช้วิธีไหน (1 หรือ 2)
2. เจอ error อะไร
3. `.env.local` มีหน้าตาอย่างไร (ปิด password)

ผมจะช่วยแก้ต่อครับ!

---

🎯 **แนะนำ:** ใช้วิธีที่ 1 เพื่อความถาวร แต่ถ้าด่วนมากใช้วิธีที่ 2 ก่อนก็ได้
