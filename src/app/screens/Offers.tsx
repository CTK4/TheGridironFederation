import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useSave } from '../context/SaveProvider';
import { TopHeader } from '../components/TopHeader';
import { getTeam, getTeamAbbrev, getTeamDisplayName, getTeamLogoPath } from '../data/leagueAdapter';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { Button } from '../components/ui/button';
import { CheckCircle2 } from 'lucide-react';

interface Offer {
  teamId: string;
  years: number;
  salary: number;
}

const OFFERS: Offer[] = [
  { teamId: 'BIRMINGHAM_VULCANS', years: 5, salary: 7500000 },
  { teamId: 'MILWAUKEE_NORTHSHORE', years: 4, salary: 4500000 },
  { teamId: 'ATLANTA_APEX', years: 4, salary: 6000000 },
];

export function Offers() {
  const navigate = useNavigate();
  const { setSave } = useSave();
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);

  const handleAcceptOffer = () => {
    if (!selectedTeamId) {
      alert('Please select a team first');
      return;
    }

    setSave((prev) => ({
      ...prev,
      userTeamId: selectedTeamId,
    }));

    navigate('/');
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <TopHeader title="Contract Offers" showBack={false} />

      <div className="p-4">
        <div className="rounded-2xl p-6 mb-4" style={{ backgroundColor: 'var(--bg-surface)' }}>
          <p className="text-white/80 text-sm leading-relaxed">
            All three teams have extended contract offers. Select the opportunity that best fits your vision.
          </p>
        </div>

        <div className="flex flex-col gap-3 mb-4">
          {OFFERS.map((offer) => {
            const team = getTeam(offer.teamId);
            if (!team) return null;

            const isSelected = selectedTeamId === offer.teamId;

            return (
              <button
                key={offer.teamId}
                onClick={() => setSelectedTeamId(offer.teamId)}
                className="rounded-2xl p-4 text-left transition-all"
                style={{
                  backgroundColor: isSelected ? 'var(--accent-primary)' : 'var(--bg-surface)',
                  opacity: isSelected ? 1 : 0.8,
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-4">
                    <ImageWithFallback
                      src={getTeamLogoPath(team.logoKey)}
                      alt={team.name}
                      className="w-16 h-16 object-contain"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <div className="text-lg font-bold text-white">{getTeamDisplayName(offer.teamId)}</div>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-white/80">
                          {getTeamAbbrev(offer.teamId)}
                        </span>
                      </div>
                      <div className="text-sm text-white/60">
                        {offer.years} years • ${(offer.salary / 1_000_000).toFixed(1)}M/yr
                      </div>
                    </div>
                  </div>
                  {isSelected && <CheckCircle2 className="w-6 h-6 text-white" />}
                </div>

                <div className="text-sm text-white/70">{team.stadium}</div>
              </button>
            );
          })}
        </div>

        <Button className="w-full" onClick={handleAcceptOffer} disabled={!selectedTeamId}>
          Accept Offer
        </Button>
      </div>
    </div>
  );
}
