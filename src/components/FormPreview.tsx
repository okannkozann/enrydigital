import { PhotoThumb } from './PhotoThumb';
import {
  MATERIAL_CATALOG,
  resolveName,
  resolveWorkItemName,
} from '../models/catalogs';
import type { ImalatForm } from '../types/form';
import { formatDateTr } from '../utils/date';
import { formatDecimal } from '../utils/number';

const dash = (v: string) => (v.trim() ? v : '—');

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="pv-row">
      <dt>{label}</dt>
      <dd>{dash(value)}</dd>
    </div>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="pv-block">
      <h3 className="pv-block__title">{title}</h3>
      {children}
    </section>
  );
}

const qty = (n: number | null, unit: string) => (n === null ? '—' : `${formatDecimal(n)} ${unit}`);

/** Formun salt okunur, kağıt forma benzer genel görünümü. */
export function FormPreview({ form }: { form: ImalatForm }) {
  const g = form.general;
  const fullName = (p: { firstName: string; lastName: string }) =>
    `${p.firstName} ${p.lastName}`.trim();

  return (
    <article className="pv">
      <Block title="1. Genel Bilgiler">
        <dl className="pv-grid">
          <Row label="Tarih" value={formatDateTr(g.date)} />
          <Row label="Bölge" value={g.region} />
          <Row label="Sektör" value={g.sector} />
          <Row label="İl" value={g.province} />
          <Row label="İlçe" value={g.district} />
          <Row label="Mahalle" value={g.neighborhood} />
          <Row label="Cadde / Sokak" value={g.street} />
          <Row label="Bina Adedi / No" value={g.buildingNo} />
          <Row label="Bağlantı Nesnesi" value={g.connectionObject} />
        </dl>
      </Block>

      <Block title="2. İmalat / Kroki">
        {form.sketch.image ? (
          <img className="pv-sketch" src={form.sketch.image} alt="Kroki" />
        ) : (
          <p className="pv-empty">Kroki çizilmedi.</p>
        )}
      </Block>

      <Block title="3. İşçilik">
        {form.workItems.length === 0 ? (
          <p className="pv-empty">Kayıt yok.</p>
        ) : (
          <div className="pv-scroll">
            <table className="pv-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>İşçilik Adı</th>
                  <th>Miktar</th>
                  <th>Geri Dolgu</th>
                  <th>Bozulan Üstyapı</th>
                </tr>
              </thead>
              <tbody>
                {form.workItems.map((w, i) => (
                  <tr key={w.id}>
                    <td>{i + 1}</td>
                    <td>{resolveWorkItemName(w)}</td>
                    <td>{qty(w.quantity, 'm')}</td>
                    <td>{w.hasBackfill ? qty(w.backfillQuantity, 'm') : '—'}</td>
                    <td>
                      {w.hasPavement
                        ? `${w.pavementType === 'parke' ? 'Parke' : 'Asfalt'} (${w.pavementLength !== null ? formatDecimal(w.pavementLength) : '—'} m × ${w.pavementWidth !== null ? formatDecimal(w.pavementWidth) : '—'} m)`
                        : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Block>

      <Block title="4. Malzeme">
        {form.materials.length === 0 ? (
          <p className="pv-empty">Kayıt yok.</p>
        ) : (
          <div className="pv-scroll">
            <table className="pv-table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Malzeme Adı</th>
                  <th>Miktar</th>
                  <th>Seri No</th>
                  <th>Ekipman No</th>
                  <th>Marka</th>
                </tr>
              </thead>
              <tbody>
                {form.materials.map((m, i) => (
                  <tr key={m.id}>
                    <td>{i + 1}</td>
                    <td>{resolveName(MATERIAL_CATALOG, m)}</td>
                    <td>{qty(m.quantity, m.unit)}</td>
                    <td>{dash(m.serialNo)}</td>
                    <td>{dash(m.equipmentNo)}</td>
                    <td>{dash(m.brand)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Block>

      <Block title={`5. Fotoğraflar (${form.photos.length})`}>
        {form.photos.length === 0 ? (
          <p className="pv-empty">Fotoğraf eklenmedi.</p>
        ) : (
          <ul className="pv-photos">
            {form.photos.map((p, i) => (
              <li key={p.id}>
                <PhotoThumb photoId={p.id} alt={`Fotoğraf ${i + 1}`} />
              </li>
            ))}
          </ul>
        )}
      </Block>

      <Block title="6. Yüklenici / Kontrol ve Onay">
        <dl className="pv-grid">
          <Row
            label="Yüklenici"
            value={`${fullName(form.parties.contractor)}${form.parties.contractor.approved ? ` (✓ Onaylandı - ${form.parties.contractor.approvedAt})` : ''}`}
          />
          {form.parties.contractor.note && <Row label="Yüklenici Notu" value={form.parties.contractor.note} />}
          <Row
            label="Kontrol"
            value={`${fullName(form.parties.inspector)}${form.parties.inspector.approved ? ` (✓ Onaylandı - ${form.parties.inspector.approvedAt})` : ''}`}
          />
          {form.parties.inspector.note && <Row label="Kontrol Notu" value={form.parties.inspector.note} />}
          <Row
            label="Dağıtım Şirketi / Teslim Alan"
            value={`${fullName(form.parties.receiver)}${form.parties.receiver.approved ? ` (✓ Onaylandı - ${form.parties.receiver.approvedAt})` : ''}`}
          />
          {form.parties.receiver.note && <Row label="Teslim Notu" value={form.parties.receiver.note} />}
        </dl>
      </Block>
    </article>
  );
}
