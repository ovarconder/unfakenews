-- เพิ่มคอลัมน์ password ในตาราง User
ALTER TABLE "User" 
ADD COLUMN IF NOT EXISTS password TEXT;

-- ตรวจสอบว่าเพิ่มสำเร็จ
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'User'
ORDER BY ordinal_position;
