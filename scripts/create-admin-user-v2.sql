-- Create admin user using Supabase Auth API
-- This approach is more reliable than direct database insertion

-- First, we'll create a simple admin user through the auth system
-- You can also do this manually in the Supabase dashboard under Authentication > Users

-- Alternative: Use the Supabase client to create the user
-- This script should be run through a Node.js script or directly in Supabase dashboard

-- For now, create the user manually in Supabase dashboard:
-- 1. Go to Authentication > Users in your Supabase dashboard
-- 2. Click "Add user"
-- 3. Email: admin@example.com
-- 4. Password: password123
-- 5. Email confirmed: Yes
-- 6. Click "Create user"

-- Or use this SQL if you have direct database access:
-- Note: This might not work in all Supabase setups due to RLS policies

-- Create the user in auth.users (if direct access is available)
-- INSERT INTO auth.users (
--   id,
--   instance_id,
--   email,
--   encrypted_password,
--   email_confirmed_at,
--   created_at,
--   updated_at,
--   role,
--   aud
-- ) VALUES (
--   gen_random_uuid(),
--   '00000000-0000-0000-0000-000000000000',
--   'admin@example.com',
--   crypt('password123', gen_salt('bf')),
--   NOW(),
--   NOW(),
--   NOW(),
--   'authenticated',
--   'authenticated'
-- );
