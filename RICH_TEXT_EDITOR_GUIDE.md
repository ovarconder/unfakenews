# 📝 Rich Text Editor with Image Upload (Future Enhancement)

## สำหรับอนาคต: Editor ที่สมบูรณ์

ตอนนี้ระบบรองรับการอัพโหลดรูปภาพ **Feature Image** แล้ว  
สำหรับรูปภาพใน **Content** ยังใช้วิธีใส่ HTML `<img>` tag

---

## 🎯 แนวทางพัฒนา: Rich Text Editor

### ตัวเลือก Editor ที่แนะนำ:

#### 1. **Tiptap** (แนะนำ!) ⭐
```bash
npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-image
```

**Features:**
- ✅ Modern, headless editor
- ✅ รองรับ image upload
- ✅ Customizable
- ✅ TypeScript support

#### 2. **Lexical** (by Meta)
```bash
npm install lexical @lexical/react
```

**Features:**
- ✅ Performance สูง
- ✅ Plugin system
- ✅ Used by Facebook

#### 3. **Quill**
```bash
npm install react-quill
```

**Features:**
- ✅ ง่าย, popular
- ✅ WYSIWYG
- ✅ Image paste support

---

## 💡 ตัวอย่าง: Tiptap with Image Upload

### 1. ติดตั้ง Dependencies

```bash
npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-image
```

### 2. สร้าง Rich Text Editor Component

```typescript
// components/admin/rich-text-editor.tsx
"use client";

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'
import { useState } from 'react'

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
}

export function RichTextEditor({ content, onChange }: RichTextEditorProps) {
  const [uploading, setUploading] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-lg max-w-full',
        },
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editor) return;

    setUploading(true);

    try {
      // Upload to Supabase
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `posts/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('post-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('post-images')
        .getPublicUrl(filePath);

      // Insert image into editor
      editor.chain().focus().setImage({ src: publicUrl }).run();
    } catch (error) {
      console.error('Upload error:', error);
      alert('❌ อัพโหลดล้มเหลว');
    } finally {
      setUploading(false);
    }
  };

  if (!editor) return null;

  return (
    <div className="border rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="bg-gray-50 border-b p-2 flex gap-1 flex-wrap">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive('bold') ? 'bg-gray-200' : ''}
        >
          <strong>B</strong>
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive('italic') ? 'bg-gray-200' : ''}
        >
          <em>I</em>
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={editor.isActive('heading', { level: 2 }) ? 'bg-gray-200' : ''}
        >
          H2
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive('bulletList') ? 'bg-gray-200' : ''}
        >
          • List
        </Button>

        {/* Image Upload */}
        <div className="ml-auto">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={uploading}
            className="hidden"
            id="editor-image-upload"
          />
          <label htmlFor="editor-image-upload">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={uploading}
              asChild
            >
              <span>
                {uploading ? '⏳ Uploading...' : '🖼️ Image'}
              </span>
            </Button>
          </label>
        </div>
      </div>

      {/* Editor Content */}
      <EditorContent 
        editor={editor} 
        className="prose max-w-none p-4 min-h-[400px] focus:outline-none"
      />
    </div>
  );
}
```

### 3. ใช้ใน Create Post Page

```typescript
// app/admin/posts/create/page.tsx
import { RichTextEditor } from "@/components/admin/rich-text-editor";

// ...

<Card className="p-6">
  <label className="block text-sm font-medium mb-2">เนื้อหาข่าว</label>
  <RichTextEditor
    content={formData.content}
    onChange={(html) => setFormData({ ...formData, content: html })}
  />
</Card>
```

---

## 🎨 Features ที่จะได้

- ✅ WYSIWYG editor
- ✅ ปุ่มจัดรูปแบบ (Bold, Italic, Heading, List)
- ✅ อัพโหลดรูปภาพภายใน content
- ✅ Drag & drop image (with plugin)
- ✅ Copy/paste image (with plugin)
- ✅ Real-time preview
- ✅ HTML output (เหมือนเดิม)

---

## 📸 Image Upload Flow ใน Editor

```
User clicks "🖼️ Image" button
    ↓
Select image file
    ↓
Upload to Supabase Storage
    ↓
Get public URL
    ↓
Insert image into editor at cursor position
    ↓
Continue editing
```

---

## 💾 Output Format

Editor จะสร้าง HTML เหมือนเดิม:

```html
<p>เนื้อหาบทความ...</p>

<img src="https://supabase.../image.jpg" class="rounded-lg max-w-full" />

<h2>หัวข้อย่อย</h2>

<ul>
  <li>รายการที่ 1</li>
  <li>รายการที่ 2</li>
</ul>

<p>เนื้อหาต่อ...</p>
```

---

## 🔧 Styling

เพิ่ม Tailwind Typography:

```bash
npm install @tailwindcss/typography
```

```typescript
// tailwind.config.ts
export default {
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
```

---

## 📊 Comparison: Editor Options

| Feature | Tiptap | Lexical | Quill |
|---------|--------|---------|-------|
| **Modern** | ✅✅✅ | ✅✅✅ | ⭐⭐ |
| **Customizable** | ✅✅✅ | ✅✅ | ⭐⭐ |
| **TypeScript** | ✅ | ✅ | ❌ |
| **Image Upload** | Plugin | Plugin | Built-in |
| **Performance** | ✅✅ | ✅✅✅ | ⭐⭐ |
| **Bundle Size** | Small | Small | Medium |
| **Learning Curve** | Easy | Medium | Easy |

---

## 🎯 Recommendation

**เริ่มจาก:** Tiptap + Image extension

**เพราะ:**
- ✅ Modern, headless
- ✅ Easy to customize
- ✅ Great TypeScript support
- ✅ Active community
- ✅ Extensible

---

## 📦 Full Package List (Future)

```json
{
  "dependencies": {
    "@tiptap/react": "^2.x",
    "@tiptap/starter-kit": "^2.x",
    "@tiptap/extension-image": "^2.x",
    "@tiptap/extension-link": "^2.x",
    "@tiptap/extension-code-block": "^2.x",
    "@tailwindcss/typography": "^0.5.x"
  }
}
```

---

## 🚀 Timeline

### ปัจจุบัน (Phase 1): ✅ เสร็จแล้ว
- ✅ Feature image upload
- ✅ Manual HTML input for content
- ✅ Image URL input

### อนาคต (Phase 2):
- [ ] Rich text editor (Tiptap)
- [ ] Inline image upload
- [ ] Drag & drop images
- [ ] Image management library

### อนาคต (Phase 3):
- [ ] Video embed
- [ ] Code syntax highlighting
- [ ] Table support
- [ ] Custom blocks

---

## 💡 Current Workaround

ตอนนี้ยังใช้วิธีนี้ได้:

1. อัพโหลดรูปใน Feature Image section
2. คัดลอก URL
3. วางใน HTML `<img>` tag ใน Content:
   ```html
   <img src="URL-ที่คัดลอกมา" alt="รูปภาพประกอบ" />
   ```

---

## 📚 Resources

- [Tiptap Documentation](https://tiptap.dev/)
- [Lexical Documentation](https://lexical.dev/)
- [Quill Documentation](https://quilljs.com/)
- [Supabase Storage](https://supabase.com/docs/guides/storage)

---

**Note:** ตอนนี้ระบบพื้นฐานพร้อมแล้ว! สามารถพัฒนาต่อได้ตามต้องการ 🚀
