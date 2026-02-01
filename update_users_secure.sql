-- อัพเดท Passwords ด้วย bcrypt (ปลอดภัย) + เพิ่ม Author

-- ===============================================
-- อัพเดท Admin Password
-- ===============================================
UPDATE "User"
SET 
  password = '$2a$10$8ViGUVH2o4NlDZb2wLp2qOTzQSRCF5H.0iHTKZRCbSDk.hIZFXcqm',
  -- Password: admin123 (bcrypt hashed)
  "updatedAt" = NOW()
WHERE email = 'admin@unfakenews.asia';

-- ===============================================
-- อัพเดท Editor Password
-- ===============================================
UPDATE "User"
SET 
  password = '$2a$10$GZqfF4AdlFSv1KFUASeehOX9RpVQn6KMFgG6W46XNA61pBRhla4oG',
  -- Password: editor123 (bcrypt hashed)
  "updatedAt" = NOW()
WHERE role = 'EDITOR';

-- ===============================================
-- เพิ่ม Author User
-- ===============================================
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
  '$2a$10$uD3awZdd9GEjpVI7OIc7cubr0XeOGlR4HIY30L2zam4HHpl14vvTW',
  -- Password: author123 (bcrypt hashed)
  'EDITOR',
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
SELECT 
  email, 
  name,
  role,
  LEFT(password, 10) || '...' as password_preview,
  "createdAt",
  "updatedAt"
FROM "User"
ORDER BY 
  CASE role
    WHEN 'SUPER_ADMIN' THEN 1
    WHEN 'ADMIN' THEN 2
    WHEN 'EDITOR' THEN 3
    WHEN 'USER' THEN 4
  END,
  "createdAt";

-- ===============================================
-- ✅ Credentials
-- ===============================================
-- Admin:  admin@unfakenews.asia  / admin123
-- Editor: (email ที่มีอยู่)        / editor123
-- Author: author@unfakenews.asia / author123
