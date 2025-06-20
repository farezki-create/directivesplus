
-- Ajouter les colonnes manquantes à la table symptom_tracking
ALTER TABLE public.symptom_tracking 
ADD COLUMN IF NOT EXISTS fatigue integer DEFAULT 0;

ALTER TABLE public.symptom_tracking 
ADD COLUMN IF NOT EXISTS sommeil integer DEFAULT 0;

-- Ajouter les contraintes directement (ignorer si elles existent déjà)
ALTER TABLE public.symptom_tracking 
ADD CONSTRAINT fatigue_range CHECK (fatigue >= 0 AND fatigue <= 10);

ALTER TABLE public.symptom_tracking 
ADD CONSTRAINT sommeil_range CHECK (sommeil >= 0 AND sommeil <= 10);
