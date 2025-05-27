
export interface HealthNews {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  featured_image_url?: string;
  category: string;
  status: string; // Changé de 'draft' | 'published' | 'archived' à string
  publication_date?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
  view_count: number;
  tags?: string[];
  is_featured: boolean;
  media?: HealthNewsMedia[];
}

export interface HealthNewsMedia {
  id: string;
  news_id: string;
  media_type: 'image' | 'video' | 'audio' | 'document';
  media_url: string;
  media_name: string;
  media_size?: number;
  mime_type?: string;
  caption?: string;
  display_order: number;
  created_at: string;
}

export interface CreateHealthNewsData {
  title: string;
  content: string;
  excerpt?: string;
  featured_image_url?: string;
  category: string;
  status: 'draft' | 'published';
  publication_date?: string;
  tags?: string[];
  is_featured: boolean;
}
