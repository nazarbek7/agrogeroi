// Order mirrors the header navigation (Гортензии → Хвойные → Горшки → Торф →
// Розы → Деревья), then the rest. The header is the single source of priority —
// keep this list in step with it.
export const categoryMenuList = [
  { id: 1,  title: "Гортензии",                  emoji: "💐", href: "/shop/Гортензии" },
  { id: 2,  title: "Хвойные деревья",            emoji: "🌲", href: "/shop/Хвойные деревья и кустарники" },
  { id: 3,  title: "Горшки и контейнеры",        emoji: "🪣", href: "/shop/Контейнеры и горшки" },
  { id: 4,  title: "Торфяная продукция",         emoji: "🏔️", href: "/shop/Торфяная продукция" },
  { id: 5,  title: "Розы",                       emoji: "🌹", href: "/shop/Розы" },
  { id: 6,  title: "Лиственные деревья",         emoji: "🌳", href: "/shop/Лиственные деревья" },
  { id: 7,  title: "Лиственные кустарники",      emoji: "🌿", href: "/shop/Лиственные кустарники" },
  { id: 8,  title: "Плодовые деревья",           emoji: "🍎", href: "/shop/Плодовые деревья и кустарники" },
  { id: 9,  title: "Лианы",                      emoji: "🪴", href: "/shop/Лианы" },
  { id: 10, title: "Цветы многолетние",          emoji: "🌸", href: "/shop/Цветы многолетние" },
  { id: 11, title: "Семена",                     emoji: "🌱", href: "/shop/Семена" },
  { id: 12, title: "Газоны",                     emoji: "🌾", href: "/shop/Газоны и травосмеси" },
  { id: 13, title: "Сетки и агротекстиль",       emoji: "🕸️", href: "/shop/Сетки и агротекстиль" },
  { id: 14, title: "Инструменты",                emoji: "🛠️", href: "/shop/Инструменты" },
];

export const navigation = {
  sale: [
    { name: "Скидки", href: "/sale" },
    { name: "Новинки", href: "/new" },
    { name: "Все товары", href: "/shop" },
  ],
  about: [
    { name: "О нас", href: "/about" },
    { name: "Вакансии", href: "/vacancies" },
    { name: "Партнёрство", href: "/partners" },
  ],
  buy: [
    { name: "Условия использования", href: "/terms" },
    { name: "Политика конфиденциальности", href: "/privacy" },
    { name: "Доставка и оплата", href: "/delivery" },
    { name: "Возврат товара", href: "/returns" },
    { name: "Партнёры", href: "/partners" },
  ],
  help: [
    { name: "Контакты", href: "/contacts" },
    { name: "Как сделать заказ", href: "/how-to-order" },
    { name: "Частые вопросы (FAQ)", href: "/faq" },
  ],
};

/**
 * Russian plural picker: plural(1, ["товар", "товара", "товаров"]) → "товар".
 * Forms are [one, few, many] — 1 товар, 2 товара, 5 товаров.
 */
export const plural = (count: number, forms: [string, string, string]) => {
  const mod100 = count % 100;
  const mod10 = count % 10;
  if (mod100 >= 11 && mod100 <= 14) return forms[2];
  if (mod10 === 1) return forms[0];
  if (mod10 >= 2 && mod10 <= 4) return forms[1];
  return forms[2];
};

export const productWord = (count: number) =>
  plural(count, ["товар", "товара", "товаров"]);

export const isValidNameOrLastname = (input: string) => {
  // Simple name or lastname regex format check
  const regex = /^[a-zA-Z\s]+$/;
  return regex.test(input);
};

export const isValidEmailAddressFormat = (input: string) => {
  // simple email address format check
  const regex = /^\S+@\S+\.\S+$/;
  return regex.test(input);
};

export const isValidCardNumber = (input: string) => {
  // Remove all non-digit characters
  const cleanedInput = input.replace(/[^0-9]/g, "");
  
  // Check if the cleaned input has valid length (13-19 digits)
  if (!/^\d{13,19}$/.test(cleanedInput)) {
    return false;
  }
  
  // Implement Luhn algorithm for credit card validation
  return luhnCheck(cleanedInput);
};

/**
 * Luhn algorithm implementation for credit card validation
 * @param cardNumber - The credit card number as a string
 * @returns boolean - true if the card number is valid according to Luhn algorithm
 */
const luhnCheck = (cardNumber: string): boolean => {
  let sum = 0;
  let isEven = false;
  
  // Process digits from right to left
  for (let i = cardNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cardNumber[i], 10);
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  return sum % 10 === 0;
};

/**
 * Enhanced credit card validation with card type detection
 * @param input - The credit card number as a string
 * @returns object with validation result and card type
 */
export const validateCreditCard = (input: string) => {
  const cleanedInput = input.replace(/[^0-9]/g, "");
  
  // Basic length and format check
  if (!/^\d{13,19}$/.test(cleanedInput)) {
    return {
      isValid: false,
      cardType: 'unknown',
      error: 'Invalid card number format'
    };
  }
  
  // Luhn algorithm check
  if (!luhnCheck(cleanedInput)) {
    return {
      isValid: false,
      cardType: 'unknown',
      error: 'Invalid card number (Luhn check failed)'
    };
  }
  
  // Detect card type based on BIN (Bank Identification Number)
  const cardType = detectCardType(cleanedInput);
  
  return {
    isValid: true,
    cardType,
    error: null
  };
};

/**
 * Detect credit card type based on BIN patterns
 * @param cardNumber - The credit card number as a string
 * @returns string - The detected card type
 */
const detectCardType = (cardNumber: string): string => {
  const firstDigit = cardNumber[0];
  const firstTwoDigits = cardNumber.substring(0, 2);
  const firstFourDigits = cardNumber.substring(0, 4);
  const firstThreeDigits = cardNumber.substring(0, 3);
  
  // Visa: starts with 4
  if (firstDigit === '4') {
    return 'visa';
  }
  
  // Mastercard: starts with 5 or 2
  if (firstDigit === '5' || (firstTwoDigits >= '22' && firstTwoDigits <= '27')) {
    return 'mastercard';
  }
  
  // American Express: starts with 34 or 37
  if (firstTwoDigits === '34' || firstTwoDigits === '37') {
    return 'amex';
  }
  
  // Discover: starts with 6011, 65, or 644-649
  if (firstFourDigits === '6011' || firstTwoDigits === '65' || 
      (firstThreeDigits >= '644' && firstThreeDigits <= '649')) {
    return 'discover';
  }
  
  // Diners Club: starts with 300-305, 36, or 38
  if ((firstThreeDigits >= '300' && firstThreeDigits <= '305') || 
      firstTwoDigits === '36' || firstTwoDigits === '38') {
    return 'diners';
  }
  
  // JCB: starts with 35
  if (firstTwoDigits === '35') {
    return 'jcb';
  }
  
  return 'unknown';
};

export const isValidCreditCardExpirationDate = (input: string) => {
  // simple expiration date format check
  const regex = /^(0[1-9]|1[0-2])\/?([0-9]{4}|[0-9]{2})$/;
  return regex.test(input);
};

export const isValidCreditCardCVVOrCVC = (input: string) => {
  // simple CVV or CVC format check
  const regex = /^[0-9]{3,4}$/;
  return regex.test(input);
};
