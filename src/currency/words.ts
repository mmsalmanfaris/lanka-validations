import type { WordsOptions } from './types';

// English number word dictionaries
const EN_ONES = [
  '',
  'One',
  'Two',
  'Three',
  'Four',
  'Five',
  'Six',
  'Seven',
  'Eight',
  'Nine',
  'Ten',
  'Eleven',
  'Twelve',
  'Thirteen',
  'Fourteen',
  'Fifteen',
  'Sixteen',
  'Seventeen',
  'Eighteen',
  'Nineteen',
];

const EN_TENS = [
  '',
  '',
  'Twenty',
  'Thirty',
  'Forty',
  'Fifty',
  'Sixty',
  'Seventy',
  'Eighty',
  'Ninety',
];

function englishNumberUnderThousand(n: number): string {
  let s = '';
  if (n >= 100) {
    s += EN_ONES[Math.floor(n / 100)] + ' Hundred ';
    n %= 100;
  }
  if (n >= 20) {
    s += EN_TENS[Math.floor(n / 10)];
    if (n % 10 > 0) {
      s += '-' + EN_ONES[n % 10];
    }
    s += ' ';
  } else if (n > 0) {
    s += EN_ONES[n] + ' ';
  }
  return s.trim();
}

function englishIntegerToWords(n: number): string {
  if (n === 0) return 'Zero';

  const scales = [
    { value: 1_000_000_000, name: 'Billion' },
    { value: 1_000_000, name: 'Million' },
    { value: 1_000, name: 'Thousand' },
    { value: 1, name: '' },
  ];

  let result = '';
  let rem = n;

  for (const scale of scales) {
    if (rem >= scale.value) {
      const count = Math.floor(rem / scale.value);
      rem %= scale.value;
      const part = englishNumberUnderThousand(count);
      result += (part ? part + (scale.name ? ' ' + scale.name : '') + ' ' : '');
    }
  }

  return result.trim();
}

// Sinhala number word mappings
const SI_ONES = [
  '',
  'එක',
  'දෙක',
  'තුන',
  'හතර',
  'පහ',
  'හය',
  'හත',
  'අට',
  'නවය',
  'දහය',
  'එකොළහ',
  'දොළහ',
  'දහතුන',
  'දහහතර',
  'පහළොව',
  'දහසය',
  'දහහත',
  'දහඅට',
  'දහනවය',
];

const SI_TENS = [
  '',
  '',
  'විසි',
  'තිස්',
  'සතලිස්',
  'පනස්',
  'හැට',
  'හැත්තෑ',
  'අසූ',
  'අනූ',
];

const SI_TENS_FULL = [
  '',
  '',
  'විස්ස',
  'තිහ',
  'සතලිහ',
  'පනහ',
  'හැට',
  'හැත්තෑව',
  'අසූව',
  'අනූව',
];

const SI_HUNDREDS = [
  '',
  'එක්සිය',
  'දෙසිය',
  'තුන්සිය',
  'හාරසිය',
  'පන්සිය',
  'හයසිය',
  'හත්සිය',
  'අටසිය',
  'නමසිය',
];

function sinhalaNumberUnderThousand(n: number): string {
  if (n === 0) return '';
  let s = '';
  if (n >= 100) {
    s += SI_HUNDREDS[Math.floor(n / 100)] + ' ';
    n %= 100;
  }
  if (n >= 20) {
    const tens = Math.floor(n / 10);
    const ones = n % 10;
    if (ones === 0) {
      s += SI_TENS_FULL[tens] + ' ';
    } else {
      s += SI_TENS[tens] + ' ' + SI_ONES[ones] + ' ';
    }
  } else if (n > 0) {
    s += SI_ONES[n] + ' ';
  }
  return s.trim();
}

function sinhalaIntegerToWords(n: number): string {
  if (n === 0) return 'බිංදුව';

  const scales = [
    { value: 1_000_000, prefix: 'මිලියන ' },
    { value: 1_000, prefix: 'දහස් ' },
  ];

  let result = '';
  let rem = n;

  for (const scale of scales) {
    if (rem >= scale.value) {
      const count = Math.floor(rem / scale.value);
      rem %= scale.value;
      if (scale.value === 1000) {
        if (count === 1) {
          result += 'එක්දහස් ';
        } else {
          result += sinhalaNumberUnderThousand(count) + ' ' + scale.prefix;
        }
      } else {
        result += sinhalaNumberUnderThousand(count) + ' ' + scale.prefix;
      }
    }
  }

  if (rem > 0) {
    result += sinhalaNumberUnderThousand(rem);
  }

  return result.trim();
}

// Tamil number mappings
const TA_ONES = [
  '',
  'ஒன்று',
  'இரண்டு',
  'மூன்று',
  'நான்கு',
  'ஐந்து',
  'ஆறு',
  'ஏழு',
  'எட்டு',
  'ஒன்பது',
  'பத்து',
  'பதினொன்று',
  'பன்னிரண்டு',
  'பதின்மூன்று',
  'பதினான்கு',
  'பதினைந்து',
  'பதினாறு',
  'பதினேழு',
  'பதினெட்டு',
  'பத்தொன்பது',
];

