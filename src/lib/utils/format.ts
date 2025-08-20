export function formatPrice(cents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(cents / 100);
}

export function getSizeLabel(size: string): string {
  const sizeMap: { [key: string]: string } = {
    '36S': '36 Short',
    '36R': '36 Regular',
    '36L': '36 Long',
    '38S': '38 Short',
    '38R': '38 Regular',
    '38L': '38 Long',
    '40S': '40 Short',
    '40R': '40 Regular',
    '40L': '40 Long',
    '42S': '42 Short',
    '42R': '42 Regular',
    '42L': '42 Long',
    '44S': '44 Short',
    '44R': '44 Regular',
    '44L': '44 Long',
    '46S': '46 Short',
    '46R': '46 Regular',
    '46L': '46 Long',
    '48S': '48 Short',
    '48R': '48 Regular',
    '48L': '48 Long',
    '50S': '50 Short',
    '50R': '50 Regular',
    '50L': '50 Long',
    '52R': '52 Regular',
    '52L': '52 Long',
    '54R': '54 Regular',
    '54L': '54 Long',
    '56R': '56 Regular',
    '56L': '56 Long',
  };
  
  return sizeMap[size] || size;
}

export function calculateDiscount(price: number, percentage: number): number {
  return Math.round(price * (1 - percentage / 100));
}