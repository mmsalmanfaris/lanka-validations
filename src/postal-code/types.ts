export interface PostalCodeInfo {
  /** 5-digit postal code string (e.g. '00100', '20000') */
  code: string;
  /** Sri Lankan district */
  district: string;
  /** Sri Lankan province */
  province: string;
  /** Primary city / post office name if matched */
  primaryCity?: string;
}

