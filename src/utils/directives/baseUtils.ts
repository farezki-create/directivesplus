
import { DirectiveDocument } from "@/types/directivesTypes";
import { useDirectivesStore } from "@/store/directivesStore";

export const hasDirectivesAccess = (): boolean => {
  const { documents } = useDirectivesStore.getState();
  return documents.length > 0;
};

export const getDirectivesDocuments = (): DirectiveDocument[] => {
  const { documents } = useDirectivesStore.getState();
  return documents;
};

export const isDirectivesAccessible = (): boolean => {
  return hasDirectivesAccess();
};
