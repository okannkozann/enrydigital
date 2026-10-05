import { SelectField, TextField } from '../components/fields';
import { OTHER_ID, type CatalogItem } from '../models/catalogs';

interface CatalogPickerProps {
  label: string;
  catalog: CatalogItem[];
  catalogId: string;
  customName: string;
  onChange: (next: { catalogId: string; customName: string; defaultUnit: CatalogItem['defaultUnit'] }) => void;
  error?: boolean;
}

/** Katalogdan seçim; "Diğer" seçilirse serbest ad alanı açılır. */
export function CatalogPicker({ label, catalog, catalogId, customName, onChange, error }: CatalogPickerProps) {
  return (
    <>
      <SelectField
        label={label}
        value={catalogId}
        onChange={(id) => {
          const item = catalog.find((c) => c.id === id) ?? catalog[0];
          onChange({ catalogId: id, customName, defaultUnit: item.defaultUnit });
        }}
        options={catalog.map((c) => ({ value: c.id, label: c.name }))}
      />
      {catalogId === OTHER_ID && (
        <TextField
          label={`${label} (yazın)`}
          value={customName}
          onChange={(v) => {
            const item = catalog.find((c) => c.id === OTHER_ID) ?? catalog[0];
            onChange({ catalogId, customName: v, defaultUnit: item.defaultUnit });
          }}
          error={error && !customName.trim() ? 'Lütfen adı yazın.' : undefined}
        />
      )}
    </>
  );
}
