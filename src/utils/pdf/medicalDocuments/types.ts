
export interface MedicalDocument {
  id: string;
  file_name: string;
  description?: string;
  created_at: string;
  user_id: string;
  content?: string;
  file_type: string;
  file_path: string;
  extracted_content?: string;
}
