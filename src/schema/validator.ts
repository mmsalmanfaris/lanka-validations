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

export type ValidatorRule<T = unknown> = (
  value: unknown,
  formData?: Record<string, unknown>
) => ValidationResult<T> | boolean | string | null;

export type SchemaDefinition = Record<string, ValidatorRule<unknown> | readonly ValidatorRule<unknown>[]>;
type RuleData<R> = R extends ValidatorRule<infer T> ? T
  : R extends readonly ValidatorRule<infer T>[] ? T : unknown;
export type InferSchemaOutput<S extends SchemaDefinition> = { [K in keyof S]: RuleData<S[K]> };

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

export type SchemaValidationResult<T extends Record<string, unknown> = Record<string, unknown>> =
  | (SchemaResultBase & { isValid: true; data: T })
  | (SchemaResultBase & { isValid: false; data: Partial<T> });

export class SchemaValidator<
  TInput extends Record<string, unknown> = Record<string, unknown>,
  TOutput extends Record<string, unknown> = TInput,
> {
  private rules: Map<keyof TInput, ValidatorRule[]>;

  constructor(schemaMap?: Partial<Record<keyof TInput, ValidatorRule | readonly ValidatorRule[]>>) {
    this.rules = new Map();
    if (schemaMap) {
      for (const [key, rule] of Object.entries(schemaMap) as [keyof TInput, ValidatorRule | readonly ValidatorRule[]][]) {
        this.rules.set(key, Array.isArray(rule) ? [...rule] : [rule as ValidatorRule]);
      }
    }
  }

  field(name: keyof TInput, ...rules: ValidatorRule[]): this {
    const existing = this.rules.get(name) ?? [];
    this.rules.set(name, [...existing, ...rules]);
    return this;
  }

  validate(data: unknown): SchemaValidationResult<TOutput> {
    const errors: Record<string, string> = Object.create(null);
    const errorCodes: Record<string, string> = Object.create(null);
    const errorList: SchemaFieldError[] = [];
    const parsed: Record<string, unknown> = Object.create(null);

    if (data === null || typeof data !== 'object' ||
        (Object.getPrototypeOf(data) !== Object.prototype && Object.getPrototypeOf(data) !== null)) {
      const field = '$root';
      const message = 'Expected a form data object.';
      const code = 'SCHEMA_INVALID_ROOT';
      errors[field] = message;
      errorCodes[field] = code;
      return { isValid: false, data: parsed as Partial<TOutput>, errors, errorCodes,
        errorList: [{ field, message, code }] };
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

export function createSchemaValidator<const S extends SchemaDefinition>(
  schemaMap: S
): SchemaValidator<Record<keyof S, unknown>, InferSchemaOutput<S>>;
export function createSchemaValidator<T extends Record<string, unknown> = Record<string, unknown>>(
  schemaMap?: Partial<Record<keyof T, ValidatorRule | readonly ValidatorRule[]>>
): SchemaValidator<T, T>;
export function createSchemaValidator(
  schemaMap?: Record<PropertyKey, ValidatorRule | readonly ValidatorRule[]>
): SchemaValidator<Record<string, unknown>, Record<string, unknown>> {
  return new SchemaValidator(schemaMap as Record<string, ValidatorRule | readonly ValidatorRule[]> | undefined);
}

function isEmpty(value: unknown): boolean {
  return value === undefined || value === null || (typeof value === 'string' && value.trim() === '');
}

export const rules = {
  required: (message = 'This field is required.'): ValidatorRule<unknown> => (value) =>
    isEmpty(value) ? createFailure(message, 'REQUIRED') : createSuccess(value),
  optional: <T>(rule: ValidatorRule<T>): ValidatorRule<T | undefined> => (value, data) =>
    value === undefined || value === '' ? createSuccess(undefined) : rule(value, data),
  nullable: <T>(rule: ValidatorRule<T>): ValidatorRule<T | null> => (value, data) =>
    value === null ? createSuccess(null) : rule(value, data),
  nic: (opts?: NicOptions): ValidatorRule<NicInfo> => (value) => validateNic(value, opts),
  phone: (): ValidatorRule<PhoneInfo> => (value) => validatePhone(value),
  contactPhone: (): ValidatorRule<PhoneInfo> => (value) => {
    const result = validatePhone(value);
    return result.isValid && result.data.type === 'short_code'
      ? createFailure('Expected a full contact phone number.', 'PHONE_SHORT_CODE_NOT_ALLOWED') : result;
  },
  mobile: (): ValidatorRule<PhoneInfo> => (value) => {
    const result = validatePhone(value);
    return result.isValid && result.data.type !== 'mobile'
      ? createFailure('Expected a Sri Lankan mobile phone number.', 'PHONE_NOT_MOBILE') : result;
  },
  passport: (): ValidatorRule<PassportInfo> => (value) => validatePassport(value),
  drivingLicense: (): ValidatorRule<DrivingLicenseInfo> => (value) => validateDrivingLicense(value),
  vehiclePlate: (): ValidatorRule<VehiclePlateInfo> => (value) => validateVehiclePlate(value),
  currency: (opts?: LkrValidationOptions): ValidatorRule<number> => (value) => validateLKR(value, opts),
  dob: (opts?: DobOptions): ValidatorRule<{ dob: Date; age: number; isoDate: string }> =>
    (value) => validateDob(value, opts),
  gender: (): ValidatorRule<Gender> => (value) => validateGender(value),
  postalCode: (): ValidatorRule<PostalCodeInfo> => (value) => validatePostalCode(value),
  bankCode: (): ValidatorRule<BankInfo> => (value) => {
    const bank = getBankByCode(value);
    return bank ? createSuccess(bank) : createFailure('Invalid CBSL bank code.', 'BANK_CODE_INVALID');
  },
  tin: (): ValidatorRule<string> => (value) => validateTIN(value),
  vat: (): ValidatorRule<string> => (value) => validateVAT(value),
  matchesNicDob: (nicFieldName = 'nic'): ValidatorRule<unknown> => (value, data) => {
    if (!data || !value || !data[nicFieldName]) return createSuccess(value);
    return matchesNicDob(value, data[nicFieldName])
      ? createSuccess(value) : createFailure('Date of Birth does not match NIC', 'DOB_NIC_MISMATCH');
  },
  matchesNicGender: (nicFieldName = 'nic'): ValidatorRule<unknown> => (value, data) => {
    if (!data || !value || !data[nicFieldName]) return createSuccess(value);
    return matchesNicGender(value, data[nicFieldName])
      ? createSuccess(value) : createFailure('Gender does not match NIC', 'GENDER_NIC_MISMATCH');
  },
};
