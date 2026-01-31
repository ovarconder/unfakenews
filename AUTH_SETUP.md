# 🔐 Authentication & Authorization System

## สรุประบบ Auth

ระบบ Authentication และ Authorization แบบครบวงจรสำหรับ UnfakeNews

---

## 📋 Role-Based Access Control (RBAC)

### Roles (4 ระดับ)

```typescript
enum UserRole {
  USER         // ผู้ใช้ทั่วไป
  EDITOR       // บรรณาธิการ
  ADMIN        // แอดมิน
  SUPER_ADMIN  // ซูเปอร์แอดมิน
}
```

### สิทธิ์แต่ละ Role

| สิทธิ์ | USER | EDITOR | ADMIN | SUPER_ADMIN |
|--------|------|--------|-------|-------------|
| **อ่านบทความ** | ✅ | ✅ | ✅ | ✅ |
| **สร้างบทความ** | ❌ | ✅ | ✅ | ✅ |
| **แก้ไขบทความตัวเอง** | ❌ | ✅ | ✅ | ✅ |
| **แก้ไขบทความทั้งหมด** | ❌ | ❌ | ✅ | ✅ |
| **ลบบทความ** | ❌ | ❌ | ✅ | ✅ |
| **จัดการหมวดหมู่** | ❌ | ❌ | ✅ | ✅ |
| **จัดการผู้ใช้** | ❌ | ❌ | ❌ | ✅ |
| **เปลี่ยน Role** | ❌ | ❌ | ❌ | ✅ |

---

## 🚪 Login Methods

### 1. Google OAuth (แนะนำ)
- ✅ ไม่ต้องจัดการ password
- ✅ Secure by default
- ✅ Easy setup

### 2. Email/Password (Credentials)
- ✅ ควบคุมเอง 100%
- ⚠️ ต้อง hash password (bcrypt)
- 💡 เหมาะสำหรับ admin accounts

---

## 🔧 Setup Guide

### 1. ติดตั้ง Dependencies

```bash
npm install @next-auth/prisma-adapter bcryptjs
npm install -D @types/bcryptjs
```

### 2. Update Database

```bash
# สร้าง migration
npm run prisma:migrate

# หรือ push โดยตรง
npm run prisma:push
```

### 3. Environment Variables

เพิ่มใน `.env`:

```env
# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-super-secret-key-min-32-chars"

# Google OAuth (Optional)
GOOGLE_CLIENT_ID="xxx.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="GOCSPX-xxxxx"
```

**สร้าง NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

### 4. Google OAuth Setup (Optional)

