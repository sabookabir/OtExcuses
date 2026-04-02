-- Run this in your Supabase SQL Editor to create all missing tables

-- 1. Users Table (to store user info publicly if needed)
CREATE TABLE IF NOT EXISTS users (
  id uuid references auth.users not null primary key,
  email text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Trigger to automatically create a user in `public.users` when they sign up
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 2. History Table
CREATE TABLE IF NOT EXISTS history (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  situation text not null,
  output text not null,
  type text not null,
  mode text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

ALTER TABLE history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only see their own history." ON history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own history." ON history FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own history." ON history FOR DELETE USING (auth.uid() = user_id);

-- 3. Feedback Table
CREATE TABLE IF NOT EXISTS feedback (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  text text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can insert feedback." ON feedback FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 4. Bug Reports Table
CREATE TABLE IF NOT EXISTS bug_reports (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  text text not null,
  status text default 'open',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

ALTER TABLE bug_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can insert bug reports." ON bug_reports FOR INSERT WITH CHECK (auth.uid() = user_id);
