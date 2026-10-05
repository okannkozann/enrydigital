import { useOnlineStatus } from '../hooks/useOnlineStatus';

export function OfflineBanner() {
  const online = useOnlineStatus();
  if (online) return null;
  return (
    <div className="offline-banner" role="status">
      <span className="offline-banner__dot" aria-hidden="true" />
      Offline – Veriler cihazda saklanıyor.
    </div>
  );
}
