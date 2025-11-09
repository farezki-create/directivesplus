
-- Migration: Ajouter des politiques RLS pour abonnes_institutions et droits_acces_nominal
-- Ces tables sont utilisées pour gérer les accès institutionnels

-- Politiques pour abonnes_institutions
-- Seuls les admins peuvent gérer les abonnés d'institutions
CREATE POLICY "Admins can manage institution subscriptions"
ON public.abonnes_institutions
FOR ALL
USING (public.is_user_admin(auth.uid()));

-- Les institutions peuvent voir leurs propres informations via leur email
CREATE POLICY "Institutions can view their own data"
ON public.abonnes_institutions
FOR SELECT
USING (
  auth.jwt() ->> 'email' = email
);

-- Politiques pour droits_acces_nominal
-- Seuls les admins peuvent gérer les droits d'accès nominatifs
CREATE POLICY "Admins can manage nominal access rights"
ON public.droits_acces_nominal
FOR ALL
USING (public.is_user_admin(auth.uid()));

-- Les utilisateurs qui ont créé l'autorisation peuvent la voir
CREATE POLICY "Creators can view their nominal access grants"
ON public.droits_acces_nominal
FOR SELECT
USING (auth.uid() = created_by);
