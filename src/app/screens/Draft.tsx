import { useEffect, useMemo, useState } from 'react';
import { TopHeader } from '../components/TopHeader';
import { OVRBadge } from '../components/OVRBadge';
import { useSave } from '../context/SaveProvider';
import { ensureDraftClass, makePick, startDraft } from '../engine/draft';

export function Draft() {
  const { save, setSave } = useSave();
  const hydratedSave = useMemo(() => ensureDraftClass(save), [save]);
  const [selectedProspectId, setSelectedProspectId] = useState<string | null>(hydratedSave.draft.board[0] ?? null);

  useEffect(() => {
    if (!save.draft.classGenerated) {
      setSave((prev) => ensureDraftClass(prev));
    }
  }, [save.draft.classGenerated, setSave]);

  const selectedProspect = hydratedSave.draft.prospects.find((p) => p.id === selectedProspectId) ?? hydratedSave.draft.prospects[0];

  const beginDraft = () => {
    setSave((prev) => startDraft(prev));
  };

  const pickPlayer = () => {
    if (!selectedProspect) return;
    setSave((prev) => makePick(prev, selectedProspect.id));
    setSelectedProspectId(null);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <TopHeader title="Draft War Room" />
      <div className="p-4 flex flex-col gap-4">
        {!save.draft.started && !save.draft.completed && (
          <button className="w-full py-3 rounded-xl text-white font-semibold" style={{ backgroundColor: 'var(--accent-primary)' }} onClick={beginDraft}>
            Start Draft
          </button>
        )}

        <div className="rounded-2xl p-4" style={{ backgroundColor: 'var(--bg-surface)' }}>
          <div className="text-white font-semibold">Pick {save.draft.currentPick}</div>
          <div className="text-sm text-white/70">Board size: {hydratedSave.draft.board.length}</div>
        </div>

        <div className="grid grid-cols-1 gap-2">
          {hydratedSave.draft.board.slice(0, 12).map((prospectId) => {
            const prospect = hydratedSave.draft.prospects.find((p) => p.id === prospectId);
            if (!prospect) return null;
            return (
              <button
                key={prospect.id}
                onClick={() => setSelectedProspectId(prospect.id)}
                className="rounded-xl p-3 text-left flex items-center gap-3"
                style={{ backgroundColor: selectedProspect?.id === prospect.id ? 'var(--accent-primary)' : 'var(--bg-surface)' }}
              >
                <OVRBadge ovr={prospect.ovr} size="small" />
                <div>
                  <div className="text-white text-sm font-semibold">{prospect.name}</div>
                  <div className="text-white/70 text-xs">{prospect.position} • {prospect.archetype}</div>
                </div>
              </button>
            );
          })}
        </div>

        <button
          onClick={pickPlayer}
          disabled={!save.draft.started || save.draft.completed || !selectedProspect}
          className="w-full py-3 rounded-xl text-white font-semibold disabled:opacity-50"
          style={{ backgroundColor: '#FF6B00' }}
        >
          {save.draft.completed ? 'Draft Complete' : 'Make Pick'}
        </button>
      </div>
    </div>
  );
}
