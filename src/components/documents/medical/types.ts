
export interface MedicalDocument {
  id: string;
  file_name: string;
  file_path: string;
  file_type?: string;
  content_type?: string;
  file_size?: number;
  description: string;
  is_visible_to_institutions?: boolean;
  medical_document_type?: string;
  antivirus_status?: string;
  created_at: string;
  user_id: string;
  extracted_content?: string;
}
