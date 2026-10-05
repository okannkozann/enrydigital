import type { Unit } from '../types/form';

/**
 * Katalogların `sapCode` alanı ileride SAP kodlarıyla eşleştirme için ayrılmıştır.
 * MVP'de kullanıcıya gösterilmez.
 */
export interface CatalogItem {
  id: string;
  name: string;
  defaultUnit: Unit;
  sapCode: string | null;
}

export const OTHER_ID = 'other';

export const UNITS: Unit[] = ['m', 'm²', 'm³', 'adet'];

export const WORK_CATALOG: CatalogItem[] = [
  { id: 'kazi', name: 'Kazı', defaultUnit: 'm', sapCode: null },
  { id: 'boru-doseme', name: 'Boru döşeme', defaultUnit: 'm', sapCode: null },
  { id: 'boru-montaji', name: 'Boru montajı', defaultUnit: 'm', sapCode: null },
  { id: 'dolgu', name: 'Dolgu', defaultUnit: 'm', sapCode: null },
  { id: OTHER_ID, name: 'Diğer', defaultUnit: 'm', sapCode: null },
];

export const PAVEMENT_CATALOG: CatalogItem[] = [
  { id: 'asfalt', name: 'Asfalt', defaultUnit: 'm', sapCode: null },
  { id: 'beton', name: 'Beton', defaultUnit: 'm', sapCode: null },
  { id: 'parke', name: 'Parke taşı', defaultUnit: 'm', sapCode: null },
  { id: 'stabilize', name: 'Stabilize', defaultUnit: 'm', sapCode: null },
  { id: 'toprak', name: 'Toprak zemin', defaultUnit: 'm', sapCode: null },
  { id: OTHER_ID, name: 'Diğer', defaultUnit: 'm', sapCode: null },
];

export const MATERIAL_CATALOG: CatalogItem[] = [
  { id: 'pe-boru-20', name: 'PE Boru Ø20', defaultUnit: 'm', sapCode: null },
  { id: 'pe-boru-32', name: 'PE Boru Ø32', defaultUnit: 'm', sapCode: null },
  { id: 'pe-boru-63', name: 'PE Boru Ø63', defaultUnit: 'm', sapCode: null },
  { id: 'pe-boru-125', name: 'PE Boru Ø125', defaultUnit: 'm', sapCode: null },
  { id: 'saddle-63-20', name: 'Saddle Ø63x20', defaultUnit: 'adet', sapCode: null },
  { id: 'saddle-63-32', name: 'Saddle Ø63x32', defaultUnit: 'adet', sapCode: null },
  { id: 'saddle-125-32', name: 'Saddle Ø125x32', defaultUnit: 'adet', sapCode: null },
  { id: 'manson-20', name: 'Manşon Ø20', defaultUnit: 'adet', sapCode: null },
  { id: 'manson-32', name: 'Manşon Ø32', defaultUnit: 'adet', sapCode: null },
  { id: 'manson-63', name: 'Manşon Ø63', defaultUnit: 'adet', sapCode: null },
  { id: 'manson-125', name: 'Manşon Ø125', defaultUnit: 'adet', sapCode: null },
  { id: 'vana-cal-25x15', name: 'Vana Cal 25x15', defaultUnit: 'adet', sapCode: null },
  { id: 'vana-20', name: 'Vana Ø20', defaultUnit: 'adet', sapCode: null },
  { id: 'vana-32', name: 'Vana Ø32', defaultUnit: 'adet', sapCode: null },
  { id: 'vana-63', name: 'Vana Ø63', defaultUnit: 'adet', sapCode: null },
  { id: 'vana-125', name: 'Vana Ø125', defaultUnit: 'adet', sapCode: null },
  { id: 'te-63', name: 'Te Ø63', defaultUnit: 'adet', sapCode: null },
  { id: 'te-125', name: 'Te Ø125', defaultUnit: 'adet', sapCode: null },
  { id: 'ikaz-bandi', name: 'İkaz Bandı', defaultUnit: 'm', sapCode: null },
  { id: 'sinyal-kablosu', name: 'Sinyal Kablosu', defaultUnit: 'm', sapCode: null },
  { id: 'celik-gecis-parcasi', name: 'Çelik Geçiş Parçası', defaultUnit: 'adet', sapCode: null },
  { id: OTHER_ID, name: 'Diğer', defaultUnit: 'adet', sapCode: null },
];

