/**
 * Translate validation errors into English, Sinhala, or Tamil.
 *
 * Import from `lanka-validations/i18n`, or from the package root.
 *
 * Every failure carries a stable `code`; these helpers turn codes into messages and accept your own overrides.
 *
 * @example
 * ```ts
 * import { translateValidationCode, localizeValidationResult } from 'lanka-validations/i18n';
 * import { validateNic } from 'lanka-validations/nic';
 *
 * translateValidationCode('NIC_INVALID_FORMAT', 'ta'); // 'தேசிய அடையாள அட்டை வடிவம் செல்லுபடியாகாது.'
 * localizeValidationResult(validateNic('bad'), 'si');
 * ```
 *
 * @module i18n
 */

import type { ValidationResult } from '../common/types';
import type { SchemaValidationResult } from '../schema';
import { VALIDATION_MESSAGES, type ValidationLocale } from './messages';

export * from './messages';

/** Application-provided messages keyed by validation code. These take precedence over the built-in translations. */
export type MessageOverrides = Readonly<Record<string, string>>;

/**
 *  Returns the message for a validation code in the given language. Unknown codes fall back to a generic "validation failed" message.
 *
 * @param code - Validation code, such as `'NIC_INVALID_FORMAT'`.
 * @param locale - `'en'` (default), `'si'`, or `'ta'`.
 * @param overrides - Optional messages keyed by code that replace the built-in text.
 * @returns The message for the code.
 *
 * @example
 * ```ts
 * translateValidationCode('NIC_INVALID_FORMAT'); // 'NIC format is invalid.'
 * translateValidationCode('NIC_INVALID_FORMAT', 'en', { NIC_INVALID_FORMAT: 'Check your NIC' }); // 'Check your NIC'
 * ```
 */
export function translateValidationCode(
  code: string,
  locale: ValidationLocale = 'en',
  overrides?: MessageOverrides,
): string {
  return (
    overrides?.[code] ??
    VALIDATION_MESSAGES[code]?.[locale] ??
    VALIDATION_MESSAGES.VALIDATION_FAILED![locale]
  );
}

/**
 *  Returns a failed result with its message translated. Successful results are returned unchanged.
 *
 * @param result - Result from any `validateX` function.
 * @param locale - `'en'` (default), `'si'`, or `'ta'`.
 * @param overrides - Optional messages keyed by code.
 * @returns The same result with `error` and `errors` translated. Successful results are returned unchanged.
 *
 * @example
 * ```ts
 * localizeValidationResult(validateNic('bad'), 'en', { NIC_INVALID_FORMAT: 'Check your NIC' }).error; // 'Check your NIC'
 * ```
 */
export function localizeValidationResult<T>(
  result: ValidationResult<T>,
  locale: ValidationLocale = 'en',
  overrides?: MessageOverrides,
): ValidationResult<T> {
  if (result.isValid) return result;
  const error = translateValidationCode(result.code, locale, overrides);
  return { isValid: false, code: result.code, error, errors: [error] };
}

/**
 * Returns a schema result with every field error translated. Field names and codes are unchanged.
 *
 * @param result - Result from `SchemaValidator.validate`.
 * @param locale - `'en'` (default), `'si'`, or `'ta'`.
 * @param overrides - Optional messages keyed by code.
 * @returns The same result with `errors` and `errorList` messages translated.
 *
 * @example
 * ```ts
 * const result = createSchemaValidator({ nic: rules.nic() }).validate({ nic: 'bad' });
 * localizeSchemaResult(result, 'si').errors; // { nic: 'ජාතික හැඳුනුම්පත් ආකෘතිය වලංගු නොවේ.' }
 * ```
 */
export function localizeSchemaResult<T extends Record<string, unknown>>(
  result: SchemaValidationResult<T>,
  locale: ValidationLocale = 'en',
  overrides?: MessageOverrides,
): SchemaValidationResult<T> {
  const errors = Object.create(null) as Record<string, string>;
  const errorList = result.errorList.map((item) => {
    const message = translateValidationCode(item.code, locale, overrides);
    errors[item.field] = message;
    return { ...item, message };
  });
  return { ...result, errors, errorList };
}
