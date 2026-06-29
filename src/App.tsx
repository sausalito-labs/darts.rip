import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ComingSoonPage } from '@/pages/coming-soon-page';
import { ModePage } from '@/pages/mode-page';
import { ModeSelectPage } from '@/pages/mode-select-page';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ModeSelectPage />} />
        <Route path="/count-up" element={<ModePage modeId="count-up" />} />
        <Route path="/count-down" element={<ModePage modeId="count-down" />} />
        <Route path="/cutthroat" element={<ComingSoonPage modeId="cutthroat" />} />
        <Route path="/killer" element={<ComingSoonPage modeId="killer" />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
