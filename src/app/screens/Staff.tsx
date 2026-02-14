import { useMemo, useState } from 'react';
import { TopHeader } from '../components/TopHeader';
import { OVRBadge } from '../components/OVRBadge';
import { useSave } from '../context/SaveProvider';
import {
  getFreeAgentCoaches,
  getStaff,
  normalizeRole,
  Personnel,
} from '../data/leagueAdapter';

const TABS = ['Staff', 'Openings', 'Free Agents'] as const;
type Tab = (typeof TABS)[number];

const COORDINATOR_ROLES = ['HC', 'OC', 'DC', 'STC'] as const;
type CoordinatorRole = (typeof COORDINATOR_ROLES)[number];

function fullName(p: Personnel): string {
  return `${p.firstName} ${p.lastName}`;
}

function roleLabel(role: string): string {
  return normalizeRole(role);
}

function safeGetFreeAgents(): Personnel[] {
  try {
    // If your adapter exports this, great.
    return typeof getFreeAgentCoaches === 'function' ? getFreeAgentCoaches() : [];
  } catch {
    return [];
  }
}

export function Staff() {
  const { save } = useSave();
  const [activeTab, setActiveTab] = useState<Tab>('Staff');

  if (!save.userTeamId) return null;

  const staff = useMemo(() => getStaff(save.userTeamId), [save.userTeamId]);
  const freeAgents = useMemo(() => safeGetFreeAgents(), []);

  const staffByRole = useMemo(() => {
    const map = new Map<string, Personnel[]>();
    for (const m of staff) {
      const list = map.get(m.role) ?? [];
      list.push(m);
      map.set(m.role, list);
    }
    return map;
  }, [staff]);

  const openings = useMemo(() => {
    const missing: CoordinatorRole[] = [];
    for (const r of COORDINATOR_ROLES) {
      const hasRole = (staffByRole.get(r) ?? []).length > 0;
      if (!hasRole) missing.push(r);
    }
    return missing;
  }, [staffByRole]);

  const freeAgentsSorted = useMemo(() => {
    return [...freeAgents].sort((a, b) => b.ovr - a.ovr);
  }, [freeAgents]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <TopHeader title="Coaching Staff" />
