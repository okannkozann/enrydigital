import { useCallback, useEffect, useMemo, useState } from 'react';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { StatusChip } from '../components/StatusChip';
import { deleteForm, listForms } from '../database/formRepository';
import { navigate } from '../hooks/useRoute';
import { exportFormJson, exportFormsExcel } from '../services/exportService';
import type { FormStatus, ImalatForm } from '../types/form';
import { formatDateTr } from '../utils/date';
import { uid } from '../utils/id';
import { showToast } from '../utils/toast';

type Filter = 'all' | FormStatus;

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'Tümü' },
  { id: 'draft', label: 'Taslak' },
  { id: 'completed', label: 'Tamamlandı' },
];

export function FormListPage() {
  const [forms, setForms] = useState<ImalatForm[] | null>(null);
  const [filter, setFilter] = useState<Filter>('all');
  const [toDelete, setToDelete] = useState<ImalatForm | null>(null);

  const refresh = useCallback(async () => {
    try {
      setForms(await listForms());
    } catch {
      showToast('Kayıtlı formlar okunamadı.', 'error');
      setForms([]);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void refresh();
  }, [refresh]);

  const visible = useMemo(
    () => (forms ?? []).filter((f) => filter === 'all' || f.status === filter),
    [forms, filter],
  );

  /** Doğrudan kaydetmek yerine editörde önizleme/onay ekranını açar. */
  const complete = (form: ImalatForm) => navigate(`/form/${form.id}/preview`);

  const guarded = async (fn: () => Promise<void>, errorText: string) => {
    try {
      await fn();
    } catch {
      showToast(errorText, 'error');
    }
  };

  return (
    <div className="page">
      <header className="topbar">
        <button type="button" className="btn btn--ghost btn--sm" onClick={() => navigate('/')}>
          ← Ana Sayfa
        </button>
        <h1 className="topbar__title">Kayıtlı Formlar</h1>
        <button
          type="button"
          className="btn btn--primary btn--sm"
          onClick={() => navigate(`/form/${uid()}`)}
        >
          + Yeni
        </button>
      </header>

      <div className="list-tools">
        <div className="tabs" role="tablist">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              role="tab"
              aria-selected={filter === f.id}
              className={`tab${filter === f.id ? ' is-active' : ''}`}
              onClick={() => setFilter(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          className="btn btn--outline btn--sm"
          disabled={visible.length === 0}
          onClick={() =>
            guarded(() => exportFormsExcel(visible, 'imalat-formlari.xlsx'), 'Excel oluşturulamadı.')
          }
        >
          Tümünü Excel’e Aktar ({visible.length})
        </button>
      </div>

      <main className="cards">
        {forms === null && <p className="muted">Yükleniyor…</p>}
        {forms !== null && visible.length === 0 && (
          <div className="empty-state">
            <p>Bu görünümde form bulunmuyor.</p>
            <button type="button" className="btn btn--primary" onClick={() => navigate(`/form/${uid()}`)}>
              + Yeni İmalat Formu
            </button>
          </div>
        )}
        {visible.map((f) => (
          <article key={f.id} className="form-card">
            <button type="button" className="form-card__main" onClick={() => navigate(`/form/${f.id}`)}>
              <div className="form-card__top">
                <span className="form-card__date">{formatDateTr(f.general.date)}</span>
                <StatusChip status={f.status} />
              </div>
              <div className="form-card__place">
                {[f.general.district, f.general.neighborhood].filter(Boolean).join(' / ') || 'Konum girilmedi'}
              </div>
              <div className="form-card__street">{f.general.street || '—'}</div>
              <div className="form-card__meta">
                <span>{f.formNo ?? 'No atanmadı'}</span>
                <span>
                  {f.workItems.length} işçilik · {f.materials.length} malzeme · {f.photos.length} foto
                </span>
              </div>
            </button>
            <div className="form-card__actions">
              <button type="button" className="btn btn--outline btn--sm" onClick={() => navigate(`/form/${f.id}`)}>
                Düzenle
              </button>
              {f.status === 'draft' && (
                <button
                  type="button"
                  className="btn btn--success btn--sm"
                  onClick={() => complete(f)}
                >
                  Tamamla
                </button>
              )}
              <button
                type="button"
                className="btn btn--ghost btn--sm"
                onClick={() => guarded(() => exportFormJson(f), 'JSON oluşturulamadı.')}
              >
                JSON
              </button>
              <button
                type="button"
                className="btn btn--ghost btn--sm"
                onClick={() => guarded(() => exportFormsExcel([f]), 'Excel oluşturulamadı.')}
              >
                Excel
              </button>
              <button type="button" className="btn btn--ghost btn--sm btn--delete" onClick={() => setToDelete(f)}>
                Sil
              </button>
            </div>
          </article>
        ))}
      </main>

      <ConfirmDialog
        open={toDelete !== null}
        title="Form silinsin mi?"
        message={`${toDelete?.formNo ?? 'Bu form'} ve fotoğrafları cihazdan kalıcı olarak silinecek. Bu işlem geri alınamaz.`}
        confirmLabel="Evet, sil"
        danger
        onCancel={() => setToDelete(null)}
        onConfirm={async () => {
          const target = toDelete;
          setToDelete(null);
          if (!target) return;
          await guarded(async () => {
            await deleteForm(target.id);
            showToast('Form silindi.', 'success');
            await refresh();
          }, 'Form silinemedi.');
        }}
      />
    </div>
  );
}
