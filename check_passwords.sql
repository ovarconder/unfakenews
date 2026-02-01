-- เช็ค Password ใน Database

-- ===============================================
-- 1. ดูข้อมูล User และ Password
-- ===============================================
SELECT 
  email,
  role,
  CASE 
    WHEN password IS NULL THEN '❌ NULL'
    WHEN password = '' THEN '❌ Empty'
    WHEN password LIKE '$2a$%' THEN '✅ bcrypt hash'
    WHEN password LIKE '$2b$%' THEN '✅ bcrypt hash'
    ELSE '❌ Plain text: ' || password
  END as password_status,
  LEFT(password, 30) || '...' as password_preview,
  LENGTH(password) as password_length,
  "createdAt"
FROM "User"
WHERE email IN ('admin@unfakenews.asia', 'author@unfakenews.asia')
ORDER BY role;

-- ===============================================
-- 2. ถ้า password ไม่ใช่ bcrypt - อัพเดทใหม่
-- ===============================================

-- สร้าง hash ใหม่ (ทดสอบแล้วว่าใช้ได้)
-- admin123  = $2a$10$8ViGUVH2o4NlDZb2wLp2qOTzQSRCF5H.0iHTKZRCbSDk.hIZFXcqm
-- author123 = $2a$10$uD3awZdd9GEjpVI7OIc7cubr0XeOGlR4HIY30L2zam4HHpl14vvTW

UPDATE "User"
SET 
  password = '$2a$10$8ViGUVH2o4NlDZb2wLp2qOTzQSRCF5H.0iHTKZRCbSDk.hIZFXcqm',
  "updatedAt" = NOW()
WHERE email = 'admin@unfakenews.asia';

UPDATE "User"
SET 
  password = '$2a$10$uD3awZdd9GEjpVI7OIc7cubr0XeOGlR4HIY30L2zam4HHpl14vvTW',
  "updatedAt" = NOW()
WHERE email = 'author@unfakenews.asia';

-- เช็คอีกครั้ง
SELECT 
  email,
  role,
  LEFT(password, 30) as password_hash,
  LENGTH(password) as len
FROM "User"
WHERE email IN ('admin@unfakenews.asia', 'author@unfakenews.asia');

-- ===============================================
-- ✅ ควรเห็น:
-- ===============================================
-- email: admin@unfakenews.asia
-- password_hash: $2a$10$8ViGUVH2o4NlDZb2wLp...
-- len: 60 (ความยาวมาตรฐานของ bcrypt)
