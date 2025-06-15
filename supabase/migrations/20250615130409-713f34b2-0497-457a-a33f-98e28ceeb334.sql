
-- Table des abonnements institutionnels (institution_subscriptions)
CREATE TABLE public.institution_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id uuid NOT NULL,
  institution_type text NOT NULL, -- 'public', 'prive', 'association'
  stripe_customer_id text,
  stripe_subscription_id text,
  email text NOT NULL,
  status text NOT NULL DEFAULT 'pending', -- 'pending', 'active', 'canceled', etc.
  subscription_start timestamptz,
  subscription_end timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Indice sur l'institution et l'ID Stripe pour recherche rapide
CREATE INDEX idx_institution_id ON public.institution_subscriptions (institution_id);
CREATE INDEX idx_stripe_subscription_id ON public.institution_subscriptions (stripe_subscription_id);

-- RLS pour que seuls les admins et responsables de l'établissement puissent voir leur abonnement
ALTER TABLE public.institution_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_own_or_admin" ON public.institution_subscriptions
FOR SELECT
USING (
  auth.role() = 'admin'
  OR institution_id IN (
    SELECT id FROM abonnes_institutions WHERE email = auth.email()
  )
);
