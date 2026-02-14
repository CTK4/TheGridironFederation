import { useNavigate } from 'react-router';
import { useSave } from '../context/SaveProvider';
import { TopHeader } from '../components/TopHeader';
import { getTeam, getTeamAbbrev, getTeamDisplayName, getTeamLogoPath } from '../data/leagueAdapter';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { Button } from '../components/ui/button';
import { CheckCircle2 } from 'lucide-react';

const INTERVIEW_TEAMS = ['MILWAUKEE_NORTHSHORE', 'ATLANTA_APEX', 'BIRMINGHAM_VULCANS'];

export function Interviews() {
  const navigate = useNavigate();
  const { save, setSave } = useSave();

  const handleInterview = (teamId: string) => {
    setSave((prev) => ({
      ...prev,
      onboarding: {
        ...prev.onboarding,
        interviewsCompleted: [...prev.onboarding.interviewsCompleted, teamId],
      },
    }));
  };

  const allInterviewsCompleted = INTERVIEW_TEAMS.every((teamId) =>
    save.onboarding.interviewsCompleted.includes(teamId)
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <TopHeader title="Head Coach Interviews" showBack={false} />

      <div className="p-4">
        <div className="rounded-2xl p-6 mb-4" style={{ backgroundColor: 'var(--bg-surface)' }}>
          <p className="text-white/80 text-sm leading-relaxed">
            Three teams have expressed interest in your coaching expertise. Complete all interviews to receive contract offers.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {INTERVIEW_TEAMS.map((teamId) => {
            const team = getTeam(teamId);
            if (!team) return null;

            const isCompleted = save.onboarding.interviewsCompleted.includes(teamId);

            return (
              <div
                key={teamId}
                className="rounded-2xl p-4 flex items-center justify-between"
                style={{ backgroundColor: 'var(--bg-surface)' }}
              >
                <div className="flex items-center gap-4">
                  <ImageWithFallback
                    src={getTeamLogoPath(team.logoKey)}
                    alt={team.name}
                    className="w-16 h-16 object-contain"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="text-lg font-bold text-white">{getTeamDisplayName(teamId)}</div>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-white/80">
                        {getTeamAbbrev(teamId)}
                      </span>
                    </div>
                    <div className="text-sm text-white/60">
                      {team.stadium}
                    </div>
                  </div>
                </div>

                {isCompleted ? (
                  <CheckCircle2 className="w-6 h-6 text-white" />
                ) : (
                  <Button onClick={() => handleInterview(teamId)}>Interview</Button>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-6">
          <Button className="w-full" disabled={!allInterviewsCompleted} onClick={() => navigate('/offers')}>
            Proceed to Offers
          </Button>
        </div>
      </div>
    </div>
  );
}
