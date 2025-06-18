
-- Table pour les questions du questionnaire d'avis
CREATE TABLE public.feedback_questions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  question_text text NOT NULL,
  question_type text NOT NULL, -- 'single_choice', 'rating', 'text', 'multiple_choice'
  options jsonb, -- Pour les choix multiples et échelles de notation
  display_order integer NOT NULL,
  category text, -- Pour grouper les questions par thème
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now()
);

-- Table pour les réponses au questionnaire d'avis
CREATE TABLE public.feedback_responses (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id),
  question_id uuid REFERENCES public.feedback_questions(id),
  response_value text NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.feedback_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback_responses ENABLE ROW LEVEL SECURITY;

-- RLS Policies pour feedback_questions (lecture publique, écriture admin)
CREATE POLICY "feedback_questions_read_all" ON public.feedback_questions
  FOR SELECT USING (true);

CREATE POLICY "feedback_questions_admin_only" ON public.feedback_questions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE id = auth.uid() 
      AND email LIKE '%@directivesplus.fr'
    )
  );

-- RLS Policies pour feedback_responses (utilisateurs peuvent créer leurs réponses, admins peuvent tout voir)
CREATE POLICY "feedback_responses_create_own" ON public.feedback_responses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "feedback_responses_read_own" ON public.feedback_responses
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "feedback_responses_admin_read_all" ON public.feedback_responses
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE id = auth.uid() 
      AND email LIKE '%@directivesplus.fr'
    )
  );

-- Insérer les questions du questionnaire
INSERT INTO public.feedback_questions (question_text, question_type, options, display_order, category) VALUES
-- Questions de découverte
('Avant de découvrir l''application, Directivesplus, connaissiez-vous une solution numérique pour la rédaction ou le partage des directives anticipées ?', 'single_choice', '["Oui", "Non"]', 1, 'découverte'),
('Avez-vous consulté ou testé l''application ?', 'single_choice', '["Oui, en détail", "Oui, rapidement", "Non, pas encore"]', 2, 'découverte'),

-- Questions d'évaluation (échelle 1-5)
('Clarté des explications', 'rating', '{"min": 1, "max": 5, "labels": {"1": "Très mauvais", "2": "Mauvais", "3": "Moyen", "4": "Bon", "5": "Excellent"}}', 3, 'évaluation'),
('Ergonomie / navigation', 'rating', '{"min": 1, "max": 5, "labels": {"1": "Très mauvais", "2": "Mauvais", "3": "Moyen", "4": "Bon", "5": "Excellent"}}', 4, 'évaluation'),
('Pertinence du contenu médical', 'rating', '{"min": 1, "max": 5, "labels": {"1": "Très mauvais", "2": "Mauvais", "3": "Moyen", "4": "Bon", "5": "Excellent"}}', 5, 'évaluation'),
('Utilité pour vos patients', 'rating', '{"min": 1, "max": 5, "labels": {"1": "Très mauvais", "2": "Mauvais", "3": "Moyen", "4": "Bon", "5": "Excellent"}}', 6, 'évaluation'),
('Utilité pour votre pratique', 'rating', '{"min": 1, "max": 5, "labels": {"1": "Très mauvais", "2": "Mauvais", "3": "Moyen", "4": "Bon", "5": "Excellent"}}', 7, 'évaluation'),
('Sécurité perçue des données', 'rating', '{"min": 1, "max": 5, "labels": {"1": "Très mauvais", "2": "Mauvais", "3": "Moyen", "4": "Bon", "5": "Excellent"}}', 8, 'évaluation'),

-- Questions ouvertes
('Quels sont, selon vous, les points forts de l''application ?', 'text', null, 9, 'feedback'),
('Quels sont, selon vous, les points faibles de l''application ?', 'text', null, 10, 'feedback'),

-- Questions de recommandation et conformité
('Seriez-vous prêt(e) à recommander cette application à vos patients ?', 'single_choice', '["Oui", "Oui, sous certaines conditions", "Non"]', 11, 'recommandation'),
('Cette application vous semble-t-elle conforme à l''éthique médicale ?', 'single_choice', '["Oui", "Non", "Je ne sais pas"]', 12, 'éthique'),

-- Questions de sécurité
('Le fait que l''application soit hébergée en France sur un serveur certifié HDS vous semble-t-il :', 'single_choice', '["Indispensable", "Important", "Peu important", "Sans importance", "Je ne sais pas ce qu''est un hébergement HDS"]', 13, 'sécurité'),
('Avez-vous confiance dans la capacité de l''application à protéger les données de santé ?', 'single_choice', '["Oui, pleinement", "Moyennement", "Non", "Je ne sais pas"]', 14, 'sécurité'),
('Les aspects de sécurité que vous pensez importants:', 'multiple_choice', '["Hébergement HDS", "Chiffrement des données", "Journalisation des accès", "Accès à la modification ou suppression des données", "Autre"]', 15, 'sécurité');
