import { useEffect, useState } from 'react';
import { countForms } from '../database/formRepository';
import { navigate } from '../hooks/useRoute';
import { uid } from '../utils/id';

export function HomePage() {
  const [counts, setCounts] = useState<{ total: number; draft: number; completed: number } | null>(null);

  useEffect(() => {
    let cancelled = false;
    countForms()
      .then((c) => !cancelled && setCounts(c))
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="page page--home">
      <header className="brand">
        <div className="brand__logo" aria-hidden="true">
          İF
        </div>
        <div>
          <h1 className="brand__title">Dijital İmalat Formu</h1>
          <p className="brand__sub">Saha veri girişi · Doğal gaz altyapı imalatı</p>
        </div>
      </header>

      <main className="home-actions">
        <button
          type="button"
          className="home-tile home-tile--primary"
          onClick={() => navigate(`/form/${uid()}`)}
        >
          <span className="home-tile__icon" aria-hidden="true">
            ＋
          </span>
          <span className="home-tile__text">
            <strong>Yeni İmalat Formu</strong>
            <small>Boş bir form oluştur</small>
          </span>
        </button>

        <button type="button" className="home-tile" onClick={() => navigate('/forms')}>
          <span className="home-tile__icon" aria-hidden="true">
            ☰
          </span>
          <span className="home-tile__text">
            <strong>Kayıtlı Formlar</strong>
            <small>
              {counts === null
                ? 'Yükleniyor…'
                : counts.total === 0
                  ? 'Henüz kayıtlı form yok'
                  : `${counts.draft} taslak · ${counts.completed} tamamlandı`}
            </small>
          </span>
          {counts && counts.total > 0 && <span className="home-tile__badge">{counts.total}</span>}
        </button>
      </main>

      <footer className="home-foot">Veriler bu cihazda saklanır ve internet olmadan da çalışır.</footer>
    </div>
  );
}
