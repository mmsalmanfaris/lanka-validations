import { deepFreeze } from '../common/freeze';
/** Two-letter province prefixes on vehicle plates (for example `'WP'`) mapped to province names. */
export const VEHICLE_PROVINCES: Readonly<Record<string, string>> = {
  WP: 'Western Province',
  CP: 'Central Province',
  SP: 'Southern Province',
  NP: 'Northern Province',
  EP: 'Eastern Province',
  NW: 'North Western Province',
  NC: 'North Central Province',
  UP: 'Uva Province',
  SG: 'Sabaragamuwa Province',
};

deepFreeze(VEHICLE_PROVINCES);
