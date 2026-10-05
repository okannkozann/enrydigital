import { getDb } from './db';

export async function savePhotoBlob(id: string, formId: string, blob: Blob): Promise<void> {
  const db = await getDb();
  await db.put('photos', { id, formId, blob });
}

export async function getPhotoBlob(id: string): Promise<Blob | undefined> {
  const db = await getDb();
  return (await db.get('photos', id))?.blob;
}

export async function deletePhotoBlob(id: string): Promise<void> {
  const db = await getDb();
  await db.delete('photos', id);
}
