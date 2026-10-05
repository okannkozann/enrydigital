import { useState } from 'react';
import { Section } from '../components/Section';
import { TextField } from '../components/fields';
import type { PartyInfo, Parties } from '../types/form';
import type { SectionProps } from './types';

const PARTIES: { key: keyof Parties; title: string; defaultRole: string; statement: string }[] = [
  {
    key: 'contractor',
    title: 'Yüklenici',
    defaultRole: 'Yüklenici Yetkilisi',
    statement:
      'Sahada gerçekleştirilen doğal gaz altyapı imalatlarının projesine, fen ve sanat kurallarına uygun olarak yapıldığını beyan ve onaylarım.',
  },
  {
    key: 'inspector',
    title: 'Kontrol',
    defaultRole: 'Kontrol Mühendisi / Teknik Eleman',
    statement:
      'Yapılan imalatların yerinde yapılan kontrolleri neticesinde yürürlükteki şartname, standart ve projelere uygun olarak tamamlandığını onaylarım.',
  },
  {
    key: 'receiver',
    title: 'Dağıtım Şirketi / Teslim Alan',
    defaultRole: 'Dağıtım Şirketi Yetkilisi',
    statement:
      'İmalatı tamamlanan hatların gerekli test ve kontrolleri yapılarak dağıtım şirketi adına teslim alındığını onaylarım.',
  },
];

export function PartiesSection({ form, update }: SectionProps) {
  const [modalKey, setModalKey] = useState<keyof Parties | null>(null);

  const patch = (key: keyof Parties, p: Partial<PartyInfo>) =>
    update((f) => ({ ...f, parties: { ...f.parties, [key]: { ...f.parties[key], ...p } } }));

  const activePartyConfig = PARTIES.find((item) => item.key === modalKey);
  const activePartyData = modalKey ? form.parties[modalKey] : null;

  const handleApprove = (key: keyof Parties) => {
    const now = new Date();
    const timeStr = `${now.toLocaleDateString('tr-TR')} ${now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}`;
    patch(key, {
      approved: true,
      approvedAt: timeStr,
    });
    setModalKey(null);
  };

  const handleRevoke = (key: keyof Parties) => {
    patch(key, {
      approved: false,
      approvedAt: null,
    });
    setModalKey(null);
  };

  return (
    <Section
      id="parties"
      number={6}
      title="Yüklenici / Kontrol ve Onay"
      hint="İsim ve soyisim girdikten sonra ilgili taraf için Onayla butonuna basarak onaylama işlemini gerçekleştirin."
    >
      <div className="parties">
        {PARTIES.map(({ key, title }) => {
          const p = form.parties[key];
          const isApproved = !!p.approved;

          return (
            <fieldset key={key} className={`party${isApproved ? ' party--approved' : ''}`}>
              <legend className="party__title">
                {title}
                {isApproved && <span className="party__badge">✓ Onaylandı</span>}
              </legend>

              <div className="party__form">
                <div className="grid grid--party">
                  <TextField
                    label="İsim"
                    placeholder="Adı"
                    value={p.firstName}
                    onChange={(v) => patch(key, { firstName: v })}
                  />
                  <TextField
                    label="Soyisim"
                    placeholder="Soyadı"
                    value={p.lastName}
                    onChange={(v) => patch(key, { lastName: v })}
                  />
                </div>

                {/* Not kısmının yerine onay butonu */}
                <div className="party__action">
                  <button
                    type="button"
                    className={`btn ${isApproved ? 'btn--success' : 'btn--outline'} btn--sm party-btn`}
                    onClick={() => setModalKey(key)}
                  >
                    {isApproved ? (
                      <>
                        <span aria-hidden="true">✓</span> Onaylandı
                        {p.approvedAt && <small className="party-btn__time">({p.approvedAt})</small>}
                      </>
                    ) : (
                      <>
                        <span aria-hidden="true">✍</span> Onayla
                      </>
                    )}
                  </button>
                </div>
              </div>
            </fieldset>
          );
        })}
      </div>

      {/* Onay Popup Modalı */}
      {modalKey && activePartyConfig && activePartyData && (
        <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-title">
          <div className="modal-card">
            <header className="modal-card__head">
              <h3 id="modal-title" className="modal-card__title">
                {activePartyConfig.title} Onayı
              </h3>
              <button
                type="button"
                className="btn-close"
                onClick={() => setModalKey(null)}
                aria-label="Kapat"
              >
                ✕
              </button>
            </header>

            <div className="modal-card__body">
              <div className="approval-person">
                <span className="approval-person__label">Onaylayan Yetkili:</span>
                <strong className="approval-person__name">
                  {`${activePartyData.firstName} ${activePartyData.lastName}`.trim() || (
                    <span className="text-warning">İsim ve soyisim henüz girilmedi</span>
                  )}
                </strong>
              </div>

              <div className="approval-statement">
                <p>{activePartyConfig.statement}</p>
              </div>

              <TextField
                label="Onay Notu / Açıklama (İsteğe bağlı)"
                placeholder="Varsa onay notunuzu yazabilirsiniz..."
                value={activePartyData.note}
                onChange={(note) => patch(modalKey, { note })}
              />

              {activePartyData.approved && activePartyData.approvedAt && (
                <div className="approval-status-info">
                  <span>Onay Zamanı: <strong>{activePartyData.approvedAt}</strong></span>
                </div>
              )}
            </div>

            <footer className="modal-card__foot">
              {activePartyData.approved ? (
                <>
                  <button
                    type="button"
                    className="btn btn--danger btn--sm"
                    onClick={() => handleRevoke(modalKey)}
                  >
                    Onayı Kaldır
                  </button>
                  <button
                    type="button"
                    className="btn btn--primary btn--sm"
                    onClick={() => setModalKey(null)}
                  >
                    Tamam
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    className="btn btn--outline btn--sm"
                    onClick={() => setModalKey(null)}
                  >
                    Vazgeç
                  </button>
                  <button
                    type="button"
                    className="btn btn--success btn--sm"
                    onClick={() => handleApprove(modalKey)}
                  >
                    ✓ Onayla ve İmzala
                  </button>
                </>
              )}
            </footer>
          </div>
        </div>
      )}
    </Section>
  );
}
