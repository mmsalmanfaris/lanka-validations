import { defineConfig } from 'tsup';

export default defineConfig({
  entry: [
    'src/index.ts',
    'src/nic/index.ts',
    'src/phone/index.ts',
    'src/passport/index.ts',
    'src/license/index.ts',
    'src/vehicle/index.ts',
    'src/currency/index.ts',
    'src/dob/index.ts',
    'src/gender/index.ts',
    'src/postal-code/index.ts',
    'src/bank/index.ts',
    'src/tax/index.ts',
    'src/administrative/index.ts',
    'src/schema/index.ts',
  ],
  format: ['cjs', 'esm'],
  dts: false,
  clean: true,
  sourcemap: false,
  minify: false,
});
