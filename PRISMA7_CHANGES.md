# Prisma 7 Configuration Changes

## ⚠️ Breaking Changes

Prisma 7 เปลี่ยนวิธีการตั้งค่า database connection URLs

### เดิม (Prisma 6 และต่ำกว่า)

ใส่ใน `prisma/schema.prisma`:

```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```

### ใหม่ (Prisma 7+) ✅

**ไฟล์ `prisma/schema.prisma`:**
```prisma
datasource db {
  provider = "postgresql"
}
```

**ไฟล์ `prisma.config.ts`:**
```typescript
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env["DATABASE_URL"],
    directUrl: process.env["DIRECT_URL"],
  },
});
```

## ✅ การตั้งค่าที่ถูกต้อง

### 1. ไฟล์ `.env`

```env
# Supabase Connection Pooling (สำหรับ queries)
DATABASE_URL="postgresql://postgres.xxxx:password@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true"

# Supabase Direct Connection (สำหรับ migrations)
DIRECT_URL="postgresql://postgres.xxxx:password@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres"

# อื่นๆ...
GEMINI_API_KEY="your_key"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your_secret"
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

### 2. ไฟล์ `prisma/schema.prisma`

```prisma
generator client {
  provider = "prisma-client-js"
  output   = "../node_modules/.prisma/client"
}

datasource db {
  provider = "postgresql"  // ไม่มี url และ directUrl
}

// Models...
model User {
  // ...
}
```

### 3. ไฟล์ `prisma.config.ts`

```typescript
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env["DATABASE_URL"],      // Connection Pooling
    directUrl: process.env["DIRECT_URL"],  // Direct Connection
  },
});
```

## 🚀 คำสั่งที่ใช้

```bash
# Generate Prisma Client
npm run prisma:generate

# Push schema to database
npm run prisma:push

# Create migration
npm run prisma:migrate

# Open Prisma Studio
npm run prisma:studio
```

## 📝 สรุป

| สิ่งที่เปลี่ยน | Prisma 6 | Prisma 7 |
|---------------|----------|----------|
| **url** | ใน schema.prisma | ใน prisma.config.ts |
| **directUrl** | ใน schema.prisma | ใน prisma.config.ts |
| **provider** | ใน schema.prisma | ใน schema.prisma (เหมือนเดิม) |

## ✅ Checklist

- [x] ลบ `url` จาก schema.prisma
- [x] ลบ `directUrl` จาก schema.prisma  
- [x] เพิ่ม `url` ใน prisma.config.ts
- [x] เพิ่ม `directUrl` ใน prisma.config.ts
- [x] รัน `npm run prisma:generate`
- [x] Success! ✨

## 🔗 อ้างอิง

- [Prisma 7 Migration Guide](https://pris.ly/d/prisma7-migration-guide)
- [Prisma Configuration](https://pris.ly/d/config-datasource)
- [Prisma Client Configuration](https://pris.ly/d/prisma7-client-config)
