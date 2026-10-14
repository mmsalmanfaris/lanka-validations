import type { ValidationResult } from '../common/types';
import type { SchemaValidationResult } from '../schema';
import { VALIDATION_MESSAGES, type ValidationLocale } from './messages';

export * from './messages';

/** Application-provided messages keyed by validation code. These take precedence over the built-in translations. */
export type MessageOverrides = Readonly<Record<string, string>>;

/** Returns the message for a validation code in the given language. Unknown codes fall back to a generic "validation failed" message. */
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

/** Returns a failed result with its message translated. Successful results are returned unchanged. */
export function localizeValidationResult<T>(
  result: ValidationResult<T>,
  locale: ValidationLocale = 'en',
  overrides?: MessageOverrides,
): ValidationResult<T> {
  if (result.isValid) return result;
  const error = translateValidationCode(result.code, locale, overrides);
  return { isValid: false, code: result.code, error, errors: [error] };
}

/** Returns a schema result with every field error translated. Field names and codes are unchanged. */
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
