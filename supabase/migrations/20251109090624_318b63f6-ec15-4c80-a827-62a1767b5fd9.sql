-- ============================================
-- SECURITY FIX: Implement server-side role management
-- ============================================

-- 1. Create app_role enum if it doesn't exist
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- 2. Create user_roles table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, role)
);

-- 3. Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 4. Update has_role function with fixed search_path
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- 5. Drop existing policies if they exist and create new ones for user_roles
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;

CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'));

-- 6. Grant admin role to existing @directivesplus.fr emails
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role
FROM auth.users
WHERE email LIKE '%@directivesplus.fr'
ON CONFLICT (user_id, role) DO NOTHING;

-- ============================================
-- SECURITY FIX: Restrict public data exposure
-- ============================================

-- 7. Fix user_otp table - restrict to system use only
DROP POLICY IF EXISTS "Allow service role full access" ON public.user_otp;
DROP POLICY IF EXISTS "Allow public access to user_otp" ON public.user_otp;
DROP POLICY IF EXISTS "Users can view their own OTP codes" ON public.user_otp;
DROP POLICY IF EXISTS "Users can insert their own OTP codes" ON public.user_otp;
DROP POLICY IF EXISTS "Users can update their own OTP codes" ON public.user_otp;
DROP POLICY IF EXISTS "System can manage OTP codes" ON public.user_otp;

-- Only service role can manage OTP codes (no public or user access)
CREATE POLICY "Service role only access"
ON public.user_otp
FOR ALL
TO service_role
USING (true);

-- 8. Fix dossiers_medicaux table - remove overly permissive policies
DROP POLICY IF EXISTS "Allow all access to dossiers_medicaux" ON public.dossiers_medicaux;
DROP POLICY IF EXISTS "Admin only access to dossiers_medicaux" ON public.dossiers_medicaux;
DROP POLICY IF EXISTS "Users can access dossiers with valid code" ON public.dossiers_medicaux;
DROP POLICY IF EXISTS "Users can only access their own medical records" ON public.dossiers_medicaux;
DROP POLICY IF EXISTS "Users can view their own medical dossiers" ON public.dossiers_medicaux;
DROP POLICY IF EXISTS "Acces interdit par defaut aux dossiers" ON public.dossiers_medicaux;
DROP POLICY IF EXISTS "Authorized access to medical dossiers" ON public.dossiers_medicaux;

-- Only allow access through valid access codes or admin
CREATE POLICY "Authorized access to medical dossiers"
ON public.dossiers_medicaux
FOR SELECT
TO authenticated
USING (
  code_acces IN (
    SELECT medical_access_code 
    FROM profiles 
    WHERE id = auth.uid()
  )
  OR has_role(auth.uid(), 'admin')
);

-- 9. Fix shared_profiles table - restrict public access
DROP POLICY IF EXISTS "Allow public access to shared_profiles" ON public.shared_profiles;
DROP POLICY IF EXISTS "allow nothing by default" ON public.shared_profiles;
DROP POLICY IF EXISTS "Access shared profiles with valid code" ON public.shared_profiles;
DROP POLICY IF EXISTS "Users can manage their own shared profiles" ON public.shared_profiles;
DROP POLICY IF EXISTS "Users manage own shared profiles" ON public.shared_profiles;
DROP POLICY IF EXISTS "Valid code read access" ON public.shared_profiles;

-- Authenticated users can manage their own profiles
CREATE POLICY "Users manage own shared profiles"
ON public.shared_profiles
FOR ALL
TO authenticated
USING (auth.uid() = user_id);

-- Read-only access for valid unexpired codes (authenticated only)
CREATE POLICY "Valid code read access"
ON public.shared_profiles
FOR SELECT
TO authenticated
USING (expires_at IS NULL OR expires_at > now());

-- 10. Fix pdf_documents table - restrict public access
DROP POLICY IF EXISTS "Allow public access via RPC function" ON public.pdf_documents;
DROP POLICY IF EXISTS "Users can view their own documents" ON public.pdf_documents;
DROP POLICY IF EXISTS "Users can manage their own documents" ON public.pdf_documents;
DROP POLICY IF EXISTS "Access documents with valid code" ON public.pdf_documents;
DROP POLICY IF EXISTS "Users manage own pdf documents" ON public.pdf_documents;

CREATE POLICY "Users manage own pdf documents"
ON public.pdf_documents
FOR ALL
TO authenticated
USING (auth.uid() = user_id);