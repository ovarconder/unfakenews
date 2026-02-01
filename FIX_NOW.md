# 🚨 แก้ Login Error - ทำตอนนี้เลย!

## ปัญหา: MaxClientsInSessionMode

Error ยังอยู่เพราะ **ยังไม่ได้เปลี่ยน DATABASE_URL** ให้ใช้ Transaction mode

---

## ✅ วิธีแก้ (ใช้เวลา 30 วินาที):

### ขั้นที่ 1: เปิดไฟล์ `.env.local`

```bash
# ถ้ามีไฟล์แล้ว
code .env.local

# ถ้ายังไม่มี ให้คัดลอกจาก .env
cp .env .env.local
code .env.local
```

### ขั้นที่ 2: หา DATABASE_URL

ในไฟล์จะมีบรรทัดนี้:

```env
DATABASE_URL="postgresql://postgres.xxxxx:[PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres"
```

### ขั้นที่ 3: เปลี่ยน 2 อย่าง

**เปลี่ยนจาก:**
```env
DATABASE_URL="postgresql://...supabase.com:5432/postgres"
```

**เป็น:**
```env
DATABASE_URL="postgresql://...supabase.com:6543/postgres?pgbouncer=true"
```

**สิ่งที่เปลี่ยน:**
1. Port: `5432` → `6543`
2. เพิ่ม: `?pgbouncer=true` ท้าย URL

### ขั้นที่ 4: Save และ Restart

1. บันทึกไฟล์ (Ctrl+S / Cmd+S)
2. ไปที่ terminal
3. กด Ctrl+C (หยุด dev server)
4. รันใหม่: `npm run dev`

---

## 📋 ตัวอย่างก่อน-หลัง

### ❌ BEFORE (จะ error):
```env
DATABASE_URL="postgresql://postgres.abc123:mypassword@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres"
```

### ✅ AFTER (ไม่ error):
```env
DATABASE_URL="postgresql://postgres.abc123:mypassword@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
```

**สังเกต:**
- `5432` → `6543`
- เพิ่ม `?pgbouncer=true`

---

## 🔍 ตรวจสอบว่าแก้ถูกต้อง

URL ต้องมี:
- ✅ Port `6543` (ไม่ใช่ 5432)
- ✅ มี `?pgbouncer=true` ท้าย URL
- ✅ Password ถูกต้อง

---

## 🎯 ทำเสร็จแล้วให้:

1. ✅ Restart dev server: `npm run dev`
2. ✅ เปิดเว็บ: https://www.unfakenews.asia
3. ✅ ทดสอบ login ใหม่

---

## ⚠️ หมายเหตุ

ถ้าใช้ Vercel หรือ hosting อื่น:
- ต้องเปลี่ยน Environment Variable ใน hosting ด้วย
- ไม่ใช่แค่ local

---

## 🐛 ถ้ายังไม่ได้

1. **เช็ค URL:**
   ```bash
   cat .env.local | grep DATABASE_URL
   ```
   ต้องเห็น port `6543` และ `?pgbouncer=true`

2. **Kill process:**
   ```bash
   killall node
   npm run dev
   ```

3. **Clear cache:**
   ```bash
   rm -rf .next
   npm run dev
   ```

---

🎉 **เสร็จแล้ว!** แค่เปลี่ยน port และเพิ่ม parameter ก็แก้ได้แล้วครับ
