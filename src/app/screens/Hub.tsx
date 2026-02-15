import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { TopHeader } from '../components/TopHeader';
import { NewsCard } from '../components/NewsCard';
import { useSave } from '../context/SaveProvider';
import { selectHubViewModel } from '../selectors/selectHubViewModel';
import { advanceTimeline } from '../engine/offseason';

export function Hub() {
  const navigate = useNavigate();
  const { save, setSave } = useSave();
  const vm = selectHubViewModel(save);

  const canAdvance =
    (save.timeline.currentStep !== 'STAFF_BUILD' || save.flags.staffBuilt) &&
    (save.timeline.currentStep !== 'ORG_STRATEGY_MEETING' || save.flags.orgMeetingDone);

  const handleAdvance = () => {
    setSave((prev) => advanceTimeline(prev));
  };

  return (
    <div className="min-h-screen pb-[83px]" style={{ backgroundColor: '#000000' }}>
      <TopHeader title="Hub" showBack={false} />

      <div className="flex flex-col gap-4 p-4">
        <div className="rounded-2xl p-5" style={{ backgroundColor: 'rgba(28, 28, 30, 1)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <div className="text-xs text-white/60 uppercase tracking-wide">{vm.phaseLabel}</div>
          <div className="text-xl font-bold text-white">{vm.stepLabel}</div>
          {vm.teamSummary && (
            <div className="mt-3 text-sm text-white/80">
              {vm.teamSummary.name} <span className="text-white/50">({vm.teamSummary.abbrev})</span> • {vm.teamSummary.avgOvr} OVR • {vm.teamSummary.rosterSize} players
            </div>
          )}

          <div className="grid grid-cols-1 gap-2 mt-4">
            <button
              onClick={() => navigate(vm.primaryCTA.route)}
              className="py-3 rounded-xl font-semibold text-white"
              style={{ backgroundColor: '#FF6B00' }}
            >
              {vm.primaryCTA.label}
            </button>
            <button
              onClick={handleAdvance}
              disabled={!canAdvance}
              className="py-3 rounded-xl font-semibold text-white disabled:opacity-50"
              style={{ backgroundColor: '#1f2937' }}
            >
              Advance Timeline
            </button>
          </div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-3 gap-3">
          {vm.secondaryCTAs.map((cta) => (
            <button
              key={cta.route}
              onClick={() => navigate(cta.route)}
              className="h-16 rounded-xl text-white/90 text-sm font-medium"
              style={{ backgroundColor: 'rgba(28, 28, 30, 1)' }}
            >
              {cta.label}
            </button>
          ))}
        </motion.div>

        <div className="flex flex-col gap-3">
          <h3 className="text-[17px] font-bold text-white px-1">Latest News</h3>
          {vm.news.length === 0 && <div className="text-white/60 text-sm px-1">No updates yet.</div>}
          {vm.news.map((news) => (
            <NewsCard key={news.id} news={news} />
          ))}
        </div>
      </div>
    </div>
  );
}
