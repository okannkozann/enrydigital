import { useSyncExternalStore } from 'react';

export type Route =
  | { name: 'home' }
  | { name: 'forms' }
  | { name: 'form'; id: string; preview: boolean };

function subscribe(cb: () => void) {
  window.addEventListener('hashchange', cb);
  return () => window.removeEventListener('hashchange', cb);
}

function getSnapshot() {
  return window.location.hash || '#/';
}

export function parseHash(hash: string): Route {
  const path = hash.replace(/^#/, '') || '/';
  const parts = path.split('/').filter(Boolean);
  if (parts[0] === 'forms') return { name: 'forms' };
  if (parts[0] === 'form' && parts[1]) {
    return { name: 'form', id: decodeURIComponent(parts[1]), preview: parts[2] === 'preview' };
  }
  return { name: 'home' };
}

export function navigate(path: string, replace = false) {
  if (replace) {
    window.location.replace(`#${path}`);
  } else {
    window.location.hash = path;
  }
}

/** Bağımlılıksız, hash tabanlı yönlendirme (PWA/offline için sunucu ayarı gerektirmez). */
export function useRoute(): Route {
  const hash = useSyncExternalStore(subscribe, getSnapshot);
  return parseHash(hash);
}
