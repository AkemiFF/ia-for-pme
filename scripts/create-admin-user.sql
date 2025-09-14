-- Create admin user for dashboard access
-- This script creates a test admin user in Supabase Auth

-- Insert admin user (you can modify email/password as needed)
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  role,
  aud,
  confirmation_token,
  email_change_token_new,
  recovery_token
) VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'admin@example.com',
  crypt('password123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  'authenticated',
  'authenticated',
  '',
  '',
  ''
);

-- Create admin profile in public schema if you have a profiles table
-- INSERT INTO public.profiles (id, email, role, created_at)
-- SELECT id, email, 'admin', created_at
-- FROM auth.users
-- WHERE email = 'admin@example.com';
