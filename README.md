# Lanka Validations

> Ultra-fast, zero-dependency Sri Lankan data validation and parsing library for TypeScript & JavaScript.  
> (ශ්‍රී ලංකා දත්ත වලංගුකරණය / இலங்கை தரவு சரிபார்ப்பு)

[![npm version](https://img.shields.io/badge/npm-v1.0.0-blue.svg)](https://www.npmjs.com/package/lanka-validations)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Tests](https://img.shields.io/badge/Tests-88%20Passed-brightgreen.svg)]()
[![Zero Dependencies](https://img.shields.io/badge/Dependencies-0-success.svg)]()
[![Bundle Size](https://img.shields.io/badge/Bundle-Tree--Shakeable-teal.svg)]()

`lanka-validations` is the most comprehensive, battle-tested validation suite designed specifically for Sri Lankan software applications, KYC onboarding, banking integrations, and forms.

---

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Import Styles](#import-styles)
- [Modules & Quick Examples](#modules--quick-examples)
  - [1. National Identity Card (NIC)](#1-national-identity-card-nic)
  - [2. Phone Numbers & Short Codes](#2-phone-numbers--short-codes)
  - [3. Passport Numbers](#3-passport-numbers)
  - [4. Driving Licenses & DMT Vehicle Classes](#4-driving-licenses--dmt-vehicle-classes)
  - [5. Vehicle Number Plates](#5-vehicle-number-plates)
  - [6. Currency (LKR) & Number-to-Words](#6-currency-lkr--number-to-words)
  - [7. Date of Birth (DOB) & Age](#7-date-of-birth-dob--age)
  - [8. Gender (Trilingual Normalization)](#8-gender-trilingual-normalization)
  - [9. Postal Codes & Districts](#9-postal-codes--districts)
  - [10. Central Bank (CBSL) Bank & Branch Codes](#10-central-bank-cbsl-bank--branch-codes)
  - [11. Taxpayer ID (TIN) & VAT](#11-taxpayer-id-tin--vat)
  - [12. Administrative Divisions (Provinces & Districts)](#12-administrative-divisions-provinces--districts)
  - [13. Schema & Form Validation Builder](#13-schema--form-validation-builder)
- [Cross-Field Verification (NIC Matching)](#cross-field-verification-nic-matching)
- [TypeScript API Reference](#typescript-api-reference)
- [License](#license)

---

## Features

- ⚡ **Zero Dependencies**: Pure, lightweight JavaScript & TypeScript algorithms without third-party bloat.
- 🎯 **100% Sri Lanka Specific**: Tailored to local laws, TRCSL telecommunication rules, CBSL banking codes, IRD tax formats, and DMT regulations.
- 🌐 **Trilingual Support**: English, Sinhala (`සිංහල`), and Tamil (`தமிழ்`) support for currency words, gender normalization, and province/district names.
- 🔄 **Bidirectional NIC Converter**: Seamlessly convert between Old 10-character (`921234567V`) and New 12-digit (`199212304567`) NIC formats.
- 🛡️ **Cross-Field KYC Integrity**: Directly cross-validate whether user-entered DOB and Gender match their NIC number.
- 📦 **Dual ESM & CommonJS**: Full tree-shaking support with subpath imports (`lanka-validations/nic`, `lanka-validations/phone`, etc.).

---

## Installation

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

### 1. Barrel Import
```typescript
import {
  isValidNic,
  parseNic,
  isValidPhone,
  formatLKR,
  lkrToWords,
} from 'lanka-validations';
```

### 2. Subpath Import (Optimized for Smallest Bundle Size)
```typescript
import { isValidNic, parseNic } from 'lanka-validations/nic';
import { isValidPhone, parsePhone } from 'lanka-validations/phone';
import { formatLKR, lkrToWords } from 'lanka-validations/currency';
import { createSchemaValidator, rules } from 'lanka-validations/schema';
```

---

## Modules & Quick Examples

### 1. National Identity Card (NIC)

Validates both **Old Format** (9 digits + `V`/`X`) and **New Format** (12 digits), extracting Date of Birth, Gender, Age, and Voter eligibility.

```typescript
import {
  isValidNic,
  parseNic,
  convertOldToNewNic,
  convertNewToOldNic,
  formatNic,
} from 'lanka-validations/nic';

// Simple boolean validation
isValidNic('921234567V'); // true
isValidNic('199212304567'); // true
isValidNic('123456'); // false

// Full extraction & parsing
const info = parseNic('921234567V');
/*
{
  nic: '921234567V',
  format: 'old',
  year: 1992,
  gender: 'male',
  dobString: '1992-05-02',
  age: 33,
  isVoter: true,
  newNic: '199212304567',
  ...
}
*/

// Bidirectional conversion
convertOldToNewNic('921234567V'); // '199212304567'
convertNewToOldNic('199212304567'); // '921234567V'

// Clean formatting
formatNic('199212304567', 'spaced-new'); // '1992 123 0456 7'
```

---

### 2. Phone Numbers & Short Codes

Validates and formats all Sri Lankan mobile operators, regional landlines, and official emergency hotlines.

```typescript
import {
  isValidPhone,
  isValidMobile,
  isValidLandline,
  isValidShortCode,
  parsePhone,
  formatPhone,
} from 'lanka-validations/phone';

// Boolean checks
isValidMobile('0771234567'); // true (Dialog)
isValidMobile('0711234567'); // true (Mobitel)
isValidMobile('0781234567'); // true (Hutch)
isValidMobile('0751234567'); // true (Airtel)

isValidLandline('0112345678'); // true (Colombo)
isValidLandline('0812345678'); // true (Kandy)

isValidShortCode('119');  // true (Police)
isValidShortCode('1990'); // true (Suwa Seriya Ambulance)

// Parsing metadata
const phone = parsePhone('+94 77 123 4567');
/*
{
  raw: '+94 77 123 4567',
  normalized: '0771234567',
  e164: '+94771234567',
  national: '077 123 4567',
  international: '+94 77 123 4567',
  type: 'mobile',
  operator: 'Dialog'
}
*/

// Standard formatting
formatPhone('0771234567', 'e164');          // '+94771234567'
formatPhone('0771234567', 'national');      // '077 123 4567'
formatPhone('0771234567', 'international'); // '+94 77 123 4567'
```

---

### 3. Passport Numbers

Validates standard Machine-Readable Passports (MRP) and new biometric e-Passports.

```typescript
import { isValidPassport, parsePassport } from 'lanka-validations/passport';

isValidPassport('N1234567');  // true (Regular Ordinary Passport)
isValidPassport('D1234567');  // true (Diplomatic Passport)
isValidPassport('O1234567');  // true (Official Passport)
isValidPassport('PA1234567'); // true (Biometric e-Passport)

const passport = parsePassport('D1234567');
// { passport: 'D1234567', type: 'diplomatic', prefix: 'D', number: '1234567', isEPassport: false }
```

---

### 4. Driving Licenses & DMT Vehicle Classes

Validates Department of Motor Traffic (DMT) driving license numbers and class categories.

```typescript
import {
  isValidDrivingLicense,
  isValidLicenseCategory,
  getLicenseCategoryInfo,
} from 'lanka-validations/license';

// License format checks
isValidDrivingLicense('B1234567');     // true (DMT B-number)
isValidDrivingLicense('921234567V');   // true (Smart card NIC-based)
isValidDrivingLicense('199212304567'); // true (Smart card New NIC)

// Vehicle category validation
isValidLicenseCategory('B1'); // true (Motor Tricycle / Tuk-tuk)
isValidLicenseCategory('A');  // true (Heavy Motor Cycle)
isValidLicenseCategory('B');  // true (Dual purpose vehicle / Car)

const info = getLicenseCategoryInfo('B1');
// { category: 'B1', name: 'Motor Tricycle', minAge: 18, ... }
```

---

### 5. Vehicle Number Plates

Supports modern province plates, numeric series, historical "Sri" series, and vintage plates.

```typescript
import { isValidVehiclePlate, parseVehiclePlate, formatVehiclePlate } from 'lanka-validations/vehicle';

isValidVehiclePlate('WP CAB-1234'); // true (Western Province Modern)
isValidVehiclePlate('CP CAA-5678'); // true (Central Province)
isValidVehiclePlate('14 Sri 1234'); // true (Historical Sri Series)
isValidVehiclePlate('EY 1234');     // true (Vintage Series)

const parsed = parseVehiclePlate('wp cab 1234');
/*
{
  era: 'modern',
  provinceCode: 'WP',
  provinceName: 'Western Province',
  series: 'CAB',
  number: '1234',
  formatted: 'WP CAB-1234'
}
*/
```

---

### 6. Currency (LKR) & Number-to-Words

Parses rupees and cents with `Rs.`, `රු.`, `ரூ.`, `LKR`, formats with Western or South Asian Lakh grouping, and converts amounts into words in **English**, **Sinhala**, and **Tamil**.

```typescript
import { parseLKR, formatLKR, lkrToWords, isValidLKR } from 'lanka-validations/currency';

// Parsing currency strings
parseLKR('Rs. 1,500.50'); // 1500.5
parseLKR('රු. 2,500.00'); // 2500
parseLKR('LKR 1,50,000'); // 150000

// Formatting options
formatLKR(1500000);                      // 'Rs. 1,500,000.00' (Western)
formatLKR(1500000, { lakhScale: true }); // 'Rs. 15,00,000.00' (Lakh scale)
formatLKR(500, { symbol: 'රු.' });        // 'රු. 500.00'

// Number to Words (Trilingual)
lkrToWords(1500.50);
// 'One Thousand Five Hundred Rupees and Fifty Cents Only'

lkrToWords(1500.50, { language: 'si' });
// 'රුපියල් එක්දහස් පන්සියයයි ශත පනහයි'

lkrToWords(1500.50, { language: 'ta' });
// 'ஆயிரத்து ஐந்நூறு ரூபாய் ஐம்பது சதம்'
```

---

### 7. Date of Birth (DOB) & Age

Validates past dates, computes age with leap-year precision, and checks age constraints.

```typescript
import { isValidDob, calculateAge } from 'lanka-validations/dob';

calculateAge('2000-01-01'); // 25
isValidDob('1995-05-20');   // true
isValidDob('2015-01-01', { minAge: 18 }); // false (underage)
```

---

### 8. Gender (Trilingual Normalization)

Normalizes English, Sinhala, and Tamil gender terms into `'male'` | `'female'`.

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

### 9. Postal Codes & Districts

Validates 5-digit Sri Lankan postal codes and looks up administrative districts and primary cities.

```typescript
import { isValidPostalCode, lookupPostalCode } from 'lanka-validations/postal-code';

isValidPostalCode('00100'); // true (Colombo 01 Fort)
isValidPostalCode('20000'); // true (Kandy)

const info = lookupPostalCode('00100');
/*
{
  code: '00100',
  district: 'Colombo',
  province: 'Western',
  primaryCity: 'Colombo 01 (Fort)'
}
*/
```

---

### 10. Central Bank (CBSL) Bank & Branch Codes

Includes all 28+ Central Bank of Sri Lanka (CBSL) licensed commercial and specialized banks.

```typescript
import {
  isValidBankCode,
  isValidBranchCode,
  getBankByCode,
  validateBankAccount,
} from 'lanka-validations/bank';

isValidBankCode('7010'); // true (Bank of Ceylon - BOC)
isValidBankCode('7083'); // true (People's Bank)
isValidBankCode('7056'); // true (Commercial Bank of Ceylon)
isValidBankCode('7135'); // true (Sampath Bank)
isValidBankCode('7074'); // true (Hatton National Bank - HNB)

const boc = getBankByCode('7010');
// { code: '7010', name: 'Bank of Ceylon', shortName: 'BOC', nameSi: 'ලංකා බැංකුව', ... }

// Full account verification
validateBankAccount('1234567890', '7010', '001');
```

---

### 11. Taxpayer ID (TIN) & VAT

Validates Inland Revenue Department (IRD) Taxpayer Identification Numbers and VAT registration numbers.

```typescript
import { isValidTIN, isValidVAT } from 'lanka-validations/tax';

isValidTIN('123456789');       // true (9-digit IRD TIN)
isValidTIN('921234567V');      // true (NIC as TIN)
isValidVAT('123456789-7000');  // true (Standard IRD VAT)
```

---

### 12. Administrative Divisions (Provinces & Districts)

Covers all 9 provinces and 25 districts with trilingual labels.

```typescript
import { isValidProvince, isValidDistrict, getProvinceInfo, getDistrictInfo } from 'lanka-validations/administrative';

isValidProvince('Western');   // true
isValidProvince('WP');        // true
isValidProvince('බස්නාහිර'); // true
isValidProvince('மேல்');     // true

isValidDistrict('Colombo');   // true
isValidDistrict('කොළඹ');     // true
isValidDistrict('கொழும்பு'); // true

const dist = getDistrictInfo('Colombo');
// { name: 'Colombo', provinceCode: 'WP', provinceName: 'Western', nameSi: 'කොළඹ', nameTa: 'கொழும்பு' }
```

---

## Cross-Field Verification (NIC Matching)

A frequent KYC requirement in Sri Lankan banking, telecom, and government portals is verifying that the user-submitted Date of Birth and Gender match the data embedded in their National Identity Card.

```typescript
import { matchesNicDob } from 'lanka-validations/dob';
import { matchesNicGender } from 'lanka-validations/gender';

const userNic = '921234567V'; // Male, born 1992-05-02

// Cross-check Date of Birth
matchesNicDob('1992-05-02', userNic); // true
matchesNicDob('1995-01-01', userNic); // false (DOB mismatch!)

// Cross-check Gender
matchesNicGender('male', userNic);   // true
matchesNicGender('female', userNic); // false (Gender mismatch!)
```

---

## 13. Schema & Form Validation Builder

Quickly construct multi-field form validators for React, Vue, Svelte, Express, NestJS, or Next.js APIs:

```typescript
import { createSchemaValidator, rules } from 'lanka-validations/schema';

const registerSchema = createSchemaValidator({
  nic: rules.nic(),
  phone: rules.phone(),
  dob: [rules.dob({ minAge: 18 }), rules.matchesNicDob('nic')],
  gender: [rules.gender(), rules.matchesNicGender('nic')],
  salary: rules.currency({ min: 10000 }),
  postalCode: rules.postalCode(),
});

const result = registerSchema.validate({
  nic: '921234567V',
  phone: '0771234567',
  dob: '1992-05-02',
  gender: 'male',
  salary: 'Rs. 150,000.00',
  postalCode: '00100',
});

if (!result.isValid) {
  console.error(result.errors);
  // { dob: 'Date of Birth does not match NIC' }
}
```

---

## TypeScript API Reference

| Module | Core Functions | Return Type |
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

## Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/mmsalmanfaris/lanka-validations/issues).

---

## Author

**M.M. Salman Faris**  
- Email: [mmsalmanfaaris01@gmail.com](mailto:mmsalmanfaaris01@gmail.com)  
- GitHub: [@mmsalmanfaris](https://github.com/mmsalmanfaris)

---

## License

This project is licensed under the [MIT License](LICENSE).