1. ไปที่ [Google Cloud Console](https://console.cloud.google.com/)
2. สร้าง Project ใหม่
3. ไปที่ **APIs & Services** → **Credentials**
4. คลิก **Create Credentials** → **OAuth 2.0 Client ID**
5. Application type: **Web application**
6. Authorized redirect URIs:
   ```
   http://localhost:3000/api/auth/callback/google
   https://yourdomain.com/api/auth/callback/google
   ```
7. คัดลอก **Client ID** และ **Client Secret**

---

## 🎯 การใช้งาน

### 1. เข้าสู่ระบบ

```bash
# เปิดหน้า Login
http://localhost:3000/auth/signin
```

**Demo Credentials:**
```
Email: admin@unfakenews.com
Password: admin123
```

### 2. ป้องกันหน้า Admin

```typescript
// app/admin/some-page/page.tsx
import { requireRole } from "@/lib/auth";
import { UserRole } from "@prisma/client";

export default async function AdminPage() {
  // ต้อง login และเป็น ADMIN ขึ้นไป
  const user = await requireRole([UserRole.ADMIN, UserRole.SUPER_ADMIN]);
  
  return <div>Welcome {user.name}!</div>;
}
```

### 3. ป้องกัน API Routes

```typescript
// app/api/admin/some-route/route.ts
import { requireRole } from "@/lib/auth";
import { UserRole } from "@prisma/client";

export async function POST(request: NextRequest) {
  // ต้อง login และเป็น ADMIN ขึ้นไป
  const user = await requireRole([UserRole.ADMIN, UserRole.SUPER_ADMIN]);
  
  // ... rest of the API logic
}
```

### 4. Client-side Auth

```typescript
"use client";

import { useSession, signOut } from "next-auth/react";

export function Component() {
  const { data: session, status } = useSession();
  
  if (status === "loading") {
    return <p>Loading...</p>;
  }
  
  if (!session) {
    return <p>Not logged in</p>;
  }
  
  return (
    <div>
      <p>Welcome {session.user.name}!</p>
      <p>Role: {session.user.role}</p>
      <button onClick={() => signOut()}>Logout</button>
    </div>
  );
}
```

---

## 🔒 Security Best Practices

### 1. Hash Passwords (สำคัญ!)

```typescript
// ติดตั้ง
npm install bcryptjs

// Hash password
import bcrypt from "bcryptjs";

const hashedPassword = await bcrypt.hash(password, 10);

// Verify password
const isValid = await bcrypt.compare(password, hashedPassword);
```

### 2. Secure NEXTAUTH_SECRET

```bash
# Generate secure secret
openssl rand -base64 32

# เก็บใน .env อย่าเดียว
# NEVER commit to git!
```

### 3. HTTPS in Production

```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  // Redirect HTTP to HTTPS
  if (process.env.NODE_ENV === "production" && 
      request.headers.get("x-forwarded-proto") !== "https") {
    return NextResponse.redirect(
      `https://${request.headers.get("host")}${request.nextUrl.pathname}`,
      301
    );
  }
}
```

### 4. Rate Limiting

```typescript
// ใช้ rate limiter สำหรับ login
import rateLimit from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts
  message: "Too many login attempts",
});
```

---

## 👥 User Management

### สร้าง Admin User แรก

```typescript
// scripts/create-admin.ts
import { prisma } from "../lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
  const hashedPassword = await bcrypt.hash("admin123", 10);
  
  const admin = await prisma.user.create({
    data: {
      email: "admin@unfakenews.com",
      name: "Admin",
      password: hashedPassword,
      role: "SUPER_ADMIN",
      emailVerified: new Date(),
    },
  });
  
  console.log("✅ Admin created:", admin.email);
}

main();
```

รัน:
```bash
npx ts-node scripts/create-admin.ts
```

### เปลี่ยน Role ผ่าน Prisma Studio

```bash
npm run prisma:studio

# เปิดที่ http://localhost:5555
# เลือก User → แก้ไข role
```

---

## 📱 Social Share System

### Features

✅ **Facebook** - แชร์ไปหน้า Facebook  
✅ **X (Twitter)** - Tweet พร้อมลิงก์  
✅ **LinkedIn** - แชร์ในวงการมืออาชีพ  
✅ **WhatsApp** - แชร์ผ่าน WhatsApp  
✅ **LINE** - แชร์ผ่าน LINE (เหมาะสำหรับไทย-ญี่ปุ่น)  
✅ **Email** - ส่งผ่านอีเมล  
✅ **Copy Link** - คัดลอกลิงก์โดยตรง  

### การใช้งาน

```typescript
import { SocialShare } from "@/components/social-share";

// Full version (แสดงทุกปุ่ม)
<SocialShare 
  title="หัวข้อบทความ"
  excerpt="สรุปบทความ"
  locale="th"
/>

// Compact version (แสดงเป็น dropdown)
<SocialShare 
  title="หัวข้อบทความ"
  excerpt="สรุปบทความ"
  locale="th"
  compact
/>
```

### ปุ่ม LINE แสดงเฉพาะภาษา

ปุ่ม LINE จะแสดงเฉพาะในภาษา:
- 🇹🇭 Thai
- 🇯🇵 Japanese
- 🇮🇩 Indonesian
- 🇵🇭 Filipino
- 🇲🇾 Malay
- 🇻🇳 Vietnamese

เพราะ LINE ได้รับความนิยมในประเทศเหล่านี้

---

## 🧪 Testing

### 1. ทดสอบ Login

```bash
# 1. เริ่ม dev server
npm run dev

