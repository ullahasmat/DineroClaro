export const formatCurrency = (value: number, locale: string = 'en-US', currency = 'USD') =>
  new Intl.NumberFormat(locale, { style: 'currency', currency }).format(value);
