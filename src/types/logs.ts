
// Types pour les différentes tables de logs
export interface AccessLog {
  id: string;
  directive_id?: string;
  accessed_at?: string;
  access_by?: string;
  access_type?: string;
  ip_address?: string | null;
  user_agent?: string;
}

export interface AccessCodeAttempt {
  id: string;
  access_code?: string;
  attempt_time?: string;
  ip_address?: string | null;
  user_agent?: string;
  success: boolean;
}

export interface DocumentAccessLog {
  id: string;
  user_id: string;
  access_code_id: string;
  date_consultation?: string;
  nom_consultant?: string;
  prenom_consultant?: string;
  ip_address?: string | null;
  user_agent?: string;
}

export interface MedicalAccessAudit {
  id: string;
  user_id?: string;
  resource_id: string;
  resource_type: string;
  access_method: string;
  access_granted: boolean;
  accessed_at?: string;
  ip_address?: string | null;
  user_agent?: string;
  session_id?: string;
  failure_reason?: string;
  additional_context?: any;
}

export interface InstitutionAccessLog {
  id: string;
  user_id: string;
  institution_code_id: string;
  institution_name?: string;
  access_type?: string;
  accessed_at?: string;
  ip_address?: string | null;
  user_agent?: string;
}

export interface SecurityAuditLog {
  id: string;
  user_id?: string;
  event_type: string;
  created_at?: string;
  details?: any;
  risk_level?: string;
  ip_address?: string | null;
  user_agent?: string;
}

// Type union pour tous les logs
export type LogEntry = AccessLog | AccessCodeAttempt | DocumentAccessLog | 
  MedicalAccessAudit | InstitutionAccessLog | SecurityAuditLog;
