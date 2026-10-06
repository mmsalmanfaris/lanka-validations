export type PhoneType = 'mobile' | 'fixed' | 'short_code' | 'toll_free';

export type MobileOperator = 'Dialog' | 'Mobitel' | 'Hutch' | 'Airtel';

export type FixedOperator = 'SLT' | 'Dialog Broadband' | 'Lanka Bell' | 'Other';

export interface PhoneInfo {
  /** The original input string */
  raw: string;
  /** Normalized 10-digit national number with leading zero, e.g. '0771234567' */
  normalized: string;
  /** Standard E.164 international format, e.g. '+94771234567' */
  e164: string;
  /** Pretty national format, e.g. '077 123 4567' */
  national: string;
  /** Pretty international format, e.g. '+94 77 123 4567' */
  international: string;
  /** Phone type: mobile, fixed, short_code, or toll_free */
  type: PhoneType;
  /** Telco provider name if identifiable */
  operator: string | null;
  /** 3-digit area code (for landlines) or mobile prefix */
  prefix: string;
  /** Geographic area/town (for landlines) */
  areaName: string | null;
  /** District name (for landlines) */
  district: string | null;
}

export interface ShortCodeInfo {
  code: string;
  name: string;
  category: 'emergency' | 'government' | 'utility' | 'helpline';
}

