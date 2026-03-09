-- ============================================================
-- FIX 1: auth_codes_verification - codes lisibles/modifiables par tous
-- ============================================================

DROP POLICY IF EXISTS "Allow read own verification codes" ON public.auth_codes_verification;
DROP POLICY IF EXISTS "Allow update verification codes" ON public.auth_codes_verification;
DROP POLICY IF EXISTS "Authenticated users can insert verification codes" ON public.auth_codes_verification;

-- Service role full access
CREATE POLICY "Service role manages verification codes"
ON public.auth_codes_verification
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Authenticated users insert their own codes
CREATE POLICY "Authenticated users insert own verification codes"
ON public.auth_codes_verification
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Users read only their own active codes
CREATE POLICY "Users read own verification codes"
ON public.auth_codes_verification
FOR SELECT
TO authenticated
USING (auth.uid() = user_id AND expires_at > now() AND used = false);

-- Users update only their own codes
CREATE POLICY "Users update own verification codes"
ON public.auth_codes_verification
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id AND expires_at > now())
WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- FIX 2: patients - données exposées au rôle public
-- ============================================================

DROP POLICY IF EXISTS "lecture_par_institution_par_structure" ON public.patients;

CREATE POLICY "Institution members read patients in their structure"
ON public.patients
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM abonnes_institutions a
    WHERE a.est_valide = true
      AND a.structure_autorisee = patients.structure
      AND a.email = (auth.jwt() ->> 'email')
  )
);

-- ============================================================
-- FIX 3: symptomes - accessibles sans vérifier le code
-- ============================================================

DROP POLICY IF EXISTS "Access symptomes with patient code" ON public.symptomes;

CREATE POLICY "Authenticated institution access to symptomes"
ON public.symptomes
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM patients p
    JOIN abonnes_institutions a ON a.structure_autorisee = p.structure
    WHERE p.id = symptomes.patient_id
      AND a.est_valide = true
      AND a.email = (auth.jwt() ->> 'email')
  )
);

-- ============================================================
-- FIX 4: shared_profiles - lisibles par tous les authentifiés
-- ============================================================

DROP POLICY IF EXISTS "Valid code read access" ON public.shared_profiles;