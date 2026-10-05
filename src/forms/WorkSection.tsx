import { Section } from '../components/Section';
import { NumberField, TextField } from '../components/fields';
import { createSuggestedMaterials, createWorkItem } from '../models/factory';
import type { WorkCategory, WorkDiameter, WorkItem } from '../types/form';
import { AddRowButton, RowCard } from './RowCard';
import type { SectionProps } from './types';

const CATEGORIES: { id: WorkCategory; label: string }[] = [
  { id: 'service', label: 'Servis Hattı' },
  { id: 'main', label: 'Ana Hat' },
  { id: 'other', label: 'Diğer' },
];

const SERVICE_DIAMETERS: { id: WorkDiameter; label: string }[] = [
  { id: '20', label: 'Çap 20 (Ø20)' },
  { id: '32', label: 'Çap 32 (Ø32)' },
];

const MAIN_DIAMETERS: { id: WorkDiameter; label: string }[] = [
  { id: '63', label: 'Çap 63 (Ø63)' },
  { id: '125', label: 'Çap 125 (Ø125)' },
];

export function WorkSection({ form, update, errors }: SectionProps) {
  const patch = (id: string, p: Partial<WorkItem>) =>
    update((f) => {
      const nextWork = f.workItems.map((w) => (w.id === id ? { ...w, ...p } : w));
      // Miktar güncellendiğinde eğer malzeme listesindeki boru miktarı boşsa senkronize et
      let nextMaterials = f.materials;
      if (p.quantity !== undefined && p.quantity !== null) {
        nextMaterials = f.materials.map((m) => {
          if (m.catalogId.startsWith('pe-boru') && (m.quantity === null || m.quantity === 0)) {
            return { ...m, quantity: p.quantity ?? null };
          }
          return m;
        });
      }
      return {
        ...f,
        workItems: nextWork,
        materials: nextMaterials,
      };
    });

  const remove = (id: string) =>
    update((f) => ({ ...f, workItems: f.workItems.filter((w) => w.id !== id) }));

  const setCategory = (id: string, cat: WorkCategory) => {
    let defDiameter: WorkDiameter = '';
    if (cat === 'service') defDiameter = '32'; // Kullanıcı örneğindeki varsayılan çap
    else if (cat === 'main') defDiameter = '63';

    update((f) => {
      const currentItem = f.workItems.find((w) => w.id === id);
      const pipeQty = currentItem?.quantity ?? null;
      const nextWork = f.workItems.map((w) =>
        w.id === id ? { ...w, category: cat, diameter: defDiameter } : w,
      );

      // İlgili hat tiklendiğinde ona ait önerilen malzemeler otomatik aşağıda sıralanır
      const suggested =
        cat !== 'other'
          ? createSuggestedMaterials(cat, defDiameter, pipeQty)
          : f.materials;

      return {
        ...f,
        workItems: nextWork,
        materials: cat !== 'other' ? suggested : f.materials,
      };
    });
  };

  const setDiameter = (id: string, cat: WorkCategory, dia: WorkDiameter) => {
    update((f) => {
      const currentItem = f.workItems.find((w) => w.id === id);
      const pipeQty = currentItem?.quantity ?? null;
      const nextWork = f.workItems.map((w) =>
        w.id === id ? { ...w, diameter: dia } : w,
      );

      // Çap seçildiğinde ilgili çapa ait önerilen malzemeler otomatik sıralanır
      const suggested = createSuggestedMaterials(cat, dia, pipeQty);

      return {
        ...f,
        workItems: nextWork,
        materials: suggested,
      };
    });
  };

  return (
    <Section id="work" number={3} title="İşçilik" hint="Hat tipi ve çap seçildiğinde önerilen malzemeler otomatik listelenir.">
      <div className="rows">
        {form.workItems.length === 0 && <p className="empty">Henüz işçilik eklenmedi.</p>}
        {form.workItems.map((w, i) => {
          const category = w.category || 'service';
          const msg = errors[`workItems.${w.id}`];

          return (
            <RowCard
              key={w.id}
              variant="work"
              title={`İşçilik #${i + 1}`}
              onDelete={() => remove(w.id)}
              hasError={!!msg}
              errorText={msg}
            >
              {/* 1. Başlık: Servis Hattı, Ana Hat, Diğer onay noktaları */}
              <div className="work-type-group">
                <span className="field__label">İşçilik Tipi</span>
                <div className="radio-group" role="radiogroup" aria-label="İşçilik Tipi">
                  {CATEGORIES.map((c) => (
                    <label key={c.id} className={`radio-pill${category === c.id ? ' is-active' : ''}`}>
                      <input
                        type="radio"
                        name={`cat-${w.id}`}
                        value={c.id}
                        checked={category === c.id}
                        onChange={() => setCategory(w.id, c.id)}
                      />
                      <span className="radio-dot" />
                      <span className="radio-label">{c.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 2. İkinci Seçim: Çaplar veya Diğer İşçilik Adı */}
              {category === 'service' && (
                <div className="work-sub-group">
                  <span className="field__label">Çap Seçimi</span>
                  <div className="radio-group" role="radiogroup" aria-label="Servis Hattı Çapı">
                    {SERVICE_DIAMETERS.map((d) => (
                      <label key={d.id} className={`radio-pill${w.diameter === d.id ? ' is-active' : ''}`}>
                        <input
                          type="radio"
                          name={`dia-${w.id}`}
                          value={d.id}
                          checked={w.diameter === d.id}
                          onChange={() => setDiameter(w.id, category, d.id)}
                        />
                        <span className="radio-dot" />
                        <span className="radio-label">{d.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {category === 'main' && (
                <div className="work-sub-group">
                  <span className="field__label">Çap Seçimi</span>
                  <div className="radio-group" role="radiogroup" aria-label="Ana Hat Çapı">
                    {MAIN_DIAMETERS.map((d) => (
                      <label key={d.id} className={`radio-pill${w.diameter === d.id ? ' is-active' : ''}`}>
                        <input
                          type="radio"
                          name={`dia-${w.id}`}
                          value={d.id}
                          checked={w.diameter === d.id}
                          onChange={() => setDiameter(w.id, category, d.id)}
                        />
                        <span className="radio-dot" />
                        <span className="radio-label">{d.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {category === 'other' && (
                <div className="work-sub-group">
                  <TextField
                    label="İşçilik Adı"
                    value={w.customName || ''}
                    placeholder="İşçilik adını yazın..."
                    onChange={(customName) => patch(w.id, { customName })}
                    error={msg && !w.customName?.trim() ? 'Lütfen işçilik adını yazın.' : undefined}
                  />
                </div>
              )}

              {/* 3. Miktar Bilgisi (Birim dropdown kaldırıldı, m sabit) */}
              <div className="work-qty-group">
                <NumberField
                  label="Miktar"
                  value={w.quantity}
                  unit="m"
                  error={!!msg && w.quantity === null}
                  onChange={(quantity) => patch(w.id, { quantity, unit: 'm' })}
                />
              </div>

              {/* 4. Geri Dolgu Onay Tiki ve Miktarı */}
              <div className="work-backfill-group">
                <label className="checkbox-pill">
                  <input
                    type="checkbox"
                    checked={!!w.hasBackfill}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      patch(w.id, {
                        hasBackfill: checked,
                        backfillQuantity: checked ? (w.backfillQuantity ?? w.quantity) : null,
                      });
                    }}
                  />
                  <span className="checkbox-box" aria-hidden="true" />
                  <span className="checkbox-text">Geri Dolgu</span>
                </label>

                {w.hasBackfill && (
                  <div className="work-backfill-qty">
                    <NumberField
                      label="Geri Dolgu Miktarı"
                      value={w.backfillQuantity}
                      unit="m"
                      error={!!msg && w.hasBackfill && w.backfillQuantity === null}
                      onChange={(backfillQuantity) => patch(w.id, { backfillQuantity })}
                    />
                  </div>
                )}
              </div>

              {/* 5. Bozulan Üst Yapı Onay Tiki ve Alanları */}
              <div className="work-pavement-group">
                <label className="checkbox-pill">
                  <input
                    type="checkbox"
                    checked={!!w.hasPavement}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      patch(w.id, {
                        hasPavement: checked,
                        pavementType: w.pavementType || 'asfalt',
                        pavementLength: checked ? (w.pavementLength ?? w.quantity) : null,
                        pavementWidth: checked ? (w.pavementWidth ?? null) : null,
                      });
                    }}
                  />
                  <span className="checkbox-box" aria-hidden="true" />
                  <span className="checkbox-text">Bozulan Üst Yapı</span>
                </label>

                {w.hasPavement && (
                  <div className="work-pavement-details">
                    <div className="work-pavement-type">
                      <span className="field__label">Üst Yapı Adı</span>
                      <div className="radio-group" role="radiogroup" aria-label="Üst Yapı Adı">
                        <label className={`radio-pill${(w.pavementType || 'asfalt') === 'asfalt' ? ' is-active' : ''}`}>
                          <input
                            type="radio"
                            name={`pave-${w.id}`}
                            value="asfalt"
                            checked={(w.pavementType || 'asfalt') === 'asfalt'}
                            onChange={() => patch(w.id, { pavementType: 'asfalt' })}
                          />
                          <span className="radio-dot" />
                          <span className="radio-label">Asfalt</span>
                        </label>
                        <label className={`radio-pill${w.pavementType === 'parke' ? ' is-active' : ''}`}>
                          <input
                            type="radio"
                            name={`pave-${w.id}`}
                            value="parke"
                            checked={w.pavementType === 'parke'}
                            onChange={() => patch(w.id, { pavementType: 'parke' })}
                          />
                          <span className="radio-dot" />
                          <span className="radio-label">Parke</span>
                        </label>
                      </div>
                    </div>

                    <div className="work-pavement-dims">
                      <NumberField
                        label="Uzunluk"
                        value={w.pavementLength}
                        unit="m"
                        error={!!msg && w.hasPavement && w.pavementLength === null}
                        onChange={(pavementLength) => patch(w.id, { pavementLength })}
                      />
                      <NumberField
                        label="Genişlik"
                        value={w.pavementWidth}
                        unit="m"
                        error={!!msg && w.hasPavement && w.pavementWidth === null}
                        onChange={(pavementWidth) => patch(w.id, { pavementWidth })}
                      />
                    </div>
                  </div>
                )}
              </div>
            </RowCard>
          );
        })}
      </div>
      <AddRowButton
        label="İşçilik Ekle"
        onClick={() => {
          const item = createWorkItem();
          update((f) => {
            const nextWork = [...f.workItems, item];
            // Eğer malzeme listesi boşsa hemen önerilen malzemelerle başlat
            const materials =
              f.materials.length === 0
                ? createSuggestedMaterials(item.category, item.diameter, null)
                : f.materials;
            return {
              ...f,
              workItems: nextWork,
              materials,
            };
          });
        }}
      />
    </Section>
  );
}
