/** Age limits and reference date for {@link validateDob} and {@link isValidDob}. Ages are full years on the UTC calendar date. */
export interface DobOptions {
  /** Minimum allowable age in full years */
  minAge?: number;
  /** Maximum allowable age in full years */
  maxAge?: number;
  /** Optional reference date for age calculation (defaults to current date) */
  referenceDate?: Date | undefined;
}
