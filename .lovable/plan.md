

# Audit de Securite Complet - DirectivesPlus

## Resume Executif

L'audit a identifie **5 problemes critiques**, **12 problemes moderes** et **8 points d'information**. Les vulnerabilites les plus urgentes concernent la verification d'identite admin cote client, les fonctions de base de donnees non securisees, et l'exposition de donnees sensibles.

---

## 1. CRITIQUES - Corrections Urgentes

### 1.1 Verification admin par email cote client (11 fichiers)

**Risque** : Un attaquant peut s'inscrire avec un email `@directivesplus.fr` et obtenir un acces admin complet a l'application.

**Fichiers concernes** :
- `src/components/ProtectedRoute.tsx` (ligne 39)
- `src/pages/Admin.tsx` (ligne 16)
- `src/pages/AdminMainDashboard.tsx` (ligne 12)
- `src/pages/AdminStrictRLS.tsx` (ligne 12)
- `src/pages/AdminFeedback.tsx` (ligne 13)
- `src/pages/Index.tsx` (ligne 34)
- `src/pages/SuiviMultiPatients.tsx` (ligne 33)
- `src/pages/AlertesSoignants.tsx` (ligne 21)
- `src/components/Footer.tsx` (ligne 10)
- `src/components/security/SecurityQuickAccess.tsx` (ligne 14)
- `src/utils/security/strictRLSManager.ts` (ligne 16)

**Correction** : Remplacer toutes les verifications `email.endsWith('@directivesplus.fr')` par un appel a la table `user_roles` via la fonction `has_role()` existante. Concretement :
1. Ajouter une requete Supabase dans `AuthContext` pour charger le role de l'utilisateur au login
2. Exposer `isAdmin` depuis le contexte en se basant sur la table `user_roles`
3. Mettre a jour tous les 11 fichiers pour utiliser ce flag

### 1.2 47 fonctions SECURITY DEFINER sans search_path fixe

**Risque** : Escalade de privileges via manipulation du `search_path` PostgreSQL. Un attaquant pourrait contourner toutes les verifications d'acces aux donnees medicales.

**Correction** : Migration SQL pour ajouter `SET search_path = public` aux 47 fonctions concernees. Les fonctions critiques incluent :
- `verify_otp`, `verify_code`, `verify_2fa_code` (authentification)
- `verify_institution_access`, `institution_has_patient_access` (acces institution)
- `get_documents_with_access_code`, `get_shared_documents_by_access_code` (acces documents)
- `is_admin`, `is_user_admin`, `is_current_user_admin` (verification admin)
- `check_rate_limit_secure`, `check_sms_rate_limit` (limitation de debit)

### 1.3 Codes de verification SMS lisibles par les anonymes

**Risque** : La table `sms_codes` a une politique SELECT permettant aux utilisateurs `anon` de lire les codes. Un attaquant peut intercepter les codes SMS de n'importe quel numero.

**Politique actuelle** :
```
Allow read for same phone - USING: auth.role() = 'anon' OR auth.role() = 'authenticated'
```

**Correction** : Remplacer par une politique qui restreint l'acces au seul service role, puisque la verification doit se faire cote serveur uniquement.

### 1.4 Donnees d'institutions de sante exposees publiquement

**Risque** : La table `abonnes_institutions` contient emails, telephones et noms des institutions. La politique `Institutions can view their own data` utilise `auth.jwt() ->> 'email'` ce qui est exploitable.

**Correction** : Remplacer la verification par email JWT par une jointure securisee ou un mecanisme base sur `auth.uid()`.

### 1.5 Edge function `accessSharedProfile` sans validation d'entree

**Risque** : Aucune validation de format, longueur ou caracteres sur les inputs. Permet des attaques par injection, DoS par payload volumineux, et enumeration de profils.

**Correction** : Ajouter validation Zod comme deja fait dans `send-symptom-alert` :
- `firstName`/`lastName` : max 100 chars, regex `[a-zA-ZA-yss-']`
- `birthdate` : format YYYY-MM-DD strict
- `accessCode` : exactement 8 caracteres alphanumeriques majuscules

---

## 2. MODERES - Corrections Importantes

