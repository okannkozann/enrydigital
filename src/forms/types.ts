import type { ImalatForm } from '../types/form';

export interface SectionProps {
  form: ImalatForm;
  update: (fn: (f: ImalatForm) => ImalatForm) => void;
  /** Alan anahtarı → hata mesajı (yalnızca doğrulama gösteriliyorsa dolu). */
  errors: Record<string, string>;
}
