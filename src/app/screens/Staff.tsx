import { useMemo, useState } from 'react';
import { TopHeader } from '../components/TopHeader';
import { useSave } from '../context/SaveProvider';

const TABS = ['Staff', 'Openings', 'Free Agents'] as const;
type Tab = (typeof TABS)[number];

const COORDINATOR_ROLES = ['HC', 'OC', 'DC', 'STC'] as const;

export function Staff() {
  const { save } = useSave();
  const [activeTab, setActiveTab] = useState<Tab>('Staff');

  if (!save.userTeamId) return null;

  const staff = useMemo(() => getStaff(save.userTeamId), [save.userTeamId]);

  const openings = useMemo(() => {
    const rolesPresent = new Set(staff.map((s) => s.role));
    return COORDINATOR_ROLES.filter((r) => !rolesPresent.has(r));
  }, [staff]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <TopHeader title="Coaching Staff" />

      <div className="flex flex-col gap-4 p-4">
        {/* Tab Selector */}
        <div
          className="flex items-center gap-2 p-1 rounded-xl overflow-x-auto"
          style={{ backgroundColor: 'var(--bg-surface)' }}
        >
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all"
              style={{
                backgroundColor: activeTab === tab ? 'var(--accent-primary)' : 'transparent',
                color: activeTab === tab ? 'white' : 'rgba(255, 255, 255, 0.6)',
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Staff List */}
        {activeTab === 'Staff' && (
          <div className="flex flex-col gap-2">
            {staff.length === 0 ? (
              <EmptyCard text="No staff members" />
            ) : (
              staff.map((member) => <StaffRow key={member.personnelId} member={member} />)
            )}
          </div>
        )}

        {/* Openings */}
        {activeTab === 'Openings' && (
          <div className="flex flex-col gap-2">
            {openings.length === 0 ? (
              <EmptyCard text="No openings — coordinator staff is filled." />
            ) : (
              openings.map((role) => (
                <div
                  key={role}
                  className="rounded-2xl p-4"
                  style={{ backgroundColor: 'var(--bg-surface)' }}
                >
                  <div className="flex items-center justify-between">
                    <div className="text-white font-semibold">{normalizeRole(role)}</div>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-white/70">
                      OPEN
                    </span>
                  </div>
                  <div className="mt-2 text-xs text-white/60">
                    Hiring flow will be wired to Save v2 + progression flags.
                  </div>
                </div>
              ))
            )}
          </div>
        ))}

        {/* Free Agents */}
        {activeTab === 'Free Agents' && (
          <EmptyCard text="Free agent coaches coming soon" />
        )}
      </div>
    </div>
  );
}

function EmptyCard({ text }: { text: string }) {
  return (
    <div className="rounded-2xl p-6 text-center" style={{ backgroundColor: 'var(--bg-surface)' }}>
      <p className="text-white/60">{text}</p>
    </div>
  );
}

function StaffRow({ member }: { member: Personnel }) {
  return (
    <div
      className="rounded-xl p-3 flex items-center gap-3 cursor-pointer hover:brightness-110 transition-all"
      style={{ backgroundColor: 'var(--bg-surface)' }}
      role="button"
      tabIndex={0}
    >
      <OVRBadge ovr={member.ovr} size="small" />

      <div className="flex-1">
        <div className="text-sm font-bold text-white">
          {member.firstName} {member.lastName}
        </div>
        <div className="text-xs text-white/60">
          {normalizeRole(member.role)} • {member.age} yrs
        </div>
      </div>

      <div className="text-right">
        <div className="text-xs text-white/60">Specialty</div>
        <div className="text-xs font-semibold text-white">{member.specialty}</div>
      </div>
    </div>
  );
}
