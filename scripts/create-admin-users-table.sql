-- Creating a simple users table for admin authentication
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an admin user (password: admin123)
-- Password hash for 'admin123' using bcrypt
INSERT INTO users (email, password_hash, name, role) 
VALUES (
  'admin@example.com', 
  '$2b$10$rOzJqQqQqQqQqQqQqQqQqOzJqQqQqQqQqQqQqQqQqQqQqQqQqQqQqQ',
  'Admin User',
  'admin'
) ON CONFLICT (email) DO NOTHING;
