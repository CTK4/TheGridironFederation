import { SaveData } from '../context/SaveProvider';
import { getStepLabel } from '../engine/offseason';
import { getRoster, getTeamAbbrev, getTeamDisplayName } from '../data/leagueAdapter';

interface CTA {
  label: string;
  route: string;
}

export interface HubViewModel {
  phaseLabel: string;
  stepLabel: string;
  primaryCTA: CTA;
  secondaryCTAs: CTA[];
  teamSummary: {
    name: string;
    abbrev: string;
    avgOvr: number;
    rosterSize: number;
  } | null;
  news: SaveData['news'];
}

function toPhaseLabel(phase: string): string {
  if (phase === 'regular_season') return 'Regular Season';
  return 'Offseason 2026';
}

export function selectHubViewModel(save: SaveData): HubViewModel {
  const teamId = save.userTeamId;
  const roster = teamId ? getRoster(teamId) : [];
  const avgOvr = roster.length > 0 ? Math.round(roster.reduce((sum, p) => sum + p.ovr, 0) / roster.length) : 0;

  const teamSummary = teamId
    ? {
        name: getTeamDisplayName(teamId),
        abbrev: getTeamAbbrev(teamId),
        avgOvr,
        rosterSize: roster.length,
      }
    : null;

  const step = save.timeline.currentStep;

  const primaryCTA: CTA =
    step === 'STAFF_BUILD'
      ? { label: 'Build Your Staff', route: '/staff' }
      : step === 'ORG_STRATEGY_MEETING'
        ? { label: 'Run Strategy Meeting', route: '/staff-meeting' }
        : step === 'DRAFT_DAY'
          ? { label: 'Open Draft War Room', route: '/draft' }
          : { label: 'Manage Team', route: '/roster' };

  return {
    phaseLabel: toPhaseLabel(save.league.phase),
    stepLabel: getStepLabel(step),
    primaryCTA,
    secondaryCTAs: [
      { label: 'Roster', route: '/roster' },
      { label: 'Staff', route: '/staff' },
      { label: 'Draft', route: '/draft' },
    ],
    teamSummary,
    news: save.news,
  };
}
