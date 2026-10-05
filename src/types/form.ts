/**
 * Dijital İmalat Formu veri modeli.
 *
 * Bu model hem IndexedDB'de saklanır hem de JSON dışa aktarma için temel alınır.
 * Sayısal değerler her zaman standart `number` olarak tutulur (Türkçe gösterim
 * yalnızca arayüz katmanında yapılır). `schemaVersion` ileride API'ye geçişte
 * ve veri göçlerinde kullanılır.
 */

export const SCHEMA_VERSION = 1;

export type FormStatus = 'draft' | 'completed';

export type Unit = 'm' | 'm²' | 'm³' | 'adet';

export interface GeneralInfo {
  /** ISO tarih: YYYY-MM-DD */
  date: string;
  region: string;
  sector: string;
  province: string;
  district: string;
  neighborhood: string;
  street: string;
  buildingNo: string;
  connectionObject: string;
}

/** Katalogdan seçilen veya "Diğer" ile serbest girilen satır adı. */
export interface CatalogRef {
  /** Katalog öğesi id'si; serbest girişte `other`. */
  catalogId: string;
  /** Yalnızca catalogId === 'other' iken kullanılır. */
  customName: string;
}

export type WorkCategory = 'service' | 'main' | 'other';
export type WorkDiameter = '20' | '32' | '63' | '125' | '';

export type PavementType = 'asfalt' | 'parke';

export interface WorkItem extends CatalogRef {
  id: string;
  category: WorkCategory;
  diameter: WorkDiameter;
  quantity: number | null;
  unit: Unit;
  hasBackfill: boolean;
  backfillQuantity: number | null;
  hasPavement: boolean;
  pavementType: PavementType;
  pavementLength: number | null;
  pavementWidth: number | null;
}

export interface PavementItem extends CatalogRef {
  id: string;
  length: number | null;
  width: number | null;
  unit: 'm';
}

export interface MaterialItem extends CatalogRef {
  id: string;
  quantity: number | null;
  unit: Unit;
  serialNo: string;
  equipmentNo: string;
  brand: string;
}

export interface PartyInfo {
  firstName: string;
  lastName: string;
  note: string;
  /** İleride parmak/stylus imzası (PNG data URL) için ayrılmıştır. */
  signature: string | null;
  approved?: boolean;
  approvedAt?: string | null;
}

export interface Parties {
  contractor: PartyInfo;
  inspector: PartyInfo;
  receiver: PartyInfo;
}

export interface ServiceChecks {
  testAndCommissioning: boolean;
  gaslessNetworkTest: boolean;
}

/** Fotoğraf meta verisi. Blob ayrı bir object store'da tutulur. */
export interface PhotoMeta {
  id: string;
  formId: string;
  name: string;
  mimeType: string;
  size: number;
  width: number;
  height: number;
  capturedAt: string;
  /** İleride GPS / kullanıcı bilgisi için ayrılmıştır. */
  gps: { lat: number; lng: number; accuracy?: number } | null;
  capturedBy: string | null;
}

export type Point = [number, number];

export type SketchItem =
  | { type: 'pen'; points: Point[] }
  | { type: 'line'; from: Point; to: Point }
  | { type: 'mark'; at: Point }
  | { type: 'text'; at: Point; text: string };

export interface SketchData {
  /** Vektör öğeleri: kroki daha sonra tekrar düzenlenebilir. */
  items: SketchItem[];
  /** PNG önizleme (data URL); dışa aktarma ve görüntüleme için. */
  image: string | null;
  width: number;
  height: number;
}

export interface ImalatForm {
  schemaVersion: number;
  id: string;
  /** İlk kayıtta otomatik atanır, örn. IMF-2026-0001. */
  formNo: string | null;
  status: FormStatus;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
  general: GeneralInfo;
  sketch: SketchData;
  workItems: WorkItem[];
  pavements: PavementItem[];
  materials: MaterialItem[];
  parties: Parties;
  serviceChecks: ServiceChecks;
  photos: PhotoMeta[];
}
