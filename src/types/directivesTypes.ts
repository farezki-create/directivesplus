
export interface DirectiveDocument {
  id: string;
  file_name: string;
  file_path: string;
  created_at: string;
  description?: string;
  content_type?: string;
  file_type?: string;
  user_id?: string;
  is_private?: boolean;
  content?: any;
}

export interface PatientData {
  first_name: string;
  last_name: string;
  birth_date: string;
}

export interface DirectiveItem {
  id: string;
  type: 'directive' | 'document';
  content?: any;
  file_path?: string;
  file_name?: string;
  content_type?: string;
  file_size?: number;
  description?: string;
  created_at: string;
}

export interface InstitutionAccessState {
  accessGranted: boolean;
  loading: boolean;
  error: string | null;
  patientData: PatientData | null;
  directiveItems: DirectiveItem[];
}
