
export interface MedicalDocument {
  id: string;
  file_name: string;
  file_path: string;
  file_type: string;
  file_size: number;
  description: string;
  created_at: string;
  user_id: string;
  extracted_content?: string;
  is_private?: boolean;
}
