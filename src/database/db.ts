import { openDB, type DBSchema, type IDBPDatabase } from 'idb';
import type { ImalatForm } from '../types/form';

export interface PhotoBlobRecord {
  id: string;
  formId: string;
  blob: Blob;
}

interface ImalatDB extends DBSchema {
  forms: {
    key: string;
    value: ImalatForm;
    indexes: { 'by-updated': string; 'by-status': string };
  };
  photos: {
    key: string;
    value: PhotoBlobRecord;
    indexes: { 'by-form': string };
  };
  meta: {
    key: string;
    value: number;
  };
}

export type AppDB = IDBPDatabase<ImalatDB>;

const DB_NAME = 'imalat-formu-db';
const DB_VERSION = 1;

let dbPromise: Promise<AppDB> | null = null;

/** Tek bir bağlantıyı paylaşır. Şema değişikliklerinde DB_VERSION artırılıp upgrade eklenir. */
export function getDb(): Promise<AppDB> {
  if (!dbPromise) {
    dbPromise = openDB<ImalatDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        const forms = db.createObjectStore('forms', { keyPath: 'id' });
        forms.createIndex('by-updated', 'updatedAt');
        forms.createIndex('by-status', 'status');

        const photos = db.createObjectStore('photos', { keyPath: 'id' });
        photos.createIndex('by-form', 'formId');

        db.createObjectStore('meta');
      },
    });
  }
  return dbPromise;
}

/** Tarayıcının veriyi otomatik silmesini azaltmak için kalıcı depolama ister. */
export async function requestPersistentStorage(): Promise<void> {
  try {
    if (navigator.storage?.persist) await navigator.storage.persist();
  } catch {
    /* sessizce geç */
  }
}
