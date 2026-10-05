import { useToasts } from '../utils/toast';

export function ToastHost() {
  const toasts = useToasts();
  return (
    <div className="toast-host" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast--${t.kind}`} role="status">
          {t.text}
        </div>
      ))}
    </div>
  );
}
