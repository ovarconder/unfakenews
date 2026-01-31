# 🔧 Prisma 7 to Prisma 6 Downgrade Guide

## ❌ Problem: Prisma 7 Engine Type Error

```
Error [PrismaClientConstructorValidationError]: Using engine type "client" requires either "adapter" or "accelerateUrl" to be provided to PrismaClient constructor.
```

## ✅ Solution: Downgrade to Prisma 6

Prisma 7 มีปัญหา compatibility กับ Next.js 15 ในเรื่อง engine type  
การ downgrade เป็น Prisma 6 จะแก้ปัญหานี้ได้

---

## 📝 Step-by-Step Instructions

### Step 1: Update `package.json`

**Change versions:**
```json
{
  "dependencies": {
    "@prisma/client": "^6.2.1",
    "prisma": "^6.2.1"
  }
}
```

### Step 2: Delete `prisma.config.ts`

```bash
rm prisma.config.ts
```

This file is only needed for Prisma 7+

### Step 3: Update `prisma/schema.prisma`

**Add back the `url` in datasource:**

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")  // ✅ Add this back
}

// ... rest of your models
```

### Step 4: Clean Install

```bash
# Remove Prisma cache
rm -rf node_modules/.prisma
rm -rf node_modules/@prisma

# Clean install
rm -rf node_modules package-lock.json
npm install

# Generate Prisma Client
npx prisma generate

# Build
npm run build
```

---

## 🎯 What Changed?

| Prisma 7 | Prisma 6 |
|----------|----------|
| `prisma.config.ts` required | ❌ Not used |
| No `url` in `datasource db` | ✅ `url = env("DATABASE_URL")` |
| Engine type issues | ✅ Works perfectly |
| New architecture | Stable architecture |

---

## 📦 Complete Working Configuration

### `package.json`:
```json
{
  "dependencies": {
    "@prisma/client": "^6.2.1",
    "prisma": "^6.2.1"
  },
  "scripts": {
    "build": "prisma generate && next build",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "prisma:push": "prisma db push"
  }
}
```

### `prisma/schema.prisma`:
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ... your models (Post, User, etc.)
```

### `lib/prisma.ts`:
```typescript
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

---

## 🚀 Vercel Deployment

### Environment Variables:
```env
DATABASE_URL="postgresql://user:password@host:port/database"
NEXTAUTH_SECRET="your-secret"
NEXTAUTH_URL="https://yourdomain.com"
GEMINI_API_KEY="your-key"
NEXT_PUBLIC_BASE_URL="https://yourdomain.com"
NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"
```

### Build Settings:
- **Build Command:** `prisma generate && next build`
- **Output Directory:** `.next`
- **Install Command:** `npm install`

---

## ✅ Verification Checklist

- [ ] `package.json` updated to Prisma 6.2.1
- [ ] `prisma.config.ts` deleted
- [ ] `prisma/schema.prisma` has `url = env("DATABASE_URL")`
- [ ] Clean install completed: `npm install`
- [ ] Prisma generated: `npx prisma generate`
- [ ] Build successful: `npm run build`
- [ ] Deploy to Vercel
- [ ] Test in production

---

## 💡 Why Prisma 6?

| Feature | Prisma 6 | Prisma 7 |
|---------|----------|----------|
| **Stability** | ✅ Proven | ⚠️ New |
| **Next.js 15** | ✅ Compatible | ❌ Issues |
| **Edge Runtime** | ✅ Works | ⚠️ Requires adapter |
| **Documentation** | ✅ Extensive | ⚠️ Limited |
| **Community Support** | ✅ Large | ⚠️ Growing |

---

## 🎉 Expected Result

After downgrade:
- ✅ No engine type errors
- ✅ Build completes successfully
- ✅ Works on Vercel
- ✅ All database operations work
- ✅ Migrations work normally

---

**You can upgrade back to Prisma 7 later when it's more stable!**
