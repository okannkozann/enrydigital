import {
  MATERIAL_CATALOG,
  PAVEMENT_CATALOG,
  resolveName,
  resolveWorkItemName,
} from '../models/catalogs';
import { getPhotoBlob } from '../database/photoRepository';
import { SCHEMA_VERSION, type ImalatForm } from '../types/form';
import { formatDateTr } from '../utils/date';

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

function download(filename: string, blob: Blob): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

function safeName(form: ImalatForm): string {
  return (form.formNo ?? form.id.slice(0, 8)).replace(/[^\w-]+/g, '_');
}

/** Backend API'ye gönderilebilecek, sürümlü ve temiz JSON yapısı. */
export async function buildJsonPayload(form: ImalatForm) {
  const photos = await Promise.all(
    form.photos.map(async (p) => {
      const blob = await getPhotoBlob(p.id);
      return { ...p, dataUrl: blob ? await blobToDataUrl(blob) : null };
    }),
  );

  return {
    schemaVersion: SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    formId: form.id,
    formNo: form.formNo,
    status: form.status,
    createdAt: form.createdAt,
    updatedAt: form.updatedAt,
    completedAt: form.completedAt,
    date: form.general.date,
    region: form.general.region,
    sector: form.general.sector,
    province: form.general.province,
    district: form.general.district,
    neighborhood: form.general.neighborhood,
    street: form.general.street,
    buildingNo: form.general.buildingNo,
    connectionObject: form.general.connectionObject,
    sketch: form.sketch,
    workItems: form.workItems.map((w) => ({
      ...w,
      name: resolveWorkItemName(w),
    })),
    pavements: form.pavements.map((p) => ({
      ...p,
      name: resolveName(PAVEMENT_CATALOG, p),
    })),
    materials: form.materials.map((m, i) => ({
      ...m,
      no: i + 1,
      name: resolveName(MATERIAL_CATALOG, m),
    })),
    parties: form.parties,
    serviceChecks: form.serviceChecks,
    photos,
  };
}

export async function exportFormJson(form: ImalatForm): Promise<void> {
  const payload = await buildJsonPayload(form);
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  download(`imalat-formu_${safeName(form)}.json`, blob);
}

/**
 * Excel çıktısı: her sayfa Form No ile ilişkilidir (SAP'ye manuel aktarım için
 * düz tablo yapısı). xlsx kütüphanesi yalnızca gerektiğinde yüklenir.
 */
export async function exportFormsExcel(forms: ImalatForm[], filename?: string): Promise<void> {
  const XLSX = await import('xlsx');

  const general = forms.map((f) => ({
    'Form No': f.formNo ?? '',
    Durum: f.status === 'completed' ? 'Tamamlandı' : 'Taslak',
    Tarih: formatDateTr(f.general.date),
    Bölge: f.general.region,
    Sektör: f.general.sector,
    İl: f.general.province,
    İlçe: f.general.district,
    Mahalle: f.general.neighborhood,
    'Cadde/Sokak': f.general.street,
    'Bina Adedi/No': f.general.buildingNo,
    'Bağlantı Nesnesi': f.general.connectionObject,
    'Test ve Devreye Alma': f.serviceChecks.testAndCommissioning ? 'Evet' : 'Hayır',
    'Gazsız Şebeke Testi': f.serviceChecks.gaslessNetworkTest ? 'Evet' : 'Hayır',
    'Yüklenici': `${f.parties.contractor.firstName} ${f.parties.contractor.lastName}`.trim(),
    'Yüklenici Onayı': f.parties.contractor.approved ? `Evet (${f.parties.contractor.approvedAt})` : 'Hayır',
    Kontrol: `${f.parties.inspector.firstName} ${f.parties.inspector.lastName}`.trim(),
    'Kontrol Onayı': f.parties.inspector.approved ? `Evet (${f.parties.inspector.approvedAt})` : 'Hayır',
    'Teslim Alan': `${f.parties.receiver.firstName} ${f.parties.receiver.lastName}`.trim(),
    'Teslim Alan Onayı': f.parties.receiver.approved ? `Evet (${f.parties.receiver.approvedAt})` : 'Hayır',
    'Fotoğraf Sayısı': f.photos.length,
    'Oluşturma': f.createdAt,
    'Güncelleme': f.updatedAt,
  }));

  const work = forms.flatMap((f) =>
    f.workItems.map((w, i) => ({
      'Form No': f.formNo ?? '',
      Sıra: i + 1,
      'İşçilik Tipi':
        w.category === 'service' ? 'Servis Hattı' : w.category === 'main' ? 'Ana Hat' : 'Diğer',
      'Çap': w.diameter ? `Ø${w.diameter}` : '',
      'İşçilik Adı': resolveWorkItemName(w),
      'Miktar': w.quantity,
      'Geri Dolgu': w.hasBackfill ? 'Evet' : 'Hayır',
      'Geri Dolgu Miktarı (m)': w.backfillQuantity ?? '',
      'Bozulan Üstyapı': w.hasPavement ? 'Evet' : 'Hayır',
      'Üstyapı Tipi': w.hasPavement ? (w.pavementType === 'parke' ? 'Parke' : 'Asfalt') : '',
      'Üstyapı Uzunluk (m)': w.hasPavement ? (w.pavementLength ?? '') : '',
      'Üstyapı Genişlik (m)': w.hasPavement ? (w.pavementWidth ?? '') : '',
    })),
  );

  const pavement = forms.flatMap((f) =>
    f.pavements.map((p, i) => ({
      'Form No': f.formNo ?? '',
      Sıra: i + 1,
      'Üstyapı Adı': resolveName(PAVEMENT_CATALOG, p),
      'Uzunluk (m)': p.length,
      'Genişlik (m)': p.width,
    })),
  );

  const materials = forms.flatMap((f) =>
    f.materials.map((m, i) => ({
      'Form No': f.formNo ?? '',
      No: i + 1,
      'Malzeme Kodu': m.catalogId,
      'Malzeme Adı': resolveName(MATERIAL_CATALOG, m),
      Miktar: m.quantity,
      Birim: m.unit,
      'Seri No': m.serialNo,
      'Ekipman No': m.equipmentNo,
      Marka: m.brand,
    })),
  );

  const wb = XLSX.utils.book_new();
  const add = (name: string, rows: object[]) =>
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(rows), name);

  add('Genel', general);
  add('İşçilik', work);
  add('Üstyapı', pavement);
  add('Malzeme', materials);

  const data = XLSX.write(wb, { type: 'array', bookType: 'xlsx' }) as ArrayBuffer;
  const blob = new Blob([data], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const name =
    filename ??
    (forms.length === 1 ? `imalat-formu_${safeName(forms[0])}.xlsx` : 'imalat-formlari.xlsx');
  download(name, blob);
}
