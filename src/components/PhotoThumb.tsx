import { useEffect, useState } from 'react';
import { getPhotoBlob } from '../database/photoRepository';

interface PhotoThumbProps {
  photoId: string;
  alt: string;
  onOpen?: (url: string) => void;
}

/** Fotoğraf Blob'unu IndexedDB'den okuyup nesne URL'siyle gösterir. */
export function PhotoThumb({ photoId, alt, onOpen }: PhotoThumbProps) {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    let revoked = false;
    let objectUrl: string | null = null;
    getPhotoBlob(photoId).then((blob) => {
      if (!blob || revoked) return;
      objectUrl = URL.createObjectURL(blob);
      setUrl(objectUrl);
    });
    return () => {
      revoked = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [photoId]);

  if (!url) return <div className="photo__placeholder" aria-hidden="true" />;
  return (
    <img
      className="photo__img"
      src={url}
      alt={alt}
      onClick={() => onOpen?.(url)}
      loading="lazy"
    />
  );
}
