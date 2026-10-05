import {
  MATERIAL_CATALOG,
  OTHER_ID,
  PAVEMENT_CATALOG,
  WORK_CATALOG,
  getSuggestedMaterialTemplates,
} from './catalogs';
import {
  SCHEMA_VERSION,
  type ImalatForm,
  type MaterialItem,
  type PartyInfo,
  type PavementItem,
  type WorkItem,
} from '../types/form';
import { todayIso } from '../utils/date';
import { uid } from '../utils/id';

export const SKETCH_WIDTH = 1000;
export const SKETCH_HEIGHT = 640;

const emptyParty = (): PartyInfo => ({
  firstName: '',
  lastName: '',
  note: '',
  signature: null,
  approved: false,
  approvedAt: null,
});

export function createEmptyForm(id: string): ImalatForm {
  const now = new Date().toISOString();
  return {
    schemaVersion: SCHEMA_VERSION,
    id,
    formNo: null,
    status: 'draft',
    createdAt: now,
    updatedAt: now,
    completedAt: null,
    general: {
      date: todayIso(),
      region: '',
      sector: '',
      province: '',
      district: '',
      neighborhood: '',
      street: '',
      buildingNo: '',
      connectionObject: '',
    },
    sketch: { items: [], image: null, width: SKETCH_WIDTH, height: SKETCH_HEIGHT },
    workItems: [],
    pavements: [],
    materials: [],
    parties: { contractor: emptyParty(), inspector: emptyParty(), receiver: emptyParty() },
    serviceChecks: { testAndCommissioning: false, gaslessNetworkTest: false },
    photos: [],
  };
}

export function createWorkItem(): WorkItem {
  return {
    id: uid(),
    category: 'service',
    diameter: '20',
    catalogId: WORK_CATALOG[0]?.id ?? 'service',
    customName: '',
    quantity: null,
    unit: 'm',
    hasBackfill: false,
    backfillQuantity: null,
    hasPavement: false,
    pavementType: 'asfalt',
    pavementLength: null,
    pavementWidth: null,
  };
}

export function createPavement(): PavementItem {
  return {
    id: uid(),
    catalogId: PAVEMENT_CATALOG[0].id,
    customName: '',
    length: null,
    width: null,
    unit: 'm',
  };
}

export function createMaterial(catalogId?: string): MaterialItem {
  const item = catalogId ? MATERIAL_CATALOG.find((c) => c.id === catalogId) : null;
  const initial = item ?? MATERIAL_CATALOG[0];
  return {
    id: uid(),
    catalogId: initial.id,
    customName: '',
    quantity: null,
    unit: initial.defaultUnit,
    serialNo: '',
    equipmentNo: '',
    brand: '',
  };
}

export function createSuggestedMaterials(
  category: 'service' | 'main' | 'other',
  diameter: string,
  pipeQuantity?: number | null,
): MaterialItem[] {
  const templates = getSuggestedMaterialTemplates(category, diameter);
  return templates.map((t) => {
    // Eğer boru ise ve işçilikte boru metrajı girilmişse boru miktarına otomatik yansıtılabilir
    const isPipe = t.catalogId.startsWith('pe-boru');
    return {
      id: uid(),
      catalogId: t.catalogId,
      customName: t.customName,
      quantity: isPipe && pipeQuantity ? pipeQuantity : null,
      unit: t.defaultUnit,
      serialNo: '',
      equipmentNo: '',
      brand: '',
    };
  });
}

export { OTHER_ID };
