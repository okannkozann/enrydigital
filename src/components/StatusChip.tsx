import type { FormStatus } from '../types/form';

export function StatusChip({ status }: { status: FormStatus }) {
  return (
    <span className={`chip chip--${status}`}>
      {status === 'completed' ? 'Tamamlandı' : 'Taslak'}
    </span>
  );
}
