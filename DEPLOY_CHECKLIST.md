# ✅ Deploy Checklist - UnfakeNews

## 📋 ก่อน Deploy

### 1. ตรวจสอบ Local

```bash
# Build ทดสอบ
npm run build

# รันทดสอบ
npm run dev

# เปิดในเบราว์เซอร์
open http://localhost:3000/en
open http://localhost:3000/th/posts/global-tech-summit-ai-platform
```

- [ ] Build สำเร็จไม่มี error
- [ ] หน้าเว็บแสดงผลถูกต้อง
- [ ] การแปลภาษาทำงาน
- [ ] Database เชื่อมต่อได้
- [ ] มีข้อมูลตัวอย่างใน Database

### 2. ตรวจสอบ Environment Variables

- [ ] `DATABASE_URL` - Supabase Connection Pooling
- [ ] `DIRECT_URL` - Supabase Direct Connection
- [ ] `GEMINI_API_KEY` - Google Gemini API
- [ ] `NEXTAUTH_SECRET` - Generate ด้วย `openssl rand -base64 32`
- [ ] `NEXT_PUBLIC_BASE_URL` - จะเป็น Vercel URL หลัง deploy

### 3. ตรวจสอบ Git

```bash
# ตรวจสอบ .gitignore
cat .gitignore

# ต้องมีบรรทัดเหล่านี้:
# .env
# .env.local
# .env*.local
```

- [ ] ไฟล์ `.env` ไม่ได้อยู่ใน Git
- [ ] ไม่มี secrets ใน code
- [ ] Code พร้อม push

---

## 🚀 Deploy ขั้นตอน

### 1. Push to GitHub

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

- [ ] Code push ขึ้น GitHub สำเร็จ

### 2. เชื่อมต่อกับ Vercel

1. ไป https://vercel.com
2. Login with GitHub
3. "Add New Project"
4. Select Repository: **unfakenews**
5. Import

- [ ] Import Project สำเร็จ

### 3. ตั้งค่า Environment Variables

ใน Vercel Dashboard → Environment Variables:

**ต้องเพิ่มทั้งหมด 6 ตัว:**

```
DATABASE_URL="postgresql://postgres.xxx:pass@xxx.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.xxx:pass@xxx.supabase.com:5432/postgres"
GEMINI_API_KEY="AIzaSy..."
NEXTAUTH_URL="https://your-app.vercel.app"
NEXTAUTH_SECRET="random_secret_here"
NEXT_PUBLIC_BASE_URL="https://your-app.vercel.app"
```

**Environment:** เลือก `Production`, `Preview`, `Development` ทั้งหมด

- [ ] DATABASE_URL ✅
- [ ] DIRECT_URL ✅
- [ ] GEMINI_API_KEY ✅
- [ ] NEXTAUTH_URL ✅
- [ ] NEXTAUTH_SECRET ✅
- [ ] NEXT_PUBLIC_BASE_URL ✅

### 4. Deploy!

- [ ] คลิก "Deploy"
- [ ] รอ 2-3 นาที
- [ ] Deploy สำเร็จ! 🎉

---

## 🧪 หลัง Deploy

### 1. ทดสอบ URL

แทนที่ `your-app` ด้วย domain จริง:

```
✅ https://your-app.vercel.app/en
✅ https://your-app.vercel.app/th
✅ https://your-app.vercel.app/ja
✅ https://your-app.vercel.app/en/posts/global-tech-summit-ai-platform
✅ https://your-app.vercel.app/th/posts/global-tech-summit-ai-platform
✅ https://your-app.vercel.app/sitemap.xml
✅ https://your-app.vercel.app/robots.txt
```

- [ ] หน้าแรกแสดงผล
- [ ] สลับภาษาได้
- [ ] บทความแสดงผล
- [ ] AI แปลภาษาทำงาน
- [ ] Sitemap มีข้อมูล
- [ ] Robots.txt แสดงผล

### 2. อัปเดต URLs

กลับไปที่ Vercel → Settings → Environment Variables:

**แก้ไข 2 ตัวนี้:**
- `NEXTAUTH_URL` → เปลี่ยนเป็น URL จริง
- `NEXT_PUBLIC_BASE_URL` → เปลี่ยนเป็น URL จริง

**Redeploy:**
Settings → Deployments → ... → Redeploy

- [ ] URLs updated
- [ ] Redeployed

### 3. ทดสอบฟีเจอร์

- [ ] สร้าง Post ใหม่ใน Prisma Studio
- [ ] เปิดดูใน production
- [ ] ทดสอบการแปลภาษาใหม่
- [ ] ตรวจสอบ SEO metadata
- [ ] ทดสอบ Language Switcher

