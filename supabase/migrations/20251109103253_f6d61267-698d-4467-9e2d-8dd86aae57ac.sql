-- Migration: Correction de la récursion infinie sur conversation_participants
-- Crée une fonction SECURITY DEFINER pour briser la boucle

-- ============================================
-- 1. Créer la fonction sécurisée
-- ============================================

CREATE OR REPLACE FUNCTION public.user_is_conversation_participant(
  _conversation_id uuid,
  _user_id uuid
)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.conversation_participants
    WHERE conversation_id = _conversation_id
      AND user_id = _user_id
  )
$$;

-- ============================================
-- 2. Supprimer les politiques problématiques
-- ============================================

DROP POLICY IF EXISTS "Users can add participants to conversations they're in" ON conversation_participants;
DROP POLICY IF EXISTS "Users can view participants of their conversations" ON conversation_participants;

-- ============================================
-- 3. Recréer les politiques avec la fonction
-- ============================================

CREATE POLICY "Users can add participants to conversations they're in"
ON conversation_participants
FOR INSERT
WITH CHECK (
  public.user_is_conversation_participant(conversation_id, auth.uid())
);

CREATE POLICY "Users can view participants of their conversations"
ON conversation_participants
FOR SELECT
USING (
  public.user_is_conversation_participant(conversation_id, auth.uid())
);

-- ============================================
-- 4. Corriger également les politiques sur conversations et messages
-- ============================================

-- Vérifier et corriger la politique sur conversations
DROP POLICY IF EXISTS "Users can view conversations they participate in" ON conversations;

CREATE POLICY "Users can view conversations they participate in"
ON conversations
FOR SELECT
USING (
  public.user_is_conversation_participant(id, auth.uid())
);

-- Vérifier et corriger les politiques sur messages
DROP POLICY IF EXISTS "Users can send messages in their conversations" ON messages;
DROP POLICY IF EXISTS "Users can view messages in their conversations" ON messages;

CREATE POLICY "Users can send messages in their conversations"
ON messages
FOR INSERT
WITH CHECK (
  (auth.uid() = user_id) AND 
  public.user_is_conversation_participant(conversation_id, auth.uid())
);

CREATE POLICY "Users can view messages in their conversations"
ON messages
FOR SELECT
USING (
  public.user_is_conversation_participant(conversation_id, auth.uid())
);