export function getSuggestedMaterialTemplates(
  category: 'service' | 'main' | 'other',
  diameter: string,
): { catalogId: string; customName: string; defaultUnit: Unit }[] {
  if (category === 'service') {
    if (diameter === '20') {
      return [
        { catalogId: 'pe-boru-20', customName: '', defaultUnit: 'm' },
        { catalogId: 'saddle-63-20', customName: '', defaultUnit: 'adet' },
        { catalogId: 'manson-20', customName: '', defaultUnit: 'adet' },
        { catalogId: 'vana-20', customName: '', defaultUnit: 'adet' },
        { catalogId: 'ikaz-bandi', customName: '', defaultUnit: 'm' },
      ];
    }
    // Ø32 (varsayılan)
    return [
      { catalogId: 'pe-boru-32', customName: '', defaultUnit: 'm' },
      { catalogId: 'saddle-63-32', customName: '', defaultUnit: 'adet' },
      { catalogId: 'manson-32', customName: '', defaultUnit: 'adet' },
      { catalogId: 'vana-cal-25x15', customName: '', defaultUnit: 'adet' },
      { catalogId: 'ikaz-bandi', customName: '', defaultUnit: 'm' },
    ];
  }
  if (category === 'main') {
    if (diameter === '125') {
      return [
        { catalogId: 'pe-boru-125', customName: '', defaultUnit: 'm' },
        { catalogId: 'manson-125', customName: '', defaultUnit: 'adet' },
        { catalogId: 'te-125', customName: '', defaultUnit: 'adet' },
        { catalogId: 'vana-125', customName: '', defaultUnit: 'adet' },
        { catalogId: 'ikaz-bandi', customName: '', defaultUnit: 'm' },
        { catalogId: 'sinyal-kablosu', customName: '', defaultUnit: 'm' },
      ];
    }
    // Ø63 (varsayılan)
    return [
      { catalogId: 'pe-boru-63', customName: '', defaultUnit: 'm' },
      { catalogId: 'manson-63', customName: '', defaultUnit: 'adet' },
      { catalogId: 'te-63', customName: '', defaultUnit: 'adet' },
      { catalogId: 'vana-63', customName: '', defaultUnit: 'adet' },
      { catalogId: 'ikaz-bandi', customName: '', defaultUnit: 'm' },
      { catalogId: 'sinyal-kablosu', customName: '', defaultUnit: 'm' },
    ];
  }
  return [];
}


export function resolveName(
  catalog: CatalogItem[],
  ref: { catalogId: string; customName: string },
): string {
  if (ref.catalogId === OTHER_ID) return ref.customName.trim();
  return catalog.find((c) => c.id === ref.catalogId)?.name ?? '';
}

export function resolveWorkItemName(w: {
  category?: 'service' | 'main' | 'other';
  diameter?: string;
  customName?: string;
  catalogId?: string;
}): string {
  if (w.category === 'service') {
    return `Servis Hattı Ø${w.diameter || '20'}`;
  }
  if (w.category === 'main') {
    return `Ana Hat Ø${w.diameter || '63'}`;
  }
  if (w.category === 'other') {
    return w.customName?.trim() ? `Diğer (${w.customName.trim()})` : 'Diğer';
  }
  if (w.catalogId) {
    return resolveName(WORK_CATALOG, { catalogId: w.catalogId, customName: w.customName || '' });
  }
  return 'Servis Hattı Ø20';
}