# 2. เปิด browser
http://localhost:3000/auth/signin

# 3. ลอง login ด้วย:
#    - Google OAuth (ถ้า setup แล้ว)
#    - Email/Password: admin@unfakenews.com / admin123
```

### 2. ทดสอบ Protected Routes

```bash
# 1. ลองเข้า /admin โดยไม่ login
http://localhost:3000/admin
# → ควร redirect ไป /auth/signin

# 2. Login แล้วลองเข้าใหม่
# → ควรเห็นหน้า Admin Dashboard
```

### 3. ทดสอบ Social Share

```bash
# 1. เปิดบทความ
http://localhost:3000/th/posts/some-slug

# 2. คลิก Share button
# 3. ทดสอบ:
#    - คลิก Facebook → เปิด popup
#    - คลิก Copy Link → ลิงก์ถูกคัดลอก
#    - คลิก LINE (ถ้าเป็นภาษาไทย)
```

---

## 🚀 Deployment

### Vercel

```bash
# 1. เพิ่ม Environment Variables ใน Vercel Dashboard
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="your-secret"
GOOGLE_CLIENT_ID="xxx"
GOOGLE_CLIENT_SECRET="xxx"

# 2. Update Google OAuth Redirect URI
https://yourdomain.com/api/auth/callback/google

# 3. Deploy
vercel --prod
```

---

## 📊 Database Schema

### Models ที่เพิ่มใหม่

```prisma
// NextAuth required models
model Account { ... }
model Session { ... }
model VerificationToken { ... }

// User model (updated)
model User {
  role UserRole @default(USER)
  password String? // For credentials login
  accounts Account[]
  sessions Session[]
}

// Role enum
enum UserRole {
  USER
  EDITOR
  ADMIN
  SUPER_ADMIN
}
```

---

## 🔍 Troubleshooting

### Error: "NEXTAUTH_SECRET missing"

```bash
# สร้าง secret ใหม่
openssl rand -base64 32

# เพิ่มใน .env
NEXTAUTH_SECRET="generated-secret-here"
```

### Error: "Google OAuth not working"

1. ตรวจสอบ Redirect URI ถูกต้อง
2. ตรวจสอบ Credentials ใน .env
3. ตรวจสอบ Google Cloud Console:
   - OAuth consent screen configured
   - Authorized domains added

### Error: "Unauthorized" แม้ login แล้ว

```typescript
// ตรวจสอบว่า middleware ไม่ block /api/auth/*
export const config = {
  matcher: [
    "/((?!api/auth|_next/static|_next/image|favicon.ico).*)",
  ],
};
```

---

## 📝 Next Steps

### 1. เพิ่ม bcrypt (สำคัญ!)

```bash
npm install bcryptjs
```

แก้ไข `/app/api/auth/[...nextauth]/route.ts`:

```typescript
import bcrypt from "bcryptjs";

// ใน authorize function:
const isValid = await bcrypt.compare(
  credentials.password, 
  user.password
);
```

### 2. สร้าง Admin User

```bash
npx ts-node scripts/create-admin.ts
```

### 3. ทดสอบระบบ

```bash
npm run dev
# เข้า /auth/signin
# ลอง login ด้วย admin account
```

### 4. Deploy!

```bash
vercel --prod
```

---

## 🎉 สรุป

คุณตอนนี้มี:

✅ **NextAuth Integration** - Login ด้วย Google + Credentials  
✅ **4 Role Levels** - USER, EDITOR, ADMIN, SUPER_ADMIN  
✅ **Protected Routes** - API และ Pages ปลอดภัย  
✅ **Social Share** - 7 platforms รวม Copy Link  
✅ **Language-aware Sharing** - แชร์ URL ภาษาที่เลือก  
✅ **Admin Dashboard** - จัดการระบบ  

**ระบบพร้อมใช้งาน!** 🚀

ถ้ามีคำถามเพิ่มเติมถามได้เลยครับ! 😊
