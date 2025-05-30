
import { create } from 'zustand';

interface DirectiveDocument {
  id: string;
  file_name: string;
  file_path: string;
  created_at: string;
  content_type?: string;
  user_id?: string;
}

interface DirectivesState {
  documents: DirectiveDocument[];
  currentDocument: DirectiveDocument | null;
  setDocuments: (documents: DirectiveDocument[]) => void;
  setCurrentDocument: (document: DirectiveDocument | null) => void;
  addDocument: (document: DirectiveDocument) => void;
  removeDocument: (documentId: string) => void;
}

export const useDirectivesStore = create<DirectivesState>((set) => ({
  documents: [],
  currentDocument: null,
  setDocuments: (documents) => set({ documents }),
  setCurrentDocument: (document) => set({ currentDocument: document }),
  addDocument: (document) => set((state) => ({ 
    documents: [...state.documents, document] 
  })),
  removeDocument: (documentId) => set((state) => ({ 
    documents: state.documents.filter(doc => doc.id !== documentId) 
  })),
}));
