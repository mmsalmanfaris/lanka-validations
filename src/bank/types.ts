export interface BankInfo {
  /** 4-digit CBSL bank code */
  code: string;
  /** Primary name of the bank */
  name: string;
  /** Short or popular acronym (e.g. 'BOC', 'COMBANK', 'HNB', 'NSB') */
  shortName: string;
  /** Sinhala name */
  nameSi?: string;
  /** Tamil name */
  nameTa?: string;
  /** Type of banking institution */
  category: 'licensed_commercial' | 'licensed_specialized';
}

