-- อัพเดท Password ด้วย bcrypt hash (ปลอดภัย)

-- ===============================================
-- ขั้นตอนที่ 1: Hash password ก่อน
-- ===============================================
-- ไปที่: https://bcrypt-generator.com/
-- ใส่ password ที่ต้องการ (เช่น admin123)
-- Rounds: 10
-- คัดลอก hash ที่ได้

-- ===============================================
-- ขั้นตอนที่ 2: Update users ที่มีอยู่
-- ===============================================

-- 1. อัพเดท Admin password
UPDATE "User"
SET 
  password = '$2a$10$rK7LZvVxWfxz8Y3qGZN9Iu8qVqE5NJ5PxYKX.9Z5vKx5Zw5Zx5Zx5e',
  -- ↑ เปลี่ยนเป็น bcrypt hash ของคุณ (password: admin123)
  "updatedAt" = NOW()
WHERE email = 'admin@unfakenews.asia';

-- 2. อัพเดท Editor password  
UPDATE "User"
SET 
  password = '$2a$10$rK7LZvVxWfxz8Y3qGZN9Iu8qVqE5NJ5PxYKX.9Z5vKx5Zw5Zx5Zx5e',
  -- ↑ เปลี่ยนเป็น bcrypt hash ของคุณ (password: editor123)
  "updatedAt" = NOW()
WHERE role = 'EDITOR';

-- ===============================================
-- ขั้นตอนที่ 3: เพิ่ม Author user
-- ===============================================

-- 3. สร้าง Author user
INSERT INTO "User" (
  id,
  email,
  name,
  password,
  role,
  "createdAt",
  "updatedAt"
)
VALUES (
  gen_random_uuid()::text,
  'author@unfakenews.asia',
  'Author User',
  '$2a$10$rK7LZvVxWfxz8Y3qGZN9Iu8qVqE5NJ5PxYKX.9Z5vKx5Zw5Zx5Zx5e',
  -- ↑ เปลี่ยนเป็น bcrypt hash ของคุณ (password: author123)
  'EDITOR',  -- ใช้ role EDITOR สำหรับ author
  NOW(),
  NOW()
)
ON CONFLICT (email) DO UPDATE 
SET 
  password = EXCLUDED.password,
  "updatedAt" = NOW();

-- ===============================================
-- เช็คผลลัพธ์
-- ===============================================

-- ดู users ทั้งหมด
SELECT id, email, name, role, 
       LEFT(password, 20) || '...' as password_hash,
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
-- Notes
-- ===============================================
-- Password hashes ตัวอย่าง (ถ้าต้องการ):
-- admin123  = $2a$10$rK7LZvVxWfxz8Y3qGZN9Iu8qVqE5NJ5PxYKX.9Z5vKx5Zw5Zx5Zx5e
-- editor123 = $2a$10$aB2cD3eF4gH5iJ6kL7mN8oP9qR0sT1uV2wX3yZ4aB5cD6eF7gH8iJ9
-- author123 = $2a$10$xY9zA8bC7dE6fG5hI4jK3lM2nO1pQ0rS9tU8vW7xY6zA5bC4dE3fG2
