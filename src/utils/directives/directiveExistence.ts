
import { DirectiveDocument } from "@/types/directivesTypes";
import { useDirectivesStore } from "@/store/directivesStore";

export const checkDirectiveExistence = (): boolean => {
  const { documents } = useDirectivesStore.getState();
  return documents.length > 0;
};

export const getDirectiveCount = (): number => {
  const { documents } = useDirectivesStore.getState();
  return documents.length;
};

export const hasValidDirectives = (): boolean => {
  const { documents } = useDirectivesStore.getState();
  return documents.some(doc => doc.file_path && doc.file_name);
};
