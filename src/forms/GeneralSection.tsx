import { Section } from '../components/Section';
import { TextField } from '../components/fields';
import type { GeneralInfo } from '../types/form';
import type { SectionProps } from './types';

export function GeneralSection({ form, update, errors }: SectionProps) {
  const g = form.general;
  const set = (key: keyof GeneralInfo) => (v: string) =>
    update((f) => ({ ...f, general: { ...f.general, [key]: v } }));
  const err = (key: keyof GeneralInfo) => errors[`general.${key}`];

  return (
    <Section id="general" number={1} title="Genel Bilgiler" hint="* ile işaretli alanlar zorunludur.">
      <div className="grid grid--compact">
        <TextField label="Tarih" type="date" required value={g.date} onChange={set('date')} error={err('date')} />
        <TextField label="Bölge" required value={g.region} onChange={set('region')} error={err('region')} />
        <TextField label="Sektör" value={g.sector} onChange={set('sector')} />
        <TextField label="İl" required value={g.province} onChange={set('province')} error={err('province')} />
        <TextField label="İlçe" required value={g.district} onChange={set('district')} error={err('district')} />
        <TextField label="Mahalle" required value={g.neighborhood} onChange={set('neighborhood')} error={err('neighborhood')} />
        <TextField
          label="Cadde / Sokak"
          required
          className="grid__col-span-2"
          value={g.street}
          onChange={set('street')}
          error={err('street')}
        />
        <TextField label="Bina / No" value={g.buildingNo} onChange={set('buildingNo')} />
        <TextField label="Bağlantı Nesnesi" className="grid__col-span-2" value={g.connectionObject} onChange={set('connectionObject')} />
      </div>
    </Section>
  );
}
