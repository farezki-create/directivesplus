
-- Vérifier et corriger la table patient_alert_contacts
-- La table existe déjà mais vérifions qu'elle a toutes les colonnes nécessaires

-- Ajouter des colonnes manquantes si nécessaire (ces commandes échoueront silencieusement si les colonnes existent déjà)
DO $$ 
BEGIN
    -- Vérifier si la colonne patient_id existe, sinon l'ajouter
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'patient_alert_contacts' AND column_name = 'patient_id') THEN
        ALTER TABLE public.patient_alert_contacts ADD COLUMN patient_id UUID NOT NULL REFERENCES auth.users(id);
    END IF;
    
    -- Vérifier si la colonne contact_type existe, sinon l'ajouter
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'patient_alert_contacts' AND column_name = 'contact_type') THEN
        ALTER TABLE public.patient_alert_contacts ADD COLUMN contact_type TEXT NOT NULL;
    END IF;
    
    -- Vérifier si la colonne contact_name existe, sinon l'ajouter
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'patient_alert_contacts' AND column_name = 'contact_name') THEN
        ALTER TABLE public.patient_alert_contacts ADD COLUMN contact_name TEXT NOT NULL;
    END IF;
    
    -- Vérifier si la colonne phone_number existe, sinon l'ajouter
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'patient_alert_contacts' AND column_name = 'phone_number') THEN
        ALTER TABLE public.patient_alert_contacts ADD COLUMN phone_number TEXT;
    END IF;
    
    -- Vérifier si la colonne email existe, sinon l'ajouter
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'patient_alert_contacts' AND column_name = 'email') THEN
        ALTER TABLE public.patient_alert_contacts ADD COLUMN email TEXT;
    END IF;
    
    -- Vérifier si la colonne is_active existe, sinon l'ajouter
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'patient_alert_contacts' AND column_name = 'is_active') THEN
        ALTER TABLE public.patient_alert_contacts ADD COLUMN is_active BOOLEAN DEFAULT true;
    END IF;
    
    -- Vérifier si la colonne created_at existe, sinon l'ajouter
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'patient_alert_contacts' AND column_name = 'created_at') THEN
        ALTER TABLE public.patient_alert_contacts ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT now();
    END IF;
    
    -- Vérifier si la colonne updated_at existe, sinon l'ajouter
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'patient_alert_contacts' AND column_name = 'updated_at') THEN
        ALTER TABLE public.patient_alert_contacts ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT now();
    END IF;
END $$;

-- Ajouter une contrainte pour s'assurer qu'au moins un moyen de contact est fourni
ALTER TABLE public.patient_alert_contacts 
DROP CONSTRAINT IF EXISTS check_contact_method;

ALTER TABLE public.patient_alert_contacts 
ADD CONSTRAINT check_contact_method 
CHECK (phone_number IS NOT NULL OR email IS NOT NULL);

-- S'assurer que RLS est activé
ALTER TABLE public.patient_alert_contacts ENABLE ROW LEVEL SECURITY;

-- Supprimer les anciennes politiques si elles existent
DROP POLICY IF EXISTS "Users can view their own alert contacts" ON public.patient_alert_contacts;
DROP POLICY IF EXISTS "Users can create their own alert contacts" ON public.patient_alert_contacts;
DROP POLICY IF EXISTS "Users can update their own alert contacts" ON public.patient_alert_contacts;
DROP POLICY IF EXISTS "Users can delete their own alert contacts" ON public.patient_alert_contacts;

-- Recréer les politiques RLS
CREATE POLICY "Users can view their own alert contacts" 
  ON public.patient_alert_contacts 
  FOR SELECT 
  USING (auth.uid() = patient_id);

CREATE POLICY "Users can create their own alert contacts" 
  ON public.patient_alert_contacts 
  FOR INSERT 
  WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Users can update their own alert contacts" 
  ON public.patient_alert_contacts 
  FOR UPDATE 
  USING (auth.uid() = patient_id);

CREATE POLICY "Users can delete their own alert contacts" 
  ON public.patient_alert_contacts 
  FOR DELETE 
  USING (auth.uid() = patient_id);

-- S'assurer que les triggers pour updated_at fonctionnent
DROP TRIGGER IF EXISTS update_patient_alert_contacts_updated_at ON public.patient_alert_contacts;

CREATE TRIGGER update_patient_alert_contacts_updated_at
  BEFORE UPDATE ON public.patient_alert_contacts
  FOR EACH ROW
  EXECUTE FUNCTION update_patient_alert_contacts_updated_at();
