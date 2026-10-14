# Lanka Validations

High-performance, zero-dependency Sri Lankan data validation and parsing library for TypeScript and JavaScript.  
(Sri Lanka Data Validations / ශ්‍රී ලංකා දත්ත වලංගුකරණය / இலங்கை தரவு சரிபார்ப்பு)

[![npm version](https://img.shields.io/npm/v/lanka-validations.svg)](https://www.npmjs.com/package/lanka-validations)
[![CI](https://github.com/mmsalmanfaris/lanka-validations/actions/workflows/ci.yml/badge.svg)](https://github.com/mmsalmanfaris/lanka-validations/actions/workflows/ci.yml)
[![NIC module size](https://deno.bundlejs.com/badge?q=lanka-validations/nic)](https://bundlejs.com/?q=lanka-validations/nic)
[![Types](https://img.shields.io/npm/types/lanka-validations.svg)](https://www.npmjs.com/package/lanka-validations)
[![OpenSSF Scorecard](https://api.scorecard.dev/projects/github.com/mmsalmanfaris/lanka-validations/badge)](https://scorecard.dev/viewer/?uri=github.com/mmsalmanfaris/lanka-validations)
[![Socket](https://badge.socket.dev/npm/package/lanka-validations)](https://socket.dev/npm/package/lanka-validations)
[![License: MIT](https://img.shields.io/npm/l/lanka-validations.svg)](LICENSE)

**lanka-validations** is a zero-dependency TypeScript and JavaScript library for validating, parsing, and formatting Sri Lankan data: NIC numbers (old and new), phone numbers, passports, driving licences, vehicle plates, LKR amounts, postal codes, CBSL bank codes, TIN/VAT numbers, dates of birth, and gender. It runs in Node.js 20+, browsers, Deno, and Bun, and ships ESM, CommonJS, and TypeScript types.

Use it for KYC onboarding, sign-up and checkout forms, banking and payroll systems, and anywhere you accept Sri Lankan identifiers.

## Quick Start

```bash
npm install lanka-validations
```

```typescript
import { isValidNic, validateNic, convertOldToNewNic } from 'lanka-validations/nic';
import { isValidMobile, formatPhone } from 'lanka-validations/phone';

isValidNic('921234567V'); // true
convertOldToNewNic('921234567V'); // '199212304567'

const result = validateNic('921234567V');
if (result.isValid) {
  result.data.dobString; // '1992-05-02'
  result.data.gender; // 'male'
} else {
  result.code; // stable error code, e.g. 'NIC_INVALID_FORMAT'
}

isValidMobile('077 123 4567'); // true
formatPhone('0771234567', 'e164'); // '+94771234567'
```

Every `isValidX` returns a boolean. Every `validateX` returns `{ isValid: true, data }` or `{ isValid: false, error, code }`, and never throws, whatever the input.

## Which Function Do I Use?

| Task | Function | Import from |
| --- | --- | --- |
| Check a Sri Lankan NIC number | `isValidNic(nic)` | `lanka-validations/nic` |
| Get date of birth, age, and gender from an NIC | `parseNic(nic)` or `validateNic(nic)` | `lanka-validations/nic` |
| Convert an old NIC (9 digits + V/X) to the new 12-digit format | `convertOldToNewNic(nic)` | `lanka-validations/nic` |
| Check that a form's date of birth or gender matches its NIC | `matchesNicDob(dob, nic)`, `matchesNicGender(gender, nic)` | `lanka-validations` |
| Check a Sri Lankan mobile number | `isValidMobile(phone)` | `lanka-validations/phone` |
| Convert a phone number to +94 (E.164) format | `formatPhone(phone, 'e164')` | `lanka-validations/phone` |
| Check a passport or driving licence number | `isValidPassport(value)`, `isValidDrivingLicense(value)` | `lanka-validations/passport`, `lanka-validations/license` |
| Check a vehicle number plate | `isValidVehiclePlate(plate)` | `lanka-validations/vehicle` |
| Parse or validate a rupee amount | `parseLKR(input)`, `validateLKR(input, { min, max })` | `lanka-validations/currency` |
| Format rupees with lakh grouping (15,00,000.00) | `formatLKR(amount, { lakhScale: true })` | `lanka-validations/currency` |
| Write an amount in words (English, Sinhala, Tamil) | `lkrToWords(amount, { language })` | `lanka-validations/currency` |
| Handle money exactly, in cents | `parseLKRMinorUnits(text)` | `lanka-validations/currency` |
| Find the district for a postal code | `lookupPostalCode(code)` | `lanka-validations/postal-code` |
| Look up a bank by CBSL code | `getBankByCode(code)` | `lanka-validations/bank` |
| Check a TIN or VAT number | `isValidTIN(tin)`, `isValidVAT(vat)` | `lanka-validations/tax` |
| List provinces and districts in three languages | `getProvinces()`, `getDistricts()` | `lanka-validations/administrative` |
| Validate a whole form object | `createSchemaValidator({ ... })` with `rules` | `lanka-validations/schema` |
| Show errors in Sinhala or Tamil | `localizeValidationResult(result, 'si')` | `lanka-validations/i18n` |
| Mask an NIC, phone, or account number for logs | `maskNic(nic)`, `maskPhone(phone)`, `maskBankAccount(account)` | `lanka-validations/privacy` |

Subpath imports keep bundles small: importing `isValidNic` alone adds about 1 kB. Everything is also exported from the package root.

Full API reference: **https://mmsalmanfaris.github.io/lanka-validations/**

---

## Table of Contents

- [Quick Start](#quick-start)
- [Which Function Do I Use?](#which-function-do-i-use)
- [Key Capabilities](#key-capabilities)
- [What Validation Means](#what-validation-means)
- [Data Sources](#data-sources)
- [Installation](#installation)
- [Import Styles](#import-styles)
- [Quick Guide by Validator](#quick-guide-by-validator)
  - [1. National Identity Card (NIC)](#1-national-identity-card-nic)
  - [2. Phone Numbers and Short Codes](#2-phone-numbers-and-short-codes)
  - [3. Passport Numbers](#3-passport-numbers)
  - [4. Driving Licenses and DMT Vehicle Classes](#4-driving-licenses-and-dmt-vehicle-classes)
  - [5. Vehicle Registration Number Plates](#5-vehicle-registration-number-plates)
  - [6. Sri Lankan Rupee (LKR) Currency and Words](#6-sri-lankan-rupee-lkr-currency-and-words)
  - [7. Date of Birth (DOB) and Age](#7-date-of-birth-dob-and-age)
  - [8. Gender Normalization](#8-gender-normalization)
  - [9. Postal Codes and District Lookup](#9-postal-codes-and-district-lookup)
  - [10. Central Bank (CBSL) Bank and Branch Codes](#10-central-bank-cbsl-bank-and-branch-codes)
  - [11. Tax Identification (TIN and VAT)](#11-tax-identification-tin-and-vat)
  - [12. Administrative Divisions (Provinces and Districts)](#12-administrative-divisions-provinces-and-districts)
  - [13. Schema and Form Validator](#13-schema-and-form-validator)
- [Cross-Field Verification (NIC Matching)](#cross-field-verification-nic-matching)
- [Using with Zod, React Hook Form, and Express](#using-with-zod-react-hook-form-and-express)
- [API Reference](#api-reference)
- [Frequently Asked Questions](#frequently-asked-questions)
- [Contributing](#contributing)
- [Author](#author)
- [License](#license)

---

## Key Capabilities

- **Zero Runtime Dependencies**: Written entirely in pure, standard JavaScript and TypeScript.
- **Sri Lankan Format Support**: Rules and reference tables are based on published DRP, TRCSL, CBSL, DMT, Sri Lanka Post, and IRD material; see [Data sources](#data-sources) for each table's source, as-of date, and known limits.
- **Trilingual Conversion**: Handles English, Sinhala, and Tamil for currency words, gender normalization, and administrative regions.
- **Bidirectional NIC Conversion**: Converts smoothly between Old (9-digit + V/X) and New (12-digit) NIC numbers.
- **Cross-Field KYC Integrity**: Checks if a submitted Date of Birth and Gender match the embedded data in a National Identity Card.
- **Modular and Tree-Shakeable**: Import only the validators you need using subpath exports.
- **Safe on Untrusted Input**: Validators accept `unknown`, never throw, and reject inputs over 1,024 characters. Property-based tests check this across thousands of generated inputs.

---

## What Validation Means

These validators check that a value is **well-formed** and consistent with the rules and reference tables listed under [Data sources](#data-sources). They do **not** check that the value exists or belongs to anyone:

- A valid NIC, passport, or driving licence number may never have been issued, or may belong to someone else.
- A valid phone number may be unassigned or disconnected; the operator shown is the prefix's original allocation, not the current network after number porting.
- A valid bank code and account number do not prove that the account exists or is open.
- A valid TIN or VAT number does not prove IRD registration.
- NIC check digits are not verified, because DRP has not published the algorithm.

For KYC or payments, treat these checks as input hygiene and confirm identity, accounts, and registrations with the issuing authority or a verification provider.

---

## Data Sources

Reference tables are bundled at build time and do not update on their own. `getReferenceDataMetadata()` returns this information at runtime, including the limitations of each table.

| Table | Source | As of | Coverage |
| --- | --- | --- | --- |
| Provinces, districts | [Department of Census and Statistics: Census of Population and Housing 2024 preliminary report](https://www.statistics.gov.lk/Resource/en/Population/CPH_2024/Preliminary_Report.pdf) | 2026-10-12 | All 9 provinces and 25 districts, in English, Sinhala, and Tamil |
| CBSL bank codes | [Central Bank of Sri Lanka: ITRS Bank Reference Manual](https://www.cbsl.gov.lk/sites/default/files/cbslweb_documents/about/ITRS_bank_reference_manual_e.pdf) | 2026-10-12 | Institution codes included by this package; verify routing-critical use against current CBSL publications |
| Postal codes | [Sri Lanka Post: Post Code Book (2022)](https://www.slpost.gov.lk/wp-content/uploads/2022/11/POST-CODE-BOOK-.pdf) | 2026-10-12 | Two-digit prefixes mapped to districts, plus selected major cities; not every delivery office |
| Mobile prefixes, area codes, short codes | [TRCSL: National Numbering Plan](https://www.trc.gov.lk/pages_e.php?id=121) | 2026-10-12 | Known prefixes and a curated subset of short codes; an unrecognised prefix is not proof a number is unassigned |
| Driving licence classes | [Department of Motor Traffic: Driving licence vehicle classes](https://dmt.gov.lk/index.php?Itemid=163&id=46&lang=ta&option=com_content&view=article) | 2026-10-12 | DMT classes, descriptions, and minimum ages used by this package |
| Vehicle plate provinces | [Department of Motor Traffic: Vehicle Information Service](https://eservices.motortraffic.gov.lk/VehicleInfo/home) | 2026-10-12 | Nine province prefixes; historical plate formats are best-effort |
| NIC format | Public DRP guidance; no official specification found | — | Old (9 digits + V/X) and new (12 digits) formats. Day-of-year uses the 366-day convention; day 060 in a common year maps to 28 February pending DRP confirmation |
| TIN / VAT | [IRD: Taxpayer registration guidelines](https://www.ird.gov.lk/en/Shared%20Documents/TPR_Guidelines_1.1_E.pdf) | 2026-10-14 | Digit-pattern checks only; an NIC is not accepted as a TIN |

Found an outdated entry? Please [open an issue](https://github.com/mmsalmanfaris/lanka-validations/issues) with a link to the current official source.

---

## Installation

Install using your preferred package manager:

```bash
# npm
npm install lanka-validations

# pnpm
pnpm add lanka-validations

# yarn
yarn add lanka-validations

# bun
bun add lanka-validations
```

---

## Import Styles

### 1. Root Import (All-in-One)

```typescript
import {
  isValidNic,
  parseNic,
  isValidPhone,
  formatLKR,
  lkrToWords,
} from 'lanka-validations';
```

### 2. Subpath Import (Recommended for Small Bundle Size)

```typescript
import { isValidNic, parseNic } from 'lanka-validations/nic';
import { isValidPhone, parsePhone } from 'lanka-validations/phone';
import { formatLKR, lkrToWords } from 'lanka-validations/currency';
import { createSchemaValidator, rules } from 'lanka-validations/schema';
```

---

## Quick Guide by Validator

### 1. National Identity Card (NIC)

Validates both the **Old Format** (9 digits followed by `V` or `X`) and the **New Format** (12 digits). It extracts the birth year, day of year, gender, date of birth, age, and voter eligibility.

```typescript
import {
  isValidNic,
  parseNic,
  convertOldToNewNic,
  convertNewToOldNic,
  formatNic,
} from 'lanka-validations/nic';

// Simple boolean validation
isValidNic('921234567V');   // true
isValidNic('199212304567'); // true
isValidNic('9212345678');   // false

// Extract detailed information
const info = parseNic('921234567V');
console.log(info?.year);       // 1992
console.log(info?.gender);     // 'male'
console.log(info?.dobString);  // '1992-05-02'
console.log(info?.isVoter);    // true
console.log(info?.newNic);     // '199212304567'

// Convert between formats
convertOldToNewNic('921234567V');  // '199212304567'
convertNewToOldNic('199212304567'); // '921234567V'

// Clean formatting
formatNic('199212304567', 'spaced-new'); // '1992 123 0456 7'
```

---

### 2. Phone Numbers and Short Codes

Validates mobile providers (Dialog, Mobitel, Hutch, Airtel), landline area codes for all 25 districts, fixed operators (SLT, Dialog Broadband, Lanka Bell), and emergency short codes.

```typescript
import {
  isValidMobile,
  isValidLandline,
  isValidShortCode,
  parsePhone,
  formatPhone,
} from 'lanka-validations/phone';

// Provider and line type checks
isValidMobile('0771234567');   // true (Dialog)
isValidMobile('0711234567');   // true (Mobitel)
isValidMobile('0781234567');   // true (Hutch)
isValidMobile('0751234567');   // true (Airtel)

isValidLandline('0112345678'); // true (Colombo landline)
isValidLandline('0812345678'); // true (Kandy landline)

isValidShortCode('119');       // true (Police Emergency)
isValidShortCode('1990');      // true (Suwa Seriya Ambulance)

// Detailed inspection
const phone = parsePhone('+94 77 123 4567');
console.log(phone?.operator);     // 'Dialog'
console.log(phone?.normalized);   // '0771234567'
console.log(phone?.type);         // 'mobile'

// Standard formatting
formatPhone('0771234567', 'e164');          // '+94771234567'
formatPhone('0771234567', 'national');      // '077 123 4567'
formatPhone('0771234567', 'international'); // '+94 77 123 4567'
```

---

### 3. Passport Numbers

Validates standard Machine-Readable Passports (MRP) and modern biometric electronic passports.

```typescript
import { isValidPassport, parsePassport } from 'lanka-validations/passport';

isValidPassport('N1234567');  // true (Ordinary Passport)
isValidPassport('D1234567');  // true (Diplomatic Passport)
isValidPassport('O1234567');  // true (Official Passport)
isValidPassport('PA1234567'); // true (Biometric e-Passport)

const details = parsePassport('D1234567');
console.log(details?.type);   // 'diplomatic'
```

---

### 4. Driving Licenses and DMT Vehicle Classes

Validates Department of Motor Traffic (DMT) driving license numbers and recognized vehicle categories.

```typescript
import {
  isValidDrivingLicense,
  isValidLicenseCategory,
  getLicenseCategoryInfo,
} from 'lanka-validations/license';

isValidDrivingLicense('B1234567');     // true (DMT B-number)
isValidDrivingLicense('921234567V');   // true (NIC smart card format)
isValidDrivingLicense('199212304567'); // true (New NIC smart card format)

// Vehicle license categories
isValidLicenseCategory('B1'); // true (Motor Tricycle / Tuk-tuk)
isValidLicenseCategory('A');  // true (Motorcycle)
isValidLicenseCategory('B');  // true (Dual Purpose Vehicle / Car)

const category = getLicenseCategoryInfo('B1');
console.log(category?.name);   // 'Motor Tricycle'
console.log(category?.minAge); // 18
```

---

### 5. Vehicle Registration Number Plates

Supports modern province plates, modern numeric series, historical "Sri" series, and vintage plates.

```typescript
import { isValidVehiclePlate, parseVehiclePlate, formatVehiclePlate } from 'lanka-validations/vehicle';

isValidVehiclePlate('WP CAB-1234'); // true (Western Province modern plate)
isValidVehiclePlate('CP CAA-5678'); // true (Central Province modern plate)
isValidVehiclePlate('14 Sri 1234'); // true (Historical Sri series)
isValidVehiclePlate('EY 1234');     // true (Vintage pre-1956 series)

const plate = parseVehiclePlate('wp cab 1234');
console.log(plate?.provinceCode); // 'WP'
console.log(plate?.provinceName); // 'Western Province'
console.log(plate?.formatted);    // 'WP CAB-1234'
```

---

### 6. Sri Lankan Rupee (LKR) Currency and Words

Parses amounts with local currency symbols (`Rs.`, `රු.`, `ரூ.`, `LKR`), formats using Western or South Asian Lakh grouping, and generates text representations in English, Sinhala, and Tamil.

```typescript
import { parseLKR, formatLKR, lkrToWords, isValidLKR } from 'lanka-validations/currency';

// Parsing
parseLKR('Rs. 1,500.50'); // 1500.5
parseLKR('රු. 2,500.00'); // 2500
parseLKR('LKR 1,50,000'); // 150000

// Formatting
formatLKR(1500000);                      // 'Rs. 1,500,000.00' (Western)
formatLKR(1500000, { lakhScale: true }); // 'Rs. 15,00,000.00' (Lakh grouping)
formatLKR(500, { symbol: 'රු.' });        // 'රු. 500.00'

// Convert number to words
lkrToWords(1500.50);
// 'One Thousand Five Hundred Rupees and Fifty Cents Only'

lkrToWords(1500.50, { language: 'si' });
// 'රුපියල් එක්දහස් පන්සියයයි ශත පනහයි'

lkrToWords(1500.50, { language: 'ta' });
// 'ஆயிரத்து ஐந்நூறு ரூபாய் ஐம்பது சதம்'
```

---

### 7. Date of Birth (DOB) and Age

Validates that a date is in the past, verifies age limits, and calculates completed years with leap-year precision.

```typescript
import { isValidDob, calculateAge } from 'lanka-validations/dob';

calculateAge('2000-01-01', new Date('2025-06-01')); // 25 (age on a given date; defaults to today)
isValidDob('1995-05-20');   // true
isValidDob('2015-01-01', { minAge: 18 }); // false (underage)
```

---

### 8. Gender Normalization

Normalizes user input across English, Sinhala, and Tamil into `'male'` or `'female'`.

```typescript
import { normalizeGender, isValidGender } from 'lanka-validations/gender';

normalizeGender('male');    // 'male'
normalizeGender('M');       // 'male'
normalizeGender('පිරිමි');   // 'male'
normalizeGender('ஆண்');     // 'male'

normalizeGender('female');  // 'female'
normalizeGender('ගැහැණු');  // 'female'
normalizeGender('பெண்');    // 'female'
```

---

### 9. Postal Codes and District Lookup

Validates 5-digit postal codes and determines the associated district, province, and primary post office.

```typescript
import { isValidPostalCode, lookupPostalCode } from 'lanka-validations/postal-code';

isValidPostalCode('00100'); // true (Colombo 01 Fort)
isValidPostalCode('20000'); // true (Kandy)

const location = lookupPostalCode('00100');
console.log(location?.district);    // 'Colombo'
console.log(location?.province);    // 'Western'
console.log(location?.primaryCity); // 'Colombo 01 (Fort)'
```

---

### 10. Central Bank (CBSL) Bank and Branch Codes

Contains all 28+ licensed commercial and specialized banks registered with the Central Bank of Sri Lanka.

```typescript
import {
  isValidBankCode,
  getBankByCode,
  validateBankAccount,
} from 'lanka-validations/bank';

isValidBankCode('7010'); // true (Bank of Ceylon - BOC)
isValidBankCode('7083'); // true (People's Bank)
isValidBankCode('7056'); // true (Commercial Bank of Ceylon)
isValidBankCode('7135'); // true (Sampath Bank)
isValidBankCode('7074'); // true (Hatton National Bank - HNB)

const bank = getBankByCode('7010');
console.log(bank?.name);      // 'Bank of Ceylon'
console.log(bank?.shortName); // 'BOC'

// Validate account number with bank and branch
const result = validateBankAccount('1234567890', '7010', '001');
console.log(result.isValid);  // true
```

---

### 11. Tax Identification (TIN and VAT)

Validates Taxpayer Identification Numbers issued by the Inland Revenue Department (IRD) and VAT registration numbers.

```typescript
import { isValidTIN, isValidVAT } from 'lanka-validations/tax';

isValidTIN('123456789');      // true (9-digit IRD TIN)
isValidTIN('921234567V');     // false (an NIC is not a TIN)
isValidVAT('123456789-7000'); // true (Standard IRD VAT number)
```

---

### 12. Administrative Divisions (Provinces and Districts)

Validates all 9 provinces and 25 districts using codes or names in English, Sinhala, and Tamil.

```typescript
import { isValidProvince, isValidDistrict, getDistrictInfo } from 'lanka-validations/administrative';

isValidProvince('Western');   // true
isValidProvince('WP');        // true
isValidProvince('බස්නාහිර'); // true
isValidProvince('மேல்');     // true

isValidDistrict('Colombo');   // true
isValidDistrict('කොළඹ');     // true
isValidDistrict('கொழும்பு'); // true

const district = getDistrictInfo('Colombo');
console.log(district?.provinceCode); // 'WP'
console.log(district?.provinceName); // 'Western'
```

---

### 13. Schema and Form Validator

Provides an easy, chainable schema builder to validate full forms in frontend frameworks (React, Vue, Svelte) or backend endpoints (Express, NestJS, Next.js).

```typescript
import { createSchemaValidator, rules } from 'lanka-validations/schema';

const userSchema = createSchemaValidator({
  nic: rules.nic(),
  phone: rules.phone(),
  dob: [rules.dob({ minAge: 18 }), rules.matchesNicDob('nic')],
  gender: [rules.gender(), rules.matchesNicGender('nic')],
  salary: rules.currency({ min: 10000 }),
  postalCode: rules.postalCode(),
});

const formSubmission = {
  nic: '921234567V',
  phone: '0771234567',
  dob: '1992-05-02',
  gender: 'male',
  salary: 'Rs. 150,000.00',
  postalCode: '00100',
};

const validation = userSchema.validate(formSubmission);
console.log(validation.isValid); // true
```

---

## Cross-Field Verification (NIC Matching)

In Sri Lankan digital onboarding, a common requirement is ensuring that user-provided Date of Birth and Gender match the data stored within their National Identity Card.

```typescript
import { matchesNicDob } from 'lanka-validations/dob';
import { matchesNicGender } from 'lanka-validations/gender';

const userNic = '921234567V'; // Male, Date of Birth: 1992-05-02

// Cross-check Date of Birth
matchesNicDob('1992-05-02', userNic); // true
matchesNicDob('1995-01-01', userNic); // false (DOB mismatch)

// Cross-check Gender
matchesNicGender('male', userNic);   // true
matchesNicGender('female', userNic); // false (Gender mismatch)
```

---

## Using with Zod, React Hook Form, and Express

The predicates return plain booleans, so they plug into any validation library.

**Zod**

```typescript
import { z } from 'zod';
import { isValidNic } from 'lanka-validations/nic';
import { isValidMobile } from 'lanka-validations/phone';

const SignUp = z.object({
  nic: z.string().refine(isValidNic, { message: 'Enter a valid Sri Lankan NIC number' }),
  phone: z.string().refine(isValidMobile, { message: 'Enter a Sri Lankan mobile number' }),
});
```

**React Hook Form**

```tsx
import { useForm } from 'react-hook-form';
import { isValidNic } from 'lanka-validations/nic';

const { register } = useForm<{ nic: string }>();

<input {...register('nic', { validate: (value) => isValidNic(value) || 'Invalid NIC number' })} />;
```

**Express**

```typescript
import express from 'express';
import { validateNic } from 'lanka-validations/nic';

const app = express();
app.use(express.json());

app.post('/customers', (req, res) => {
  const nic = validateNic(req.body.nic);
  if (!nic.isValid) {
    res.status(400).json({ code: nic.code, error: nic.error });
    return;
  }
  res.json({ dateOfBirth: nic.data.dobString, gender: nic.data.gender });
});
```

To validate several fields at once with typed output, use the built-in [schema validator](#13-schema-and-form-validator).

---

## API Reference

Full generated documentation for every export: **https://mmsalmanfaris.github.io/lanka-validations/**

| Module | Core Exports | Return Types |
|---|---|---|
| `nic` | `isValidNic`, `parseNic`, `convertOldToNewNic`, `convertNewToOldNic`, `formatNic` | `boolean`, `NicInfo`, `string` |
| `phone` | `isValidPhone`, `isValidMobile`, `isValidLandline`, `parsePhone`, `formatPhone` | `boolean`, `PhoneInfo`, `string` |
| `passport` | `isValidPassport`, `parsePassport`, `validatePassport` | `boolean`, `PassportInfo` |
| `license` | `isValidDrivingLicense`, `isValidLicenseCategory`, `getLicenseCategoryInfo` | `boolean`, `DrivingLicenseInfo` |
| `vehicle` | `isValidVehiclePlate`, `parseVehiclePlate`, `formatVehiclePlate` | `boolean`, `VehiclePlateInfo` |
| `currency` | `isValidLKR`, `parseLKR`, `formatLKR`, `lkrToWords` | `boolean`, `number`, `string` |
| `dob` | `isValidDob`, `calculateAge`, `matchesNicDob` | `boolean`, `number` |
| `gender` | `isValidGender`, `normalizeGender`, `matchesNicGender` | `boolean`, `'male' \| 'female'` |
| `postal-code` | `isValidPostalCode`, `lookupPostalCode` | `boolean`, `PostalCodeInfo` |
| `bank` | `isValidBankCode`, `isValidBranchCode`, `getBankByCode`, `getBankList` | `boolean`, `BankInfo` |
| `tax` | `isValidTIN`, `isValidVAT`, `validateTIN`, `validateVAT` | `boolean`, `ValidationResult` |
| `administrative` | `isValidProvince`, `isValidDistrict`, `getProvinces`, `getDistricts` | `boolean`, `ProvinceInfo[]`, `DistrictInfo[]` |
| `schema` | `createSchemaValidator`, `rules` | `SchemaValidator`, `SchemaValidationResult` |

---

## Input contracts and validation safety

Scalar parsers and validators accept strings and finite numbers where their format
matches. Objects, arrays, booleans, bigint, symbols, `NaN`, and infinities are
rejected without calling user-defined string conversion. DOB functions additionally
accept valid `Date` objects. Use strings for identifiers to preserve leading zeros
and avoid JavaScript numeric precision loss. Strings are trimmed, and zero-width
spaces/BOMs are removed by the common normalizer.
Raw strings longer than `MAX_INPUT_LENGTH` (1024 UTF-16 code units) are rejected
before trimming, case conversion, or separator removal. The limit includes whitespace
and invisible characters; inputs are never truncated. This is a library resource
limit, not an official identifier-length rule. DOB inputs are restricted as below.

- Bank codes must normalize to four ASCII digits and belong to the bank table.
- Postal codes accept one to five ASCII digits (or integers from 0 to 99999),
  padded to five digits. Letters, embedded separators, and fractions are rejected.
  Lookup still checks known ranges, not exact postal assignment.
- Short codes must contain only their three or four digits after trimming.
  `isValidPhone` includes short codes; use `isValidContactPhone` to exclude them,
  or `isValidMobile` for mobile-only fields. Full numbers retain support for
  spaces, hyphens, parentheses, dots, slashes, and a leading international `+`.
- `parseLKR` accepts ungrouped, Western (`1,234,567`), and South Asian
  (`12,34,567`) grouping. A single currency symbol may precede or follow the
  amount. Negatives use a leading minus or enclosing parentheses. Malformed
  grouping, embedded/repeated symbols, and non-finite results are rejected.
  Magnitudes must not exceed exported `MAX_LKR_AMOUNT`
  (`Number.MAX_SAFE_INTEGER / 100`). Parsing returns an approximate JavaScript
  number without rounding fractional digits; it is not an exact decimal-money API.
- `lkrToWords` rounds the number's shortest decimal representation to cents,
  with ties away from zero, before splitting rupees and cents. This includes
  carrying 100 cents into the next rupee. `includeCents: false` hides the cents
  after rounding. Rounded magnitudes must be below 1 trillion rupees for English
  and 1 billion for Sinhala/Tamil; invalid or unsupported amounts throw
  `RangeError`. Existing Sinhala/Tamil vocabulary has not received a new
  native-speaker review.
- DOB age bounds must be non-negative integers with `minAge <= maxAge`, and a
  supplied reference date must be valid. Invalid options return `false` from
  `isValidDob`, `DOB_INVALID_OPTIONS` from `validateDob`, and an invalid age
  reference returns `null` from `calculateAge`.
- DOB strings must use exactly `YYYY-MM-DD`, `YYYY/MM/DD`, `DD-MM-YYYY`, or
  `DD/MM/YYYY`, with two-digit months/days and consistent separators. Numbers,
  timestamps, month names, and other `Date.parse` formats are rejected. Dates must
  exist in the calendar. `Date` inputs use their **UTC calendar date**, are copied,
  and normalized to UTC midnight. Age and future-date checks use UTC, independently
  of the host time zone; a local midnight Date can represent the previous UTC day.
- NIC parsing and boolean/detailed validation accept `{ referenceDate: Date }`
  as an optional second argument. They use one UTC reference for both year and
  age checks and reject future DOBs within the same year (`NIC_FUTURE_DOB`).
  Invalid references produce `NIC_INVALID_OPTIONS` in detailed validation.
  Converters accept the same option; `formatNic` accepts it as a third argument,
  and `rules.nic(options)` supports it in schemas.
- Bank, province, and district getters return independent mutable copies, including
  province district arrays. Changing a returned record cannot affect subsequent
  lookups. Exported `CBSL_BANKS`, `PROVINCES`, and `DISTRICTS` tables are deeply
  frozen with readonly declaration types. Consumers that mutated these shared
  exports must instead use getter copies; direct mutation now fails.
- Schema validation accepts plain or null-prototype records. Invalid roots return
  an error under `$root`. The `errors` dictionary has no prototype, so fields such
  as `__proto__` work normally. Use `Object.hasOwn(errors, field)` instead of
  `errors.hasOwnProperty(field)`. Rule exceptions still propagate to the caller.

These checks validate supported formats and semantics, not identity, account
ownership, or official registration. The stricter rejection rules and word-conversion
range errors are intentional changes from earlier permissive behavior.

The implementation follows [OWASP input-validation guidance](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html),
[own-property lookup semantics](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwn),
and [finite-number checks](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isFinite).

**NIC day-60 research (12 October 2026):** the library retains its legacy mapping
of day 60 to February 28 in non-leap years, and February 29 in leap years.
The [DRP FAQ](https://drp.gov.lk/en/faq.php) explains conversion to 12-digit numbers
but does not establish this day-of-year rule. Targeted DRP searches did not find
an authoritative rule. Tests preserve compatibility; they do not certify that
mapping as official. No leap-day policy change has been made without that evidence.

## Performance benchmarks

Run `npm run benchmark` after a production build. The dependency-free harness uses
Node's high-resolution `performance.now()` clock, warms each operation, reports the
median of repeated samples, exercises CJS and ESM, includes valid/invalid/oversized
and mixed inputs, measures cold imports in isolated Node processes, and reports a
post-GC retained-heap estimate. Set `BENCHMARK_BASELINE=/absolute/path/to/dist` to
compare another build. `BENCHMARK_WARMUP`, `BENCHMARK_ITERATIONS`,
`BENCHMARK_SAMPLES`, and `BENCHMARK_COLD_SAMPLES` control the workload.

The 12 October 2026 comparison on Node 25.4.0 used 20,000 warm-up calls and repeated
medians of 200,000 calls for focused hot-operation checks. Precomputed trilingual
administrative indexes changed last-district lookup from 3.04 to 0.13 µs/op in CJS
(23×) and 3.08 to 0.10 µs/op in ESM (32×). Missing-district lookup changed from
3.41 to 0.08 µs/op in CJS (41×) and 3.29 to 0.05 µs/op in ESM (60×). Successful
detailed NIC validation improved about 1.2–1.3× and phone validation about 1.1–1.2×
after eliminating duplicate normalization on their success paths. These are local
synthetic measurements, not production guarantees or release gates.

Tree-shaking was rechecked with esbuild after adding the indexes. Importing only
`isValidNic` produced a 969-byte gzip bundle from the root entry and 967 bytes from
the `/nic` entry; the administrative index was absent from both. The unminified CJS
root grew by 218 bytes and the administrative entry by 308 bytes relative to the
saved pre-index build.

The indexes contain only public administrative aliases. They do not cache supplied
NICs, phone numbers, or other personal identifiers. All code paths preserve the
existing detached-copy behavior of lookup results. The benchmark implementation uses
[Node's performance clock](https://nodejs.org/api/perf_hooks.html) and
[memory-usage API](https://nodejs.org/api/process.html#processmemoryusage).

## Frequently Asked Questions

### How do I validate a Sri Lankan NIC number in JavaScript or TypeScript?

Install `lanka-validations` and call `isValidNic(value)` from `lanka-validations/nic`. It returns `true` for valid old-format (9 digits plus V or X) and new-format (12 digits) numbers. Use `validateNic(value)` to also get the date of birth, age, gender, and an error code when it fails.

### How do I get the date of birth and gender from an NIC?

Call `parseNic('921234567V')`. It returns `dobString` (`'1992-05-02'`), `dob` as a UTC `Date`, `age`, `gender` (`'male'` or `'female'`), and both the old and new forms of the number. It returns `null` for invalid input. The birth year and day of year are encoded in the number; 500 is added to the day for women.

### How do I convert an old NIC to the new 12-digit format?

Use `convertOldToNewNic('921234567V')`, which returns `'199212304567'`. `convertNewToOldNic` converts back for people born between 1900 and 1999. Both return `null` when the input is not a valid NIC of the expected format.

### Does it check that an NIC, phone number, or bank account really exists?

No. It checks format and consistency with published rules and reference tables. It cannot tell whether a number was issued, who owns it, or whether an account is open. For KYC, confirm identity with the issuing authority or a verification provider. See [What Validation Means](#what-validation-means).

### Does it work in the browser, React, Next.js, Deno, and Bun?

Yes. It has no runtime dependencies and uses no Node.js-only APIs, so it runs in browsers, React and Next.js (client and server), Node.js 20+, Deno, and Bun. It ships both ESM and CommonJS builds with TypeScript types, and subpath imports such as `lanka-validations/nic` keep bundles small.

### Can I show validation errors in Sinhala or Tamil?

Yes. Every failure has a stable `code`. Pass a result to `localizeValidationResult(result, 'si')` or `'ta'` from `lanka-validations/i18n`, or use `localizeSchemaResult` for whole forms. You can override any message by code with your own text.

### Why does `isValidTIN` reject an NIC number?

An NIC is not a TIN. Individuals register with the Inland Revenue Department using their NIC and receive a separate 9- or 10-digit TIN. Since 2.0.0, `isValidTIN` accepts only TIN formats; validate NIC fields with `isValidNic`.

### How up to date is the reference data?

Each bundled table (provinces, districts, bank codes, postal prefixes, phone prefixes, licence classes) records its official source, as-of date, and known gaps. Read them at runtime with `getReferenceDataMetadata()` or in the [Data Sources](#data-sources) table. Report outdated entries with the data-correction issue form.

### How do I upgrade from 1.x to 2.x?

2.0.0 requires Node.js 20+, rejects malformed input that 1.x accepted, stops treating NIC numbers as TINs, freezes the exported reference tables, and turns `ValidationResult` into a union you narrow with `isValid`. The [changelog](CHANGELOG.md) lists every breaking change.

### What should I use instead?

For international phone numbers from many countries, use `libphonenumber-js`. For generic checks such as email addresses or URLs, use a general-purpose validator. Use `lanka-validations` for Sri Lanka-specific identifiers and data; it combines well with both.

---

## Contributing

We welcome contributions from the community. Please read our [Contribution Guidelines](CONTRIBUTING.md) before submitting pull requests. Note that all pull requests must be made against the **`development`** branch.

---

## Author

**M.M. Salman Faris**  
- Email: [mmsalmanfaris@outlook.com](mailto:mmsalmanfaris@outlook.com)  
- GitHub: [@mmsalmanfaris](https://github.com/mmsalmanfaris)

---

## License

This library is licensed under the [MIT License](LICENSE).
