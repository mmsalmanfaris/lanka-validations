import type { ValidationResult } from '../common/types';
import { createFailure, createSuccess } from '../common/utils';
import { validateNic } from '../nic/validator';
import { validatePhone } from '../phone/validator';
import { validatePassport } from '../passport/validator';
import { validateDrivingLicense } from '../license/validator';
import { validateVehiclePlate } from '../vehicle/validator';
import { validateLKR, type LkrValidationOptions } from '../currency/validator';
import { validateDob, matchesNicDob } from '../dob/validator';
import { validateGender, matchesNicGender } from '../gender/validator';
import { validatePostalCode } from '../postal-code/validator';
import { getBankByCode } from '../bank/validator';
import { validateTIN, validateVAT } from '../tax/validator';
import type { BankInfo } from '../bank/types';
import type { DobOptions } from '../dob/types';
import type { NicInfo, NicOptions, Gender } from '../nic/types';
import type { PhoneInfo } from '../phone/types';
import type { PassportInfo } from '../passport/types';
import type { DrivingLicenseInfo } from '../license/types';
import type { VehiclePlateInfo } from '../vehicle/types';
import type { PostalCodeInfo } from '../postal-code/types';

/** A field check. Return a `ValidationResult`, or `true`/`null` to pass, `false` to fail with a default message, or a string to fail with that message. A successful `ValidationResult` replaces the field value in the parsed output. */
export type ValidatorRule<T = unknown> = (
  value: unknown,
  formData?: Record<string, unknown>,
) => ValidationResult<T> | boolean | string | null;

/** Field names mapped to one rule or a list of rules, checked in order until one fails. */
export type SchemaDefinition = Record<
  string,
  ValidatorRule<unknown> | readonly ValidatorRule<unknown>[]
>;
type RuleData<R> =
  R extends ValidatorRule<infer T> ? T : R extends readonly ValidatorRule<infer T>[] ? T : unknown;
/** Parsed output type of a schema: each field typed by the data its rules return. */
export type InferSchemaOutput<S extends SchemaDefinition> = { [K in keyof S]: RuleData<S[K]> };

/** One field that failed validation. */
export interface SchemaFieldError {
  field: string;
  message: string;
  code: string;
}

interface SchemaResultBase {
  errors: Record<string, string>;
  errorCodes: Record<string, string>;
  errorList: SchemaFieldError[];
}

/** Outcome of {@link SchemaValidator.validate}. `errors` and `errorCodes` are keyed by field; `errorList` keeps them in rule order. */
export type SchemaValidationResult<T extends Record<string, unknown> = Record<string, unknown>> =
  | (SchemaResultBase & { isValid: true; data: T })
  | (SchemaResultBase & { isValid: false; data: Partial<T> });

/** Validates a form object field by field. Create one with {@link createSchemaValidator}, or with `new SchemaValidator()` and {@link SchemaValidator.field}. */
export class SchemaValidator<
  TInput extends Record<string, unknown> = Record<string, unknown>,
  TOutput extends Record<string, unknown> = TInput,
