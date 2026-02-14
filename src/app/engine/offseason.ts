import { SaveData, TimelineStep } from '../context/SaveProvider';

export const OFFSEASON_TIMELINE: TimelineStep[] = [
  'STAFF_BUILD',
  'ORG_STRATEGY_MEETING',
  'SENIOR_BOWL',
  'COMBINE',
  'FA_W1',
  'FA_W2',
  'PRE_DRAFT_VISITS',
  'DRAFT_DAY',
  'TRAINING_CAMP',
  'PRESEASON',
  'REG_SEASON',
];

const STEP_LABELS: Record<TimelineStep, string> = {
  STAFF_BUILD: 'Staff Build',
  ORG_STRATEGY_MEETING: 'Organizational Strategy Meeting',
  SENIOR_BOWL: 'Senior Bowl',
  COMBINE: 'Scouting Combine',
  FA_W1: 'Free Agency Week 1',
  FA_W2: 'Free Agency Week 2',
  PRE_DRAFT_VISITS: 'Pre-Draft Visits',
  DRAFT_DAY: 'Draft Day',
  TRAINING_CAMP: 'Training Camp',
  PRESEASON: 'Preseason',
  REG_SEASON: 'Regular Season',
};

function canAdvanceFromStep(save: SaveData, step: TimelineStep): boolean {
  if (step === 'STAFF_BUILD') {
    return save.flags.staffBuilt;
  }
  if (step === 'ORG_STRATEGY_MEETING') {
    return save.flags.orgMeetingDone;
  }
  return true;
}

export function getStepLabel(step: TimelineStep): string {
  return STEP_LABELS[step] ?? step;
}

export function advanceTimeline(save: SaveData): SaveData {
  const currentIndex = OFFSEASON_TIMELINE.indexOf(save.timeline.currentStep);
  if (currentIndex === -1) {
    return save;
  }

  const currentStep = OFFSEASON_TIMELINE[currentIndex];
  if (!canAdvanceFromStep(save, currentStep)) {
    return save;
  }

  const nextStep = OFFSEASON_TIMELINE[currentIndex + 1];
  if (!nextStep) {
    return save;
  }

  const shouldAdvanceWeek = ['FA_W1', 'FA_W2', 'PRESEASON', 'REG_SEASON'].includes(nextStep);
  const phase = nextStep === 'REG_SEASON' ? 'regular_season' : 'offseason';

  return {
    ...save,
    league: {
      ...save.league,
      phase,
      week: shouldAdvanceWeek ? save.league.week + 1 : save.league.week,
    },
    timeline: {
      ...save.timeline,
      currentStep: nextStep,
      history: save.timeline.history.includes(nextStep) ? save.timeline.history : [...save.timeline.history, nextStep],
    },
  };
}
