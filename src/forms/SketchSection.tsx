import { Section } from '../components/Section';
import { SketchPad } from '../components/SketchPad';
import type { SectionProps } from './types';

export function SketchSection({ form, update }: SectionProps) {
  return (
    <Section
      id="sketch"
      number={2}
      title="İmalat / Kroki"
      hint="Parmağınız veya kalemle çizin. Ölçü eklemek için “Ölçü / Yazı” aracını kullanın."
    >
      <SketchPad value={form.sketch} onChange={(sketch) => update((f) => ({ ...f, sketch }))} />
    </Section>
  );
}
