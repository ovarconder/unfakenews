-- สร้าง/อัพเดท Admin User พร้อม Password

-- วิธีที่ 1: สร้าง admin user ใหม่ (ถ้ายังไม่มี)
INSERT INTO "User" (
  id,
  email,
  name,
  password,
  role,
  "emailVerified",
  "createdAt",
  "updatedAt"
)
VALUES (
  gen_random_uuid()::text,
  'admin@unfakenews.asia',
  'Admin User',
  'admin123',
  'ADMIN',
  NULL,
  NOW(),
  NOW()
)
ON CONFLICT (email) DO UPDATE 
SET 
  password = 'admin123',
  role = 'ADMIN',
  "updatedAt" = NOW();

-- เช็คว่าสร้างสำเร็จ
SELECT id, email, name, password, role, "createdAt"
FROM "User" 
WHERE email = 'admin@unfakenews.asia';

-- ผลลัพธ์ที่ควรเห็น:
-- email: admin@unfakenews.asia
-- password: admin123
-- role: ADMIN
