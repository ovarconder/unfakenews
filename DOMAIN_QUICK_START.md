# 🚀 Quick Domain Setup - ฉบับย่อ

## ขั้นตอนเร็ว (15 นาที)

### 1. Deploy to Vercel

```bash
# ติดตั้ง Vercel CLI
npm install -g vercel

# Deploy
vercel
```

หรือใช้ Dashboard:
1. https://vercel.com/new
2. Import `UnfakeNews` repo
3. เพิ่ม Environment Variables
4. Deploy

### 2. เพิ่มโดเมนใน Vercel

1. Vercel Dashboard → Project → **Settings** → **Domains**
2. กรอกโดเมน: `unfakenews.com`
3. คลิก **Add**

### 3. ตั้งค่า DNS

#### ถ้าใช้ Cloudflare (แนะนำ):

```
Type: CNAME
Name: @
Target: cname.vercel-dns.com
Proxy: DNS only (สีเทา)
```

```
Type: CNAME
Name: www
Target: cname.vercel-dns.com
Proxy: DNS only (สีเทา)
```

#### ถ้าใช้ Registrar อื่น:

```
Type: A
Host: @
Value: 76.76.21.21
```

```
Type: CNAME
Host: www
Value: cname.vercel-dns.com
```

### 4. Update Environment Variables

```env
NEXTAUTH_URL="https://unfakenews.com"
NEXT_PUBLIC_BASE_URL="https://unfakenews.com"
```

Vercel → Settings → Environment Variables → Save → **Redeploy**

### 5. รอและทดสอบ

```bash
# รอ DNS propagation (5-15 นาที)
# ทดสอบ
https://unfakenews.com
```

---

## Troubleshooting เร็ว

### DNS ยังไม่ชี้:
```bash
nslookup unfakenews.com
# รอ 24-48 ชั่วโมง
```

### SSL Error:
- รอ 5-15 นาที
- ถ้าใช้ Cloudflare: เปลี่ยนเป็น **DNS only** (ไม่ใช่ Proxied)

### 404 Error:
- ตรวจสอบ `vercel.json` มี rewrites
- Redeploy

---

## คำแนะนำโดเมน

### ซื้อโดเมนที่ไหน?

**🥇 Cloudflare** (แนะนำที่สุด)
- ราคาต้นทุน ~$10/ปี (~350 บาท)
- SSL ฟรี
- CDN ฟรี
- ใช้กับ Vercel ง่าย

**🥈 Namecheap**
- ราคาถูก
- มักมีโปร

**🥉 GoDaddy**
- รู้จักกันดี
- รับบัตรไทย

---

## ค่าใช้จ่าย

```
โดเมน .com (Cloudflare):  ~350 บาท/ปี
Vercel Hobby Plan:         ฟรี
SSL Certificate:           ฟรี (auto)
CDN:                       ฟรี
───────────────────────────────────────
รวม:                       350 บาท/ปี
                          (< 30 บาท/เดือน)
```

---

## Checklist

- [ ] Deploy to Vercel สำเร็จ
- [ ] เพิ่มโดเมนใน Vercel
- [ ] ตั้งค่า DNS records
- [ ] Update environment variables
- [ ] Redeploy
- [ ] ทดสอบ HTTPS

---

**พร้อมใช้งาน!** 🎉

อ่านคู่มือเต็มที่: `VERCEL_DOMAIN_SETUP.md`
