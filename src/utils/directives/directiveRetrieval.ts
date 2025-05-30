
import { DirectiveDocument } from "@/types/directivesTypes";
import { useDirectivesStore } from "@/store/directivesStore";

export const retrieveDirectives = (): DirectiveDocument[] => {
  const { documents } = useDirectivesStore.getState();
  return documents;
};

export const getDirectiveById = (id: string): DirectiveDocument | undefined => {
  const { documents } = useDirectivesStore.getState();
  return documents.find(doc => doc.id === id);
};

export const getDirectiveByPath = (filePath: string): DirectiveDocument | undefined => {
  const { documents } = useDirectivesStore.getState();
  return documents.find(doc => doc.file_path === filePath);
};
