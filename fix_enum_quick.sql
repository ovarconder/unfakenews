-- ⚡ สร้าง enum UserRole + Users (Copy-Paste เลย)

-- สร้าง enum
DROP TYPE IF EXISTS "UserRole" CASCADE;
CREATE TYPE "UserRole" AS ENUM ('USER', 'EDITOR', 'ADMIN', 'SUPER_ADMIN');

-- อัพเดทตาราง User
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS password TEXT;
ALTER TABLE "User" ALTER COLUMN role DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN role TYPE "UserRole" USING COALESCE(role::"UserRole", 'USER'::"UserRole");
ALTER TABLE "User" ALTER COLUMN role SET DEFAULT 'USER'::"UserRole";

-- สร้าง Admin
INSERT INTO "User" (id, email, name, password, role, "createdAt", "updatedAt")
VALUES (
  gen_random_uuid()::text,
  'admin@unfakenews.asia',
  'Admin User',
  '$2a$10$8ViGUVH2o4NlDZb2wLp2qOTzQSRCF5H.0iHTKZRCbSDk.hIZFXcqm',
  'ADMIN', NOW(), NOW()
) ON CONFLICT (email) DO UPDATE 
SET password = '$2a$10$8ViGUVH2o4NlDZb2wLp2qOTzQSRCF5H.0iHTKZRCbSDk.hIZFXcqm', role = 'ADMIN';

-- สร้าง Author  
INSERT INTO "User" (id, email, name, password, role, "createdAt", "updatedAt")
VALUES (
  gen_random_uuid()::text,
  'author@unfakenews.asia',
  'Author User',
  '$2a$10$uD3awZdd9GEjpVI7OIc7cubr0XeOGlR4HIY30L2zam4HHpl14vvTW',
  'EDITOR', NOW(), NOW()
) ON CONFLICT (email) DO UPDATE 
SET password = '$2a$10$uD3awZdd9GEjpVI7OIc7cubr0XeOGlR4HIY30L2zam4HHpl14vvTW';

-- เช็ค
SELECT unnest(enum_range(NULL::"UserRole")) as roles;
SELECT email, role FROM "User";

-- ✅ Credentials:
-- admin@unfakenews.asia  / admin123
-- author@unfakenews.asia / author123
