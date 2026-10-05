import type { ImalatForm } from '../types/form';
import { getDb } from './db';

/**
 * Form repository'si. UI yalnızca bu arayüzü bilir; ileride aynı fonksiyon
 * imzalarıyla IndexedDB + REST API (senkronizasyon) uygulaması eklenebilir.
 */

export async function listForms(): Promise<ImalatForm[]> {
  const db = await getDb();
  const all = await db.getAll('forms');
  return all.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function getForm(id: string): Promise<ImalatForm | undefined> {
  const db = await getDb();
  return db.get('forms', id);
}

/** Kaydeder; ilk kayıtta Form No atar. Kaydedilen formu döndürür. */
export async function saveForm(form: ImalatForm): Promise<ImalatForm> {
  const db = await getDb();
  const tx = db.transaction(['forms', 'meta'], 'readwrite');
  const saved: ImalatForm = { ...form, updatedAt: new Date().toISOString() };

  if (!saved.formNo) {
    const meta = tx.objectStore('meta');
    const next = ((await meta.get('formCounter')) ?? 0) + 1;
    await meta.put(next, 'formCounter');
    saved.formNo = `IMF-${new Date().getFullYear()}-${String(next).padStart(4, '0')}`;
  }

  await tx.objectStore('forms').put(saved);
  await tx.done;
  return saved;
}

export async function deleteForm(id: string): Promise<void> {
  const db = await getDb();
  const tx = db.transaction(['forms', 'photos'], 'readwrite');
  const photoKeys = await tx.objectStore('photos').index('by-form').getAllKeys(id);
  await Promise.all(photoKeys.map((k) => tx.objectStore('photos').delete(k)));
  await tx.objectStore('forms').delete(id);
  await tx.done;
}

export async function countForms(): Promise<{ total: number; draft: number; completed: number }> {
  const forms = await listForms();
  return {
    total: forms.length,
    draft: forms.filter((f) => f.status === 'draft').length,
    completed: forms.filter((f) => f.status === 'completed').length,
  };
}
