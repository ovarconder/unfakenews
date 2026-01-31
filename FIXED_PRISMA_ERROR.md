# ✅ แก้ไข Prisma Error เรียบร้อยแล้ว

## ปัญหาที่เจอ

```
Error: The datasource property `url` is no longer supported in schema files.
Error: The datasource property `directUrl` is no longer supported in schema files.
```

## สาเหตุ

Prisma 7 เปลี่ยนวิธีการตั้งค่า - **ไม่อนุญาตให้ใส่ `url` และ `directUrl` ใน `schema.prisma` อีกต่อไป**

## วิธีแก้ (เสร็จแล้ว ✅)

### 1. แก้ไข `prisma/schema.prisma`

**เดิม (ผิด):**
```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")     ❌
  directUrl = env("DIRECT_URL")       ❌
}
```

**ใหม่ (ถูกต้อง):**
```prisma
datasource db {
  provider = "postgresql"  ✅
}
```

### 2. แก้ไข `prisma.config.ts`

**เพิ่ม `directUrl`:**

```typescript
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env["DATABASE_URL"],      ✅
    directUrl: process.env["DIRECT_URL"],  ✅ เพิ่มบรรทัดนี้
  },
});
```

### 3. Generate Prisma Client

```bash
npm run prisma:generate
```

**ผลลัพธ์:**
```
✔ Generated Prisma Client (v7.3.0) to ./node_modules/.prisma/client in 1.09s
```

## ✅ ตอนนี้พร้อมใช้งานแล้ว!

### ขั้นตอนถัดไป:

```bash
# 1. Push schema ไป Supabase
npm run prisma:push

# 2. เปิด Prisma Studio
npm run prisma:studio

# 3. สร้างข้อมูลตัวอย่าง
# - ใช้ Prisma Studio หรือ
# - ใช้ SQL ใน Supabase (ไฟล์ supabase-sample-data.sql)

# 4. รัน Development Server
npm run dev
```

## 📝 สรุป Configuration ที่ถูกต้อง

### ไฟล์ `.env`:
```env
DATABASE_URL="postgresql://postgres.xxx:pass@xxx.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.xxx:pass@xxx.supabase.com:5432/postgres"
GEMINI_API_KEY="your_key"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your_secret"
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

### ไฟล์ `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"  // เท่านี้พอ!
}
```

### ไฟล์ `prisma.config.ts`:
```typescript
datasource: {
  url: process.env["DATABASE_URL"],
  directUrl: process.env["DIRECT_URL"],
}
```

## 🎉 เสร็จสิ้น!

Error แก้ไขเรียบร้อยแล้ว คุณสามารถใช้งาน Prisma กับ Supabase ได้ตามปกติ

**Next Steps:**
1. ตั้งค่า Supabase ตาม `SUPABASE_QUICK_TH.md`
2. Push schema: `npm run prisma:push`
3. สร้างข้อมูล: ใช้ `supabase-sample-data.sql`
4. ทดสอบ: `npm run dev`
