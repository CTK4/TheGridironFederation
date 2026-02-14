import leagueDB from './leagueDB.json';

export interface Team {
  teamId: string;
  abbrev: string;
  name: string;
  region: string;
  conferenceId: string;
  divisionId: string;
  stadium: string;
  logoKey: string;
  isActive: boolean;
  notes?: string | null;
}

export interface Player {
  playerId: string;
  firstName: string;
  lastName: string;
  position: string;
  archetype: string;
  age: number;
  ovr: number;
  contractTeamId: string;
  contractYears: number;
  contractSalary: number;
  ratings?: {
    physical?: Record<string, number>;
    mental?: Record<string, number>;
    technical?: Record<string, number>;
  };
  traits?: Array<{ text: string; type: 'positive' | 'neutral' | 'negative' }>;
  status?: 'normal' | 'injured' | 'rising' | 'declining';
}

export interface Personnel {
  personnelId: string;
  firstName: string;
  lastName: string;
  role: string;
  age: number;
  ovr: number;
  contractTeamId: string;
  contractYears: number;
  contractSalary: number;
  specialty: string;
}

/**
 * Normalize role for display
 */
export function normalizeRole(role: string): string {
  if (role === 'WR_RB_COACH') return 'WR/RB Coach';
  return role;
}

/**
 * Check if role is a position coach (not coordinator, not HC)
 */
export function isPositionCoach(role: string): boolean {
  const coordinatorRoles = ['HC', 'OC', 'DC', 'STC'];
  return !coordinatorRoles.includes(role);
}

/**
 * Get team logo path
 */
export function getTeamLogoPath(logoKey: string): string {
  return `/logos/${logoKey}.png`;
}

/**
 * List all teams
 */
export function listTeams(): Team[] {
  return leagueDB.Teams as Team[];
}

export function resolveTeamId(idOrAbbrev: string): string | null {
  const teams = leagueDB.Teams as Team[];
  const direct = teams.find((t) => t.teamId === idOrAbbrev);
  if (direct) return direct.teamId;

  const byAbbrev = teams.find((t) => t.abbrev === idOrAbbrev);
  return byAbbrev ? byAbbrev.teamId : null;
}

/**
 * Get team by teamId OR abbrev
 */
export function getTeam(idOrAbbrev: string): Team | null {
  const teamId = resolveTeamId(idOrAbbrev);
  if (!teamId) return null;
  const team = (leagueDB.Teams as Team[]).find((t) => t.teamId === teamId);
  return team ?? null;
}

/**
 * Display name: "Atlanta Apex"
 */
export function getTeamDisplayName(idOrAbbrev: string): string {
  const team = getTeam(idOrAbbrev);
  if (!team) return idOrAbbrev;
  return `${team.region} ${team.name}`;
}

/**
 * Abbrev: "ATL"
 */
export function getTeamAbbrev(idOrAbbrev: string): string {
  const team = getTeam(idOrAbbrev);
  return team?.abbrev ?? '—';
}

/**
 * Get roster for a teamId OR abbrev
 */
export function getRoster(idOrAbbrev: string): Player[] {
  const teamId = resolveTeamId(idOrAbbrev);
  if (!teamId) return [];
  return (leagueDB.Players as Player[]).filter((p) => p.contractTeamId === teamId);
}

/**
 * Get player by ID
 */
export function getPlayer(playerId: string): Player | null {
  const player = (leagueDB.Players as Player[]).find((p) => p.playerId === playerId);
  return player ?? null;
}

/**
 * Get staff for a teamId OR abbrev
 */
export function getStaff(idOrAbbrev: string): Personnel[] {
  const teamId = resolveTeamId(idOrAbbrev);
  if (!teamId) return [];
  return (leagueDB.Personnel as Personnel[]).filter((p) => p.contractTeamId === teamId);
}

/**
 * Get all free agent coaches
 */
export function getFreeAgentCoaches(): Personnel[] {
  return (leagueDB.Personnel as Personnel[]).filter((p) => p.contractTeamId === 'FREE_AGENT');
}

/**
 * Get personnel by ID
 */
export function getPersonnel(personnelId: string): Personnel | null {
  const personnel = (leagueDB.Personnel as Personnel[]).find((p) => p.personnelId === personnelId);
  return personnel ?? null;
}
