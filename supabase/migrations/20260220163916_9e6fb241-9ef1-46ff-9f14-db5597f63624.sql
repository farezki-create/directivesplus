
-- =====================================================
-- CORRECTION DES VULNÉRABILITÉS RLS CRITIQUES
-- =====================================================

-- 1. PROFILES: Supprimer la politique qui expose TOUS les profils à tous les utilisateurs authentifiés
DROP POLICY IF EXISTS "Users can read profiles for alert validation" ON public.profiles;

-- Supprimer les politiques SELECT en double sur profiles
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can read their own profile" ON public.profiles;
-- Garder uniquement "Les utilisateurs peuvent voir uniquement leur propre profil"

-- Supprimer les politiques INSERT en double sur profiles  
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
-- Garder uniquement "Les utilisateurs peuvent insérer uniquement leur propre profil"

-- Supprimer les politiques UPDATE en double sur profiles
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
-- Garder uniquement "Les utilisateurs peuvent uniquement mettre à jour leur propre "

-- 2. PATIENT_ALERT_CONTACTS: Remplacer les politiques trop permissives
DROP POLICY IF EXISTS "Authenticated users can create alert contacts" ON public.patient_alert_contacts;
DROP POLICY IF EXISTS "Authenticated users can delete alert contacts" ON public.patient_alert_contacts;
DROP POLICY IF EXISTS "Authenticated users can update alert contacts" ON public.patient_alert_contacts;
DROP POLICY IF EXISTS "Authenticated users can view alert contacts" ON public.patient_alert_contacts;

-- Recréer avec des restrictions sur patient_id
CREATE POLICY "Users can create their own alert contacts"
ON public.patient_alert_contacts
FOR INSERT
WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Users can view their own alert contacts"
ON public.patient_alert_contacts
FOR SELECT
USING (auth.uid() = patient_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can update their own alert contacts"
ON public.patient_alert_contacts
FOR UPDATE
USING (auth.uid() = patient_id);

CREATE POLICY "Users can delete their own alert contacts"
ON public.patient_alert_contacts
FOR DELETE
USING (auth.uid() = patient_id);

-- 3. ORDERS: Restreindre l'INSERT aux utilisateurs authentifiés avec leur propre user_id
DROP POLICY IF EXISTS "Users can create orders" ON public.orders;

CREATE POLICY "Users can create their own orders"
ON public.orders
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- 4. AUTH_CODES: Restreindre l'UPDATE aux propres codes de l'utilisateur
DROP POLICY IF EXISTS "Allow update auth codes" ON public.auth_codes;

CREATE POLICY "Users can update their own auth codes"
ON public.auth_codes
FOR UPDATE
USING (auth.uid() = user_id OR user_id IS NULL);

-- 5. Nettoyage des doublons sur la table DIRECTIVES
DROP POLICY IF EXISTS "Users can insert own directives" ON public.directives;
DROP POLICY IF EXISTS "Users can insert their own directives" ON public.directives;
DROP POLICY IF EXISTS "Users can update own directives" ON public.directives;
DROP POLICY IF EXISTS "Users can update their own directives" ON public.directives;
DROP POLICY IF EXISTS "Users can view own directives" ON public.directives;
DROP POLICY IF EXISTS "Users can view their own directives" ON public.directives;
-- Garder "Users can manage their own directives" (ALL) + les politiques FR

-- Supprimer aussi les doublons FR qui font la même chose que "manage"
DROP POLICY IF EXISTS "Les utilisateurs peuvent insérer uniquement leurs propres dire" ON public.directives;
DROP POLICY IF EXISTS "Les utilisateurs peuvent uniquement mettre à jour leurs propre" ON public.directives;
DROP POLICY IF EXISTS "Les utilisateurs peuvent uniquement supprimer leurs propres dir" ON public.directives;
DROP POLICY IF EXISTS "Les utilisateurs peuvent voir uniquement leurs propres directiv" ON public.directives;
-- "Users can manage their own directives" couvre ALL (SELECT, INSERT, UPDATE, DELETE)

-- 6. Nettoyage doublons MEDICAL_DOCUMENTS
DROP POLICY IF EXISTS "Users can create their own medical documents" ON public.medical_documents;
DROP POLICY IF EXISTS "Users can delete their own medical documents" ON public.medical_documents;
DROP POLICY IF EXISTS "Users can view their own medical documents" ON public.medical_documents;
-- Garder les politiques FR existantes

-- 7. Nettoyage doublons DOCUMENT_ACCESS_LOGS
DROP POLICY IF EXISTS "Users can view their own access logs" ON public.document_access_logs;
-- Garder "Users can view their own document access logs" qui inclut admin check
