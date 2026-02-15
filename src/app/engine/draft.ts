import { DraftProspect, SaveData } from '../context/SaveProvider';

const FIRST_NAMES = ['Jayden', 'Malik', 'Trent', 'Isaiah', 'Roman', 'Darnell', 'Cameron', 'Tyrese'];
const LAST_NAMES = ['Miller', 'Johnson', 'Davis', 'Reed', 'Brooks', 'Carter', 'Fields', 'Bryant'];
const POSITIONS = ['QB', 'RB', 'WR', 'TE', 'OT', 'EDGE', 'CB', 'S'];
const ARCHETYPES = ['Field General', 'Power Back', 'Route Runner', 'Pass Protector', 'Ball Hawk', 'Speed Rusher'];

function seededValue(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function generateProspect(index: number, season: number): DraftProspect {
  const seed = season * 100 + index;
  const firstName = FIRST_NAMES[Math.floor(seededValue(seed) * FIRST_NAMES.length)];
  const lastName = LAST_NAMES[Math.floor(seededValue(seed + 1) * LAST_NAMES.length)];
  const position = POSITIONS[Math.floor(seededValue(seed + 2) * POSITIONS.length)];
  const archetype = ARCHETYPES[Math.floor(seededValue(seed + 3) * ARCHETYPES.length)];
  const age = 21 + Math.floor(seededValue(seed + 4) * 3);
  const ovr = 65 + Math.floor(seededValue(seed + 5) * 25);

  return {
    id: `DR_${season}_${index + 1}`,
    name: `${firstName} ${lastName}`,
    position,
    archetype,
    age,
    ovr,
  };
}

export function ensureDraftClass(save: SaveData): SaveData {
  if (save.draft.classGenerated) {
    return save;
  }

  const prospects = Array.from({ length: 32 }, (_, index) => generateProspect(index, save.league.season));
  const board = [...prospects].sort((a, b) => b.ovr - a.ovr).map((p) => p.id);

  return {
    ...save,
    draft: {
      ...save.draft,
      classGenerated: true,
      prospects,
      board,
    },
  };
}

export function startDraft(save: SaveData): SaveData {
  const withClass = ensureDraftClass(save);
  return {
    ...withClass,
    draft: {
      ...withClass.draft,
      started: true,
      completed: false,
      currentPick: 1,
    },
  };
}

export function makePick(save: SaveData, prospectId: string): SaveData {
  if (!save.userTeamId || !save.draft.started || save.draft.completed) {
    return save;
  }

  const selectedProspect = save.draft.prospects.find((p) => p.id === prospectId);
  if (!selectedProspect) {
    return save;
  }

  const remainingProspects = save.draft.prospects.filter((p) => p.id !== prospectId);
  const remainingBoard = save.draft.board.filter((id) => id !== prospectId);
  const completed = save.draft.currentPick >= 7;

  return {
    ...save,
    news: [
      {
        id: `news_draft_pick_${Date.now()}`,
        headline: `Draft Pick ${save.draft.currentPick}: ${selectedProspect.name}`,
        description: `You selected ${selectedProspect.position} ${selectedProspect.name} (${selectedProspect.ovr} OVR).`,
        timestamp: 'Just now',
      },
      ...save.news,
    ],
    draft: {
      ...save.draft,
      prospects: remainingProspects,
      board: remainingBoard,
      currentPick: save.draft.currentPick + 1,
      completed,
      started: !completed,
    },
  };
}
