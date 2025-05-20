
import { RefObject } from "react";

export interface CardOperationOptions {
  cardRef: RefObject<HTMLDivElement>;
  userId: string;
  firstName: string;
  lastName: string;
  includeDirective: boolean;
  includeMedical: boolean;
  directiveCode?: string | null;
  medicalCode?: string | null;
}
