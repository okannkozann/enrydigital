import { useCallback, useEffect, useRef, useState } from 'react';
import { getForm, saveForm } from '../database/formRepository';
import { createEmptyForm } from '../models/factory';
import type { ImalatForm } from '../types/form';

export type SaveState = 'idle' | 'dirty' | 'saving' | 'saved' | 'error';

const AUTOSAVE_DELAY_MS = 700;

/**
 * Formu IndexedDB'den yükler ve değişiklikleri otomatik (debounce) kaydeder.
 * Sekme gizlenince / kapanırken / sayfadan çıkılırken bekleyen değişiklikler yazılır.
 */
export function useFormEditor(id: string) {
  const [form, setForm] = useState<ImalatForm | null>(null);
  const [saveState, setSaveState] = useState<SaveState>('idle');

  const formRef = useRef<ImalatForm | null>(null);
  const dirtyRef = useRef(false);
  const timerRef = useRef<number | undefined>(undefined);
  const queueRef = useRef<Promise<void>>(Promise.resolve());

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const existing = await getForm(id);
        if (cancelled) return;
        const loaded = existing ?? createEmptyForm(id);
        formRef.current = loaded;
        setForm(loaded);
        setSaveState(existing ? 'saved' : 'idle');
      } catch {
        if (!cancelled) setSaveState('error');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const doPersist = useCallback(async () => {
    const current = formRef.current;
    if (!current || !dirtyRef.current) return;
    dirtyRef.current = false;
    setSaveState('saving');
    try {
      const saved = await saveForm(current);
      if (formRef.current) {
        formRef.current = {
          ...formRef.current,
          formNo: saved.formNo,
          updatedAt: saved.updatedAt,
        };
        setForm(formRef.current);
      }
      setSaveState(dirtyRef.current ? 'dirty' : 'saved');
    } catch {
      dirtyRef.current = true;
      setSaveState('error');
    }
  }, []);

  /** Kayıtları sıraya dizer; aynı anda iki kayıt Form No çakışması yaratmaz. */
  const persist = useCallback(() => {
    window.clearTimeout(timerRef.current);
    queueRef.current = queueRef.current.then(doPersist);
    return queueRef.current;
  }, [doPersist]);

  const update = useCallback(
    (fn: (f: ImalatForm) => ImalatForm) => {
      if (!formRef.current) return;
      const next = fn(formRef.current);
      formRef.current = next;
      dirtyRef.current = true;
      setForm(next);
      setSaveState('dirty');
      window.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => {
        void persist();
      }, AUTOSAVE_DELAY_MS);
    },
    [persist],
  );

  /** Manuel kaydet: değişiklik olmasa da zaman damgasını günceller. */
  const saveNow = useCallback(async () => {
    dirtyRef.current = true;
    await persist();
  }, [persist]);

  useEffect(() => {
    const flush = () => {
      void persist();
    };
    const onVisibility = () => {
      if (document.visibilityState === 'hidden') flush();
    };
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('pagehide', flush);
    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('pagehide', flush);
      flush();
    };
  }, [persist]);

  return { form, saveState, update, saveNow };
}
