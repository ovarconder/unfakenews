"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Upload, Loader2, X, Check } from "lucide-react";

interface ImageUploaderProps {
  onUpload: (url: string) => void;
  currentImage?: string;
  label?: string;
}

export function ImageUploader({ onUpload, currentImage, label = "อัพโหลดรูปภาพ" }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string>(currentImage || "");
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset states
    setError("");
    setSuccess(false);

    // ตรวจสอบขนาด (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("⚠️ ไฟล์ใหญ่เกิน 5MB กรุณาเลือกไฟล์ที่เล็กกว่า");
      return;
    }

    // ตรวจสอบประเภท
    if (!file.type.startsWith("image/")) {
      setError("⚠️ อัพโหลดได้เฉพาะรูปภาพ (JPG, PNG, WebP, GIF)");
      return;
    }

    setUploading(true);

    try {
      // สร้างชื่อไฟล์ unique
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `posts/${fileName}`;

      // Upload to Supabase
      const { data, error: uploadError } = await supabase.storage
        .from("post-images")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        throw new Error(uploadError.message);
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from("post-images")
        .getPublicUrl(filePath);

      // Update preview and notify parent
      setPreview(publicUrl);
      onUpload(publicUrl);
      setSuccess(true);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Upload error:", err);
      setError(
        err instanceof Error 
          ? `❌ อัพโหลดล้มเหลว: ${err.message}` 
          : "❌ เกิดข้อผิดพลาดในการอัพโหลด"
      );
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview("");
    onUpload("");
    setSuccess(false);
    setError("");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <input
          type="file"
          accept="image/*"
          onChange={handleUpload}
          disabled={uploading}
          className="hidden"
          id="image-upload"
        />
        <label htmlFor="image-upload" className="flex-1">
          <Button
            type="button"
            variant="outline"
            disabled={uploading}
            className="w-full cursor-pointer"
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
                  {label}
                </>
              )}
            </span>
          </Button>
        </label>
        
        {preview && !uploading && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleRemove}
            title="ลบรูปภาพ"
          >
            <X className="h-4 w-4 text-red-500" />
          </Button>
        )}
      </div>

      {/* Success Message */}
      {success && (
        <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 border border-green-200 rounded-md px-3 py-2">
          <Check className="h-4 w-4" />
          <span>อัพโหลดสำเร็จ!</span>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
          {error}
        </div>
      )}

      {/* Image Preview */}
      {preview && (
        <div className="relative rounded-lg overflow-hidden border border-gray-200">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-48 object-cover"
            onError={() => {
              setPreview("");
              setError("❌ ไม่สามารถโหลดรูปภาพได้");
            }}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
            <p className="text-xs text-white truncate">{preview}</p>
          </div>
        </div>
      )}

      {/* Helper Text */}
      {!preview && !error && (
        <p className="text-xs text-muted-foreground">
          📸 รองรับ: JPG, PNG, WebP, GIF • ขนาดสูงสุด: 5MB
        </p>
      )}
    </div>
  );
}
