
import { create } from 'zustand';

interface DirectiveDocument {
  id: string;
  file_name: string;
  file_path: string;
  created_at: string;
  content_type?: string;
  user_id?: string;
  content?: any;
}

interface TrustedPerson {
  id: string;
  firstName: string;
  lastName: string;
  relationship: string;
  phone: string;
  email?: string;
}

interface DirectivesState {
  documents: DirectiveDocument[];
  currentDocument: DirectiveDocument | null;
  responses: Record<string, string>;
  trustedPersons: TrustedPerson[];
  setDocuments: (documents: DirectiveDocument[]) => void;
  setCurrentDocument: (document: DirectiveDocument | null) => void;
  addDocument: (document: DirectiveDocument) => void;
  removeDocument: (documentId: string) => void;
  updateResponse: (questionId: string, value: string) => void;
  setResponses: (responses: Record<string, string>) => void;
  addTrustedPerson: (person: TrustedPerson) => void;
  removeTrustedPerson: (personId: string) => void;
  updateTrustedPerson: (personId: string, person: Partial<TrustedPerson>) => void;
}

export const useDirectivesStore = create<DirectivesState>((set) => ({
  documents: [],
  currentDocument: null,
  responses: {},
  trustedPersons: [],
  setDocuments: (documents) => set({ documents }),
  setCurrentDocument: (document) => set({ currentDocument: document }),
  addDocument: (document) => set((state) => ({ 
    documents: [...state.documents, document] 
  })),
  removeDocument: (documentId) => set((state) => ({ 
    documents: state.documents.filter(doc => doc.id !== documentId) 
  })),
  updateResponse: (questionId, value) => set((state) => ({
    responses: { ...state.responses, [questionId]: value }
  })),
  setResponses: (responses) => set({ responses }),
  addTrustedPerson: (person) => set((state) => ({
    trustedPersons: [...state.trustedPersons, person]
  })),
  removeTrustedPerson: (personId) => set((state) => ({
    trustedPersons: state.trustedPersons.filter(p => p.id !== personId)
  })),
  updateTrustedPerson: (personId, updatedPerson) => set((state) => ({
    trustedPersons: state.trustedPersons.map(p => 
      p.id === personId ? { ...p, ...updatedPerson } : p
    )
  })),
}));
