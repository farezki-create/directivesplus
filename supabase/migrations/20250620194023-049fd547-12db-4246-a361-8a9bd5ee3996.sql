
-- S'assurer que les utilisateurs peuvent accéder à leur propre profil
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;

-- Activer RLS sur la table profiles si ce n'est pas déjà fait
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Créer des politiques permissives pour les profils utilisateur
CREATE POLICY "Users can view own profile" 
  ON public.profiles 
  FOR SELECT 
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON public.profiles 
  FOR UPDATE 
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile" 
  ON public.profiles 
  FOR INSERT 
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- S'assurer que les utilisateurs peuvent accéder aux informations nécessaires pour les alertes
-- Permettre la lecture des profils pour la validation des paramètres d'alerte
CREATE POLICY "Users can read profiles for alert validation" 
  ON public.profiles 
  FOR SELECT 
  TO authenticated
  USING (true);
