# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.1.0] - 2026-10-14

Documentation release: no changes to validation behavior or the public API. Upgrading
from 2.0.0 needs no code changes.

### Added

- `llms.txt` ships in the package and on the docs site, with `llms-full.txt` (llms.txt,
  README, and changelog in one file), so AI coding assistants can read the API, its
  conventions, and its limits.
- Every public function documents its parameters and return value and has a
  `@example`, shown in editor hovers and the API reference. Each entry point
  (`lanka-validations/nic`, `/phone`, and so on) has an overview with its import path.
- README: a Quick Start, a "Which Function Do I Use?" task table, examples for Zod,
  React Hook Form, and Express, and an FAQ.
- API reference: each area is its own module page; header links to GitHub, npm, and
  the changelog; the changelog is published on the site; search covers descriptions.

### Changed

- The npm `homepage` points to the API reference.
- README, `llms.txt`, and TSDoc examples now run as tests, so documented results
  always match the library.
- Shortened the README's input-rules and performance sections and moved Data Sources
  near the end.

### Fixed

- `formatNic` documentation showed the wrong output for the `spaced-old` and
  `spaced-new` styles. The function itself is unchanged.
- The README's `calculateAge` example depended on the current date.
- The bundle-size badge, which could not measure the package, now shows the
  `lanka-validations/nic` size; a Socket badge was added.

## [2.0.0] - 2026-10-14

This release hardens input validation. Some inputs that 1.0.0 accepted are now
rejected, and several public types are stricter. Read **Breaking changes** before
upgrading.

### Breaking changes

- Node.js 18 is no longer supported; the minimum is Node.js 20. Node 18 reached
  end-of-life in April 2025.
- `ValidationResult<T>` is now a discriminated union of `ValidationSuccess<T>` and
  `ValidationFailure`. Checking `isValid` narrows the result: on success `data` is
  always present; on failure `error`, `errors` and `code` are always present.
  Code that builds its own `{ isValid: boolean, ... }` object and types it as
  `ValidationResult` no longer compiles.
- Province and district getters return immutable copies typed as
  `ReadonlyProvinceInfo` / readonly records. Mutating a returned record is a type
  error, and mutation no longer affects later lookups.
- All exported reference tables (`MOBILE_PREFIXES`, `AREA_CODES`,
  `FIXED_OPERATOR_DIGITS`, `SRI_LANKA_SHORT_CODES`, `POSTAL_PREFIXES`, `MAJOR_CITIES`,
  `DMT_LICENSE_CATEGORIES`, `VEHICLE_PROVINCES`, and the nested entries of
  `VALIDATION_MESSAGES` and `REFERENCE_DATA_METADATA`) are deeply frozen and typed
  `Readonly`. Writing to them is a type error and throws in strict mode. Previously,
  any code in the process could change validation results, for example by adding a
  mobile prefix.
- Validators reject non-scalar input (arrays, objects) instead of coercing it to a
  string. Only strings and finite numbers are accepted. For example,
  `isValidPhone(['0771234567'])` now returns `false`.
- Strings longer than `MAX_INPUT_LENGTH` (1024 UTF-16 code units) are rejected
  before normalization.
- Date of birth parsing accepts only `Date` objects and the documented formats
  `YYYY-MM-DD`, `YYYY/MM/DD`, `DD-MM-YYYY` and `DD/MM/YYYY`. Free-form strings
  such as `'March 5 2000'` are rejected. Date-only comparisons and ages use the
  UTC calendar date.
- `isValidTIN` / `validateTIN` no longer accept an NIC number as a TIN. IRD issues a
  separate 9- or 10-digit TIN to individuals who register using their NIC; no IRD
  source supports treating the NIC itself as a TIN. Validate NIC fields with
  `isValidNic` instead.
- Phone validation rejects strings containing letters or other disallowed
  characters (for example, `'abc119xyz'` is no longer read as short code `119`).
