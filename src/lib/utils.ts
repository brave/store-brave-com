export const sanctionedCountryCodes: Array<string> = ["IR", "CU", "KP", "SY", "UA"];

export const formatPrice = (price: string | number, currency = 'USD') => {
  if (typeof price === 'string') {
    price = parseFloat(price);
  }

  return price.toLocaleString('en-US', {
    style: 'currency',
    currency
  });
};

export const sleep = (seconds: number): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(resolve, seconds * 1000);
  });
};

export class ValidationError {
  name: string;
  message: string;

  constructor(message: string) {
    this.name = "ValidationError";
    this.message = message;
  }
}
