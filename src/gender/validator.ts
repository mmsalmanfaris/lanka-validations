import { cleanString, createFailure, createSuccess } from '../common/utils';
import type { ValidationResult } from '../common/types';
import { parseNic } from '../nic/parser';
import type { Gender } from '../nic/types';

function normalizeTerm(str: string): string {
  return str
    .normalize('NFC')
    .replace(/\u200B|\u200C|\u200D|\uFEFF/g, '')
    .toLowerCase();
}

const MALE_TERMS = new Set(
  ['male', 'm', 'man', 'boy', 'පිරිමි', 'පුරුෂ', 'ஆண்'].map(normalizeTerm),
);

const FEMALE_TERMS = new Set(
  ['female', 'f', 'woman', 'girl', 'ගැහැණු', 'ගැහැනු', 'ස්ත්‍රී', 'ස්ත්‍රි', 'பெண்'].map(
    normalizeTerm,
  ),
);

/**
 * Normalizes any English, Sinhala, or Tamil representation of gender into 'male' | 'female'.
 * Returns null if unrecognized.
 *
 * @param input - Gender in English, Sinhala, or Tamil, including common abbreviations such as `'M'` or `'F'`.
 * @returns `'male'`, `'female'`, or `null` if not recognised.
 *
 * @example
 * ```ts
 * normalizeGender('F'); // 'female'
 * normalizeGender('Male'); // 'male'
 * normalizeGender('ගැහැණු'); // 'female'
 * normalizeGender('other'); // null
 * ```
 */
export function normalizeGender(input: unknown): Gender | null {
  const cleaned = cleanString(input);
  if (!cleaned) return null;

  const term = normalizeTerm(cleaned);

  if (MALE_TERMS.has(term)) {
    return 'male';
  }

  if (FEMALE_TERMS.has(term)) {
    return 'female';
  }

  return null;
}

/**
 * Validates whether the input is a recognized gender representation.
 *
 * @param input - Gender value to check.
 * @returns `true` if `normalizeGender` recognises the value.
 *
 * @example
 * ```ts
 * isValidGender('m'); // true
 * isValidGender('x'); // false
 * ```
 */
export function isValidGender(input: unknown): boolean {
  return normalizeGender(input) !== null;
}

/**
 * Cross-validates whether the entered gender matches the gender in the Sri Lankan NIC.
 *
 * @param genderInput - Gender from the form.
 * @param nicInput - NIC number from the same form.
 * @returns `true` if both are valid and the gender matches the one encoded in the NIC.
 *
 * @example
 * ```ts
 * matchesNicGender('male', '921234567V'); // true
 * matchesNicGender('female', '921234567V'); // false
 * ```
 */
export function matchesNicGender(genderInput: unknown, nicInput: unknown): boolean {
  const normalized = normalizeGender(genderInput);
  if (!normalized) return false;

  const nicInfo = parseNic(nicInput);
  if (!nicInfo) return false;

  return nicInfo.gender === normalized;
}

/**
 * Validates gender returning structured ValidationResult.
 *
 * @param input - Gender value to check.
 * @returns `{ isValid: true, data }` with `'male'` or `'female'`, or `{ isValid: false, error, errors, code }`.
 *
 * @example
 * ```ts
 * validateGender('F').isValid; // true
 * ```
 */
export function validateGender(input: unknown): ValidationResult<Gender> {
  const normalized = normalizeGender(input);
  if (!normalized) {
    return createFailure(
      'Invalid gender value. Expected male/female, M/F, පිරිමි/ගැහැණු, or ஆண்/பெண்.',
      'GENDER_INVALID',
    );
  }

  return createSuccess(normalized);
}
