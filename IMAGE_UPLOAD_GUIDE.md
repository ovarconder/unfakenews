# 📸 Image Upload Solutions for UnfakeNews

## ปัญหา: อัพโหลดรูปไปที่ไหนดี?

คำตอบ: มี 3 วิธีหลักๆ ที่แนะนำ

---

## 🥇 วิธีที่ 1: Supabase Storage (แนะนำ!)

### ทำไมต้อง Supabase?
✅ **ฟรี 1GB** storage  
✅ **รวมกับ Database** - จัดการที่เดียว  
✅ **CDN Built-in** - โหลดเร็ว  
✅ **Secure** - Authentication & Authorization  
✅ **Easy API** - Client library พร้อมใช้  

### Setup Supabase Storage

#### 1. สร้าง Bucket

1. ไปที่ Supabase Dashboard
2. คลิก **Storage** (เมนูซ้าย)
3. คลิก **"New bucket"**
4. ตั้งชื่อ: `post-images`
5. เลือก **Public** (ถ้าต้องการให้เข้าถึงได้โดยไม่ต้อง auth)
6. คลิก **"Create bucket"**

#### 2. ติดตั้ง Supabase Client

```bash
npm install @supabase/supabase-js
```

#### 3. สร้าง Supabase Client

```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

#### 4. Image Upload Component

```typescript
// components/admin/image-uploader.tsx
"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Upload, Loader2 } from "lucide-react";

export function ImageUploader({ onUpload }: { onUpload: (url: string) => void }) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // ตรวจสอบขนาด (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("⚠️ ไฟล์ใหญ่เกิน 5MB");
      return;
    }

    // ตรวจสอบประเภท
    if (!file.type.startsWith("image/")) {
      alert("⚠️ อัพโหลดได้เฉพาะรูปภาพ");
      return;
    }

    setUploading(true);

    try {
      // สร้างชื่อไฟล์ unique
      const fileExt = file.name.split(".").pop();
      const fileName = \`\${Date.now()}-\${Math.random().toString(36).substring(7)}.\${fileExt}\`;
      const filePath = \`posts/\${fileName}\`;

      // Upload to Supabase
      const { data, error } = await supabase.storage
        .from("post-images")
        .upload(filePath, file);

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from("post-images")
        .getPublicUrl(filePath);

      onUpload(publicUrl);
      alert("✅ อัพโหลดสำเร็จ!");
    } catch (error) {
      console.error("Upload error:", error);
      alert("❌ อัพโหลดล้มเหลว: " + (error instanceof Error ? error.message : "Unknown error"));
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={handleUpload}
        disabled={uploading}
        className="hidden"
        id="image-upload"
      />
      <label htmlFor="image-upload">
        <Button
          type="button"
          variant="outline"
          disabled={uploading}
          className="cursor-pointer"
          asChild
        >
          <span>
            {uploading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                กำลังอัพโหลด...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                อัพโหลดรูปภาพ
              </>
            )}
          </span>
        </Button>
      </label>
    </div>
  );
}
```

#### 5. เพิ่ม Environment Variables

```env
# .env
NEXT_PUBLIC_SUPABASE_URL="https://xxxxxxxxxxxxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

หา URL และ Key ได้ที่:
Supabase Dashboard → Settings → API

---

## 🥈 วิธีที่ 2: Cloudinary (ยอดนิยม)

### ทำไมต้อง Cloudinary?
✅ **ฟรี 25GB** bandwidth/เดือน  
✅ **Image Optimization** อัตโนมัติ  
✅ **Transformation API** - Resize, crop, filter  
✅ **Fast CDN** - โหลดเร็วทั่วโลก  

### Setup Cloudinary

#### 1. สร้างบัญชี

1. ไปที่ https://cloudinary.com/
2. สมัครฟรี
3. ไปที่ Dashboard
4. คัดลอก:
   - Cloud Name
   - API Key
   - API Secret

#### 2. ติดตั้ง Package

```bash
npm install cloudinary next-cloudinary
```

#### 3. Configure Cloudinary

```typescript
// lib/cloudinary.ts
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export { cloudinary };
```

#### 4. Upload API Route

```typescript
// app/api/admin/upload-image/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cloudinary } from "@/lib/cloudinary";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file" }, { status: 400 });
    }

    // Convert to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString("base64");
    const dataURI = \`data:\${file.type};base64,\${base64}\`;

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: "unfakenews/posts",
      resource_type: "image",
    });

    return NextResponse.json({
      url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload failed" },
      { status: 500 }
    );
  }
}
```

---

## 🥉 วิธีที่ 3: Unsplash (สำหรับ Stock Images)

### ทำไมต้อง Unsplash?
✅ **ฟรี 100%** - ไม่เสียค่าใช้จ่าย  
✅ **High Quality** - รูปสวยระดับมืออาชีพ  
✅ **License Free** - ใช้เชิงพาณิชย์ได้  
✅ **API Available** - Search & integrate  

