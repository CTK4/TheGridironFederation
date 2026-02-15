import { TopHeader } from '../components/TopHeader';
import { useSave } from '../context/SaveProvider';

type Coordinator = 'oc' | 'dc' | 'stc';

const labels: Record<Coordinator, string> = {
  oc: 'Offensive Coordinator',
  dc: 'Defensive Coordinator',
  stc: 'Special Teams Coordinator',
};

export function Staff() {
  const { save, setSave } = useSave();

  const setPlan = (slot: Coordinator, value: 'hire' | 'delegate') => {
    setSave((prev) => ({
      ...prev,
      staffPlan: {
        ...prev.staffPlan,
        [slot]: value,
      },
    }));
  };

  const allDecided = (['oc', 'dc', 'stc'] as Coordinator[]).every((slot) => Boolean(save.staffPlan[slot]));

  const finalizeBuild = () => {
    if (!allDecided) return;
    setSave((prev) => ({
      ...prev,
      flags: {
        ...prev.flags,
        staffBuilt: true,
      },
      news: [
        {
          id: `news_staff_build_${Date.now()}`,
          headline: 'Staff Build Completed',
          description: 'You finalized OC/DC/STC responsibilities. Strategy Meeting is now unlocked.',
          timestamp: 'Just now',
          cta: 'Open Hub',
        },
        ...prev.news,
      ],
    }));
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <TopHeader title="Staff Build" />

      <div className="flex flex-col gap-4 p-4">
        {(['oc', 'dc', 'stc'] as Coordinator[]).map((slot) => (
          <div key={slot} className="rounded-2xl p-4" style={{ backgroundColor: 'var(--bg-surface)' }}>
            <div className="text-white font-semibold mb-3">{labels[slot]}</div>
            <div className="grid grid-cols-2 gap-2">
              <ChoiceButton label="Hire" active={save.staffPlan[slot] === 'hire'} onClick={() => setPlan(slot, 'hire')} />
              <ChoiceButton label="Delegate" active={save.staffPlan[slot] === 'delegate'} onClick={() => setPlan(slot, 'delegate')} />
            </div>
          </div>
        ))}

        <button
          onClick={finalizeBuild}
          disabled={!allDecided || save.flags.staffBuilt}
          className="w-full py-3 rounded-xl text-white font-semibold disabled:opacity-50"
          style={{ backgroundColor: 'var(--accent-primary)' }}
        >
          {save.flags.staffBuilt ? 'Staff Build Complete' : 'Finalize Staff Build'}
        </button>
      </div>
    </div>
  );
}

function ChoiceButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="py-2 rounded-lg text-sm font-medium"
      style={{
        backgroundColor: active ? 'var(--accent-primary)' : '#0B0F16',
        color: 'white',
      }}
    >
      {label}
    </button>
  );
}
