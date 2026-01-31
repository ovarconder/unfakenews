# 🌐 เชื่อมโดเมนกับ Vercel - คู่มือฉบับสมบูรณ์

## สารบัญ

1. [ภาพรวม](#ภาพรวม)
2. [เตรียมโดเมน](#เตรียมโดเมน)
3. [Deploy ไป Vercel](#deploy-ไป-vercel)
4. [เชื่อมโดเมน](#เชื่อมโดเมน)
5. [ตั้งค่า DNS](#ตั้งค่า-dns)
6. [SSL Certificate](#ssl-certificate)
7. [ทดสอบ](#ทดสอบ)
8. [Troubleshooting](#troubleshooting)

---

## ภาพรวม

### สิ่งที่คุณต้องมี:

- ✅ โดเมน (เช่น `unfakenews.com`)
- ✅ Vercel Account (ฟรี)
- ✅ โปรเจค Deploy แล้ว
- ✅ Access ไปยัง DNS settings ของโดเมน

### ระยะเวลา:

- **Setup:** 10-15 นาที
- **DNS Propagation:** 5 นาที - 48 ชั่วโมง (มักจะเร็วกว่า)

---

## เตรียมโดเมน

### ซื้อโดเมนจากที่ไหนดี?

#### 🥇 แนะนำสำหรับคนไทย:

**1. Cloudflare Registrar** (แนะนำที่สุด!)
- 💰 **ราคา:** ราคาต้นทุน (ไม่มี markup)
- 🔒 **SSL:** ฟรีตลอดชีพ
- ⚡ **CDN:** ฟรี, เร็วมาก
- 🛡️ **Security:** DDoS protection
- 📍 **ใช้กับ Vercel:** ง่ายมาก

**ราคาตัวอย่าง:**
- `.com` - ~$10/ปี (~350 บาท)
- `.net` - ~$13/ปี (~450 บาท)
- `.io` - ~$39/ปี (~1,350 บาท)

**2. Namecheap**
- 💰 ราคาถูก
- 🎁 มักมีโปรโมชั่น
- 👍 Interface เข้าใจง่าย

**3. GoDaddy**
- 🌏 ที่รู้จักกันดี
- 💳 รับบัตรไทย
- ⚠️ ราคาแพงกว่า

**4. Hostinger Thailand**
- 🇹🇭 Support ภาษาไทย
- 💳 รับบัตรไทย
- 📞 โทรได้

#### ไม่แนะนำ:
- ❌ โดเมนจาก Hosting ไทยราคาแพง (มักจะ 800-1,500 บาท/ปี สำหรับ .com)

---

## Deploy ไป Vercel

### Step 1: สร้าง Vercel Account

1. ไปที่ https://vercel.com/
2. คลิก **Sign Up**
3. เลือก **Continue with GitHub** (แนะนำ)
4. Authorize Vercel

### Step 2: Import Project

```bash
# ติดตั้ง Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel
```

**หรือใช้ Vercel Dashboard:**

1. คลิก **Add New** → **Project**
2. เลือก Repository: `UnfakeNews`
3. Configure:
   - **Framework Preset:** Next.js
   - **Root Directory:** `./`
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`

4. **Environment Variables:** เพิ่มทั้งหมด

```env
# Database
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."

# Gemini AI
GEMINI_API_KEY="AIza..."

# NextAuth
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="your-secret"

# Google OAuth (ถ้ามี)
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."

# Google Analytics
NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"

# Base URL
NEXT_PUBLIC_BASE_URL="https://yourdomain.com"
```

5. คลิก **Deploy**

### Step 3: รอ Deploy เสร็จ

```
Building... ⏳
✓ Build completed in 2m 34s
✓ Deployment ready
```

คุณจะได้ URL ชั่วคราว:
```
https://unfakenews-abc123.vercel.app
```

---

## เชื่อมโดเมน

### Step 1: เข้าสู่ Project Settings

1. ไปที่ Vercel Dashboard
2. เลือกโปรเจค **UnfakeNews**
3. คลิก **Settings** → **Domains**

### Step 2: เพิ่มโดเมน

1. กรอกโดเมนของคุณ:
   ```
   unfakenews.com
   ```

2. คลิก **Add**

3. Vercel จะแสดง DNS records ที่ต้องตั้งค่า:

```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

**Note:** ถ้าใช้ **Cloudflare** จะง่ายกว่า (ใช้ CNAME ตรง)

---

## ตั้งค่า DNS

### วิธีที่ 1: ใช้ Cloudflare (แนะนำ!)

#### Step 1: เพิ่มโดเมนใน Cloudflare

1. ไปที่ https://dash.cloudflare.com/
2. คลิก **Add a Site**
3. กรอกโดเมน: `unfakenews.com`
4. เลือกแพลน **Free**
5. Cloudflare จะ scan DNS records เดิม

#### Step 2: เปลี่ยน Nameservers

Cloudflare จะให้ nameservers:
```
austin.ns.cloudflare.com
reza.ns.cloudflare.com
```

**ไปที่ Domain Registrar:**
1. เข้า DNS Settings
2. เปลี่ยน Nameservers เป็นของ Cloudflare
3. Save (รอ 5 นาที - 48 ชั่วโมง)

#### Step 3: เพิ่ม DNS Records ใน Cloudflare

เข้า Cloudflare Dashboard → DNS → Records:

**Record 1: Root Domain**
```
Type: CNAME
Name: @
Target: cname.vercel-dns.com
Proxy status: DNS only (🌐 สีเทา)
TTL: Auto
```

**Record 2: WWW Subdomain**
```
Type: CNAME
Name: www
Target: cname.vercel-dns.com
Proxy status: DNS only (🌐 สีเทา)
TTL: Auto
```

**⚠️ สำคัญ:** ต้องเป็น **DNS only** (สีเทา) ไม่ใช่ Proxied (สีส้ม) เพื่อให้ Vercel จัดการ SSL

**Record 3: API Subdomain (Optional)**
```
Type: CNAME
Name: api
Target: cname.vercel-dns.com
Proxy status: DNS only
TTL: Auto
```

#### Step 4: SSL/TLS Settings ใน Cloudflare

1. ไปที่ **SSL/TLS** → **Overview**
2. เลือก: **Full** หรือ **Full (strict)**
3. Save

---

### วิธีที่ 2: ใช้ DNS ของ Registrar โดยตรง

#### Namecheap Example:

1. Login to Namecheap
2. คลิก **Domain List**
3. คลิก **Manage** ข้าง domain
4. ไปที่ **Advanced DNS**

**เพิ่ม Records:**

```
Type: A Record
Host: @
Value: 76.76.21.21
TTL: Automatic
```

```
Type: CNAME Record
Host: www
Value: cname.vercel-dns.com
TTL: Automatic
```

#### GoDaddy Example:

1. Login to GoDaddy
2. คลิก **My Products**
3. คลิก **DNS** ข้าง domain
4. เพิ่ม Records:

```
Type: A
Name: @
Value: 76.76.21.21
TTL: 1 Hour
```

```
Type: CNAME
Name: www
Points to: cname.vercel-dns.com
TTL: 1 Hour
```

---

### วิธีที่ 3: ใช้ Vercel DNS (ง่ายที่สุด!)

#### เปลี่ยน Nameservers เป็นของ Vercel:

Vercel จะให้ nameservers:
```
ns1.vercel-dns.com
ns2.vercel-dns.com
```

**ไปที่ Domain Registrar:**
1. เข้า DNS Settings
2. เปลี่ยน Nameservers
3. Save

**Vercel จะจัดการ DNS ทั้งหมดอัตโนมัติ!**

---

## SSL Certificate

### Auto SSL (Free)

Vercel ออก SSL certificates อัตโนมัติ:

✅ **Let's Encrypt** certificates  
✅ **Auto-renewal** - ต่ออายุอัตโนมัติ  
✅ **Wildcard support** - รองรับ subdomain  
✅ **HTTPS Redirect** - force HTTPS  

### ตรวจสอบ SSL Status

1. ไปที่ Vercel Dashboard
2. Project → **Domains**
3. ดู status:
   ```
   ✓ Valid Configuration
   🔒 SSL Certificate Active
   ```

**ถ้าเห็น:**
```
⚠️ Invalid Configuration
```

**แก้ไข:**
1. ตรวจสอบ DNS records ถูกต้อง
2. รอ DNS propagation (24-48 ชั่วโมง)
3. ลอง Remove แล้ว Add domain ใหม่

---

## ทดสอบ

### 1. ทดสอบ DNS Propagation

```bash
# ตรวจสอบว่า DNS update แล้วหรือยัง
nslookup unfakenews.com

# หรือใช้เว็บ
https://www.whatsmydns.net/
```

**ผลลัพธ์ที่ถูกต้อง:**
```
Name: unfakenews.com
Address: 76.76.21.21
```

### 2. ทดสอบ HTTPS

```bash
curl -I https://unfakenews.com
```

**ผลลัพธ์ที่ถูกต้อง:**
```
HTTP/2 200
server: Vercel
```

### 3. ทดสอบ WWW Redirect

```bash
# ทดสอบว่า www redirect ไป non-www
curl -I https://www.unfakenews.com
```

**ผลลัพธ์ที่ถูกต้อง:**
```
HTTP/2 308
location: https://unfakenews.com/
```

### 4. ทดสอบหน้าเว็บ

เปิดเบราว์เซอร์:
```
https://unfakenews.com
https://www.unfakenews.com
```

✅ ต้องเปิดได้ทั้งคู่  
✅ มี 🔒 (SSL active)  
✅ หน้าเว็บโหลดเร็ว  

---

## Subdomain Setup

### เพิ่ม Subdomain (เช่น `api.unfakenews.com`)

#### ใน Vercel:

1. **Domains** → **Add Domain**
2. กรอก: `api.unfakenews.com`
3. คลิก **Add**

#### ใน DNS (Cloudflare):

```
Type: CNAME
Name: api
Target: cname.vercel-dns.com
Proxy: DNS only
```

#### Example Use Cases:

```
api.unfakenews.com    → API endpoints
admin.unfakenews.com  → Admin dashboard
blog.unfakenews.com   → Blog
cdn.unfakenews.com    → CDN assets
```

---

## WWW vs Non-WWW

### ตั้งค่า Redirect

#### Option 1: Non-WWW (แนะนำ)

```
unfakenews.com         → Primary
www.unfakenews.com     → Redirect to unfakenews.com
```

**ใน Vercel:**
1. เพิ่มทั้งสอง domain
2. ตั้ง `unfakenews.com` เป็น **Primary**
3. `www.unfakenews.com` จะ redirect อัตโนมัติ

#### Option 2: WWW

```
www.unfakenews.com     → Primary
unfakenews.com         → Redirect to www.unfakenews.com
```

---

## Environment Variables Update

### อัปเดต URLs หลัง Deploy

```env
# Production URLs
NEXTAUTH_URL="https://unfakenews.com"
NEXT_PUBLIC_BASE_URL="https://unfakenews.com"

# Google OAuth Redirect URI
# Update in Google Cloud Console:
https://unfakenews.com/api/auth/callback/google
```

**Update ใน Vercel:**
1. **Settings** → **Environment Variables**
2. แก้ไข `NEXTAUTH_URL`
3. แก้ไข `NEXT_PUBLIC_BASE_URL`
4. **Save**
5. **Redeploy** (คลิก Deployments → ... → Redeploy)

---

## Performance Optimization

### 1. Enable Vercel Analytics

```bash
npm install @vercel/analytics
```

```typescript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### 2. Enable Speed Insights

```bash
npm install @vercel/speed-insights
```

```typescript
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
```

### 3. Set up Edge Caching

```typescript
// next.config.js
module.exports = {
  headers: async () => [
    {
      source: '/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=3600, s-maxage=86400',
        },
      ],
    },
  ],
};
```

---

## Troubleshooting

### ❌ Problem 1: DNS Not Propagating

**Symptoms:**
- Domain ยังไม่ชี้ไปที่ Vercel
- "Not Found" error

**Solutions:**
1. รอ 24-48 ชั่วโมง
2. ล้าง DNS cache:
   ```bash
   # Mac
   sudo dscacheutil -flushcache
   
   # Windows
   ipconfig /flushdns
   
   # Linux
   sudo systemd-resolve --flush-caches
   ```
3. ใช้ DNS checker: https://www.whatsmydns.net/

### ❌ Problem 2: SSL Certificate Error

**Symptoms:**
- "Your connection is not private"
- "NET::ERR_CERT_AUTHORITY_INVALID"

**Solutions:**
1. รอ SSL ออกให้ (5-15 นาที)
2. ตรวจสอบ DNS ชี้ถูกแล้ว
3. ลบแล้วเพิ่ม domain ใหม่
4. ถ้าใช้ Cloudflare: เปลี่ยนเป็น **DNS only**

### ❌ Problem 3: Redirect Loop

**Symptoms:**
- หน้าเว็บ redirect วนไปวนมา
- "ERR_TOO_MANY_REDIRECTS"

**Solutions:**
1. ตรวจสอบ Cloudflare SSL setting: ต้องเป็น **Full** หรือ **Full (strict)**
2. ปิด Cloudflare Proxy (ใช้ DNS only)
3. ตรวจสอบ redirect rules ใน Vercel

### ❌ Problem 4: 404 on Subpaths

**Symptoms:**
- `/th/posts/slug` → 404
- รีเฟรชหน้าแล้วหาย

**Solutions:**
```json
// vercel.json
{
  "rewrites": [
    {
      "source": "/:path*",
      "destination": "/"
    }
  ]
}
```

### ❌ Problem 5: Slow Loading

**Solutions:**
1. Enable Vercel Edge Network
2. Optimize images
3. Enable caching
4. ใช้ Cloudflare CDN

---

## Security Best Practices

### 1. HTTPS Only

```json
// vercel.json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Strict-Transport-Security",
          "value": "max-age=31536000; includeSubDomains"
        }
      ]
    }
  ]
}
```

### 2. Security Headers

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        }
      ]
    }
  ]
}
```

### 3. Environment Variables

- ❌ ห้าม commit secrets ลง Git
- ✅ ใช้ Vercel Environment Variables
- ✅ แยก Production vs Preview

---

## Checklist

### ก่อน Deploy:

- [ ] ซื้อโดเมนแล้ว
- [ ] มี Vercel account
- [ ] Environment variables พร้อม
- [ ] Database setup เรียบร้อย
- [ ] Test locally ผ่าน

### Deploy:

- [ ] Import project to Vercel
- [ ] Configure build settings
- [ ] เพิ่ม environment variables
- [ ] Deploy สำเร็จ
- [ ] ทดสอบ Preview URL

### Domain Setup:

- [ ] เพิ่ม domain ใน Vercel
- [ ] ตั้งค่า DNS records
- [ ] รอ DNS propagation
- [ ] ตรวจสอบ SSL active
- [ ] ทดสอบ HTTPS

### Post-Deploy:

- [ ] Update OAuth redirect URIs
- [ ] Update NEXTAUTH_URL
- [ ] Update NEXT_PUBLIC_BASE_URL
- [ ] Redeploy
- [ ] ทดสอบ login
- [ ] ทดสอบ Google Analytics
- [ ] ตรวจสอบ Performance

---

## คำนวณค่าใช้จ่าย

### Vercel Pricing:

**Hobby (Free):**
- ✅ Unlimited deployments
- ✅ SSL certificates
- ✅ 100GB bandwidth/month
- ✅ Automatic scaling
- ❌ 1 team member only

**Pro ($20/month):**
- ✅ ทุกอย่างของ Hobby
- ✅ 1TB bandwidth/month
- ✅ Team collaboration
- ✅ Password protection
- ✅ Advanced analytics

**สำหรับโปรเจคนี้:**
- **Hobby plan** พอเริ่มต้น
- Upgrade เมื่อ traffic > 100GB/month

### Domain Cost:

- `.com` - ~350 บาท/ปี (Cloudflare)
- `.io` - ~1,350 บาท/ปี
- `.co` - ~1,100 บาท/ปี

### Total Cost (ปีแรก):

```
โดเมน .com:     350 บาท
Vercel Hobby:   ฟรี
Supabase Free:  ฟรี
Gemini Free:    ฟรี
─────────────────────────
รวม:            350 บาท/ปี
                (< 30 บาท/เดือน)
```

---

## 🎉 Summary

### Quick Steps:

```bash
# 1. Deploy to Vercel
vercel

# 2. เพิ่ม domain ใน Vercel
# Dashboard → Domains → Add

# 3. ตั้งค่า DNS
# Cloudflare → DNS → Add CNAME

# 4. รอ propagation (24-48 ชั่วโมง)

# 5. Update environment variables

# 6. Redeploy

# 7. ทดสอบ
https://yourdomain.com ✅
```

### คุณจะได้:

✅ **โดเมนของคุณเอง** - `unfakenews.com`  
✅ **HTTPS/SSL ฟรี** - 🔒 Secure  
✅ **CDN Global** - โหลดเร็วทั่วโลก  
✅ **Auto-scaling** - รองรับ traffic สูง  
✅ **Zero downtime** - ไม่มี downtime  
✅ **Git Integration** - Push แล้ว deploy อัตโนมัติ  

---

## 📚 Resources

- [Vercel Domains Docs](https://vercel.com/docs/concepts/projects/domains)
- [Cloudflare Setup Guide](https://developers.cloudflare.com/fundamentals/get-started/)
- [DNS Checker](https://www.whatsmydns.net/)
- [SSL Test](https://www.ssllabs.com/ssltest/)

---

**พร้อมเชื่อมโดเมนแล้ว!** 🚀

มีคำถามเพิ่มเติมถามได้เลยครับ! 😊