> {
  private rules: Map<keyof TInput, ValidatorRule[]>;

  constructor(schemaMap?: Partial<Record<keyof TInput, ValidatorRule | readonly ValidatorRule[]>>) {
    this.rules = new Map();
    if (schemaMap) {
      for (const [key, rule] of Object.entries(schemaMap) as [
        keyof TInput,
        ValidatorRule | readonly ValidatorRule[],
      ][]) {
        this.rules.set(key, typeof rule === 'function' ? [rule] : [...rule]);
      }
    }
  }

  /**
   * Adds rules to a field, after any it already has. Returns the validator for chaining.
   *
   * @param name - Field name in the form object.
   * @param rules - Rules to append, checked in order.
   * @returns The same validator.
   *
   * @example
   * ```ts
   * const form = new SchemaValidator().field('nic', rules.required(), rules.nic());
   * form.validate({}).errorCodes; // { nic: 'REQUIRED' }
   * ```
   */
  field(name: keyof TInput, ...rules: ValidatorRule[]): this {
    const existing = this.rules.get(name) ?? [];
    this.rules.set(name, [...existing, ...rules]);
    return this;
  }

  /**
   * Checks every field. Each field stops at its first failing rule. Non-object input, arrays,
   * and class instances fail with code `SCHEMA_INVALID_ROOT` instead of throwing.
   *
   * @param data - Form data to check, usually a parsed request body.
   * @returns `{ isValid: true, data }` with every field's parsed value, or `{ isValid: false, data }` with
   * only the fields that passed. Both include `errors` (messages), `errorCodes`, and `errorList`, keyed by field.
   */
  validate(data: unknown): SchemaValidationResult<TOutput> {
    const errors = Object.create(null) as Record<string, string>;
    const errorCodes = Object.create(null) as Record<string, string>;
    const errorList: SchemaFieldError[] = [];
    const parsed = Object.create(null) as Record<string, unknown>;

    if (
      data === null ||
      typeof data !== 'object' ||
      (Object.getPrototypeOf(data) !== Object.prototype && Object.getPrototypeOf(data) !== null)
    ) {
      const field = '$root';
      const message = 'Expected a form data object.';
      const code = 'SCHEMA_INVALID_ROOT';
      errors[field] = message;
      errorCodes[field] = code;
      return {
        isValid: false,
        data: parsed as Partial<TOutput>,
        errors,
        errorCodes,
        errorList: [{ field, message, code }],
      };
    }
    const formData = data as Record<string, unknown>;

    for (const [field, fieldRules] of this.rules.entries()) {
      const fieldStr = String(field);
      const value = Object.hasOwn(formData, fieldStr) ? formData[fieldStr] : undefined;
      let parsedValue = value;

      for (const rule of fieldRules) {
        const result = rule(value, formData);
        let message: string | undefined;
        let code = 'SCHEMA_INVALID';

        if (result === false) message = `Invalid ${fieldStr}`;
        else if (typeof result === 'string') message = result;
        else if (result && typeof result === 'object') {
          if (result.isValid) parsedValue = result.data;
          else {
            message = result.error;
            code = result.code;
          }
        }

        if (message !== undefined) {
          errors[fieldStr] = message;
          errorCodes[fieldStr] = code;
          errorList.push({ field: fieldStr, message, code });
          break;
        }
      }
      if (!Object.hasOwn(errors, fieldStr)) parsed[fieldStr] = parsedValue;
    }

    return errorList.length === 0
      ? { isValid: true, data: parsed as TOutput, errors, errorCodes, errorList }
      : { isValid: false, data: parsed as Partial<TOutput>, errors, errorCodes, errorList };
  }
}

/**
 * Creates a {@link SchemaValidator} from a map of field names to rules. The parsed output type is inferred from the rules.
 *
 * @param schemaMap - Field names mapped to one rule or an ordered list of rules. Use the built-in `rules` or your own functions.
 * @returns A validator whose `validate(data)` returns typed, parsed data or per-field errors.
 *
 * @example
 * ```ts
 * const form = createSchemaValidator({ nic: rules.nic(), phone: rules.optional(rules.mobile()) });
 *
 * const ok = form.validate({ nic: '921234567V', phone: '0771234567' });
 * ok.isValid; // true
 * if (ok.isValid) ok.data.nic.dobString; // '1992-05-02'
 *
 * form.validate({ nic: 'bad' }).errorCodes; // { nic: 'NIC_INVALID_FORMAT' }
 * form.validate(null).errorCodes; // { $root: 'SCHEMA_INVALID_ROOT' }
 * ```
 */
export function createSchemaValidator<const S extends SchemaDefinition>(
  schemaMap: S,
): SchemaValidator<Record<keyof S, unknown>, InferSchemaOutput<S>>;
export function createSchemaValidator<T extends Record<string, unknown> = Record<string, unknown>>(
  schemaMap?: Partial<Record<keyof T, ValidatorRule | readonly ValidatorRule[]>>,
): SchemaValidator<T, T>;
export function createSchemaValidator(
  schemaMap?: Partial<Record<string, ValidatorRule | readonly ValidatorRule[]>>,
): SchemaValidator<Record<string, unknown>, Record<string, unknown>> {
  return new SchemaValidator(schemaMap);
}

function isEmpty(value: unknown): boolean {
  return (
    value === undefined || value === null || (typeof value === 'string' && value.trim() === '')
  );
}

