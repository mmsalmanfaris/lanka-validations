import { deepFreeze } from '../common/freeze';
import type { LicenseCategoryInfo } from './types';

/** DMT vehicle classes keyed by code (for example `'B1'`). Prefer {@link getLicenseCategoryInfo}, which returns a copy. */
export const DMT_LICENSE_CATEGORIES: Readonly<Record<string, Readonly<LicenseCategoryInfo>>> = {
  A1: {
    category: 'A1',
    name: 'Light Motor Cycle',
    description: 'Engine capacity does not exceed 100 cc',
    minAge: 17,
  },
  A: {
    category: 'A',
    name: 'Motor Cycle',
    description: 'Engine capacity exceeds 100 cc',
    minAge: 18,
  },
  B1: {
    category: 'B1',
    name: 'Motor Tricycle',
    description: 'Three-wheelers (Tuk-tuks) and light invalid carriages',
    minAge: 18,
  },
  B: {
    category: 'B',
    name: 'Dual Purpose Vehicle / Motor Car',
    description: 'Tare <= 3500 kg, seating <= 9 persons including driver',
    minAge: 18,
  },
  C1: {
    category: 'C1',
    name: 'Light Motor Lorry',
    description: 'Gross vehicle weight between 3500 kg and 17000 kg',
    minAge: 21,
  },
  C: {
    category: 'C',
    name: 'Motor Lorry',
    description: 'Gross vehicle weight exceeding 17000 kg',
    minAge: 21,
  },
  CE: {
    category: 'CE',
    name: 'Heavy Motor Lorry Combination',
    description: 'Motor lorry with trailer',
    minAge: 21,
  },
  D1: {
    category: 'D1',
    name: 'Light Motor Coach',
    description: 'Passenger vehicle with 9 to 33 seats including driver',
    minAge: 21,
  },
  D: {
    category: 'D',
    name: 'Motor Coach',
    description: 'Passenger vehicle with more than 33 seats',
    minAge: 21,
  },
  DE: {
    category: 'DE',
    name: 'Heavy Motor Coach Combination',
    description: 'Motor coach with trailer',
    minAge: 21,
  },
  G1: {
    category: 'G1',
    name: 'Hand Tractor',
    description: 'Two-wheel land vehicle with or without trailer',
    minAge: 18,
  },
  G: {
    category: 'G',
    name: 'Land Vehicle',
    description: 'Agricultural tractor with or without trailer',
    minAge: 18,
  },
  J: {
    category: 'J',
    name: 'Special Purpose Vehicle',
    description: 'Construction and road making equipment',
    minAge: 21,
  },
};

deepFreeze(DMT_LICENSE_CATEGORIES);