### วิธีใช้ (แบบง่าย):

1. ไปที่ https://unsplash.com
2. ค้นหารูปที่ต้องการ
3. คลิกขวา → Copy Image Address
4. วางใน Image URL field

**ตัวอย่าง URL:**
```
https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=800&fit=crop
```

### Unsplash API (Advanced):

```bash
npm install unsplash-js
```

```typescript
// lib/unsplash.ts
import { createApi } from 'unsplash-js';

export const unsplash = createApi({
  accessKey: process.env.UNSPLASH_ACCESS_KEY!,
});
```

---

## 📊 เปรียบเทียบ

| คุณสมบัติ | Supabase | Cloudinary | Unsplash |
|-----------|----------|------------|----------|
| **Storage ฟรี** | 1GB | 25GB bandwidth | ไม่จำกัด |
| **Upload เอง** | ✅ | ✅ | ❌ |
| **Image Transform** | ❌ | ✅✅✅ | ❌ |
| **CDN** | ✅ | ✅✅✅ | ✅ |
| **ง่ายต่อการใช้** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **รูปหาย?** | ไม่ (ควบคุมเอง) | ไม่ (ควบคุมเอง) | ไม่ (public CDN) |

---

## 🎯 คำแนะนำ

### สำหรับ Development:
✅ **Unsplash** - ใช้รูป stock สวยๆ ฟรี

### สำหรับ Production:
✅ **Supabase Storage** - ถ้าใช้ Supabase database อยู่แล้ว  
✅ **Cloudinary** - ถ้าต้องการ image optimization

### Hybrid Approach (ที่ดีที่สุด):
1. **Supabase Storage** - สำหรับรูปที่ upload เอง
2. **Unsplash** - สำหรับรูป stock
3. **Cloudinary** - สำหรับรูปที่ต้อง transform

---

## 🔒 Security Best Practices

### 1. Validate File Type

```typescript
const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
if (!allowedTypes.includes(file.type)) {
  throw new Error('Invalid file type');
}
```

### 2. Limit File Size

```typescript
const MAX_SIZE = 5 * 1024 * 1024; // 5MB
if (file.size > MAX_SIZE) {
  throw new Error('File too large');
}
```

### 3. Generate Unique Filenames

```typescript
const fileName = \`\${Date.now()}-\${crypto.randomUUID()}.\${ext}\`;
```

### 4. Scan for Malware (Optional)

ใช้ service เช่น:
- VirusTotal API
- ClamAV

---

## 💡 เคล็ดลับ

### 1. Optimize Images ก่อน Upload

```bash
npm install sharp
```

```typescript
import sharp from 'sharp';

const optimized = await sharp(buffer)
  .resize(1200, 800, { fit: 'cover' })
  .webp({ quality: 80 })
  .toBuffer();
```

### 2. Lazy Loading

```tsx
<img 
  src={imageUrl} 
  alt="..." 
  loading="lazy" 
  decoding="async"
/>
```

### 3. Next.js Image Component

```tsx
import Image from 'next/image';

<Image
  src={imageUrl}
  width={1200}
  height={800}
  alt="..."
  priority={false}
/>
```

---

## 🆘 FAQ

### Q: รูปจะหายไหม?

**A:** ขึ้นอยู่กับที่เก็บ:
- **Supabase/Cloudinary**: ไม่หาย (จนกว่าจะลบเอง)
- **Unsplash**: ไม่หาย (public CDN)
- **Vercel**: อย่าเก็บใน public folder จะหายตอน redeploy

### Q: Bandwidth เกินจะเกิดอะไร?

**A:**
- **Supabase Free**: 2GB/เดือน → เกินต้อง upgrade
- **Cloudinary Free**: 25GB/เดือน → เกินถูก throttle
- **Unsplash**: ไม่จำกัด (แต่มี rate limit 50 requests/hour)

### Q: SEO ดีไหม?

**A:** ทุกวิธีดีถ้า:
- ใส่ alt text
- ใช้ descriptive filename
- Optimize image size
- Lazy loading

---

## 🚀 Next Steps

1. **เลือกวิธี** ที่เหมาะกับโปรเจค
2. **Setup** ตาม guide ข้างบน
3. **Test** upload ดู
4. **Integrate** เข้า Admin panel
5. **Monitor** usage และ costs

---

## 📚 Resources

- [Supabase Storage Docs](https://supabase.com/docs/guides/storage)
- [Cloudinary Docs](https://cloudinary.com/documentation)
- [Unsplash API](https://unsplash.com/developers)
- [Next.js Image Optimization](https://nextjs.org/docs/basic-features/image-optimization)

---

**แนะนำเริ่มจาก Supabase Storage ก่อน** เพราะใช้ database อยู่แล้ว จัดการง่าย ฟรี และไม่ต้องกังวลเรื่องรูปหาย! 📸
