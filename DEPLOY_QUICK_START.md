# 🚀 Deploy ใน 10 นาที - Quick Start

## TL;DR - ขั้นตอนสั้นๆ

### 1. Push to GitHub (2 นาที)

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 2. Deploy to Vercel (3 นาที)

1. ไป https://vercel.com
2. Login with GitHub
3. "Add New Project"
4. Select: **unfakenews**
5. **อย่ากด Deploy ก่อน!**

### 3. ตั้งค่า Environment Variables (3 นาที)

คลิกแท็บ **"Environment Variables"** แล้วเพิ่มทีละตัว:

```env
DATABASE_URL="postgresql://postgres.xxx:pass@xxx.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.xxx:pass@xxx.supabase.com:5432/postgres"
GEMINI_API_KEY="AIzaSy..."
NEXTAUTH_URL="https://your-app.vercel.app"
NEXTAUTH_SECRET="generate_with_openssl_rand_base64_32"
NEXT_PUBLIC_BASE_URL="https://your-app.vercel.app"
```

**ทุกตัว:** เลือก `Production`, `Preview`, `Development`

### 4. Deploy! (2 นาที)

1. คลิก **"Deploy"**
2. รอ 2-3 นาที
3. คัดลอก URL ที่ได้ (e.g., `https://unfakenews.vercel.app`)

### 5. อัปเดต URLs

1. Settings → Environment Variables
2. แก้ไข `NEXTAUTH_URL` และ `NEXT_PUBLIC_BASE_URL`
3. เปลี่ยนเป็น URL จริงที่ได้จาก Vercel
4. Redeploy: Deployments → ... → Redeploy

---

## ✅ ทดสอบ

เปิดเบราว์เซอร์:

```
https://your-app.vercel.app/en
https://your-app.vercel.app/th
https://your-app.vercel.app/en/posts/global-tech-summit-ai-platform
```

---

## 🎉 เสร็จแล้ว!

เว็บของคุณ online แล้ว พร้อมใช้งาน!

**ต้องการรายละเอียดเพิ่มเติม?**
- `DEPLOY_VERCEL.md` - คู่มือแบบละเอียด
- `DEPLOY_CHECKLIST.md` - Checklist ครบถ้วน
- `ENV_TEMPLATE_VERCEL.txt` - Template environment variables

---

## 🔧 หาก Build Failed

### Error: Missing Environment Variables

→ ตรวจสอบว่าใส่ครบทั้ง 6 ตัว

### Error: Prisma Connection

→ ตรวจสอบ `DATABASE_URL` และ `DIRECT_URL`

### Error: Cannot find module

→ รัน: `npm install` แล้ว commit & push ใหม่

---

## 📱 Auto Deploy

ทุกครั้งที่ push code:

```bash
git add .
git commit -m "Update feature"
git push
```

Vercel จะ deploy อัตโนมัติใน 2-3 นาที!

---

## 🎯 Next Steps

1. ✅ Submit sitemap: https://search.google.com/search-console
2. ✅ เพิ่มคอนเทนต์ใหม่
3. ✅ Monitor ที่ Vercel Dashboard
4. 🎊 แชร์ให้โลกรู้จัก!

**Happy Publishing! 🚀**
