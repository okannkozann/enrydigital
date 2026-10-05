import { useEffect } from 'react';
import { OfflineBanner } from './components/OfflineBanner';
import { ToastHost } from './components/ToastHost';
import { requestPersistentStorage } from './database/db';
import { useRoute } from './hooks/useRoute';
import { FormEditorPage } from './pages/FormEditorPage';
import { FormListPage } from './pages/FormListPage';
import { HomePage } from './pages/HomePage';

export default function App() {
  const route = useRoute();

  useEffect(() => {
    void requestPersistentStorage();
  }, []);

  return (
    <>
      <OfflineBanner />
      {route.name === 'home' && <HomePage />}
      {route.name === 'forms' && <FormListPage />}
      {/* key: her form için editör durumu sıfırdan başlar */}
      {route.name === 'form' && (
        <FormEditorPage key={route.id} id={route.id} autoPreview={route.preview} />
      )}
      <ToastHost />
    </>
  );
}
