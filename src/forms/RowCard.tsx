import type { ReactNode } from 'react';

interface RowCardProps {
  title: string;
  onDelete: () => void;
  variant: 'work' | 'pavement' | 'material';
  hasError?: boolean;
  errorText?: string;
  children: ReactNode;
}

/** Dinamik satır: masaüstünde tablo benzeri yatay ızgara, mobilde kart. */
export function RowCard({ title, onDelete, variant, hasError, errorText, children }: RowCardProps) {
  return (
    <article className={`row-card${hasError ? ' row-card--error' : ''}`}>
      <header className="row-card__head">
        <h3 className="row-card__title">{title}</h3>
        <button type="button" className="btn btn--ghost btn--sm btn--delete" onClick={onDelete} aria-label={`${title} sil`}>
          Sil
        </button>
      </header>
      <div className={`row-card__grid row-card__grid--${variant}`}>{children}</div>
      {hasError && errorText && (
        <p className="field__error" role="alert">
          {errorText}
        </p>
      )}
    </article>
  );
}

interface AddRowButtonProps {
  label: string;
  onClick: () => void;
}

export function AddRowButton({ label, onClick }: AddRowButtonProps) {
  return (
    <button type="button" className="btn btn--add" onClick={onClick}>
      <span aria-hidden="true">+</span> {label}
    </button>
  );
}
