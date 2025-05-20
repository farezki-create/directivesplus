
export interface CardOperationOptions {
  cardRef: React.RefObject<HTMLDivElement>;
  userId: string;
  firstName: string;
  lastName: string;
  includeDirective: boolean;
  includeMedical: boolean;
  directiveCode?: string | null;
  medicalCode?: string | null;
}
