import { describe, expect, it } from 'vitest';
import { getReferenceDataMetadata, REFERENCE_DATA_METADATA } from '../src/reference-data';

describe('reference-data metadata', () => {
  it('documents provenance, coverage, verification and updates for every table', () => {
    expect(Object.keys(REFERENCE_DATA_METADATA)).toHaveLength(11);
    for (const entry of Object.values(REFERENCE_DATA_METADATA)) {
      expect(entry.lastVerified).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(entry.coverage).toBeTruthy();
      expect(entry.provenance).toBeTruthy();
      expect(entry.sources[0]?.url).toMatch(/^https:\/\//);
      expect(entry.updateProcess.length).toBeGreaterThan(0);
    }
  });

  it('returns copies rather than mutable shared metadata', () => {
    const copy = getReferenceDataMetadata('PROVINCES');
    copy.coverage = 'changed';
    expect(REFERENCE_DATA_METADATA.PROVINCES.coverage).not.toBe('changed');
  });

  it('returns every table when called without a key', () => {
    const all = getReferenceDataMetadata();
    expect(Object.keys(all)).toHaveLength(11);
    expect(all).toEqual(REFERENCE_DATA_METADATA);
    expect(all).not.toBe(REFERENCE_DATA_METADATA);
  });
});
