
-- Modifier les colonnes de symptômes pour accepter des valeurs décimales
ALTER TABLE public.symptom_tracking 
ALTER COLUMN douleur TYPE numeric(3,1),
ALTER COLUMN dyspnee TYPE numeric(3,1),
ALTER COLUMN anxiete TYPE numeric(3,1),
ALTER COLUMN fatigue TYPE numeric(3,1),
ALTER COLUMN sommeil TYPE numeric(3,1);

-- Mettre à jour les contraintes pour accepter les valeurs décimales
ALTER TABLE public.symptom_tracking 
DROP CONSTRAINT IF EXISTS douleur_range,
DROP CONSTRAINT IF EXISTS dyspnee_range,
DROP CONSTRAINT IF EXISTS anxiete_range,
DROP CONSTRAINT IF EXISTS fatigue_range,
DROP CONSTRAINT IF EXISTS sommeil_range;

ALTER TABLE public.symptom_tracking 
ADD CONSTRAINT douleur_range CHECK (douleur >= 0 AND douleur <= 10),
ADD CONSTRAINT dyspnee_range CHECK (dyspnee >= 0 AND dyspnee <= 10),
ADD CONSTRAINT anxiete_range CHECK (anxiete >= 0 AND anxiete <= 10),
ADD CONSTRAINT fatigue_range CHECK (fatigue >= 0 AND fatigue <= 10),
ADD CONSTRAINT sommeil_range CHECK (sommeil >= 0 AND sommeil <= 10);
