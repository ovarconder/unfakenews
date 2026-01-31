# 🚀 Deploy UnfakeNews ขึ้น Vercel

## เตรียมความพร้อม

### ✅ Checklist ก่อน Deploy

- [ ] Supabase Database พร้อมใช้งาน
- [ ] มีข้อมูลตัวอย่างใน Database แล้ว
- [ ] Gemini API Key พร้อมใช้
- [ ] ทดสอบ local (npm run dev) สำเร็จ
- [ ] Code อยู่ใน Git Repository (GitHub/GitLab/Bitbucket)

---

## ขั้นตอนการ Deploy

### 1. Push Code ขึ้น GitHub

ถ้ายังไม่มี Git Repository:

```bash
# เริ่มต้น Git
git init

# Add files
git add .

# Commit
git commit -m "Initial commit - UnfakeNews multi-language platform"

# สร้าง repository ใหม่ที่ github.com แล้วรัน:
git remote add origin https://github.com/your-username/unfakenews.git
git branch -M main
git push -u origin main
```

**⚠️ สำคัญ:** ตรวจสอบว่า `.env` อยู่ใน `.gitignore` แล้ว (อย่า commit ไฟล์ .env!)

### 2. Deploy ไปยัง Vercel

#### วิธีที่ 1: ใช้ Vercel Dashboard (ง่ายที่สุด)

1. ไปที่ https://vercel.com
2. Sign up / Login with GitHub
3. คลิก **"Add New Project"**
4. เลือก Repository **unfakenews**
5. คลิก **"Import"**
6. **Configure Project:**
   - Framework Preset: **Next.js** (auto-detect)
   - Root Directory: `./` (default)
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)
7. **ยังไม่ต้องกด Deploy!** ไปขั้นตอนที่ 3 ก่อน

### 3. ตั้งค่า Environment Variables

ใน Vercel Dashboard → Environment Variables → เพิ่มตัวแปรเหล่านี้:

#### 🔐 Environment Variables ที่ต้องเพิ่ม:

| Name | Value | Example |
|------|-------|---------|
| `DATABASE_URL` | Connection Pooling URL | `postgresql://postgres.xxx:pass@xxx.supabase.com:6543/postgres?pgbouncer=true` |
| `DIRECT_URL` | Direct Connection URL | `postgresql://postgres.xxx:pass@xxx.supabase.com:5432/postgres` |
| `GEMINI_API_KEY` | Your Gemini API Key | `AIzaSyAbc123...` |
| `NEXTAUTH_URL` | Your Vercel domain | `https://your-app.vercel.app` |
| `NEXTAUTH_SECRET` | Random secret | `abc123def456...` |
| `NEXT_PUBLIC_BASE_URL` | Your Vercel domain | `https://your-app.vercel.app` |

**วิธีเพิ่ม Environment Variables:**

1. คลิกแท็บ **"Environment Variables"**
2. สำหรับแต่ละตัวแปร:
   - Name: `DATABASE_URL`
   - Value: วาง Connection String จาก Supabase
   - Environment: เลือก **Production, Preview, Development** ทั้งหมด
   - คลิก **"Add"**
3. ทำซ้ำสำหรับตัวแปรทั้งหมด

**💡 Tips:**

```bash
# Generate NEXTAUTH_SECRET
openssl rand -base64 32

# หรือใช้คำสั่งนี้:
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 4. Deploy!

1. หลังจากใส่ Environment Variables ครบแล้ว
2. คลิก **"Deploy"**
3. รอประมาณ 2-3 นาที
4. เสร็จแล้ว! 🎉

---

## หลัง Deploy สำเร็จ

### 1. รับ Domain URL

Vercel จะให้ URL แบบนี้:
```
https://unfakenews.vercel.app
https://unfakenews-git-main-yourname.vercel.app
```

### 2. อัปเดต Environment Variables

กลับไปที่ Vercel Dashboard:

1. Settings → Environment Variables
2. แก้ไข `NEXTAUTH_URL` และ `NEXT_PUBLIC_BASE_URL`
3. เปลี่ยนจาก `http://localhost:3000` เป็น `https://your-app.vercel.app`
4. คลิก **"Save"**
5. **Redeploy** (Settings → Deployments → เลือก latest → คลิก ... → Redeploy)

