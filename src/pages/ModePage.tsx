import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlayerSetup } from '@/components/PlayerSetup';
import { CountDownRulesForm } from '@/components/rules/CountDownRulesForm';
import { CountUpRulesForm } from '@/components/rules/CountUpRulesForm';
import { ScoreScreen } from '@/components/scoring/ScoreScreen';
import { getMode } from '@/game-engine/registry';
import { useGameStore } from '@/store/gameStore';

interface ModePageProps {
  modeId: string;
}

export function ModePage({ modeId }: ModePageProps) {
  const navigate = useNavigate();
  const storeModeId = useGameStore((s) => s.currentModeId);
  const selectMode = useGameStore((s) => s.selectMode);
  const step = useGameStore((s) => s.currentStep);

  useEffect(() => {
    if (storeModeId !== modeId) {
      const mode = getMode(modeId);
      if (!mode?.available) {
        navigate('/');
        return;
      }
      selectMode(modeId);
    }
  }, [modeId, navigate, selectMode, storeModeId]);

  const mode = getMode(modeId);
  if (!mode) return null;

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      {step === 'rules' && (
        <>
          {modeId === 'count-up' && <CountUpRulesForm />}
          {modeId === 'count-down' && <CountDownRulesForm />}
        </>
      )}
      {step === 'players' && <PlayerSetup />}
      {step === 'play' && <ScoreScreen />}
    </div>
  );
}
