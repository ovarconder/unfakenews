-- สร้าง Database Schema ทั้งหมด + enum UserRole

-- ===============================================
-- ขั้นตอนที่ 1: สร้าง Enum UserRole
-- ===============================================

-- ลบ enum เก่า (ถ้ามี) แล้วสร้างใหม่
DROP TYPE IF EXISTS "UserRole" CASCADE;

CREATE TYPE "UserRole" AS ENUM (
  'USER',
  'EDITOR',
  'ADMIN',
  'SUPER_ADMIN'
);

-- ===============================================
-- ขั้นตอนที่ 2: เช็คว่ามีตาราง User หรือยัง
-- ===============================================

-- ถ้ามีตาราง User แล้วแต่ไม่มี password column
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'User') THEN
    -- เพิ่มคอลัมน์ password ถ้ายังไม่มี
    ALTER TABLE "User" 
    ADD COLUMN IF NOT EXISTS password TEXT;
    
    -- เพิ่มคอลัมน์ role ถ้ายังไม่มี (แล้วเปลี่ยนเป็น enum)
    IF NOT EXISTS (
      SELECT FROM information_schema.columns 
      WHERE table_name = 'User' AND column_name = 'role'
    ) THEN
      ALTER TABLE "User" ADD COLUMN role "UserRole" DEFAULT 'USER';
    ELSE
      -- เปลี่ยน type ของ role เป็น enum (ถ้าเป็น text อยู่)
      ALTER TABLE "User" 
      ALTER COLUMN role TYPE "UserRole" 
      USING role::"UserRole";
    END IF;
    
    RAISE NOTICE 'Updated existing User table';
  END IF;
END $$;

-- ===============================================
-- ขั้นตอนที่ 3: อัพเดท/สร้าง Users พร้อม bcrypt
-- ===============================================

-- อัพเดท Admin
INSERT INTO "User" (
  id, email, name, password, role, "createdAt", "updatedAt"
)
VALUES (
  gen_random_uuid()::text,
  'admin@unfakenews.asia',
  'Admin User',
  '$2a$10$8ViGUVH2o4NlDZb2wLp2qOTzQSRCF5H.0iHTKZRCbSDk.hIZFXcqm',
  'ADMIN',
  NOW(),
  NOW()
)
ON CONFLICT (email) DO UPDATE 
SET 
  password = '$2a$10$8ViGUVH2o4NlDZb2wLp2qOTzQSRCF5H.0iHTKZRCbSDk.hIZFXcqm',
  role = 'ADMIN',
  "updatedAt" = NOW();

-- อัพเดท Editor (ถ้ามี)
UPDATE "User"
SET 
  password = '$2a$10$GZqfF4AdlFSv1KFUASeehOX9RpVQn6KMFgG6W46XNA61pBRhla4oG',
  role = 'EDITOR',
  "updatedAt" = NOW()
WHERE role = 'EDITOR' OR email ILIKE '%editor%';

-- เพิ่ม Author
INSERT INTO "User" (
  id, email, name, password, role, "createdAt", "updatedAt"
)
VALUES (
  gen_random_uuid()::text,
  'author@unfakenews.asia',
  'Author User',
  '$2a$10$uD3awZdd9GEjpVI7OIc7cubr0XeOGlR4HIY30L2zam4HHpl14vvTW',
  'EDITOR',
  NOW(),
  NOW()
)
ON CONFLICT (email) DO UPDATE 
SET 
  password = '$2a$10$uD3awZdd9GEjpVI7OIc7cubr0XeOGlR4HIY30L2zam4HHpl14vvTW',
  role = 'EDITOR',
  "updatedAt" = NOW();

-- ===============================================
-- เช็คผลลัพธ์
-- ===============================================

-- ดู enum values
SELECT unnest(enum_range(NULL::"UserRole")) as available_roles;

-- ดู users
SELECT 
  email, 
  name,
  role,
  LEFT(password, 15) || '...' as password_hash,
  "createdAt"
FROM "User"
ORDER BY 
  CASE role
    WHEN 'SUPER_ADMIN' THEN 1
    WHEN 'ADMIN' THEN 2
    WHEN 'EDITOR' THEN 3
    WHEN 'USER' THEN 4
  END;

-- ===============================================
-- ✅ เสร็จแล้ว!
-- ===============================================
-- Credentials:
-- Admin:  admin@unfakenews.asia  / admin123
-- Editor: (existing email)        / editor123  
-- Author: author@unfakenews.asia / author123
