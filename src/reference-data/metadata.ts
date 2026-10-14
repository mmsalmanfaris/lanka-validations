import { deepFreeze } from '../common/freeze';
import type { ReferenceTableId, ReferenceTableMetadata, ReferenceSource } from './types';

const census: ReferenceSource = {
  authority: 'Department of Census and Statistics, Sri Lanka',
  title: 'Census of Population and Housing 2024 — Preliminary Report',
  url: 'https://www.statistics.gov.lk/Resource/en/Population/CPH_2024/Preliminary_Report.pdf',
};
const cbsl: ReferenceSource = {
  authority: 'Central Bank of Sri Lanka',
  title: 'ITRS Bank Reference Manual',
  url: 'https://www.cbsl.gov.lk/sites/default/files/cbslweb_documents/about/ITRS_bank_reference_manual_e.pdf',
};
const post: ReferenceSource = {
  authority: 'Sri Lanka Post',
  title: 'Post Code Book',
  url: 'https://www.slpost.gov.lk/wp-content/uploads/2022/11/POST-CODE-BOOK-.pdf',
};
const trc: ReferenceSource = {
  authority: 'Telecommunications Regulatory Commission of Sri Lanka',
  title: 'National Numbering Plan',
  url: 'https://www.trc.gov.lk/pages_e.php?id=121',
};
const dmt: ReferenceSource = {
  authority: 'Department of Motor Traffic, Sri Lanka',
  title: 'Driving licence vehicle classes',
  url: 'https://dmt.gov.lk/index.php?Itemid=163&id=46&lang=ta&option=com_content&view=article',
};
const dmtVehicles: ReferenceSource = {
  authority: 'Department of Motor Traffic, Sri Lanka',
  title: 'Vehicle Information Service',
  url: 'https://eservices.motortraffic.gov.lk/VehicleInfo/home',
};

function metadata(
  table: ReferenceTableId,
  source: ReferenceSource,
  coverage: string,
  limitations: string[],
): ReferenceTableMetadata {
  return {
    table,
    version: '2026-10-12',
    lastVerified: '2026-10-12',
    coverage,
    provenance: `Transcribed and normalized from ${source.authority}.`,
    sources: [source],
    limitations,
    updateProcess: [
      'Compare the table with the linked authority source.',
      'Update data and this verification date together.',
      'Add tests for additions, removals, aliases, and boundary behavior.',
      'Publish the data change in the package changelog.',
    ],
  };
}

const phoneLimit = [
  'Allocations can change; unsupported prefixes are not proof that a number is unassigned.',
];
const postalLimit = [
  'Prefix coverage and selected major cities do not represent every delivery-office assignment.',
];

/** Metadata for every bundled reference table. Prefer {@link getReferenceDataMetadata}, which returns a copy. */
export const REFERENCE_DATA_METADATA: Readonly<Record<ReferenceTableId, ReferenceTableMetadata>> =
  deepFreeze({
    PROVINCES: metadata(
      'PROVINCES',
      census,
      'All 9 provinces with English, Sinhala, and Tamil names.',
      [],
    ),
    DISTRICTS: metadata(
      'DISTRICTS',
      census,
      'All 25 districts with province relationships and multilingual names.',
      [],
    ),
    CBSL_BANKS: metadata('CBSL_BANKS', cbsl, 'CBSL institution codes included by this package.', [
      'The linked manual is a point-in-time source; verify routing-critical use against current CBSL publications.',
    ]),
    POSTAL_PREFIXES: metadata(
      'POSTAL_PREFIXES',
      post,
      'Two-digit routing prefixes mapped to districts and provinces.',
      postalLimit,
    ),
    MAJOR_CITIES: metadata(
      'MAJOR_CITIES',
      post,
      'Selected five-digit codes for major cities.',
      postalLimit,
    ),
    MOBILE_PREFIXES: metadata(
      'MOBILE_PREFIXES',
      trc,
      'Known 07 mobile prefixes and operator labels.',
      phoneLimit,
    ),
    AREA_CODES: metadata('AREA_CODES', trc, 'Known geographic fixed-line area codes.', phoneLimit),
    FIXED_OPERATOR_DIGITS: metadata(
      'FIXED_OPERATOR_DIGITS',
      trc,
      'Fixed-network operator digit labels used after area codes.',
      phoneLimit,
    ),
    SRI_LANKA_SHORT_CODES: metadata(
      'SRI_LANKA_SHORT_CODES',
      trc,
      'Selected public 3- and 4-digit service codes.',
      ['This is a curated subset and not a complete live short-code registry.'],
    ),
    DMT_LICENSE_CATEGORIES: metadata(
      'DMT_LICENSE_CATEGORIES',
      dmt,
      'DMT vehicle classes, descriptions, and minimum-age rules used by this package.',
      [
        'Applications must verify current eligibility rules with DMT before making licensing decisions.',
      ],
    ),
    VEHICLE_PROVINCES: metadata(
      'VEHICLE_PROVINCES',
      dmtVehicles,
      'Nine province prefixes accepted by the vehicle parser.',
      [
        'Accepted historical plate syntax is implementation coverage, not a complete DMT registration database.',
      ],
    ),
  });

/**
 * Returns the source, as-of date, coverage, and limitations of one bundled reference table, as a copy.
 *
 * @param table - Table name, such as `'CBSL_BANKS'` or `'MOBILE_PREFIXES'`.
 * @returns Metadata for that table.
 *
 * @example
 * ```ts
 * getReferenceDataMetadata('CBSL_BANKS').lastVerified; // '2026-10-12'
 * getReferenceDataMetadata('MOBILE_PREFIXES').sources[0]?.authority; // 'Telecommunications Regulatory Commission of Sri Lanka'
 * ```
 */
export function getReferenceDataMetadata(table: ReferenceTableId): ReferenceTableMetadata;
/**
 * Returns metadata for every bundled reference table, keyed by table name, as a copy.
 *
 * @returns Metadata for all tables.
 *
 * @example
 * ```ts
 * Object.keys(getReferenceDataMetadata()).length; // 11
 * ```
 */
export function getReferenceDataMetadata(): Record<ReferenceTableId, ReferenceTableMetadata>;
export function getReferenceDataMetadata(
  table?: ReferenceTableId,
): ReferenceTableMetadata | Record<ReferenceTableId, ReferenceTableMetadata> {
  return structuredClone(table ? REFERENCE_DATA_METADATA[table] : REFERENCE_DATA_METADATA);
}
