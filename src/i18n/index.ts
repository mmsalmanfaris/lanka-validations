import type { ValidationResult } from '../common/types';
import type { SchemaValidationResult } from '../schema';
import { VALIDATION_MESSAGES, type ValidationLocale } from './messages';

export * from './messages';

export type MessageOverrides = Readonly<Record<string, string>>;

export function translateValidationCode(
  code: string,
  locale: ValidationLocale = 'en',
  overrides?: MessageOverrides,
): string {
  return overrides?.[code] ?? VALIDATION_MESSAGES[code]?.[locale] ?? VALIDATION_MESSAGES.VALIDATION_FAILED[locale];
}

export function localizeValidationResult<T>(
  result: ValidationResult<T>,
  locale: ValidationLocale = 'en',
  overrides?: MessageOverrides,
): ValidationResult<T> {
  if (result.isValid) return result;
  const error = translateValidationCode(result.code, locale, overrides);
  return { isValid: false, code: result.code, error, errors: [error] };
}

export function localizeSchemaResult<T extends Record<string, unknown>>(
  result: SchemaValidationResult<T>,
  locale: ValidationLocale = 'en',
  overrides?: MessageOverrides,
): SchemaValidationResult<T> {
  const errors: Record<string, string> = Object.create(null);
  const errorList = result.errorList.map((item) => {
    const message = translateValidationCode(item.code, locale, overrides);
    errors[item.field] = message;
    return { ...item, message };
  });
  return { ...result, errors, errorList };
}
