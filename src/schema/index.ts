/**
 * Validate whole form objects with typed, field-by-field rules.
 *
 * Import from `lanka-validations/schema`, or from the package root.
 *
 * Combine the built-in `rules` with your own. Rules run in order and stop at the first failure for each field; the parsed output type is inferred.
 *
 * @example
 * ```ts
 * import { createSchemaValidator, rules } from 'lanka-validations/schema';
 *
 * const signUp = createSchemaValidator({
 *   nic: rules.nic(),
 *   phone: rules.optional(rules.mobile()),
 * });
 *
 * const result = signUp.validate({ nic: '921234567V' });
 * if (result.isValid) result.data.nic.dobString; // '1992-05-02'
 * ```
 *
 * @module schema
 */

export * from './validator';
