
-- Sécuriser les INSERT système restants qui ne devraient pas être ouverts à tous

-- 1. sms_codes: restreindre à l'utilisateur authentifié
DROP POLICY IF EXISTS "Allow insert for everyone" ON public.sms_codes;
CREATE POLICY "Authenticated users can insert sms codes"
ON public.sms_codes
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

-- 2. auth_codes: restreindre INSERT aux utilisateurs authentifiés  
DROP POLICY IF EXISTS "Allow insert auth codes" ON public.auth_codes;
CREATE POLICY "Authenticated users can insert auth codes"
ON public.auth_codes
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

-- 3. auth_codes_verification: restreindre INSERT aux utilisateurs authentifiés
DROP POLICY IF EXISTS "Allow insert verification codes" ON public.auth_codes_verification;
CREATE POLICY "Authenticated users can insert verification codes"
ON public.auth_codes_verification
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

-- 4. Dédupliquer medical_access_audit (2 politiques INSERT identiques)
DROP POLICY IF EXISTS "System can insert audit logs" ON public.medical_access_audit;
-- Garder "System can insert medical access audit"

-- 5. access_logs: dédupliquer (2 politiques INSERT)
DROP POLICY IF EXISTS "allow inserts for anon" ON public.access_logs;
-- Garder "System can insert access logs"

-- 6. document_access_logs: dédupliquer (garder la politique système)
DROP POLICY IF EXISTS "Les utilisateurs peuvent insérer leurs propres logs d'accès" ON public.document_access_logs;
-- Garder "System can insert document access logs"
