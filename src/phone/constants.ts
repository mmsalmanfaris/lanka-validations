import type { MobileOperator, ShortCodeInfo } from './types';

export const MOBILE_PREFIXES: Record<string, MobileOperator> = {
  '070': 'Mobitel',
  '071': 'Mobitel',
  '072': 'Hutch',
  '074': 'Dialog',
  '075': 'Airtel',
  '076': 'Dialog',
  '077': 'Dialog',
  '078': 'Hutch',
};

export interface AreaCodeInfo {
  code: string;
  name: string;
  district: string;
}

export const AREA_CODES: Record<string, AreaCodeInfo> = {
  '011': { code: '011', name: 'Colombo', district: 'Colombo' },
  '021': { code: '021', name: 'Jaffna', district: 'Jaffna' },
  '023': { code: '023', name: 'Mannar', district: 'Mannar' },
  '024': { code: '024', name: 'Vavuniya', district: 'Vavuniya' },
  '025': { code: '025', name: 'Anuradhapura', district: 'Anuradhapura' },
  '026': { code: '026', name: 'Trincomalee', district: 'Trincomalee' },
  '027': { code: '027', name: 'Polonnaruwa', district: 'Polonnaruwa' },
  '031': { code: '031', name: 'Negombo / Chilaw', district: 'Gampaha' },
  '032': { code: '032', name: 'Puttalam', district: 'Puttalam' },
  '033': { code: '033', name: 'Gampaha', district: 'Gampaha' },
  '034': { code: '034', name: 'Kalutara', district: 'Kalutara' },
  '035': { code: '035', name: 'Kegalle', district: 'Kegalle' },
  '036': { code: '036', name: 'Avissawella', district: 'Colombo' },
  '037': { code: '037', name: 'Kurunegala', district: 'Kurunegala' },
  '038': { code: '038', name: 'Panadura', district: 'Kalutara' },
  '041': { code: '041', name: 'Matara', district: 'Matara' },
  '045': { code: '045', name: 'Ratnapura', district: 'Ratnapura' },
  '047': { code: '047', name: 'Hambantota', district: 'Hambantota' },
  '051': { code: '051', name: 'Hatton', district: 'Nuwara Eliya' },
  '052': { code: '052', name: 'Nuwara Eliya', district: 'Nuwara Eliya' },
  '054': { code: '054', name: 'Nawalapitiya', district: 'Kandy' },
  '055': { code: '055', name: 'Badulla / Monaragala', district: 'Badulla' },
  '057': { code: '057', name: 'Bandarawela', district: 'Badulla' },
  '063': { code: '063', name: 'Ampara', district: 'Ampara' },
  '065': { code: '065', name: 'Batticaloa', district: 'Batticaloa' },
  '066': { code: '066', name: 'Matale', district: 'Matale' },
  '067': { code: '067', name: 'Kalmunai', district: 'Ampara' },
  '081': { code: '081', name: 'Kandy', district: 'Kandy' },
  '091': { code: '091', name: 'Galle', district: 'Galle' },
};

export const FIXED_OPERATOR_DIGITS: Record<string, string> = {
  '2': 'SLT',
  '3': 'SLT',
  '4': 'Dialog Broadband',
  '5': 'Lanka Bell',
  '7': 'Dialog Broadband',
};

export const SRI_LANKA_SHORT_CODES: Record<string, ShortCodeInfo> = {
  '119': { code: '119', name: 'Police Emergency Hotline', category: 'emergency' },
  '1990': { code: '1990', name: '1990 Suwa Seriya Ambulance', category: 'emergency' },
  '110': { code: '110', name: 'Fire & Rescue Service', category: 'emergency' },
  '118': { code: '118', name: 'National Defense & Security Help Desk', category: 'emergency' },
  '1919': { code: '1919', name: 'Government Information Centre (GIC)', category: 'government' },
  '1938': { code: '1938', name: 'Women & Child Abuse Helpline', category: 'helpline' },
  '1989': { code: '1989', name: 'Disaster Management Centre (DMC)', category: 'emergency' },
  '1920': { code: '1920', name: 'Agriculture Information Service', category: 'utility' },
  '1948': { code: '1948', name: 'Central Bank Financial Consumer Inquiries', category: 'government' },
  '1905': { code: '1905', name: 'Ministry of Health Hotline', category: 'government' },
  '1929': { code: '1929', name: 'ChildLine Sri Lanka', category: 'helpline' },
  '1925': { code: '1925', name: 'Consumer Affairs Authority', category: 'government' },
};

