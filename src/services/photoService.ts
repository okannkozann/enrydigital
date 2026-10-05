export const MAX_PHOTOS_PER_FORM = 10;
const MAX_BYTES = 2 * 1024 * 1024; // hedef: ~2 MB altı
const MAX_DIMENSION = 1600;

export interface CompressedPhoto {
  blob: Blob;
  width: number;
  height: number;
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Fotoğraf okunamadı.'));
    };
    img.src = url;
  });
}

function toBlob(canvas: HTMLCanvasElement, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error('Fotoğraf sıkıştırılamadı.'))),
      'image/jpeg',
      quality,
    );
  });
}

/** Görseli yeniden boyutlandırıp JPEG olarak sıkıştırır (hedef < 2 MB). */
export async function compressPhoto(file: File): Promise<CompressedPhoto> {
  const img = await loadImage(file);
  let dim = MAX_DIMENSION;
  let quality = 0.8;

  for (let attempt = 0; attempt < 6; attempt++) {
    const scale = Math.min(1, dim / Math.max(img.naturalWidth, img.naturalHeight));
    const width = Math.max(1, Math.round(img.naturalWidth * scale));
    const height = Math.max(1, Math.round(img.naturalHeight * scale));
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Fotoğraf işlenemedi.');
    ctx.drawImage(img, 0, 0, width, height);
    const blob = await toBlob(canvas, quality);
    if (blob.size <= MAX_BYTES || attempt === 5) return { blob, width, height };
    quality = Math.max(0.5, quality - 0.1);
    dim = Math.round(dim * 0.85);
  }
  throw new Error('Fotoğraf sıkıştırılamadı.');
}
