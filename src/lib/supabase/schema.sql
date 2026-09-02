-- ==========================================
-- MEOWBOX SOCIAL APP - SUPABASE SCHEMA SETUP
-- Paste this entire script into the Supabase SQL Editor and click "RUN"
-- ==========================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create Profiles Table (User Profile Information)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  username TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  image_url TEXT,
  bio TEXT DEFAULT '',
  website TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Posts Table
CREATE TABLE IF NOT EXISTS public.posts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  creator_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  caption TEXT DEFAULT '',
  image_url TEXT NOT NULL,
  image_id TEXT,
  location TEXT DEFAULT '',
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  filter TEXT DEFAULT 'normal',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create Likes Table
CREATE TABLE IF NOT EXISTS public.likes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

-- 5. Create Saves / Bookmarks Table
CREATE TABLE IF NOT EXISTS public.saves (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

-- 6. Create Comments Table
CREATE TABLE IF NOT EXISTS public.comments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  user_name TEXT NOT NULL,
  user_avatar TEXT,
  text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Create Follows Table
CREATE TABLE IF NOT EXISTS public.follows (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  follower_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  following_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(follower_id, following_id)
);

-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saves ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Public profiles are viewable by everyone" 
  ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" 
  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Posts Policies
CREATE POLICY "Posts are viewable by everyone" 
  ON public.posts FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert posts" 
  ON public.posts FOR INSERT WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Users can update their own posts" 
  ON public.posts FOR UPDATE USING (auth.uid() = creator_id);

CREATE POLICY "Users can delete their own posts" 
  ON public.posts FOR DELETE USING (auth.uid() = creator_id);

-- Likes Policies
CREATE POLICY "Likes are viewable by everyone" 
  ON public.likes FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert likes" 
  ON public.likes FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own likes" 
  ON public.likes FOR DELETE USING (auth.uid() = user_id);

-- Saves Policies
CREATE POLICY "Users can view their own saves" 
  ON public.saves FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own saves" 
  ON public.saves FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own saves" 
  ON public.saves FOR DELETE USING (auth.uid() = user_id);

-- Comments Policies
CREATE POLICY "Comments are viewable by everyone" 
  ON public.comments FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert comments" 
  ON public.comments FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Follows Policies
CREATE POLICY "Follows are viewable by everyone" 
  ON public.follows FOR SELECT USING (true);

CREATE POLICY "Authenticated users can follow" 
  ON public.follows FOR INSERT WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "Authenticated users can unfollow" 
  ON public.follows FOR DELETE USING (auth.uid() = follower_id);

-- ==========================================
-- STORAGE BUCKET CREATION (FOR PHOTOS & MEDIA)
-- ==========================================

-- Create Public 'media' Storage Bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies
CREATE POLICY "Media files are publicly accessible" 
  ON storage.objects FOR SELECT 
  USING (bucket_id = 'media');

CREATE POLICY "Authenticated users can upload media" 
  ON storage.objects FOR INSERT 
  WITH CHECK (bucket_id = 'media' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update their own media" 
  ON storage.objects FOR UPDATE 
  USING (bucket_id = 'media' AND auth.uid() = owner);

CREATE POLICY "Users can delete their own media" 
  ON storage.objects FOR DELETE 
  USING (bucket_id = 'media' AND auth.uid() = owner);
