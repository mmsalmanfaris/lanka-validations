import type { DistrictInfo, ReadonlyProvinceInfo } from './types';

/** All 9 provinces. Prefer {@link getProvinces}, which returns copies. */
export const PROVINCES: readonly ReadonlyProvinceInfo[] = [
  {
    code: 'WP',
    name: 'Western',
    nameSi: 'බස්නාහිර',
    nameTa: 'மேல்',
    districts: ['Colombo', 'Gampaha', 'Kalutara'],
  },
  {
    code: 'CP',
    name: 'Central',
    nameSi: 'මධ්‍යම',
    nameTa: 'மத்திய',
    districts: ['Kandy', 'Matale', 'Nuwara Eliya'],
  },
  {
    code: 'SP',
    name: 'Southern',
    nameSi: 'දකුණු',
    nameTa: 'தென்',
    districts: ['Galle', 'Matara', 'Hambantota'],
  },
  {
    code: 'NP',
    name: 'Northern',
    nameSi: 'උතුරු',
    nameTa: 'வடக்கு',
    districts: ['Jaffna', 'Kilinochchi', 'Mannar', 'Vavuniya', 'Mullaitivu'],
  },
  {
    code: 'EP',
    name: 'Eastern',
    nameSi: 'නැගෙනහිර',
    nameTa: 'கிழக்கு',
    districts: ['Batticaloa', 'Ampara', 'Trincomalee'],
  },
  {
    code: 'NW',
    name: 'North Western',
    nameSi: 'වයඹ',
    nameTa: 'வடமேல்',
    districts: ['Kurunegala', 'Puttalam'],
  },
  {
    code: 'NC',
    name: 'North Central',
    nameSi: 'උතුරු මැද',
    nameTa: 'வடமத்திய',
    districts: ['Anuradhapura', 'Polonnaruwa'],
  },
  {
    code: 'UP',
    name: 'Uva',
    nameSi: 'ඌව',
    nameTa: 'ஊவா',
    districts: ['Badulla', 'Monaragala'],
  },
  {
    code: 'SG',
    name: 'Sabaragamuwa',
    nameSi: 'සබරගමුව',
    nameTa: 'சப்ரகமுவ',
    districts: ['Ratnapura', 'Kegalle'],
  },
];

/** All 25 districts. Prefer {@link getDistricts}, which returns copies. */
export const DISTRICTS: readonly Readonly<DistrictInfo>[] = [
  {
    name: 'Colombo',
    nameSi: 'කොළඹ',
    nameTa: 'கொழும்பு',
    provinceCode: 'WP',
    provinceName: 'Western',
  },
  {
    name: 'Gampaha',
    nameSi: 'ගම්පහ',
    nameTa: 'கம்பஹா',
    provinceCode: 'WP',
    provinceName: 'Western',
  },
  {
    name: 'Kalutara',
    nameSi: 'කළුතර',
    nameTa: 'களுத்துறை',
    provinceCode: 'WP',
    provinceName: 'Western',
  },
  { name: 'Kandy', nameSi: 'මහනුවර', nameTa: 'கண்டி', provinceCode: 'CP', provinceName: 'Central' },
  {
    name: 'Matale',
    nameSi: 'මාතලේ',
    nameTa: 'மாத்தளை',
    provinceCode: 'CP',
    provinceName: 'Central',
  },
  {
    name: 'Nuwara Eliya',
    nameSi: 'නුවරඑළිය',
    nameTa: 'நுவரெலியா',
    provinceCode: 'CP',
    provinceName: 'Central',
  },
  { name: 'Galle', nameSi: 'ගාල්ල', nameTa: 'காலி', provinceCode: 'SP', provinceName: 'Southern' },
  {
    name: 'Matara',
    nameSi: 'මාතර',
    nameTa: 'மாத்தறை',
    provinceCode: 'SP',
    provinceName: 'Southern',
  },
  {
    name: 'Hambantota',
    nameSi: 'හම්බන්තොට',
    nameTa: 'அம்பாந்தோட்டை',
    provinceCode: 'SP',
    provinceName: 'Southern',
  },
  {
    name: 'Jaffna',
    nameSi: 'යාපනය',
    nameTa: 'யாழ்ப்பாணம்',
    provinceCode: 'NP',
    provinceName: 'Northern',
  },
  {
    name: 'Kilinochchi',
    nameSi: 'කිලිනොච්චිය',
    nameTa: 'கிளிநொச்சி',
    provinceCode: 'NP',
    provinceName: 'Northern',
  },
  {
    name: 'Mannar',
    nameSi: 'මන්නාරම',
    nameTa: 'மன்னார்',
    provinceCode: 'NP',
    provinceName: 'Northern',
  },
  {
    name: 'Vavuniya',
    nameSi: 'වවුනියාව',
    nameTa: 'வவுனியா',
    provinceCode: 'NP',
    provinceName: 'Northern',
  },
  {
    name: 'Mullaitivu',
    nameSi: 'මුලතිව්',
    nameTa: 'முல்லைத்தீவு',
    provinceCode: 'NP',
    provinceName: 'Northern',
  },
  {
    name: 'Batticaloa',
    nameSi: 'මඩකලපුව',
    nameTa: 'மட்டக்களப்பு',
    provinceCode: 'EP',
    provinceName: 'Eastern',
  },
  {
    name: 'Ampara',
    nameSi: 'අම්පාර',
    nameTa: 'அம்பாறை',
    provinceCode: 'EP',
    provinceName: 'Eastern',
  },
  {
    name: 'Trincomalee',
    nameSi: 'ත්‍රිකුණාමලය',
    nameTa: 'திருகோணமலை',
    provinceCode: 'EP',
    provinceName: 'Eastern',
  },
  {
    name: 'Kurunegala',
    nameSi: 'කුරුණෑගල',
    nameTa: 'குருநாகல்',
    provinceCode: 'NW',
    provinceName: 'North Western',
  },
  {
    name: 'Puttalam',
    nameSi: 'පුත්තලම',
    nameTa: 'புத்தளம்',
    provinceCode: 'NW',
    provinceName: 'North Western',
  },
  {
    name: 'Anuradhapura',
    nameSi: 'අනුරාධපුරය',
    nameTa: 'அனுராதபுரம்',
    provinceCode: 'NC',
    provinceName: 'North Central',
  },
  {
    name: 'Polonnaruwa',
    nameSi: 'පොළොන්නරුව',
    nameTa: 'பொலன்னறுவை',
    provinceCode: 'NC',
    provinceName: 'North Central',
  },
  { name: 'Badulla', nameSi: 'බදුල්ල', nameTa: 'பதுளை', provinceCode: 'UP', provinceName: 'Uva' },
  {
    name: 'Monaragala',
    nameSi: 'මොණරාගල',
    nameTa: 'மொனராகலை',
    provinceCode: 'UP',
    provinceName: 'Uva',
  },
  {
    name: 'Ratnapura',
    nameSi: 'රත්නපුර',
    nameTa: 'இரத்தினபுரி',
    provinceCode: 'SG',
    provinceName: 'Sabaragamuwa',
  },
  {
    name: 'Kegalle',
    nameSi: 'කෑගල්ල',
    nameTa: 'கேகாலை',
    provinceCode: 'SG',
    provinceName: 'Sabaragamuwa',
  },
];

for (const province of PROVINCES) {
  Object.freeze(province.districts);
  Object.freeze(province);
}
Object.freeze(PROVINCES);
for (const district of DISTRICTS) Object.freeze(district);
Object.freeze(DISTRICTS);
