
-- Migration: Corriger les 3 dernières fonctions sans search_path configuré
-- Note: SET search_path dans le body n'est PAS suffisant, il faut le mettre dans la définition CREATE

-- DROP les versions stub
DROP FUNCTION IF EXISTS public.send_sms_code() CASCADE;
DROP FUNCTION IF EXISTS public.update_sms_status() CASCADE;

-- Corriger send_sms_code avec SET search_path dans la définition
CREATE OR REPLACE FUNCTION public.send_sms_code(phone text)
RETURNS void
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  code text := lpad(floor(random() * 1000000)::text, 6, '0');
BEGIN
  -- Supprimer les codes anciens
  DELETE FROM sms_codes WHERE phone_number = phone;

  -- Insérer le nouveau code
  INSERT INTO sms_codes (phone_number, code) VALUES (phone, code);

  -- Appel HTTP à Brevo via edge function ou backend Node
  -- Le code ne peut PAS être envoyé directement depuis Supabase
END;
$$;

-- Corriger update_sms_status avec SET search_path dans la définition
CREATE OR REPLACE FUNCTION public.update_sms_status(
  p_log_id uuid,
  p_status text,
  p_brevo_message_id text DEFAULT NULL,
  p_error_message text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  UPDATE sms_send_logs
  SET 
    status = p_status,
    brevo_message_id = p_brevo_message_id,
    error_message = p_error_message,
    sent_at = CASE WHEN p_status = 'sent' THEN NOW() ELSE sent_at END
  WHERE id = p_log_id;
END;
$$;
