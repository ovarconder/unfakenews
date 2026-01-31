# 🔧 Debug: INVALID_REQUEST_METHOD Error

## ปัญหา
```
INVALID_REQUEST_METHOD: This Request was not made with an accepted method
```

## สาเหตุที่เป็นไปได้

### 1. Middleware ยัง intercept `/api/auth/*`
✅ **แก้แล้ว** - อัพเดท matcher ใน middleware.ts

### 2. Vercel Edge Config หรือ Rewrites
อาจมี config ใน `vercel.json` ที่ conflict

### 3. NextAuth Route Handler ไม่ export GET/POST
✅ **ตรวจสอบแล้ว** - route.ts export ครบ

---

## 🧪 วิธีทดสอบ

### Test 1: ทดสอบ NextAuth API endpoint
เปิด browser console แล้วรัน:

```javascript
// Test GET request
fetch('/api/auth/providers')
  .then(r => r.json())
  .then(d => console.log('Providers:', d))
  .catch(e => console.error('Error:', e));

// หรือเปิดใน browser tab ใหม่:
// https://yourdomain.com/api/auth/providers
```

**ผลลัพธ์ที่คาดหวัง:**
```json
{
  "google": {
    "id": "google",
    "name": "Google",
    "type": "oauth",
    "signinUrl": "...",
    "callbackUrl": "..."
  }
}
```

**ถ้าเจอ error:**
- `INVALID_REQUEST_METHOD` = middleware ยัง block อยู่
- `404` = route ไม่เจอ
- `Configuration error` = env variables ผิด

---

### Test 2: ทดสอบ signin endpoint

```javascript
// เปิด DevTools Console
fetch('/api/auth/signin/google', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
})
  .then(r => r.json())
  .then(d => console.log('Response:', d))
  .catch(e => console.error('Error:', e));
```

---

### Test 3: เช็ค Vercel logs แบบละเอียด

1. **ไปที่ Vercel Dashboard:**
   ```
   https://vercel.com/[account]/[project]/logs
   ```

2. **กด Filter → Show:**
   - All logs
   - Errors only
   - Edge logs

3. **ดูรายละเอียด:**
   - HTTP method ที่ส่งมา (GET/POST)
   - Path ที่ request ไป
   - Response status code
   - Error message เต็ม

---

## 🔍 Possible Solutions

### Solution 1: ตรวจสอบ vercel.json
ถ้ามีไฟล์ `vercel.json` อาจมี config ที่ conflict:

```json
{
  "rewrites": [
    // ถ้ามี rewrite ที่ redirect /api/auth/* ให้ลบออก
  ]
}
```

### Solution 2: ตรวจสอบ next.config.js
อาจมี rewrites หรือ redirects ��ี่ conflict:

```javascript
// next.config.js
module.exports = {
  async rewrites() {
    return [
      // ตรวจสอบว่าไม่มี rewrite สำหรับ /api/auth/*
    ]
  }
}
```

### Solution 3: Clear Vercel Build Cache
```bash
# ใน Vercel Dashboard
Settings → General → Clear Build Cache
# แล้ว Redeploy
```

### Solution 4: ลอง Disable Middleware ชั่วคราว
แก้ไข `middleware.ts`:

```typescript
export const config = {
  matcher: [
    // Disable ทั้งหมดชั่วคราวเพื่อทดสอบ
    "/_test_disabled_*",
  ],
};
```

ถ้า Google Sign In ใช้งานได้ = ปัญหาอยู่ที่ middleware
ถ้ายังไม่ได้ = ปัญหาอยู่ที่อื่น

---

## 🚨 Emergency Fix: ย้าย signin page ไปใช้ [lang] route

ถ้าแก้ไม่ได้ ลองใช้ signin page ที่มี [lang]:

1. **แก้ auth-options.ts:**
```typescript
pages: {
  signIn: "/th/auth/signin", // เปลี่ยนจาก /auth/signin
  error: "/auth/error",
},
```

2. **ใช้ page ที่ `/app/[lang]/auth/signin/page.tsx`** (มีอยู่แล้ว)

3. **Redeploy**

---

## 📋 Quick Checklist

- [ ] Middleware matcher ไม่ match `/api/auth/*`
- [ ] Route handler export GET และ POST
- [ ] ไม่มี `vercel.json` ที่ conflict
- [ ] ไม่มี `next.config.js` rewrites ที่ conflict
- [ ] Environment variables ครบ (GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, NEXTAUTH_URL, NEXTAUTH_SECRET)
- [ ] Google OAuth redirect URI ถูกต้อง
- [ ] Clear Vercel build cache แล้ว redeploy

---

## 💡 ข้อมูลเพิ่มเติมที่ต้องการ

กรุณาส่งข้อมูลเหล่านี้:

1. **Full error log จาก Vercel:**
   - รวมถึง timestamp, path, method, headers

2. **ผลลัพธ์จาก test:**
   ```
   https://yourdomain.com/api/auth/providers
   ```

3. **มี `vercel.json` หรือไม่?**
   - ถ้ามี ส่ง content มาด้วย

4. **มี rewrites ใน `next.config.js` หรือไม่?**

---

## 🎯 Next Steps

1. ลอง **test endpoint** `/api/auth/providers` ก่อน
2. ดู **full Vercel logs** 
3. ตรวจสอบ **vercel.json** และ **next.config.js**
4. ถ้ายังไม่ได้ลอง **disable middleware** ชั่วคราว

ส่งผลลัพธ์มาแล้วผมจะช่วยแก้ต่อครับ!
