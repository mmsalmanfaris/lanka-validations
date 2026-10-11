import type { ValidationResult } from '../common/types';
import { validateNic } from '../nic/validator';
import { validatePhone } from '../phone/validator';
import { validatePassport } from '../passport/validator';
import { validateDrivingLicense } from '../license/validator';
import { validateVehiclePlate } from '../vehicle/validator';
import { validateLKR, type LkrValidationOptions } from '../currency/validator';
import { validateDob, matchesNicDob } from '../dob/validator';
import { validateGender, matchesNicGender } from '../gender/validator';
import { validatePostalCode } from '../postal-code/validator';
import { isValidBankCode } from '../bank/validator';
import { validateTIN, validateVAT } from '../tax/validator';
import type { DobOptions } from '../dob/types';
import type { NicOptions } from '../nic/types';

export type ValidatorRule<T = unknown> = (
  value: unknown,
  formData?: Record<string, unknown>
) => ValidationResult<T> | boolean | string | null;

export interface SchemaValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
  errorList: { field: string; message: string }[];
}

export class SchemaValidator<T extends Record<string, unknown> = Record<string, unknown>> {
  private rules: Map<keyof T, ValidatorRule[]>;

  constructor(schemaMap?: Partial<Record<keyof T, ValidatorRule | ValidatorRule[]>>) {
    this.rules = new Map();
    if (schemaMap) {
      for (const [key, rule] of Object.entries(schemaMap) as [keyof T, ValidatorRule | ValidatorRule[]][]) {
        const ruleArray = Array.isArray(rule) ? rule : [rule];
        this.rules.set(key, ruleArray);
      }
    }
  }

  /**
   * Adds validation rules for a specific field
   */
  field(name: keyof T, ...rules: ValidatorRule[]): this {
    const existing = this.rules.get(name) ?? [];
    this.rules.set(name, [...existing, ...rules]);
    return this;
  }

  /**
   * Validates input data against all configured rules
   */
  validate(data: unknown): SchemaValidationResult {
    const errors: Record<string, string> = Object.create(null);
    const errorList: { field: string; message: string }[] = [];

    if (data === null || typeof data !== 'object' ||
        (Object.getPrototypeOf(data) !== Object.prototype && Object.getPrototypeOf(data) !== null)) {
      const message = 'Expected a form data object.';
      errors['$root'] = message;
      return { isValid: false, errors, errorList: [{ field: '$root', message }] };
    }
    const formData = data as Record<string, unknown>;

    for (const [field, rules] of this.rules.entries()) {
      const fieldStr = String(field);
      const val = Object.hasOwn(formData, fieldStr) ? formData[fieldStr] : undefined;

      for (const rule of rules) {
        const res = rule(val, formData);

        if (typeof res === 'boolean') {
          if (!res) {
            const msg = `Invalid ${fieldStr}`;
            errors[fieldStr] = msg;
            errorList.push({ field: fieldStr, message: msg });
            break;
          }
        } else if (typeof res === 'string') {
          errors[fieldStr] = res;
          errorList.push({ field: fieldStr, message: res });
          break;
        } else if (res && typeof res === 'object') {
          if (!res.isValid) {
            const msg = res.error ?? `Invalid ${fieldStr}`;
            errors[fieldStr] = msg;
            errorList.push({ field: fieldStr, message: msg });
            break;
          }
        }
      }
    }

    return {
      isValid: errorList.length === 0,
      errors,
      errorList,
    };
  }
}

/**
 * Creates a new SchemaValidator instance.
 */
export function createSchemaValidator<T extends Record<string, unknown> = Record<string, unknown>>(
  schemaMap?: Partial<Record<keyof T, ValidatorRule | ValidatorRule[]>>
): SchemaValidator<T> {
  return new SchemaValidator<T>(schemaMap);
}

/**
 * Pre-packaged validation rules for convenience
 */
export const rules = {
  nic: (opts?: NicOptions): ValidatorRule => (val) => validateNic(val, opts),
  phone: (): ValidatorRule => (val) => validatePhone(val),
  passport: (): ValidatorRule => (val) => validatePassport(val),
  drivingLicense: (): ValidatorRule => (val) => validateDrivingLicense(val),
  vehiclePlate: (): ValidatorRule => (val) => validateVehiclePlate(val),
  currency: (opts?: LkrValidationOptions): ValidatorRule => (val) => validateLKR(val, opts),
  dob: (opts?: DobOptions): ValidatorRule => (val) => validateDob(val, opts),
  gender: (): ValidatorRule => (val) => validateGender(val),
  postalCode: (): ValidatorRule => (val) => validatePostalCode(val),
  bankCode: (): ValidatorRule => (val) => {
    return isValidBankCode(val) ? true : 'Invalid CBSL bank code';
  },
  tin: (): ValidatorRule => (val) => validateTIN(val),
  vat: (): ValidatorRule => (val) => validateVAT(val),

  /** Ensures date of birth matches the NIC */
  matchesNicDob: (nicFieldName = 'nic'): ValidatorRule => (val, data) => {
    if (!data || !val) return true;
    const nic = data[nicFieldName];
    if (!nic) return true;
    return matchesNicDob(val, nic) ? true : 'Date of Birth does not match NIC';
  },

  /** Ensures gender matches the NIC */
  matchesNicGender: (nicFieldName = 'nic'): ValidatorRule => (val, data) => {
    if (!data || !val) return true;
    const nic = data[nicFieldName];
    if (!nic) return true;
    return matchesNicGender(val, nic) ? true : 'Gender does not match NIC';
  },
};

