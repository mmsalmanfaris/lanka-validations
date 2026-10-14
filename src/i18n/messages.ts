import { deepFreeze } from '../common/freeze';
/** Languages with built-in validation messages: English, Sinhala, and Tamil. */
export type ValidationLocale = 'en' | 'si' | 'ta';

/** One validation message in each supported language. */
export interface ValidationMessages {
  en: string;
  si: string;
  ta: string;
}

/** Stable validation-code translations. Applications may override any message. */
export const VALIDATION_MESSAGES: Readonly<Record<string, Readonly<ValidationMessages>>> =
  deepFreeze({
    VALIDATION_FAILED: {
      en: 'Validation failed.',
      si: 'වලංගුකරණය අසාර්ථකයි.',
      ta: 'சரிபார்ப்பு தோல்வியடைந்தது.',
    },
    REQUIRED: {
      en: 'This field is required.',
      si: 'මෙම ක්ෂේත්‍රය අවශ්‍යයි.',
      ta: 'இந்தப் புலம் அவசியம்.',
    },
    SCHEMA_INVALID: {
      en: 'The field is invalid.',
      si: 'ක්ෂේත්‍රය වලංගු නොවේ.',
      ta: 'புலம் செல்லுபடியாகாது.',
    },
    SCHEMA_INVALID_ROOT: {
      en: 'Expected a form data object.',
      si: 'පෝරම දත්ත වස්තුවක් අවශ්‍යයි.',
      ta: 'படிவத் தரவு பொருள் எதிர்பார்க்கப்படுகிறது.',
    },
    NIC_REQUIRED: {
      en: 'NIC is required.',
      si: 'ජාතික හැඳුනුම්පත් අංකය අවශ්‍යයි.',
      ta: 'தேசிய அடையாள அட்டை எண் அவசியம்.',
    },
    NIC_INVALID_FORMAT: {
      en: 'NIC format is invalid.',
      si: 'ජාතික හැඳුනුම්පත් ආකෘතිය වලංගු නොවේ.',
      ta: 'தேசிய அடையாள அட்டை வடிவம் செல்லுபடியாகாது.',
    },
    NIC_INVALID_YEAR: {
      en: 'NIC birth year is invalid.',
      si: 'උපන් වර්ෂය වලංගු නොවේ.',
      ta: 'பிறந்த ஆண்டு செல்லுபடியாகாது.',
    },
    NIC_INVALID_DAY: {
      en: 'NIC day value is invalid.',
      si: 'දින අගය වලංගු නොවේ.',
      ta: 'நாள் மதிப்பு செல்லுபடியாகாது.',
    },
    NIC_FUTURE_DOB: {
      en: 'NIC contains a future date of birth.',
      si: 'උපන් දිනය අනාගත දිනයකි.',
      ta: 'பிறந்த தேதி எதிர்காலத்தில் உள்ளது.',
    },
    NIC_INVALID_OPTIONS: {
      en: 'NIC validation options are invalid.',
      si: 'වලංගුකරණ විකල්ප වලංගු නොවේ.',
      ta: 'சரிபார்ப்பு விருப்பங்கள் செல்லுபடியாகாது.',
    },
    PHONE_REQUIRED: {
      en: 'Phone number is required.',
      si: 'දුරකථන අංකය අවශ්‍යයි.',
      ta: 'தொலைபேசி எண் அவசியம்.',
    },
    PHONE_INVALID: {
      en: 'Phone number is invalid or unsupported.',
      si: 'දුරකථන අංකය වලංගු හෝ සහාය දක්වන අංකයක් නොවේ.',
      ta: 'தொலைபேசி எண் செல்லுபடியாகவில்லை அல்லது ஆதரிக்கப்படவில்லை.',
    },
    PHONE_UNSUPPORTED: {
      en: 'Phone prefix or short code is unsupported.',
      si: 'දුරකථන උපසර්ගයට හෝ කෙටි අංකයට සහාය නොදක්වයි.',
      ta: 'தொலைபேசி முன்னொட்டு அல்லது குறுகிய எண் ஆதரிக்கப்படவில்லை.',
    },
    PHONE_SHORT_CODE_NOT_ALLOWED: {
      en: 'Short codes are not accepted here.',
      si: 'මෙහි කෙටි අංක පිළිගන්නේ නැත.',
      ta: 'குறுகிய எண்கள் இங்கு ஏற்கப்படாது.',
    },
    PHONE_NOT_MOBILE: {
      en: 'A mobile number is required.',
      si: 'ජංගම දුරකථන අංකයක් අවශ්‍යයි.',
      ta: 'கைபேசி எண் அவசியம்.',
    },
    PASSPORT_REQUIRED: {
      en: 'Passport number is required.',
      si: 'විදේශ ගමන් බලපත්‍ර අංකය අවශ්‍යයි.',
      ta: 'கடவுச்சீட்டு எண் அவசியம்.',
    },
    PASSPORT_INVALID: {
      en: 'Passport number is invalid.',
      si: 'විදේශ ගමන් බලපත්‍ර අංකය වලංගු නොවේ.',
      ta: 'கடவுச்சீட்டு எண் செல்லுபடியாகாது.',
    },
    LICENSE_REQUIRED: {
      en: 'Driving licence number is required.',
      si: 'රියදුරු බලපත්‍ර අංකය අවශ්‍යයි.',
      ta: 'ஓட்டுநர் உரிம எண் அவசியம்.',
    },
    LICENSE_INVALID: {
      en: 'Driving licence number is invalid.',
      si: 'රියදුරු බලපත්‍ර අංකය වලංගු නොවේ.',
      ta: 'ஓட்டுநர் உரிம எண் செல்லுபடியாகாது.',
    },
    PLATE_REQUIRED: {
      en: 'Vehicle plate is required.',
      si: 'වාහන අංකය අවශ්‍යයි.',
      ta: 'வாகன இலக்கம் அவசியம்.',
    },
    PLATE_INVALID: {
      en: 'Vehicle plate is invalid.',
      si: 'වාහන අංකය වලංගු නොවේ.',
      ta: 'வாகன இலக்கம் செல்லுபடியாகாது.',
    },
    CURRENCY_REQUIRED: {
      en: 'Currency amount is required.',
      si: 'මුදල් අගය අවශ්‍යයි.',
      ta: 'நாணயத் தொகை அவசியம்.',
    },
    CURRENCY_INVALID: {
      en: 'Currency amount is invalid.',
      si: 'මුදල් අගය වලංගු නොවේ.',
      ta: 'நாணயத் தொகை செல்லுபடியாகாது.',
    },
    CURRENCY_NEGATIVE: {
      en: 'Negative amounts are not allowed.',
      si: 'ඍණ අගයන් සඳහා අවසර නැත.',
      ta: 'எதிர்மறைத் தொகைகள் அனுமதிக்கப்படாது.',
    },
    CURRENCY_BELOW_MIN: {
      en: 'Amount is below the minimum.',
      si: 'අගය අවමයට වඩා අඩුයි.',
      ta: 'தொகை குறைந்தபட்சத்திற்குக் கீழே உள்ளது.',
    },
    CURRENCY_EXCEEDS_MAX: {
      en: 'Amount exceeds the maximum.',
      si: 'අගය උපරිමය ඉක්මවයි.',
      ta: 'தொகை அதிகபட்சத்தை மீறுகிறது.',
    },
    CURRENCY_EXCESS_DECIMALS: {
      en: 'Amount has too many decimal places.',
      si: 'අගයට දශම ස්ථාන වැඩියි.',
      ta: 'தொகையில் அதிக தசம இடங்கள் உள்ளன.',
    },
    DOB_INVALID: {
      en: 'Date of birth is invalid.',
      si: 'උපන් දිනය වලංගු නොවේ.',
      ta: 'பிறந்த தேதி செல்லுபடியாகாது.',
    },
    DOB_FUTURE: {
      en: 'Date of birth cannot be in the future.',
      si: 'උපන් දිනය අනාගතයේ විය නොහැක.',
      ta: 'பிறந்த தேதி எதிர்காலத்தில் இருக்க முடியாது.',
    },
    DOB_TOO_OLD: {
      en: 'Date of birth is outside the supported range.',
      si: 'උපන් දිනය සහාය දක්වන පරාසයෙන් පිටතයි.',
      ta: 'பிறந்த தேதி ஆதரிக்கப்படும் வரம்பிற்கு வெளியே உள்ளது.',
    },
    DOB_BELOW_MIN_AGE: {
      en: 'Age is below the minimum.',
      si: 'වයස අවමයට වඩා අඩුයි.',
      ta: 'வயது குறைந்தபட்சத்திற்குக் கீழே உள்ளது.',
    },
    DOB_EXCEEDS_MAX_AGE: {
      en: 'Age exceeds the maximum.',
      si: 'වයස උපරිමය ඉක්මවයි.',
      ta: 'வயது அதிகபட்சத்தை மீறுகிறது.',
    },
    DOB_INVALID_OPTIONS: {
      en: 'Date validation options are invalid.',
      si: 'දින වලංගුකරණ විකල්ප වලංගු නොවේ.',
      ta: 'தேதி சரிபார்ப்பு விருப்பங்கள் செல்லுபடியாகாது.',
    },
    DOB_NIC_MISMATCH: {
      en: 'Date of birth does not match NIC.',
      si: 'උපන් දිනය හැඳුනුම්පතට නොගැළපේ.',
      ta: 'பிறந்த தேதி அடையாள அட்டையுடன் பொருந்தவில்லை.',
    },
    GENDER_INVALID: {
      en: 'Gender value is invalid.',
      si: 'ස්ත්‍රී පුරුෂ භාවය වලංගු නොවේ.',
      ta: 'பாலின மதிப்பு செல்லுபடியாகாது.',
    },
    GENDER_NIC_MISMATCH: {
      en: 'Gender does not match NIC.',
      si: 'ස්ත්‍රී පුරුෂ භාවය හැඳුනුම්පතට නොගැළපේ.',
      ta: 'பாலினம் அடையாள அட்டையுடன் பொருந்தவில்லை.',
    },
    POSTAL_CODE_INVALID_FORMAT: {
      en: 'Postal code format is invalid.',
      si: 'තැපැල් කේත ආකෘතිය වලංගු නොවේ.',
      ta: 'அஞ்சல் குறியீட்டு வடிவம் செல்லுபடியாகாது.',
    },
    POSTAL_CODE_OUT_OF_RANGE: {
      en: 'Postal code is unsupported.',
      si: 'තැපැල් කේතයට සහාය නොදක්වයි.',
      ta: 'அஞ்சல் குறியீடு ஆதரிக்கப்படவில்லை.',
    },
    BANK_ACC_REQUIRED: {
      en: 'Bank account number is required.',
      si: 'බැංකු ගිණුම් අංකය අවශ්‍යයි.',
      ta: 'வங்கிக் கணக்கு எண் அவசியம்.',
    },
    BANK_ACC_INVALID: {
      en: 'Bank account number is invalid.',
      si: 'බැංකු ගිණුම් අංකය වලංගු නොවේ.',
      ta: 'வங்கிக் கணக்கு எண் செல்லுபடியாகாது.',
    },
    BANK_CODE_INVALID: {
      en: 'CBSL bank code is invalid or unsupported.',
      si: 'CBSL බැංකු කේතය වලංගු හෝ සහාය දක්වන කේතයක් නොවේ.',
      ta: 'CBSL வங்கிக் குறியீடு செல்லுபடியாகவில்லை அல்லது ஆதரிக்கப்படவில்லை.',
    },
    BANK_CODE_INVALID_FORMAT: {
      en: 'Bank code format is invalid.',
      si: 'බැංකු කේත ආකෘතිය වලංගු නොවේ.',
      ta: 'வங்கிக் குறியீட்டு வடிவம் செல்லுபடியாகாது.',
    },
    BANK_CODE_UNSUPPORTED: {
      en: 'Bank code is unsupported.',
      si: 'බැංකු කේතයට සහාය නොදක්වයි.',
      ta: 'வங்கிக் குறியீடு ஆதரிக்கப்படவில்லை.',
    },
    BRANCH_CODE_INVALID: {
      en: 'Branch code is invalid.',
      si: 'ශාඛා කේතය වලංගු නොවේ.',
      ta: 'கிளைக் குறியீடு செல்லுபடியாகாது.',
    },
    TIN_REQUIRED: {
      en: 'TIN is required.',
      si: 'බදු ගෙවන්නාගේ අංකය අවශ්‍යයි.',
      ta: 'வரி செலுத்துநர் எண் அவசியம்.',
    },
    TIN_INVALID: {
      en: 'TIN is invalid.',
      si: 'බදු ගෙවන්නාගේ අංකය වලංගු නොවේ.',
      ta: 'வரி செலுத்துநர் எண் செல்லுபடியாகாது.',
    },
    VAT_REQUIRED: {
      en: 'VAT number is required.',
      si: 'VAT අංකය අවශ්‍යයි.',
      ta: 'VAT எண் அவசியம்.',
    },
    VAT_INVALID: {
      en: 'VAT number is invalid.',
      si: 'VAT අංකය වලංගු නොවේ.',
      ta: 'VAT எண் செல்லுபடியாகாது.',
    },
  });