### 3. ทดสอบ

เปิด browser และทดสอบ URL เหล่านี้:

```
https://your-app.vercel.app/en
https://your-app.vercel.app/th
https://your-app.vercel.app/en/posts/global-tech-summit-ai-platform
https://your-app.vercel.app/th/posts/global-tech-summit-ai-platform
https://your-app.vercel.app/sitemap.xml
https://your-app.vercel.app/robots.txt
```

### 4. Submit Sitemap ไป Google

1. ไปที่ [Google Search Console](https://search.google.com/search-console)
2. เพิ่ม property: `https://your-app.vercel.app`
3. Verify ownership (ใช้ DNS หรือ HTML file)
4. ไปที่ Sitemaps → เพิ่ม sitemap URL: `https://your-app.vercel.app/sitemap.xml`
5. คลิก **"Submit"**

---

## Custom Domain (Optional)

### 1. เพิ่ม Custom Domain

1. ไปที่ Vercel Dashboard → Settings → **Domains**
2. คลิก **"Add"**
3. ใส่ domain ของคุณ: `unfakenews.com`
4. เลือก redirect:
   - Redirect `www.unfakenews.com` → `unfakenews.com` (แนะนำ)

### 2. ตั้งค่า DNS

ที่ Domain Provider (Namecheap, GoDaddy, Cloudflare):

**A Record:**
```
Type: A
Name: @
Value: 76.76.21.21
```

**CNAME Record:**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

**รอ DNS propagation:** 5-30 นาที

### 3. อัปเดต Environment Variables

อย่าลืมเปลี่ยน:
- `NEXTAUTH_URL` → `https://unfakenews.com`
- `NEXT_PUBLIC_BASE_URL` → `https://unfakenews.com`

แล้ว Redeploy

---

## การ Auto Deploy

Vercel จะ auto deploy ทุกครั้งที่คุณ push code ขึ้น GitHub:

```bash
# แก้ไขโค้ด
git add .
git commit -m "Update feature"
git push

# Vercel จะ deploy อัตโนมัติใน 2-3 นาที
```

---

## Environment Variables ทั้งหมด

### Production Environment Variables

```env
# Supabase Database
DATABASE_URL="postgresql://postgres.xyzabcdefghijk:MyP@ssw0rd123@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.xyzabcdefghijk:MyP@ssw0rd123@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres"

# Gemini AI
GEMINI_API_KEY="AIzaSyAbc123Def456Ghi789Jkl012Mno345Pqr678Stu"

# NextAuth
NEXTAUTH_URL="https://your-app.vercel.app"
NEXTAUTH_SECRET="a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4"

# Base URL
NEXT_PUBLIC_BASE_URL="https://your-app.vercel.app"
```

---

## Vercel CLI (Advanced)

### ติดตั้ง Vercel CLI

```bash
npm i -g vercel
```

### Deploy ผ่าน CLI

```bash
# Login
vercel login

# Deploy
vercel

# Deploy to Production
vercel --prod

# Check logs
vercel logs

# List deployments
vercel ls
```

---

## แก้ปัญหาที่พบบ่อย

### ❌ Build Failed

**สาเหตุ:**
- Environment variables ไม่ครบ
- Prisma client ไม่ได้ generate

**วิธีแก้:**
1. ตรวจสอบ Environment Variables ครบทั้งหมดหรือไม่
2. ดู Build Logs ใน Vercel Dashboard
3. แก้ไขและ redeploy

### ❌ Database Connection Error

**สาเหตุ:**
- `DATABASE_URL` หรือ `DIRECT_URL` ผิด
- Supabase Project ถูก pause

**วิธีแก้:**
1. ตรวจสอบ Connection String ใน Supabase
2. Copy Connection String ใหม่
3. อัปเดต Environment Variables ใน Vercel
4. Redeploy

### ❌ Translation Not Working

**สาเหตุ:**
- `GEMINI_API_KEY` ไม่ถูกต้อง
- API Quota เกิน

**วิธีแก้:**
1. ตรวจสอบ API Key ที่ https://makersuite.google.com
2. เช็ค Quota และ Billing
3. อัปเดต Environment Variable
4. Redeploy

### ❌ 404 Not Found

**สาเหตุ:**
- Middleware ไม่ทำงาน
- ไม่มีข้อมูลใน Database

**วิธีแก้:**
1. ตรวจสอบว่ามี Posts ใน Database
2. ดู Function Logs ใน Vercel Dashboard
3. ตรวจสอบ `middleware.ts` ทำงานถูกต้อง

### ❌ Fonts Not Loading

**สาเหตุ:**
- Google Fonts blocked
- Network issue

**วิธีแก้:**
- รอสักครู่แล้วลอง refresh
- Clear browser cache
- ปกติ Vercel จัดการ fonts อัตโนมัติ

---

## Performance Optimization

### 1. Enable Edge Runtime (Optional)

แก้ไข `app/[lang]/posts/[slug]/page.tsx`:

```typescript
export const runtime = 'edge'; // Add this line
```

### 2. Enable ISR (Incremental Static Regeneration)

แก้ไข `app/[lang]/posts/[slug]/page.tsx`:

```typescript
export const revalidate = 3600; // Revalidate every hour
```

### 3. Monitor Performance

1. ไปที่ Vercel Dashboard → **Analytics**
2. ดู:
   - Page Load Time
   - Time to First Byte (TTFB)
   - Core Web Vitals

---

## Security Checklist

- [x] ✅ `.env` ไม่ได้ commit ขึ้น Git
- [x] ✅ Environment Variables ตั้งค่าใน Vercel แล้ว
- [x] ✅ `NEXTAUTH_SECRET` เป็น random string
- [x] ✅ Database password แข็งแรง
- [x] ✅ Gemini API Key ไม่ได้ hardcode ในโค้ด
- [x] ✅ Supabase Row Level Security (RLS) เปิดใช้งาน

---

## Monitoring & Logs

### ดู Logs

1. Vercel Dashboard → เลือก Project
2. คลิกแท็บ **"Logs"**
3. Filter by:
   - Function executions
   - Edge functions
   - Build logs

### ดู Usage

1. Dashboard → **Usage**
2. เช็ค:
   - Bandwidth
   - Function executions
   - Build minutes

---

## Cost Estimation

### Vercel (Hobby Plan - ฟรี)

✅ 100 GB Bandwidth/เดือน  
✅ Unlimited deployments  
✅ Unlimited projects  
✅ SSL certificates (auto)  
✅ Custom domains  

### Supabase (Free Plan)

✅ 500MB Database storage  
✅ 2GB Bandwidth/เดือน  
✅ 50,000 Monthly Active Users  
✅ Unlimited API requests  

### Gemini API

✅ Gemini 2.0 Flash: **ฟรี** ถึง 15 RPM  
💰 เกิน quota: ~$0.001/request  

**ประมาณการ:** ระบบทั้งหมด **ฟรี** สำหรับ traffic ปานกลาง!

---

## Backup & Rollback

### Rollback to Previous Version

1. Vercel Dashboard → **Deployments**
2. เลือก deployment ที่ต้องการ rollback
3. คลิก `...` → **"Promote to Production"**

### Backup Database

Supabase ทำ backup อัตโนมัติทุกวัน

**Manual backup:**
```bash
# Export database
pg_dump "postgresql://postgres.xxx..." > backup_$(date +%Y%m%d).sql

# Restore
psql "postgresql://postgres.xxx..." < backup_20260130.sql
```

---

## Next Steps

หลัง Deploy สำเร็จ:

1. ✅ ทดสอบทุก URL
2. ✅ ทดสอบการแปลภาษา
3. ✅ Submit sitemap ไป Google Search Console
4. ✅ Monitor performance และ logs
5. ✅ เพิ่มคอนเทนต์ใหม่
6. 🎉 แชร์ให้โลกรู้จัก!

---

## 🎊 Congratulations!

เว็บไซต์ของคุณตอนนี้:
- ✅ Deploy บน Vercel
- ✅ รองรับ 11 ภาษา
- ✅ AI Translation พร้อมใช้
- ✅ SEO Optimized
- ✅ Auto scaling
- ✅ HTTPS enabled
- ✅ Global CDN

**URL ตัวอย่าง:**
- https://your-app.vercel.app
- https://your-app.vercel.app/th
- https://your-app.vercel.app/ja/posts/article-slug

🚀 **Happy Publishing!**
