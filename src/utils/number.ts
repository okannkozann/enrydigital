/** Yalnızca rakam, nokta ve virgül karakterlerine izin verir (negatif değer yok). */
export function sanitizeDecimalInput(raw: string): string {
  return raw.replace(/[^\d.,]/g, '');
}

/**
 * Türkçe ondalık girişi sayıya çevirir.
 * "0,60" → 0.6, "1.234,5" → 1234.5, "0.6" → 0.6. Geçersizse null döner.
 */
export function parseDecimal(text: string): number | null {
  let t = text.trim();
  if (!t) return null;
  if (t.includes(',')) {
    t = t.replace(/\./g, '').replace(',', '.');
  } else if ((t.match(/\./g) ?? []).length > 1) {
    t = t.replace(/\./g, '');
  }
  const n = Number(t);
  return Number.isFinite(n) && n >= 0 ? n : null;
}

/** Türkçe gösterim: tam sayılar olduğu gibi, ondalıklılar en az 2 hane. */
export function formatDecimal(n: number | null): string {
  if (n === null || n === undefined) return '';
  const isInt = Number.isInteger(n);
  return new Intl.NumberFormat('tr-TR', {
    minimumFractionDigits: isInt ? 0 : 2,
    maximumFractionDigits: 3,
  }).format(n);
}