/** Ready-made {@link ValidatorRule}s for each validator in this package. */
export const rules = {
  /** Fails with code `REQUIRED` when the value is `undefined`, `null`, or a blank string. */
  required:
    (message = 'This field is required.'): ValidatorRule<unknown> =>
    (value) =>
      isEmpty(value) ? createFailure(message, 'REQUIRED') : createSuccess(value),
  /** Passes `undefined` and empty strings; otherwise applies `rule`. */
  optional:
    <T>(rule: ValidatorRule<T>): ValidatorRule<T | undefined> =>
    (value, data) =>
      value === undefined || value === '' ? createSuccess(undefined) : rule(value, data),
  /** Passes `null`; otherwise applies `rule`. */
  nullable:
    <T>(rule: ValidatorRule<T>): ValidatorRule<T | null> =>
    (value, data) =>
      value === null ? createSuccess(null) : rule(value, data),
  /** Valid NIC. Parsed value: {@link NicInfo}. */
  nic:
    (opts?: NicOptions): ValidatorRule<NicInfo> =>
    (value) =>
      validateNic(value, opts),
  /** Any valid phone number, including short codes. Parsed value: {@link PhoneInfo}. */
  phone: (): ValidatorRule<PhoneInfo> => (value) => validatePhone(value),
  /** A full phone number; rejects short codes. */
  contactPhone: (): ValidatorRule<PhoneInfo> => (value) => {
    const result = validatePhone(value);
    return result.isValid && result.data.type === 'short_code'
      ? createFailure('Expected a full contact phone number.', 'PHONE_SHORT_CODE_NOT_ALLOWED')
      : result;
  },
  /** A mobile number only. */
  mobile: (): ValidatorRule<PhoneInfo> => (value) => {
    const result = validatePhone(value);
    return result.isValid && result.data.type !== 'mobile'
      ? createFailure('Expected a Sri Lankan mobile phone number.', 'PHONE_NOT_MOBILE')
      : result;
  },
  /** Valid passport number. Parsed value: {@link PassportInfo}. */
  passport: (): ValidatorRule<PassportInfo> => (value) => validatePassport(value),
  /** Valid driving licence number. */
  drivingLicense: (): ValidatorRule<DrivingLicenseInfo> => (value) => validateDrivingLicense(value),
  /** Valid vehicle registration plate. */
  vehiclePlate: (): ValidatorRule<VehiclePlateInfo> => (value) => validateVehiclePlate(value),
  /** Valid LKR amount within the given range. Parsed value: the amount as a number. */
  currency:
    (opts?: LkrValidationOptions): ValidatorRule<number> =>
    (value) =>
      validateLKR(value, opts),
  /** Valid date of birth within the given age range. */
  dob:
    (opts?: DobOptions): ValidatorRule<{ dob: Date; age: number; isoDate: string }> =>
    (value) =>
      validateDob(value, opts),
  /** Recognised gender value. Parsed value: `male` or `female`. */
  gender: (): ValidatorRule<Gender> => (value) => validateGender(value),
  /** Valid postal code with a known prefix. */
  postalCode: (): ValidatorRule<PostalCodeInfo> => (value) => validatePostalCode(value),
  /** A CBSL bank code. Parsed value: {@link BankInfo}. */
  bankCode: (): ValidatorRule<BankInfo> => (value) => {
    const bank = getBankByCode(value);
    return bank
      ? createSuccess(bank)
      : createFailure('Invalid CBSL bank code.', 'BANK_CODE_INVALID');
  },
  /** TIN format (9 or 10 digits). */
  tin: (): ValidatorRule<string> => (value) => validateTIN(value),
  /** VAT registration number format. */
  vat: (): ValidatorRule<string> => (value) => validateVAT(value),
  /** Fails when the date of birth does not match the NIC in `nicFieldName`. Passes when either value is missing. */
  matchesNicDob:
    (nicFieldName = 'nic'): ValidatorRule<unknown> =>
    (value, data) => {
      if (!data || !value || !data[nicFieldName]) return createSuccess(value);
      return matchesNicDob(value, data[nicFieldName])
        ? createSuccess(value)
        : createFailure('Date of Birth does not match NIC', 'DOB_NIC_MISMATCH');
    },
  /** Fails when the gender does not match the NIC in `nicFieldName`. Passes when either value is missing. */
  matchesNicGender:
    (nicFieldName = 'nic'): ValidatorRule<unknown> =>
    (value, data) => {
      if (!data || !value || !data[nicFieldName]) return createSuccess(value);
      return matchesNicGender(value, data[nicFieldName])
        ? createSuccess(value)
        : createFailure('Gender does not match NIC', 'GENDER_NIC_MISMATCH');
    },
};
