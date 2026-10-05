import type { ReactNode } from 'react';

interface SectionProps {
  id: string;
  number: number;
  title: string;
  hint?: string;
  children: ReactNode;
}

export function Section({ id, number, title, hint, children }: SectionProps) {
  return (
    <section id={id} className="section" data-section aria-labelledby={`${id}-title`}>
      <header className="section__head">
        <span className="section__num" aria-hidden="true">
          {number}
        </span>
        <div>
          <h2 id={`${id}-title`} className="section__title">
            {title}
          </h2>
          {hint && <p className="section__hint">{hint}</p>}
        </div>
      </header>
      <div className="section__body">{children}</div>
    </section>
  );
}
