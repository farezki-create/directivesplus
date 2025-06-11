
-- Supprimer et recréer la table user_otp avec la bonne structure
DROP TABLE IF EXISTS public.user_otp CASCADE;

-- Créer la table user_otp pour gérer les codes OTP
CREATE TABLE public.user_otp (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  otp_code TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + interval '10 minutes'),
  used BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Activer RLS
ALTER TABLE public.user_otp ENABLE ROW LEVEL SECURITY;

-- Index pour optimiser les requêtes
CREATE INDEX IF NOT EXISTS idx_user_otp_email ON public.user_otp(email);
CREATE INDEX IF NOT EXISTS idx_user_otp_email_code ON public.user_otp(email, otp_code);
CREATE INDEX IF NOT EXISTS idx_user_otp_expires_at ON public.user_otp(expires_at);
CREATE INDEX IF NOT EXISTS idx_user_otp_used ON public.user_otp(used);

-- Politique pour permettre l'insertion et la lecture des OTP (service role uniquement)
CREATE POLICY "Allow service role full access" ON public.user_otp
  FOR ALL USING (true);

-- Fonction pour nettoyer les anciens codes expirés
CREATE OR REPLACE FUNCTION cleanup_expired_otp_codes()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM public.user_otp 
  WHERE expires_at < now() - interval '1 hour';
END;
$$;

-- Trigger pour mise à jour automatique de updated_at
CREATE OR REPLACE FUNCTION update_user_otp_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER user_otp_updated_at
  BEFORE UPDATE ON public.user_otp
  FOR EACH ROW
  EXECUTE FUNCTION update_user_otp_updated_at();
