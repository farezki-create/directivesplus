
export interface DiagnosticResult {
  test: string;
  status: string;
  details: string;
  success: boolean;
  rawError?: any;
  duration?: number;
  data?: any;
}
