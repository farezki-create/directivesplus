
export interface DirectiveItem {
  id: string;
  type: 'directive' | 'document';
  content?: any;
  file_path?: string;
  file_name?: string;
  file_size?: number;
  content_type?: string;
  description?: string;
  created_at: string;
}

export interface InstitutionAccessResult {
  access_granted: boolean;
  user_id?: string;
  patient_info?: {
    first_name: string;
    last_name: string;
    birth_date: string;
  };
  directives?: DirectiveItem[];
  documents?: DirectiveItem[];
}

export interface InstitutionAccessState {
  accessGranted: boolean;
  loading: boolean;
  error: string | null;
  patientData: any | null;
  directiveItems: DirectiveItem[];
}
