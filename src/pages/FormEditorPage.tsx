import { useEffect, useMemo, useState } from 'react';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { FormPreview } from '../components/FormPreview';
import { StatusChip } from '../components/StatusChip';
import { GeneralSection } from '../forms/GeneralSection';
import { MaterialSection } from '../forms/MaterialSection';
import { PartiesSection } from '../forms/PartiesSection';
import { PhotosSection } from '../forms/PhotosSection';
import { SketchSection } from '../forms/SketchSection';
import { WorkSection } from '../forms/WorkSection';
import { useFormEditor, type SaveState } from '../hooks/useFormEditor';
import { navigate } from '../hooks/useRoute';
import { showToast } from '../utils/toast';
import { validateForm } from '../utils/validation';

const NAV: { id: string; label: string }[] = [
  { id: 'general', label: 'Genel' },
  { id: 'sketch', label: 'Kroki' },
  { id: 'work', label: 'İşçilik' },
  { id: 'material', label: 'Malzeme' },
  { id: 'photos', label: 'Fotoğraf' },
  { id: 'parties', label: 'Kontrol / Onay' },
];

const SAVE_LABEL: Record<SaveState, string> = {
  idle: 'Henüz kaydedilmedi',
  dirty: 'Değişiklikler kaydediliyor…',
  saving: 'Kaydediliyor…',
  saved: 'Cihaza kaydedildi',
  error: 'Kaydedilemedi!',
};

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export function FormEditorPage({ id, autoPreview = false }: { id: string; autoPreview?: boolean }) {
  const { form, saveState, update, saveNow } = useFormEditor(id);
  const [showErrors, setShowErrors] = useState(autoPreview);
  const [activeSection, setActiveSection] = useState('general');
  const [confirmDraft, setConfirmDraft] = useState(false);
  // Listeden "Tamamla" ile gelindiyse önizleme baştan açık istenir (eksik varsa gösterilmez).
  const [previewRequested, setPreviewRequested] = useState(autoPreview);
  const [confirming, setConfirming] = useState(false);

  const issues = useMemo(() => (form ? validateForm(form) : []), [form]);
  const previewOpen = previewRequested && form !== null && issues.length === 0;
  const errors = useMemo(
    () => (showErrors ? Object.fromEntries(issues.map((i) => [i.key, i.message])) : {}),
    [showErrors, issues],
  );

  // Kullanıcının hangi bölümde olduğunu üst gezinmede vurgula
  const loaded = form !== null;
  useEffect(() => {
    if (!loaded) return;
    const els = Array.from(document.querySelectorAll<HTMLElement>('[data-section]'));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveSection(visible[0].target.id);
      },
      { rootMargin: '-120px 0px -60% 0px' },
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [loaded]);

  // Önizleme açıkken arka plan sayfası kaydırılmasın
  useEffect(() => {
    if (!previewOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [previewOpen]);

  if (!form) {
    return (
      <div className="page">
        <p className="muted pad">{saveState === 'error' ? 'Form açılamadı.' : 'Form yükleniyor…'}</p>
      </div>
    );
  }

  const sectionProps = { form, update, errors };
  const isCompleted = form.status === 'completed';

  const handleSave = async () => {
    await saveNow();
    showToast('Form cihaza kaydedildi.', 'success');
  };

  /** 1. adım: doğrula ve önizlemeyi aç (henüz kayıt/tamamlama yok). */
  const handleComplete = () => {
    setShowErrors(true);
    if (issues.length > 0) {
      showToast(`${issues.length} eksik alan var. Lütfen kontrol edin.`, 'error');
      scrollToSection(issues[0].section);
      return;
    }
    setPreviewRequested(true);
  };

  /** 2. adım: kullanıcı onayladı; Tamamlandı olarak kaydet. */
  const handleConfirm = async () => {
    setConfirming(true);
    try {
      update((f) => ({ ...f, status: 'completed', completedAt: new Date().toISOString() }));
      await saveNow();
      setPreviewRequested(false);
      showToast('Form onaylandı ve kaydedildi.', 'success');
      navigate('/forms');
    } catch {
      showToast('Form kaydedilemedi. Lütfen tekrar deneyin.', 'error');
    } finally {
      setConfirming(false);
    }
  };

  const closePreview = () => {
    setPreviewRequested(false);
    if (autoPreview) navigate(`/form/${form.id}`, true);
  };

  const handleBackToDraft = async () => {
    setConfirmDraft(false);
    update((f) => ({ ...f, status: 'draft', completedAt: null }));
    await saveNow();
    showToast('Form taslağa alındı.', 'info');
  };

  return (
    <div className="page editor">
      <header className="editor__header">
        <button
          type="button"
          className="btn btn--ghost btn--sm"
          onClick={() => navigate('/forms')}
          aria-label="Kayıtlı formlara dön"
        >
          ← Formlar
        </button>
        <div className="editor__title">
          <h1>{form.formNo ?? 'Yeni İmalat Formu'}</h1>
          <span className={`save-state save-state--${saveState}`}>{SAVE_LABEL[saveState]}</span>
        </div>
        <StatusChip status={form.status} />
      </header>

      <nav className="section-nav" aria-label="Form bölümleri">
        {NAV.map((n, i) => (
          <button
            key={n.id}
            type="button"
            className={`section-nav__item${activeSection === n.id ? ' is-active' : ''}`}
            onClick={() => scrollToSection(n.id)}
          >
            <span className="section-nav__num">{i + 1}</span>
            {n.label}
          </button>
        ))}
      </nav>

      {showErrors && issues.length > 0 && (
        <div className="error-summary" role="alert">
          <strong>Formu tamamlamak için eksikler:</strong>
          <ul>
            {issues.map((i) => (
              <li key={i.key + i.message}>
                <button type="button" className="link" onClick={() => scrollToSection(i.section)}>
                  {i.message}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <main className="editor__body">
        <GeneralSection {...sectionProps} />
        <SketchSection {...sectionProps} />
        <WorkSection {...sectionProps} />
        <MaterialSection {...sectionProps} />
        <PhotosSection {...sectionProps} />
        <PartiesSection {...sectionProps} />
      </main>

      <footer className="action-bar">
        <button type="button" className="btn btn--outline btn--lg" onClick={() => void handleSave()}>
          {isCompleted ? 'Kaydet' : 'Taslak Kaydet'}
        </button>
        {isCompleted ? (
          <button type="button" className="btn btn--ghost btn--lg" onClick={() => setConfirmDraft(true)}>
            Taslağa Al
          </button>
        ) : (
          <button type="button" className="btn btn--success btn--lg" onClick={handleComplete}>
            Formu Tamamla
          </button>
        )}
      </footer>

      <ConfirmDialog
        open={confirmDraft}
        title="Taslağa alınsın mı?"
        message="Form tekrar “Taslak” durumuna geçecek ve düzenlemeye devam edebileceksiniz."
        confirmLabel="Taslağa Al"
        onCancel={() => setConfirmDraft(false)}
        onConfirm={() => void handleBackToDraft()}
      />

      {previewOpen && (
        <div className="preview" role="dialog" aria-modal="true" aria-label="Form önizleme ve onay">
          <header className="preview__bar">
            <span className="preview__badge">TASLAK ÖNİZLEME</span>
            <p>Formu kontrol edin. Onaylamadan kayıt tamamlanmaz.</p>
          </header>
          <div className="preview__scroll">
            <div className="preview__head">
              <h2>İmalat Formu</h2>
              <span>{form.formNo ?? 'Yeni form'}</span>
            </div>
            <FormPreview form={form} />
          </div>
          <footer className="action-bar preview__actions">
            <button type="button" className="btn btn--outline btn--lg" disabled={confirming} onClick={closePreview}>
              Düzenlemeye Dön
            </button>
            <button
              type="button"
              className="btn btn--success btn--lg"
              disabled={confirming}
              onClick={() => void handleConfirm()}
            >
              {confirming ? 'Kaydediliyor…' : 'Onayla ve Kaydet'}
            </button>
          </footer>
        </div>
      )}
    </div>
  );
}
