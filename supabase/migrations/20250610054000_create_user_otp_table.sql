
-- Créer la table user_otp pour gérer les codes OTP
CREATE TABLE IF NOT EXISTS public.user_otp (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  otp_code TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + interval '10 minutes'),
  used BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Activer RLS
ALTER TABLE public.user_otp ENABLE ROW LEVEL SECURITY;

-- Index pour optimiser les requêtes
CREATE INDEX IF NOT EXISTS idx_user_otp_email_code ON public.user_otp(email, otp_code);
CREATE INDEX IF NOT EXISTS idx_user_otp_expires_at ON public.user_otp(expires_at);

-- Politique pour permettre l'insertion et la lecture des OTP
CREATE POLICY "Allow OTP operations" ON public.user_otp
  FOR ALL USING (true);