- Postal code validation rejects letters and non-integer numbers (for example,
  `'abc20000xyz'` and `200.5`).
- LKR validation rejects non-finite values, amounts above `MAX_LKR_AMOUNT`, and
  malformed digit grouping such as `'1,2,3'`.
- `createSchemaValidator().validate()` returns a `SCHEMA_INVALID_ROOT` failure
  for non-object input (for example, `null`) instead of reporting it as valid.

### Added

- `lanka-validations/privacy` subpath: `redactSensitiveValue`, `maskNic`,
  `maskPhone`, `maskBankAccount`, `validationResultForLog` and `REDACTED_VALUE`.
- `lanka-validations/i18n` subpath: `translateValidationCode`,
  `localizeValidationResult`, `localizeSchemaResult` and `VALIDATION_MESSAGES`.
- `lanka-validations/reference-data` subpath: `getReferenceDataMetadata` and
  `REFERENCE_DATA_METADATA`, describing the source, version, coverage and
  limitations of each bundled data table.
- Exact LKR minor-unit (cents) handling: `parseLKRMinorUnits`,
  `formatLKRMinorUnits`, `validateLKRDecimal` and `MAX_LKR_MINOR_UNITS`.
- `isValidContactPhone`, which accepts full phone numbers and rejects short codes.
- Schema rules `rules.required()`, `rules.optional()`, `rules.nullable()`,
  `rules.contactPhone()` and `rules.mobile()`.
- `validateBankCode`, returning a detailed `ValidationResult`.
- `referenceDate` option for NIC parsing and validation (`NicOptions`), for
  deterministic age and future-date checks.
- Schema validators infer their output type from the rules passed to
  `createSchemaValidator`.
- `MAX_INPUT_LENGTH` and `MAX_LKR_AMOUNT` constants.
- `lanka-validations/package.json` is exported for tools that read package metadata.

### Fixed

- ESM consumers using `moduleResolution: node16`/`nodenext` now get ESM type
  declarations (`.d.mts`) instead of CommonJS ones, so default and named imports
  type-check correctly.
- Subpath imports such as `lanka-validations/nic` now resolve types under the
  legacy `moduleResolution: node` (node10) setting.
- Bank code validation and lookup no longer accept inherited object property
  names such as `'__proto__'` or `'constructor'`.
- `maskNic`, `maskPhone` and `maskBankAccount` revealed the full value when
  `visibleDigits` was `0`, negative, or `NaN`. They now reveal nothing in those cases
  and round fractional values down.
- Validators no longer throw on objects with a broken `toString`.
- `getLicenseCategoryInfo` and `getAllLicenseCategories` return copies, so changing
  a returned record no longer affects later lookups.
- `getReferenceDataMetadata(table)` is typed to return a single table's metadata,
  instead of a union that callers had to narrow.
- `lkrToWords` rounds to cents once and carries into rupees:
  `lkrToWords(1.999)` returns `'Two Rupees Only'` instead of
  `'One Rupee and One Hundred Cents Only'`.
- Schema validation records failures for special field names such as
  `'__proto__'` in `errors` as well as `errorList`.

### Changed

- Releases are published from GitHub Actions with npm provenance.
- Province and district lookups use precomputed indexes instead of scanning
  arrays on every call.

## [1.0.0] - 2026-10-06

### Added

- Initial release: validators and parsers for Sri Lankan NIC, phone numbers,
  passports, driving licenses, vehicle plates, LKR currency (including amounts in
  words), date of birth, gender, postal codes, CBSL bank codes, TIN/VAT and
  administrative divisions, plus a schema/form validator.

[2.1.0]: https://github.com/mmsalmanfaris/lanka-validations/compare/2.0.0...2.1.0
[2.0.0]: https://github.com/mmsalmanfaris/lanka-validations/compare/1.0.0...2.0.0
[1.0.0]: https://github.com/mmsalmanfaris/lanka-validations/releases/tag/1.0.0
