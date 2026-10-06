/**
 * Universal validation result contract across all lanka-validations modules
 */
export interface ValidationResult<T = unknown> {
  isValid: boolean;
  data?: T;
  error?: string;
  errors?: string[];
  code?: string;
}

export interface ValidationError {
  field?: string;
  code: string;
  message: string;
}