### 2.1 Politiques RLS `WITH CHECK (true)` sur 8 tables de logs

Tables concernees : `access_code_attempts`, `access_logs`, `alert_notifications_sent`, `document_access_logs`, `institution_access_logs`, `medical_access_audit`, `symptom_access_logs`, `sms_send_logs`

Ces politiques permettent a n'importe qui (role `public`) d'inserer dans les tables d'audit. Bien que necessaire pour le logging systeme, cela devrait etre restreint au service role.

**Correction** : Changer les roles de `public` a `service_role` pour les politiques INSERT.

### 2.2 Protection contre les mots de passe compromis desactivee

La fonctionnalite "Leaked Password Protection" de Supabase est desactivee.

**Correction** : Activer dans Supabase Dashboard > Authentication > Settings > Password Security.

### 2.3 Articles de sante en brouillon visibles

La politique de `health_news` permet aux utilisateurs authentifies de voir les brouillons.

**Correction** : Ajouter une condition `status = 'published'` pour les non-admins.

### 2.4 Questions de feedback publiquement lisibles

`feedback_questions` a une politique SELECT `USING (true)` pour le role `public`.

**Correction** : Restreindre a `authenticated`.

### 2.5 Logs de debug restants dans ProtectedRoute

`ProtectedRoute.tsx` contient encore 4 `console.log` qui fuient des informations sensibles (email utilisateur, statut admin).

**Correction** : Supprimer les 4 console.log aux lignes 16-23, 41-45, 52, 102-106, 125.

---

## 3. INFORMATIFS - Ameliorations Recommandees

| Element | Description |
|---------|-------------|
| Questionnaires publics | 8 tables de questionnaires sont lisibles publiquement (potentiellement intentionnel) |
| Table `user_otp` | Politique `ALL` avec `true` pour `service_role` (correct mais a verifier) |
| Conversations | Pas de politique DELETE (utilisateurs ne peuvent pas supprimer leur historique) |
| Documents medicaux | Pas de mecanisme de partage (contrairement a `pdf_documents`) |
| Suivi symptomes | Pas d'acces pour les soignants autorises |
| Codes institution | Pas de politique RLS visible pour l'acces institutionnel aux directives |

---

## Plan d'Implementation (par priorite)

### Phase 1 - Critique (immediat)
1. **Migration SQL** : Ajouter `SET search_path = public` aux 47 fonctions SECURITY DEFINER
2. **Migration SQL** : Corriger la politique RLS de `sms_codes` (supprimer acces anon)
3. **Migration SQL** : Corriger la politique RLS de `abonnes_institutions`
4. **Code** : Charger le role admin depuis `user_roles` dans `AuthContext`
5. **Code** : Remplacer les 11 verifications email par `isAdmin` du contexte
6. **Code** : Ajouter validation Zod dans `accessSharedProfile`

### Phase 2 - Moderee (cette semaine)
7. **Migration SQL** : Restreindre les INSERT sur les tables de logs au `service_role`
8. **Migration SQL** : Corriger la politique `health_news` pour filtrer les brouillons
9. **Migration SQL** : Restreindre `feedback_questions` a `authenticated`
10. **Code** : Supprimer les console.log restants dans `ProtectedRoute.tsx`
11. **Dashboard** : Activer "Leaked Password Protection" dans Supabase

### Phase 3 - Amelioration (planifie)
12. Ajouter des politiques DELETE pour les conversations
13. Evaluer la necessite de proteger les questionnaires publics

### Details Techniques

**Contexte Auth modifie** : Le `AuthContext` devra effectuer une requete `supabase.from('user_roles').select('role').eq('user_id', user.id).eq('role', 'admin').maybeSingle()` apres chaque changement d'etat d'authentification pour determiner `isAdmin`.

**Migration des fonctions** : La migration contiendra 47 instructions `CREATE OR REPLACE FUNCTION` identiques aux fonctions existantes mais avec l'ajout de `SET search_path = public`. Cela n'affecte pas le comportement fonctionnel.

**Estimation** : Phase 1 necessite environ 3-4 messages de travail. Phase 2 environ 2 messages.

