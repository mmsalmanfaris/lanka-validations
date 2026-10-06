export interface DobOptions {
  /** Minimum allowable age in full years */
  minAge?: number;
  /** Maximum allowable age in full years */
  maxAge?: number;
  /** Optional reference date for age calculation (defaults to current date) */
  referenceDate?: Date;
}
