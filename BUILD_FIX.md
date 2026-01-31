# 🔧 Build Error Fixes

## Errors Fixed

### 1. ❌ Module not found: './signin-form'

**Problem:**
```
Module not found: Can't resolve './signin-form'
```

**Solution:**
แก้ไขไฟล์ `app/[lang]/auth/signin/page.tsx` ให้เป็น client component ที่สมบูรณ์ แทนการ import ไฟล์ที่ไม่มี

**Changes:**
- ลบ `signin-form` import
- แก้ไขเป็น client component เต็มรูปแบบ
- ใช้ `next-auth/react` โดยตรง

---

### 2. ❌ Module not found: '@next-auth/prisma-adapter'

**Problem:**
```
Module not found: Can't resolve '@next-auth/prisma-adapter'
```

**Solution:**
เพิ่ม dependencies ที่หายไปใน `package.json`:
- `@next-auth/prisma-adapter`
- `bcryptjs`

**Changes:**
```json
"@next-auth/prisma-adapter": "^1.0.7",
"bcryptjs": "^2.4.3",
```

---

## How to Fix

### ทำแล้ว ✅:
- ✅ แก้ไข `app/[lang]/auth/signin/page.tsx`
- ✅ อัปเดต `package.json`
- ✅ ลบ `/app/auth/signin/page.tsx` ซ้ำ

### คุณต้องทำ:

```bash
# 1. ติดตั้ง dependencies ใหม่
npm install

# หรือถ้าใช้ yarn
yarn install

# 2. Build ใหม่
npm run build

# หรือถ้า deploy บน Vercel
# จะติดตั้งอัตโนมัติ แค่ push code ขึ้นไป
git add .
git commit -m "Fix build errors"
git push
```

---

## Vercel Deployment

ถ้า deploy บน Vercel และเจอ error:

1. **Push code ใหม่:**
   ```bash
   git add .
   git commit -m "Fix: Add missing dependencies and signin page"
   git push
   ```

2. **Vercel จะ auto-deploy**
   - Vercel จะรัน `npm install` อัตโนมัติ
   - จะติดตั้ง dependencies ใหม่
   - Build ใหม่

3. **หรือ Manual Redeploy:**
   - Vercel Dashboard → Deployments
   - คลิก ... → **Redeploy**

---

## ตรวจสอบ Environment Variables

ก่อน deploy ตรวจสอบว่ามี Environment Variables ครบ:

```env
# Database
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."

# NextAuth
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="your-secret"

# Gemini AI
GEMINI_API_KEY="AIza..."

# Google Analytics
NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"

# Base URL
NEXT_PUBLIC_BASE_URL="https://yourdomain.com"
```

---

## Testing Locally

```bash
# 1. Install dependencies
npm install

# 2. Generate Prisma Client
npm run prisma:generate

# 3. Test build
npm run build

# 4. Run production build
npm start
```

---

## Common Build Errors

### Error: Prisma Client not generated

```bash
npm run prisma:generate
```

### Error: Missing environment variables

Add to `.env`:
```env
DATABASE_URL="..."
NEXTAUTH_SECRET="..."
```

### Error: bcrypt/bcryptjs not found

```bash
npm install bcryptjs @types/bcryptjs
```

---

## Summary

✅ **Fixed signin page** - ลบการ import ไฟล์ที่ไม่มี  
✅ **Added dependencies** - `@next-auth/prisma-adapter`, `bcryptjs`  
✅ **Updated package.json** - พร้อม deploy  

**Next Steps:**
```bash
npm install
git add .
git commit -m "Fix build errors"
git push
```

Build should succeed now! ✅
