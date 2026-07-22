/**
 * This function takes a number value and converts it into a readable currency.
 * Example - 150000 would become $150,000.00
 * */
export const formatCurrency = (value: number) =>
  value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    currencyDisplay: 'symbol',
  });
