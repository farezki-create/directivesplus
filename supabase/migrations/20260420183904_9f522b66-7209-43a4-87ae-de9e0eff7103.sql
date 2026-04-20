
-- ============================================================
-- 1. FIX: user_roles privilege escalation (user_roles_self_assignment)
-- Add explicit restrictive policies for INSERT/UPDATE/DELETE
-- ============================================================

-- Drop the overly broad ALL policy that doesn't properly restrict non-admins
DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;

-- Re-create admin SELECT (admins see all roles)
CREATE POLICY "Admins can view all roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admin-only INSERT
CREATE POLICY "Only admins can insert roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Admin-only UPDATE
CREATE POLICY "Only admins can update roles"
ON public.user_roles
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Admin-only DELETE
CREATE POLICY "Only admins can delete roles"
ON public.user_roles
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- ============================================================
-- 2. FIX: institution_subscriptions policy (institution_subscriptions_email_bypass)
-- Replace auth.role() = 'admin' with has_role() and add est_valide check
-- ============================================================

DROP POLICY IF EXISTS "select_own_or_admin" ON public.institution_subscriptions;

CREATE POLICY "select_own_or_admin"
ON public.institution_subscriptions
FOR SELECT
TO authenticated
USING (
  has_role(auth.uid(), 'admin'::app_role)
  OR (
    institution_id IN (
      SELECT ai.id
      FROM public.abonnes_institutions ai
      WHERE ai.email = auth.email()
        AND ai.est_valide = true
    )
  )
);

-- ============================================================
-- 3. FIX: patients table JWT email claim (patients_table_no_select_for_owner)
-- Replace JWT email-based check with auth.uid() via profiles lookup
-- ============================================================

DROP POLICY IF EXISTS "Institution members read patients in their structure" ON public.patients;

CREATE POLICY "Institution members read patients in their structure"
ON public.patients
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.abonnes_institutions a
    WHERE a.est_valide = true
      AND a.structure_autorisee = patients.structure
      AND a.email = (
        SELECT u.email FROM auth.users u WHERE u.id = auth.uid()
      )
  )
  OR has_role(auth.uid(), 'admin'::app_role)
);
