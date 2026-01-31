"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Save, Loader2, ImagePlus } from "lucide-react";

export default function AdminCreatePost() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    category: "Technology",
    image: "",
    featured: false,
  });

  const handleImageUrlChange = (url: string) => {
    setFormData({ ...formData, image: url });
    setImagePreview(url);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/admin/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          lang: "th", // เริ่มจากภาษาไทย
        }),
      });

      if (!response.ok) throw new Error("Failed to create post");

      const data = await response.json();
      
      // แปลภาษาหลัก (Primary languages)
      await fetch("/api/admin/translate-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId: data.id,
          targetLanguages: "primary", // แปลภาษาหลัก 10 ภาษา
        }),
      });

      alert("✅ สร้างบทความสำเร็จ! กำลังแปลภาษา...");
      router.push("/admin/posts");
    } catch (error) {
      alert("❌ เกิดข้อผิดพลาด: " + (error instanceof Error ? error.message : "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">สร้างบทความใหม่</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* หัวข้อ */}
        <Card className="p-6">
          <label className="block text-sm font-medium mb-2">หัวข้อข่าว</label>
          <Input
            value={formData.title}
            onChange={(e) => {
              setFormData({
                ...formData,
                title: e.target.value,
                slug: generateSlug(e.target.value),
              });
            }}
            placeholder="พิมพ์หัวข้อข่าวภาษาไทย..."
            required
            className="text-lg"
          />
        </Card>

        {/* Slug */}
        <Card className="p-6">
          <label className="block text-sm font-medium mb-2">Slug (URL)</label>
          <Input
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            placeholder="auto-generated-slug"
            required
          />
          <p className="text-xs text-muted-foreground mt-1">
            URL: /th/posts/{formData.slug || "your-slug"}
          </p>
        </Card>

        {/* สรุปข่าว */}
        <Card className="p-6">
          <label className="block text-sm font-medium mb-2">สรุปข่าว</label>
          <textarea
            value={formData.excerpt}
            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
            placeholder="เขียนสรุปข่าวสั้นๆ ภาษาไทย..."
            required
            rows={3}
            className="w-full px-3 py-2 border rounded-md"
          />
        </Card>

        {/* เนื้อหา */}
        <Card className="p-6">
          <label className="block text-sm font-medium mb-2">เนื้อหาข่าว</label>
          <textarea
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            placeholder="เขียนเนื้อหาข่าวฉบับเต็มภาษาไทย... (รองรับ HTML)"
            required
            rows={15}
            className="w-full px-3 py-2 border rounded-md font-mono text-sm"
          />
          <p className="text-xs text-muted-foreground mt-1">
            💡 รองรับ HTML tags: &lt;p&gt;, &lt;h2&gt;, &lt;strong&gt;, &lt;em&gt;, etc.
          </p>
        </Card>

        {/* รูปภาพ */}
        <Card className="p-6">
          <label className="block text-sm font-medium mb-2">
            <ImagePlus className="inline h-4 w-4 mr-1" />
            รูปภาพประกอบ
          </label>
          <Input
            value={formData.image}
            onChange={(e) => handleImageUrlChange(e.target.value)}
            placeholder="https://images.unsplash.com/photo-..."
            required
            type="url"
          />
          <div className="mt-4 space-y-2">
            <p className="text-xs text-muted-foreground">
              📸 แนะนำ: ใช้ Unsplash, Cloudinary หรือ Supabase Storage
            </p>
            <div className="flex gap-2 text-xs">
              <a 
                href="https://unsplash.com" 
                target="_blank" 
                className="text-blue-600 hover:underline"
              >
                → Unsplash (ฟรี)
              </a>
              <a 
                href="https://cloudinary.com" 
                target="_blank" 
                className="text-blue-600 hover:underline"
              >
                → Cloudinary
              </a>
              <a 
                href="#supabase-storage" 
                className="text-blue-600 hover:underline"
              >
                → Supabase Storage
              </a>
            </div>
          </div>
          {imagePreview && (
            <div className="mt-4">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-48 object-cover rounded-lg"
                onError={() => setImagePreview("")}
              />
            </div>
          )}
        </Card>

        {/* หมวดหมู่ */}
        <Card className="p-6">
          <label className="block text-sm font-medium mb-2">หมวดหมู่</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="Technology">เทคโนโลยี (Technology)</option>
            <option value="Business">ธุรกิจ (Business)</option>
            <option value="Politics">การเมือง (Politics)</option>
            <option value="Culture">วัฒนธรรม (Culture)</option>
            <option value="Sports">กีฬา (Sports)</option>
          </select>
        </Card>

        {/* ตัวเลือกเพิ่มเติม */}
        <Card className="p-6">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.featured}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
              className="w-4 h-4"
            />
            <span className="text-sm font-medium">ข่าวเด่น (Featured)</span>
          </label>
        </Card>

        {/* ปุ่มส่ง */}
        <div className="flex gap-4">
          <Button
            type="submit"
            disabled={loading}
            className="flex-1"
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                กำลังสร้างและแปลภาษา...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                เผยแพร่บทความ
              </>
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={loading}
          >
            ยกเลิก
          </Button>
        </div>

        {loading && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              ⏳ ระบบกำลังสร้างบทความและแปลเป็น 10 ภาษาหลัก...
              <br />
              <span className="text-xs">
                (Thai, English, Chinese, Japanese, Korean, Malay, Indonesian, Vietnamese, Filipino, Spanish)
              </span>
            </p>
          </div>
        )}
      </form>
    </div>
  );
}
