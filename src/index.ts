/**
 * Every validator, parser, and formatter in one import.
 *
 * Each area is also available as a subpath, such as `lanka-validations/nic`, which keeps bundles small. This module also exports the shared `ValidationResult` types and string helpers.
 *
 * @example
 * ```ts
 * import { isValidNic, isValidMobile, formatLKR } from 'lanka-validations';
 *
 * isValidNic('921234567V'); // true
 * isValidMobile('0771234567'); // true
 * formatLKR(1500000, { lakhScale: true }); // 'Rs. 15,00,000.00'
 * ```
 *
 * @module lanka-validations
 */

// Common Types & Utilities
export * from './common/types';
export * from './common/utils';

// National Identity Card (NIC)
export * from './nic';

// Phone Numbers & Short Codes
export * from './phone';

// Sri Lankan Passport
export * from './passport';

// Sri Lankan Driving License & DMT Vehicle Categories
export * from './license';

// Sri Lankan Vehicle Registration Plates
export * from './vehicle';

// Sri Lankan Rupee (LKR) Currency, Formatting & Words
export * from './currency';

// Date of Birth & Age
export * from './dob';

// Gender Normalization & Matching
export * from './gender';

// Postal Codes & Districts
export * from './postal-code';

// Central Bank of Sri Lanka (CBSL) Bank & Branch Codes
export * from './bank';

// Taxpayer Identification (TIN) & VAT
export * from './tax';

// Administrative Divisions (Provinces & Districts)
export * from './administrative';

// Schema & Form Validator Builder
export * from './schema';

// Privacy-safe display and logging helpers
export * from './privacy';

// Localized validation messages with stable codes
export * from './i18n';

// Versioned provenance and coverage for bundled reference tables
export * from './reference-data';
