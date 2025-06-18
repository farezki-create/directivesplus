
import { Document } from "@/types/documents";

export interface PostData {
  id: string;
  content: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  likes_count: number;
  comments_count: number;
  shared_document?: Document | null;
  profiles?: {
    first_name: string;
    last_name: string;
  };
  comments?: Array<{
    id: string;
    content: string;
    created_at: string;
    profiles?: {
      first_name: string;
      last_name: string;
    };
  }>;
  likes?: Array<{
    user_id: string;
  }>;
  user_has_liked: boolean;
}

export interface UsePostsReturn {
  posts: PostData[];
  loading: boolean;
  createPost: (content: string, sharedDocument?: Document) => Promise<void>;
  toggleLike: (postId: string) => Promise<void>;
  addComment: (postId: string, content: string) => Promise<void>;
  refetch: () => Promise<void>;
}
