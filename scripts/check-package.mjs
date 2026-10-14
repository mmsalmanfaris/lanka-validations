import { execFileSync } from 'node:child_process';
import {
  mkdtempSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const root = process.cwd();
const temporary = mkdtempSync(join(tmpdir(), 'lanka-validations-package-'));
const packed = JSON.parse(
  execFileSync('npm', ['pack', '--ignore-scripts', '--json', '--pack-destination', temporary], {
    cwd: root,
    encoding: 'utf8',
  }),
);
const tarball = join(temporary, packed[0].filename);
const consumer = join(temporary, 'consumer');

writeFileSync(join(temporary, 'package.json'), '{}');
mkdirSync(consumer);
writeFileSync(join(consumer, 'package.json'), JSON.stringify({ private: true, type: 'module' }));
execFileSync(
  'npm',
  ['install', '--ignore-scripts', '--no-package-lock', '--no-audit', '--no-fund', tarball],
  { cwd: consumer, stdio: 'inherit' },
);

const installedPackage = JSON.parse(
  readFileSync(join(consumer, 'node_modules/lanka-validations/package.json'), 'utf8'),
);
const codeExports = Object.keys(installedPackage.exports).filter(
  (name) => name !== './package.json',
);
const specifiers = codeExports.map((name) =>
  name === '.' ? 'lanka-validations' : `lanka-validations${name.slice(1)}`,
);
const esmScript = `for(const s of ${JSON.stringify(specifiers)}){const m=await import(s);if(Object.keys(m).length===0)throw new Error('Empty ESM export: '+s)}`;
writeFileSync(join(consumer, 'runtime.mjs'), esmScript);
execFileSync(process.execPath, ['runtime.mjs'], { cwd: consumer, stdio: 'inherit' });

const cjsScript = `for(const s of ${JSON.stringify(specifiers)}){if(Object.keys(require(s)).length===0)throw new Error('Empty CJS export: '+s)}`;
execFileSync(process.execPath, ['-e', cjsScript], { cwd: consumer, stdio: 'inherit' });

const typeSource = `
import { validateNic, type ValidationResult } from 'lanka-validations';
import { parseNic } from 'lanka-validations/nic';
import { isValidPhone } from 'lanka-validations/phone';
import { parsePassport } from 'lanka-validations/passport';
import { isValidDrivingLicense } from 'lanka-validations/license';
import { isValidVehiclePlate } from 'lanka-validations/vehicle';
import { parseLKRMinorUnits } from 'lanka-validations/currency';
import { validateDob } from 'lanka-validations/dob';
import { validateGender } from 'lanka-validations/gender';
import { validatePostalCode } from 'lanka-validations/postal-code';
import { validateBankCode } from 'lanka-validations/bank';
import { validateTIN } from 'lanka-validations/tax';
import { getProvinceInfo } from 'lanka-validations/administrative';
import { createSchemaValidator, rules } from 'lanka-validations/schema';
import { maskNic } from 'lanka-validations/privacy';
import { translateValidationCode } from 'lanka-validations/i18n';
import { getReferenceDataMetadata } from 'lanka-validations/reference-data';
const result: ValidationResult<unknown> = validateNic('921234567V');
if (result.isValid) result.data; else result.code;
parseNic('921234567V'); isValidPhone('0771234567'); parsePassport('N1234567');
isValidDrivingLicense('B1234567'); isValidVehiclePlate('WP CAB-1234'); parseLKRMinorUnits('1.00');
validateDob('2000-01-01'); validateGender('male'); validatePostalCode('00100'); validateBankCode('7010');
validateTIN('123456789'); getProvinceInfo('Western'); maskNic('921234567V'); translateValidationCode('NIC_REQUIRED');
getReferenceDataMetadata('PROVINCES'); createSchemaValidator({ nic: rules.nic() }).validate({ nic: '921234567V' });
`;
writeFileSync(join(consumer, 'consumer.mts'), typeSource);
writeFileSync(join(consumer, 'consumer.ts'), typeSource);
const tsc = join(root, 'node_modules/typescript/bin/tsc');
execFileSync(
  process.execPath,
  [
    tsc,
    '--noEmit',
    '--strict',
    '--target',
    'ES2022',
    '--module',
    'NodeNext',
    '--moduleResolution',
    'NodeNext',
    'consumer.mts',
  ],
  { cwd: consumer, stdio: 'inherit' },
);
execFileSync(
  process.execPath,
  [
    tsc,
    '--noEmit',
    '--strict',
    '--target',
    'ES2022',
    '--module',
    'ESNext',
    '--moduleResolution',
    'Bundler',
    'consumer.ts',
  ],
  { cwd: consumer, stdio: 'inherit' },
);

function walk(directory) {
  return readdirSync(directory).flatMap((name) => {
    const path = join(directory, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}
const declarationMaps = walk(join(consumer, 'node_modules/lanka-validations/dist')).filter((name) =>
  name.endsWith('.d.ts.map'),
);
if (declarationMaps.length)
  throw new Error(`Unusable declaration maps shipped: ${declarationMaps.join(', ')}`);
console.log(
  `Packed-package checks passed on Node ${process.version}: ${codeExports.length} ESM/CJS exports, NodeNext and bundler declarations.`,
);
