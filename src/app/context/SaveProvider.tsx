import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type TimelineStep =
  | 'STAFF_BUILD'
  | 'ORG_STRATEGY_MEETING'
  | 'SENIOR_BOWL'
  | 'COMBINE'
  | 'FA_W1'
  | 'FA_W2'
  | 'PRE_DRAFT_VISITS'
  | 'DRAFT_DAY'
  | 'TRAINING_CAMP'
  | 'PRESEASON'
  | 'REG_SEASON';

export interface SaveNewsItem {
  id: string;
  headline: string;
  description: string;
  timestamp: string;
  cta?: string;
}

export interface DraftProspect {
  id: string;
  name: string;
  position: string;
  archetype: string;
  age: number;
  ovr: number;
}

export interface SaveData {
  schemaVersion: 2;
  userCharacterId: string | null;
  userTeamId: string | null;
  coach: {
    name: string;
    age: number;
    hometown: string;
    personality: string;
  } | null;
  league: {
    season: number;
    week: number;
    phase: string;
  };
  onboarding: {
    interviewsCompleted: string[];
  };
  timeline: {
    currentStep: TimelineStep;
    startedAt: string;
    history: TimelineStep[];
  };
  flags: {
    staffBuilt: boolean;
    orgMeetingDone: boolean;
  };
  news: SaveNewsItem[];
  inbox: SaveNewsItem[];
  career: {
    reputation: number;
    ownerTrust: number;
    scoutingEfficiency: number;
    negotiationEdge: number;
    draftPhilosophy: 'balanced' | 'best_player_available' | 'trenches' | 'playmakers';
    faAggressiveness: 'low' | 'medium' | 'high';
    extensionPriority: 'stars' | 'depth' | 'youth';
  };
  staffPlan: {
    oc: 'hire' | 'delegate';
    dc: 'hire' | 'delegate';
    stc: 'hire' | 'delegate';
  };
  draft: {
    classGenerated: boolean;
    started: boolean;
    completed: boolean;
    currentPick: number;
    prospects: DraftProspect[];
    board: string[];
  };
}

interface LegacySaveData {
  userCharacterId?: string | null;
  userTeamId?: string | null;
  coach?: SaveData['coach'];
  league?: SaveData['league'];
  onboarding?: SaveData['onboarding'];
  staffMeetingCompleted?: boolean;
}

interface SaveContextType {
  save: SaveData;
  setSave: (updates: Partial<SaveData> | ((prev: SaveData) => SaveData)) => void;
  clearSave: () => void;
  loadSave: () => SaveData | null;
}

const SAVE_KEY_V2 = 'ugf_save_v2';
const SAVE_KEY_V1 = 'ugf_save_v1';

export const defaultSave: SaveData = {
  schemaVersion: 2,
  userCharacterId: null,
  userTeamId: null,
  coach: null,
  league: {
    season: 2026,
    week: 1,
    phase: 'offseason',
  },
  onboarding: {
    interviewsCompleted: [],
  },
  timeline: {
    currentStep: 'STAFF_BUILD',
    startedAt: '2026-01-05T09:00:00.000Z',
    history: ['STAFF_BUILD'],
  },
  flags: {
    staffBuilt: false,
    orgMeetingDone: false,
  },
  news: [],
  inbox: [],
  career: {
    reputation: 50,
    ownerTrust: 50,
    scoutingEfficiency: 50,
    negotiationEdge: 50,
    draftPhilosophy: 'balanced',
    faAggressiveness: 'medium',
    extensionPriority: 'stars',
  },
  staffPlan: {
    oc: 'delegate',
    dc: 'delegate',
    stc: 'delegate',
  },
  draft: {
    classGenerated: false,
    started: false,
    completed: false,
    currentPick: 1,
    prospects: [],
    board: [],
  },
};

function mergeWithDefaultSave(save: Partial<SaveData>): SaveData {
  return {
    ...defaultSave,
    ...save,
    schemaVersion: 2,
    league: { ...defaultSave.league, ...(save.league ?? {}) },
    onboarding: { ...defaultSave.onboarding, ...(save.onboarding ?? {}) },
    timeline: { ...defaultSave.timeline, ...(save.timeline ?? {}) },
    flags: { ...defaultSave.flags, ...(save.flags ?? {}) },
    career: { ...defaultSave.career, ...(save.career ?? {}) },
    staffPlan: { ...defaultSave.staffPlan, ...(save.staffPlan ?? {}) },
    draft: { ...defaultSave.draft, ...(save.draft ?? {}) },
    news: Array.isArray(save.news) ? save.news : defaultSave.news,
    inbox: Array.isArray(save.inbox) ? save.inbox : defaultSave.inbox,
  };
}

function migrateLegacySave(legacy: LegacySaveData): SaveData {
  const merged = mergeWithDefaultSave({
    userCharacterId: legacy.userCharacterId ?? null,
    userTeamId: legacy.userTeamId ?? null,
    coach: legacy.coach ?? null,
    league: legacy.league,
    onboarding: legacy.onboarding,
  });

  if (legacy.staffMeetingCompleted) {
    merged.flags.staffBuilt = true;
    merged.flags.orgMeetingDone = true;
    merged.timeline.currentStep = 'SENIOR_BOWL';
    merged.timeline.history = ['STAFF_BUILD', 'ORG_STRATEGY_MEETING', 'SENIOR_BOWL'];
  }

  return merged;
}

function migrateToLatest(data: unknown): SaveData {
  if (!data || typeof data !== 'object') {
    return defaultSave;
  }

  const parsed = data as Partial<SaveData> & LegacySaveData;

  if (parsed.schemaVersion === 2) {
    return mergeWithDefaultSave(parsed);
  }

  return migrateLegacySave(parsed);
}

const SaveContext = createContext<SaveContextType | undefined>(undefined);

export function SaveProvider({ children }: { children: ReactNode }) {
  const [save, setSaveState] = useState<SaveData>(defaultSave);

  useEffect(() => {
    const loaded = loadSave();
    if (loaded) {
      setSaveState(loaded);
    }
  }, []);

  const loadSave = (): SaveData | null => {
    try {
      const storedV2 = localStorage.getItem(SAVE_KEY_V2);
      if (storedV2) {
        return migrateToLatest(JSON.parse(storedV2));
      }

      const storedV1 = localStorage.getItem(SAVE_KEY_V1);
      if (storedV1) {
        const migrated = migrateToLatest(JSON.parse(storedV1));
        localStorage.setItem(SAVE_KEY_V2, JSON.stringify(migrated));
        return migrated;
      }
    } catch (error) {
      console.error('Failed to load save:', error);
    }
    return null;
  };

  const writeSave = (data: SaveData) => {
    try {
      localStorage.setItem(SAVE_KEY_V2, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to write save:', error);
    }
  };

  const setSave = (updates: Partial<SaveData> | ((prev: SaveData) => SaveData)) => {
    setSaveState((prev) => {
      const next = typeof updates === 'function' ? updates(prev) : { ...prev, ...updates };
      const newSave = mergeWithDefaultSave(next);
      writeSave(newSave);
      return newSave;
    });
  };

  const clearSave = () => {
    localStorage.removeItem(SAVE_KEY_V2);
    localStorage.removeItem(SAVE_KEY_V1);
    setSaveState(defaultSave);
  };

  return <SaveContext.Provider value={{ save, setSave, clearSave, loadSave }}>{children}</SaveContext.Provider>;
}

export function useSave() {
  const context = useContext(SaveContext);
  if (!context) {
    throw new Error('useSave must be used within SaveProvider');
  }
  return context;
}
