import { Section } from '../components/Section';
import { NumberField, SelectField, TextField } from '../components/fields';
import { MATERIAL_CATALOG, OTHER_ID } from '../models/catalogs';
import { createMaterial } from '../models/factory';
import type { MaterialItem, Unit } from '../types/form';
import type { SectionProps } from './types';

export function MaterialSection({ form, update, errors }: SectionProps) {
  const patch = (id: string, p: Partial<MaterialItem>) =>
    update((f) => ({
      ...f,
      materials: f.materials.map((m) => (m.id === id ? { ...m, ...p } : m)),
    }));

  const remove = (id: string) =>
    update((f) => ({ ...f, materials: f.materials.filter((m) => m.id !== id) }));

  const addExtraMaterial = () => {
    update((f) => ({ ...f, materials: [...f.materials, createMaterial()] }));
  };

  return (
    <Section
      id="material"
      number={4}
      title="Malzeme"
      hint="İşçilik seçimine göre önerilen malzemeler listelenir. İstemediklerinizi (-) ile çıkarabilir, (+) ile yeni ekleyebilirsiniz."
    >
      <div className="material-panel">
        {form.materials.length === 0 ? (
          <div className="empty">
            <p>Henüz malzeme bulunmuyor.</p>
            <small>Yukarıdan işçilik hattı seçtiğinizde önerilen malzemeler otomatik eklenir.</small>
          </div>
        ) : (
          <div className="material-list">
            {form.materials.map((m, index) => {
              const msg = errors[`materials.${m.id}`];
              const isOther = m.catalogId === OTHER_ID;

              return (
                <div key={m.id} className={`mat-row${msg ? ' mat-row--error' : ''}`}>
                  <div className="mat-row__top">
                    {/* Silme butonu: listeden çıkarabilmek için [-] işareti */}
                    <button
                      type="button"
                      className="mat-btn-remove"
                      onClick={() => remove(m.id)}
                      title="Listeden sil"
                      aria-label={`Malzeme ${index + 1} sil`}
                    >
                      <span aria-hidden="true">−</span>
                    </button>

                    <span className="mat-row__idx">{index + 1}</span>

                    {/* Malzeme Adı Seçimi */}
                    <div className="mat-row__name">
                      <SelectField
                        label="Malzeme"
                        value={m.catalogId}
                        options={MATERIAL_CATALOG.map((c) => ({ value: c.id, label: c.name }))}
                        onChange={(catId) => {
                          const item = MATERIAL_CATALOG.find((c) => c.id === catId);
                          patch(m.id, {
                            catalogId: catId,
                            unit: (item?.defaultUnit ?? 'adet') as Unit,
                          });
                        }}
                      />
                    </div>

                    {/* Miktar */}
                    <div className="mat-row__qty">
                      <NumberField
                        label="Miktar"
                        value={m.quantity}
                        unit={m.unit}
                        error={!!msg && m.quantity === null}
                        onChange={(quantity) => patch(m.id, { quantity })}
                      />
                    </div>
                  </div>

                  {/* Diğer seçildiyse serbest isim yazımı */}
                  {isOther && (
                    <div className="mat-row__custom">
                      <TextField
                        label="Özel Malzeme Adı"
                        placeholder="Malzeme adını yazın..."
                        value={m.customName}
                        onChange={(customName) => patch(m.id, { customName })}
                        error={msg && !m.customName?.trim() ? 'Lütfen malzeme adını yazın.' : undefined}
                      />
                    </div>
                  )}

                  {/* Kompakt Ek Bilgiler (Seri No, Marka) */}
                  <div className="mat-row__meta">
                    <TextField
                      label="Seri No"
                      placeholder="Seri No"
                      value={m.serialNo}
                      onChange={(serialNo) => patch(m.id, { serialNo })}
                    />
                    <TextField
                      label="Marka"
                      placeholder="Marka"
                      value={m.brand}
                      onChange={(brand) => patch(m.id, { brand })}
                    />
                    <TextField
                      label="Ekipman No"
                      placeholder="Ekipman No"
                      value={m.equipmentNo}
                      onChange={(equipmentNo) => patch(m.id, { equipmentNo })}
                    />
                  </div>

                  {msg && (
                    <p className="field__error" role="alert">
                      {msg}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Listenin altında + butonu: ekstra malzeme ekleme */}
        <div className="mat-actions">
          <button type="button" className="btn btn--add" onClick={addExtraMaterial}>
            <span aria-hidden="true">+</span> Ekstra Malzeme Ekle
          </button>
        </div>
      </div>
    </Section>
  );
}
