import {
  MATERIAL_CATALOG,
  OTHER_ID,
  resolveName,
  resolveWorkItemName,
} from '../models/catalogs';
import type { ImalatForm } from '../types/form';

export interface ValidationIssue {
  /** Alan anahtarı, örn. `general.district` veya `workItems.<id>` */
  key: string;
  /** Hatanın ait olduğu bölüm id'si (sayfada kaydırmak için). */
  section: string;
  message: string;
}

const REQUIRED_GENERAL: [keyof ImalatForm['general'], string][] = [
  ['date', 'Tarih'],
  ['region', 'Bölge'],
  ['province', 'İl'],
  ['district', 'İlçe'],
  ['neighborhood', 'Mahalle'],
  ['street', 'Cadde/Sokak'],
];

export function validateForm(form: ImalatForm): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  for (const [field, label] of REQUIRED_GENERAL) {
    if (!form.general[field].trim()) {
      issues.push({
        key: `general.${field}`,
        section: 'general',
        message: `Lütfen ${label} alanını doldurun.`,
      });
    }
  }

  form.workItems.forEach((w, i) => {
    const isOther = w.category === 'other' || w.catalogId === OTHER_ID;
    if (isOther && !w.customName?.trim()) {
      issues.push({
        key: `workItems.${w.id}`,
        section: 'work',
        message: `İşçilik #${i + 1}: Lütfen işçilik adını yazın.`,
      });
    } else if (w.quantity === null) {
      issues.push({
        key: `workItems.${w.id}`,
        section: 'work',
        message: `İşçilik #${i + 1} (${resolveWorkItemName(w)}): Lütfen miktarı girin.`,
      });
    } else if (w.hasBackfill && w.backfillQuantity === null) {
      issues.push({
        key: `workItems.${w.id}`,
        section: 'work',
        message: `İşçilik #${i + 1} (${resolveWorkItemName(w)}): Lütfen geri dolgu miktarını girin.`,
      });
    } else if (w.hasPavement && (w.pavementLength === null || w.pavementWidth === null)) {
      issues.push({
        key: `workItems.${w.id}`,
        section: 'work',
        message: `İşçilik #${i + 1} (${resolveWorkItemName(w)}): Lütfen bozulan üstyapı uzunluk ve genişliğini girin.`,
      });
    }
  });

  form.materials.forEach((m, i) => {
    if (m.catalogId === OTHER_ID && !m.customName.trim()) {
      issues.push({
        key: `materials.${m.id}`,
        section: 'material',
        message: `Malzeme #${i + 1}: Lütfen malzeme adını yazın.`,
      });
    } else if (m.quantity === null) {
      issues.push({
        key: `materials.${m.id}`,
        section: 'material',
        message: `Malzeme #${i + 1} (${resolveName(MATERIAL_CATALOG, m)}): Lütfen miktarı girin.`,
      });
    }
  });

  return issues;
}
