/**
 * Universal validation result contract across all lanka-validations modules
 */
export interface ValidationSuccess<T> {
  isValid: true;
  data: T;
  error?: never;
  errors?: never;
  code?: never;
}

/** A failed validation. `code` is stable across releases and safe to branch on; `error` is an English message for display. */
export interface ValidationFailure {
  isValid: false;
  data?: never;
  error: string;
  errors: string[];
  code: string;
}

/** Checking `isValid` narrows this result to success data or failure details. */
export type ValidationResult<T = unknown> = ValidationSuccess<T> | ValidationFailure;

/** A single validation problem, optionally tied to a form field. */
export interface ValidationError {
  field?: string;
  code: string;
  message: string;
}