const TA_TENS = [
  '',
  '',
  'இருபது',
  'முப்பது',
  'நாற்பது',
  'ஐம்பது',
  'அறுபது',
  'எழுபது',
  'எண்பது',
  'தொண்ணூறு',
];

const TA_TENS_PREFIX = [
  '',
  '',
  'இருபத்து ',
  'முப்பத்து ',
  'நாற்பத்து ',
  'ஐம்பத்து ',
  'அறுபத்து ',
  'எழுபத்து ',
  'எண்பத்து ',
  'தொண்ணூற்று ',
];

const TA_HUNDREDS = [
  '',
  'நூறு',
  'இருநூறு',
  'முந்நூறு',
  'நானூறு',
  'ஐந்நூறு',
  'அறுநூறு',
  'எழுநூறு',
  'எண்ணூறு',
  'தொள்ளாயிரம்',
];

const TA_HUNDREDS_PREFIX = [
  '',
  'நூற்று ',
  'இருநூற்று ',
  'முந்நூற்று ',
  'நானூற்று ',
  'ஐந்நூற்று ',
  'அறுநூற்று ',
  'எழுநூற்று ',
  'எண்ணூற்று ',
  'தொள்ளாயிரத்து ',
];

function tamilNumberUnderThousand(n: number): string {
  if (n === 0) return '';
  let s = '';
  if (n >= 100) {
    const h = Math.floor(n / 100);
    n %= 100;
    if (n === 0) {
      return TA_HUNDREDS[h];
    }
    s += TA_HUNDREDS_PREFIX[h];
  }

  if (n >= 20) {
    const tens = Math.floor(n / 10);
    const ones = n % 10;
    if (ones === 0) {
      s += TA_TENS[tens];
    } else {
      s += TA_TENS_PREFIX[tens] + TA_ONES[ones];
    }
  } else if (n > 0) {
    s += TA_ONES[n];
  }

  return s.trim();
}

function tamilIntegerToWords(n: number): string {
  if (n === 0) return 'பூஜ்ஜியம்';

  let result = '';
  let rem = n;

  if (rem >= 1_000_000) {
    const m = Math.floor(rem / 1_000_000);
    rem %= 1_000_000;
    result += tamilNumberUnderThousand(m) + ' மில்லியன் ';
  }

  if (rem >= 1_000) {
    const t = Math.floor(rem / 1_000);
    rem %= 1_000;
    if (t === 1) {
      result += (rem === 0 ? 'ஆயிரம் ' : 'ஆயிரத்து ');
    } else {
      result += tamilNumberUnderThousand(t) + (rem === 0 ? ' ஆயிரம் ' : ' ஆயிரத்து ');
    }
  }

  if (rem > 0) {
    result += tamilNumberUnderThousand(rem);
  }

  return result.trim();
}

/**
 * Converts a Sri Lankan Rupee amount into words in English, Sinhala, or Tamil.
 *
 * Examples:
 * - lkrToWords(1500) -> "One Thousand Five Hundred Rupees Only"
 * - lkrToWords(1500.50) -> "One Thousand Five Hundred Rupees and Fifty Cents Only"
 * - lkrToWords(1500, { language: 'si' }) -> "රුපියල් එක්දහස් පන්සියයයි"
 * - lkrToWords(1500, { language: 'ta' }) -> "ஆயிரத்து ஐந்நூறு ரூபாய்"
 */
export function lkrToWords(amount: number, options?: WordsOptions): string {
  const lang = options?.language ?? 'en';
  const includeCents = options?.includeCents ?? true;
  const isNeg = amount < 0;
  const absAmount = Math.abs(amount);

  const rupees = Math.floor(absAmount);
  const cents = Math.round((absAmount - rupees) * 100);

  if (lang === 'si') {
    let text = `රුපියල් ${sinhalaIntegerToWords(rupees)}`;
    if (text.endsWith('ය')) {
      text += 'යි';
    } else if (text.endsWith('හ') || text.endsWith('ක') || text.endsWith('න') || text.endsWith('ට')) {
      text += 'යි';
    } else {
      text += 'යි';
    }

    if (includeCents && cents > 0) {
      text += ` ශත ${sinhalaIntegerToWords(cents)}යි`;
    }

    return (isNeg ? 'සෘණ ' : '') + text;
  }

  if (lang === 'ta') {
    let text = `${tamilIntegerToWords(rupees)} ரூபாய்`;
    if (includeCents && cents > 0) {
      text += ` ${tamilIntegerToWords(cents)} சதம்`;
    }
    return (isNeg ? 'கழித்தல் ' : '') + text;
  }

  // English
  const words = englishIntegerToWords(rupees);
  const rupeeUnit = rupees === 1 ? 'Rupee' : 'Rupees';
  let result = `${words} ${rupeeUnit}`;

  if (includeCents && cents > 0) {
    const centWords = englishIntegerToWords(cents);
    const centUnit = cents === 1 ? 'Cent' : 'Cents';
    result += ` and ${centWords} ${centUnit}`;
  }

  const suffix = options?.suffix !== undefined ? options.suffix : 'Only';
  if (suffix) {
    result += ` ${suffix}`;
  }

  return (isNeg ? 'Minus ' : '') + result.trim();
}

