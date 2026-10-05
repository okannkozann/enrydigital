import { useRef, useState } from 'react';
import { PhotoThumb } from '../components/PhotoThumb';
import { Section } from '../components/Section';
import { deletePhotoBlob, savePhotoBlob } from '../database/photoRepository';
import { MAX_PHOTOS_PER_FORM, compressPhoto } from '../services/photoService';
import type { PhotoMeta } from '../types/form';
import { uid } from '../utils/id';
import { showToast } from '../utils/toast';
import type { SectionProps } from './types';

export function PhotosSection({ form, update }: SectionProps) {
  const cameraRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const count = form.photos.length;
  const full = count >= MAX_PHOTOS_PER_FORM;

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const room = MAX_PHOTOS_PER_FORM - count;
    const selected = Array.from(files).slice(0, room);
    if (files.length > room) {
      showToast(`En fazla ${MAX_PHOTOS_PER_FORM} fotoğraf eklenebilir.`, 'info');
    }
    setBusy(true);
    const added: PhotoMeta[] = [];
    try {
      for (const file of selected) {
        const { blob, width, height } = await compressPhoto(file);
        const id = uid();
        await savePhotoBlob(id, form.id, blob);
        added.push({
          id,
          formId: form.id,
          name: file.name || `foto-${id.slice(0, 6)}.jpg`,
          mimeType: blob.type,
          size: blob.size,
          width,
          height,
          capturedAt: new Date().toISOString(),
          gps: null,
          capturedBy: null,
        });
      }
    } catch {
      showToast('Fotoğraf eklenemedi. Lütfen tekrar deneyin.', 'error');
    } finally {
      if (added.length) update((f) => ({ ...f, photos: [...f.photos, ...added] }));
      setBusy(false);
      if (cameraRef.current) cameraRef.current.value = '';
      if (galleryRef.current) galleryRef.current.value = '';
    }
  };

  const remove = async (id: string) => {
    update((f) => ({ ...f, photos: f.photos.filter((p) => p.id !== id) }));
    await deletePhotoBlob(id);
  };

  return (
    <Section id="photos" number={5} title="Fotoğraflar" hint={`${count} / ${MAX_PHOTOS_PER_FORM} fotoğraf. Fotoğraflar otomatik sıkıştırılır.`}>
      <div className="photo-actions">
        <button type="button" className="btn btn--add" disabled={full || busy} onClick={() => cameraRef.current?.click()}>
          <span aria-hidden="true">📷</span> Fotoğraf Çek
        </button>
        <button type="button" className="btn btn--add" disabled={full || busy} onClick={() => galleryRef.current?.click()}>
          <span aria-hidden="true">+</span> Galeriden Ekle
        </button>
        <input
          ref={cameraRef}
          type="file"
          accept="image/*"
          capture="environment"
          hidden
          onChange={(e) => void handleFiles(e.target.files)}
        />
        <input
          ref={galleryRef}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={(e) => void handleFiles(e.target.files)}
        />
      </div>
      {busy && <p className="muted">Fotoğraf işleniyor…</p>}
      {count === 0 && !busy && <p className="empty">Henüz fotoğraf eklenmedi.</p>}

      <ul className="photos">
        {form.photos.map((p, i) => (
          <li key={p.id} className="photo">
            <PhotoThumb photoId={p.id} alt={`Fotoğraf ${i + 1}`} onOpen={setPreview} />
            <button
              type="button"
              className="photo__delete"
              onClick={() => void remove(p.id)}
              aria-label={`Fotoğraf ${i + 1} sil`}
            >
              ✕
            </button>
            <span className="photo__size">{(p.size / 1024).toFixed(0)} KB</span>
          </li>
        ))}
      </ul>

      {preview && (
        <div className="dialog-backdrop" onClick={() => setPreview(null)}>
          <img className="lightbox" src={preview} alt="Fotoğraf önizleme" />
        </div>
      )}
    </Section>
  );
}