---

## 📊 SEO Setup

### 1. Google Search Console

1. ไป https://search.google.com/search-console
2. Add property: `https://your-app.vercel.app`
3. Verify ownership
4. Submit sitemap: `https://your-app.vercel.app/sitemap.xml`

- [ ] Property added
- [ ] Ownership verified
- [ ] Sitemap submitted

### 2. ตรวจสอบ Hreflang Tags

เปิด View Source:

```html
<link rel="alternate" hreflang="th" href="..." />
<link rel="alternate" hreflang="en" href="..." />
<link rel="alternate" hreflang="ja" href="..." />
<!-- ... 11 ภาษา -->
<link rel="alternate" hreflang="x-default" href="..." />
```

- [ ] Hreflang tags มีครบ 11 ภาษา
- [ ] มี x-default

---

## 🔧 Troubleshooting

### Build Failed?

```bash
# ตรวจสอบ logs ใน Vercel Dashboard
# แก้ไขแล้วรัน:
git add .
git commit -m "Fix build error"
git push
```

### Database Connection Error?

- ตรวจสอบ DATABASE_URL ใน Vercel
- ตรวจสอบ Supabase Project ไม่ pause
- Copy Connection String ใหม่

### Translation Not Working?

- ตรวจสอบ GEMINI_API_KEY
- เช็ค API quota ที่ Google AI Studio
- ดู Function Logs ใน Vercel

---

## 📱 Custom Domain (Optional)

### 1. Add Domain

Vercel → Settings → Domains → Add

- [ ] Domain added
- [ ] DNS configured
- [ ] SSL certificate issued

### 2. Update Environment Variables

```
NEXTAUTH_URL="https://yourdomain.com"
NEXT_PUBLIC_BASE_URL="https://yourdomain.com"
```

- [ ] Variables updated
- [ ] Redeployed

---

## 🎯 Performance Check

### Vercel Analytics

Dashboard → Analytics → ตรวจสอบ:

- [ ] Page Load Time < 2s
- [ ] TTFB < 600ms
- [ ] Core Web Vitals ผ่าน

### Lighthouse Score

เปิด Chrome DevTools → Lighthouse:

- [ ] Performance > 90
- [ ] Accessibility > 90
- [ ] Best Practices > 90
- [ ] SEO > 90

---

## 🔒 Security Check

- [x] .env ไม่อยู่ใน Git
- [x] API Keys ไม่ hardcode
- [x] NEXTAUTH_SECRET เป็น random
- [x] Database password แข็งแรง
- [x] HTTPS enabled (auto by Vercel)
- [x] Security headers configured

---

## 📈 Monitoring

### Daily

- [ ] เช็ค Vercel Dashboard
- [ ] ดู Function Logs
- [ ] Monitor error rate

### Weekly

- [ ] ตรวจสอบ bandwidth usage
- [ ] ดู Google Search Console
- [ ] Review translation quality
- [ ] Check Gemini API usage

---

## ✨ Launch Checklist

### Content

- [ ] มีบทความอย่างน้อย 5 บทความ
- [ ] แต่ละบทความมี featured image
- [ ] SEO metadata ครบถ้วน

### Social Media

- [ ] เตรียม OG images
- [ ] ทดสอบ Facebook share
- [ ] ทดสอบ Twitter card

### Marketing

- [ ] เขียน blog post ประกาศ launch
- [ ] เตรียม social media posts
- [ ] แจ้ง mailing list (ถ้ามี)

---

## 🎊 All Done!

เมื่อทุกอย่างเสร็จสมบูรณ์:

- ✅ Site deployed on Vercel
- ✅ 11 languages working
- ✅ AI translation active
- ✅ SEO optimized
- ✅ Sitemap submitted
- ✅ SSL enabled
- ✅ Global CDN
- ✅ Auto scaling

**🚀 Ready to go live!**

---

## 📞 Need Help?

- **Vercel Docs:** https://vercel.com/docs
- **Supabase Docs:** https://supabase.com/docs
- **Next.js Docs:** https://nextjs.org/docs
- **Prisma Docs:** https://www.prisma.io/docs

---

## 📝 Post-Launch

### Week 1
- Monitor errors และ logs
- Fix bugs ที่พบ
- เพิ่มคอนเทนต์

### Month 1
- Analyze traffic
- Optimize performance
- Improve SEO

### Ongoing
- Regular content updates
- Monitor costs
- Scale as needed

**Happy Publishing! 🎉**
