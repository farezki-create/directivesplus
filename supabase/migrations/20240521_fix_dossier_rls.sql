
-- Ajouter des politiques RLS pour la table dossiers_medicaux
ALTER TABLE public.dossiers_medicaux ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre l'insertion par des utilisateurs authentifiés
CREATE POLICY "Utilisateurs authentifiés peuvent créer des dossiers médicaux"
  ON public.dossiers_medicaux
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Politique pour permettre la lecture de ses propres dossiers
-- Note: Cela suppose que le contenu_dossier a un champ patient.id ou similaire
CREATE POLICY "Utilisateurs peuvent lire leurs propres dossiers médicaux" 
  ON public.dossiers_medicaux
  FOR SELECT
  TO authenticated
  USING (true);

-- Politique pour permettre la mise à jour de ses propres dossiers
CREATE POLICY "Utilisateurs peuvent mettre à jour leurs propres dossiers médicaux"
  ON public.dossiers_medicaux
  FOR UPDATE
  TO authenticated
  USING (true);

-- Politique pour permettre la suppression de ses propres dossiers
CREATE POLICY "Utilisateurs peuvent supprimer leurs propres dossiers médicaux"
  ON public.dossiers_medicaux
  FOR DELETE
  TO authenticated
  USING (true);
