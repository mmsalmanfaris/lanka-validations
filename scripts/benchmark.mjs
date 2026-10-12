import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { performance } from 'node:perf_hooks';
import { memoryUsage } from 'node:process';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const require = createRequire(import.meta.url);
const root = process.cwd();
const warmup = Number(process.env.BENCHMARK_WARMUP ?? 10_000);
const iterations = Number(process.env.BENCHMARK_ITERATIONS ?? 100_000);
const samples = Number(process.env.BENCHMARK_SAMPLES ?? 7);
const coldSamples = Number(process.env.BENCHMARK_COLD_SAMPLES ?? 12);
const oversized = 'x'.repeat(1025);
let sink = 0;

function median(values) {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)];
}

function measure(operation) {
  for (let i = 0; i < warmup; i++) sink += Number(operation());
  const results = [];
  for (let sample = 0; sample < samples; sample++) {
    const start = performance.now();
    for (let i = 0; i < iterations; i++) sink += Number(operation());
    results.push(((performance.now() - start) * 1000) / iterations);
  }
  return median(results);
}

function operations(api) {
  const mixed = [
    () => api.isValidNic('921234567V'),
    () => api.isValidNic('invalid'),
    () => api.isValidPhone('+94 77 123 4567'),
    () => api.isValidPhone('abc119xyz'),
    () => api.getDistrictInfo('Colombo') !== null,
    () => api.getDistrictInfo('missing') !== null,
    () => api.getProvinceInfo('බස්නාහිර') !== null,
    () => api.isValidPostalCode('20000'),
  ];
  let mixedIndex = 0;
  return [
    ['NIC boolean: valid', () => api.isValidNic('921234567V')],
    ['NIC detailed: valid', () => api.validateNic('921234567V').isValid],
    ['NIC boolean: invalid', () => api.isValidNic('invalid')],
    ['Phone boolean: valid', () => api.isValidPhone('0771234567')],
    ['Phone detailed: valid', () => api.validatePhone('0771234567').isValid],
    ['Phone: oversized invalid', () => api.isValidPhone(oversized)],
    ['District: first alias', () => api.getDistrictInfo('Colombo') !== null],
    ['District: last alias', () => api.getDistrictInfo('Ratnapura') !== null],
    ['District: miss', () => api.getDistrictInfo('missing') !== null],
    ['District boolean: last alias', () => api.isValidDistrict('Ratnapura')],
    ['District boolean: miss', () => api.isValidDistrict('missing')],
    ['Province: Tamil alias', () => api.getProvinceInfo('மேல்') !== null],
    ['Mixed validation batch', () => mixed[mixedIndex++ % mixed.length]()],
  ];
}

function memoryAfterWork(api) {
  globalThis.gc?.();
  const before = memoryUsage().heapUsed;
  for (let i = 0; i < iterations * 5; i++) {
    const n = i % 4;
    if (n === 0) api.isValidNic('921234567V');
    else if (n === 1) api.isValidPhone('0771234567');
    else if (n === 2) api.getDistrictInfo('Ratnapura');
    else api.getDistrictInfo('missing');
  }
  globalThis.gc?.();
  return memoryUsage().heapUsed - before;
}

function coldImport(file, format) {
  const target = format === 'esm' ? pathToFileURL(file).href : file;
  const source = format === 'esm'
    ? `const {performance}=await import('node:perf_hooks');const s=performance.now();await import(${JSON.stringify(target)});console.log(performance.now()-s)`
    : `const {performance}=require('node:perf_hooks');const s=performance.now();require(${JSON.stringify(target)});console.log(performance.now()-s)`;
  const timings = [];
  for (let i = 0; i < coldSamples; i++) {
    const args = format === 'esm' ? ['--input-type=module', '-e', source] : ['-e', source];
    const result = spawnSync(process.execPath, args, {
      encoding: 'utf8',
    });
    if (result.error) throw result.error;
    if (result.status !== 0) throw new Error(result.stderr || `Cold ${format} import failed`);
    timings.push(Number(result.stdout.trim()));
  }
  return median(timings);
}

async function loadBuild(distDir) {
  return {
    cjs: require(path.join(distDir, 'index.js')),
    esm: await import(pathToFileURL(path.join(distDir, 'index.mjs')).href),
  };
}

async function runBuild(label, distDir) {
  const api = await loadBuild(distDir);
  const rows = [];
  for (const format of ['cjs', 'esm']) {
    for (const [name, operation] of operations(api[format])) {
      rows.push({ build: label, format: format.toUpperCase(), operation: name,
        'median µs/op': Number(measure(operation).toFixed(4)) });
    }
  }
  console.table(rows);
  console.table([
    { build: label, format: 'CJS', 'cold import median ms': Number(coldImport(path.join(distDir, 'index.js'), 'cjs').toFixed(3)) },
    { build: label, format: 'ESM', 'cold import median ms': Number(coldImport(path.join(distDir, 'index.mjs'), 'esm').toFixed(3)) },
  ]);
  console.log(`${label} retained heap estimate after mixed workload: ${memoryAfterWork(api.cjs)} bytes`);
}

console.log(`Node ${process.version}; warmup=${warmup}; iterations=${iterations}; samples=${samples}`);
if (!globalThis.gc) console.log('Run with --expose-gc for the retained-heap estimate.');
const baseline = process.env.BENCHMARK_BASELINE;
if (baseline) await runBuild('baseline', path.resolve(baseline));
await runBuild('current', path.join(root, 'dist'));
if (process.env.BENCHMARK_DEBUG_SINK) console.log({ sink });
