import { useEffect, useMemo } from 'react';
import { Section } from '../components/Section';
import { SelectField, TextField } from '../components/fields';
import {
  ANTALYA_DISTRICTS,
  ANTALYA_NEIGHBORHOODS,
  DEFAULT_PROVINCE,
} from '../data/antalyaLocations';
import type { GeneralInfo } from '../types/form';
import type { SectionProps } from './types';

export function GeneralSection({ form, update, errors }: SectionProps) {
  const g = form.general;

  // İl bilgisinin her zaman varsayılan olarak Antalya olmasını garanti altına al
  useEffect(() => {
    if (!g.province) {
      update((f) => ({
        ...f,
        general: { ...f.general, province: DEFAULT_PROVINCE },
      }));
    }
  }, [g.province, update]);

  const set = (key: keyof GeneralInfo) => (v: string) =>
    update((f) => ({ ...f, general: { ...f.general, [key]: v } }));

  // Bölge, sektör, bağlantı nesnesi için sadece rakam filtresi
  const setNumeric = (key: keyof GeneralInfo) => (v: string) => {
    const onlyDigits = v.replace(/\D/g, '');
    update((f) => ({ ...f, general: { ...f.general, [key]: onlyDigits } }));
  };

  const handleDistrictChange = (district: string) => {
    update((f) => ({
      ...f,
      general: {
        ...f.general,
        province: DEFAULT_PROVINCE,
        district,
        neighborhood: '', // İlçe değişince mahalleyi sıfırla
      },
    }));
  };

  const districtOptions = useMemo(
    () => ANTALYA_DISTRICTS.map((d) => ({ value: d, label: d })),
    [],
  );

  const neighborhoodOptions = useMemo(() => {
    if (!g.district) return [];
    const list = ANTALYA_NEIGHBORHOODS[g.district] ?? [];
    // Eğer mevcut kayıtlı mahalle listede yoksa bile seçim listesine ekle
    if (g.neighborhood && !list.includes(g.neighborhood)) {
      return [{ value: g.neighborhood, label: g.neighborhood }, ...list.map((n) => ({ value: n, label: n }))];
    }
    return list.map((n) => ({ value: n, label: n }));
  }, [g.district, g.neighborhood]);

  const err = (key: keyof GeneralInfo) => errors[`general.${key}`];

  return (
    <Section id="general" number={1} title="Genel Bilgiler" hint="* ile işaretli alanlar zorunludur.">
      <div className="grid grid--compact">
        <TextField
          label="Tarih"
          type="date"
          required
          value={g.date}
          onChange={set('date')}
          error={err('date')}
        />

        <TextField
          label="Bölge"
          required
          inputMode="numeric"
          pattern="[0-9]*"
          placeholder="Örn: 1"
          value={g.region}
          onChange={setNumeric('region')}
          error={err('region')}
        />

        <TextField
          label="Sektör"
          inputMode="numeric"
          pattern="[0-9]*"
          placeholder="Örn: 102"
          value={g.sector}
          onChange={setNumeric('sector')}
          error={err('sector')}
        />

        <SelectField
          label="İl"
          required
          value={g.province || DEFAULT_PROVINCE}
          onChange={set('province')}
          options={[{ value: DEFAULT_PROVINCE, label: DEFAULT_PROVINCE }]}
          error={err('province')}
        />

        <SelectField
          label="İlçe"
          required
          placeholder="İlçe seçiniz..."
          value={g.district}
          onChange={handleDistrictChange}
          options={districtOptions}
          error={err('district')}
        />

        <SelectField
          label="Mahalle"
          required
          placeholder={g.district ? 'Mahalle seçiniz...' : 'Önce ilçe seçiniz'}
          disabled={!g.district}
          value={g.neighborhood}
          onChange={set('neighborhood')}
          options={neighborhoodOptions}
          error={err('neighborhood')}
        />

        <TextField
          label="Cadde / Sokak"
          required
          className="grid__col-span-2"
          value={g.street}
          onChange={set('street')}
          error={err('street')}
        />

        <TextField
          label="Bina / No"
          value={g.buildingNo}
          onChange={set('buildingNo')}
        />

        <TextField
          label="Bağlantı Nesnesi"
          className="grid__col-span-2"
          inputMode="numeric"
          pattern="[0-9]*"
          placeholder="Sadece rakam (Örn: 1002345678)"
          value={g.connectionObject}
          onChange={setNumeric('connectionObject')}
          error={err('connectionObject')}
        />
      </div>
    </Section>
  );
}
