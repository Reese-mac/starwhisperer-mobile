export function normalizeCityKey(city?: string) {
  if (!city) return 'fallback';

  return city
    .toLowerCase()
    .trim();
}
