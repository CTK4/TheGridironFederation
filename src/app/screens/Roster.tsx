import { useState } from 'react';
import { useNavigate } from 'react-router';
import { TopHeader } from '../components/TopHeader';
import { PlayerRow } from '../components/PlayerRow';
import { OVRBadge } from '../components/OVRBadge';
import { useSave } from '../context/SaveProvider';
import { getRoster, getTeam } from '../data/leagueAdapter';
import { getRatingColor } from '../data/mock-data';

const tabs = ['Roster', 'Depth', 'Contracts', 'Stats', 'History'];

export function Roster() {
  const navigate = useNavigate();
  const { save } = useSave();
  const [activeTab, setActiveTab] = useState('Roster');

  // Get real roster data
  const roster = save.userTeamId ? getRoster(save.userTeamId) : [];
  const team = save.userTeamId ? getTeam(save.userTeamId) : null;

  // Calculate team averages
  const avgOvr = roster.length > 0
    ? Math.round(roster.reduce((sum, p) => sum + p.ovr, 0) / roster.length)
    : 0;

  // Convert Player[] to the format expected by PlayerRow
  const playersForDisplay = roster.map((p) => ({
    id: p.playerId,
    name: `${p.firstName} ${p.lastName}`,
    position: p.position,
    archetype: p.archetype,
    age: p.age,
    ovr: p.ovr,
    status: p.status as 'normal' | 'injured' | 'rising' | 'declining' | undefined,
    team: team?.name,
    contractYears: p.contractYears,
    ratings: p.ratings,
    traits: p.traits,
  }));

  return (
    <div 
      className="min-h-screen pb-[83px]"
      style={{ backgroundColor: '#000000' }}
    >
      <TopHeader title="Team Roster" />

      <div className="flex flex-col gap-3 p-4">
        {/* Team Stats */}
        <div 
          className="p-5 rounded-2xl"
          style={{ 
            backgroundColor: 'rgba(28, 28, 30, 1)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[13px] font-medium uppercase tracking-wide" style={{ color: 'rgba(235, 235, 245, 0.6)' }}>
              Team Overview
            </h3>
            <div className="flex flex-col items-end">
              <div className="text-[11px] font-medium uppercase tracking-wide" style={{ color: 'rgba(235, 235, 245, 0.6)' }}>
                AVG OVR
              </div>
              <div 
                className="text-3xl font-bold tabular-nums leading-none"
                style={{ color: getRatingColor(avgOvr) }}
              >
                {avgOvr}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <StatBar label="Offense" value={team?.off || 0} />
            <StatBar label="Defense" value={team?.def || 0} />
            <StatBar label="Special" value={74} />
          </div>
        </div>

        {/* Tab Selector */}
        <div 
          className="flex items-center gap-2 p-1 overflow-x-auto rounded-xl"
          style={{ 
            backgroundColor: 'rgba(28, 28, 30, 1)',
          }}
        >
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="px-4 py-2 text-[13px] font-semibold whitespace-nowrap transition-all rounded-lg active:opacity-60"
              style={{
                backgroundColor: activeTab === tab ? '#FF6B00' : 'transparent',
                color: activeTab === tab ? 'white' : 'rgba(235, 235, 245, 0.6)',
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Player List */}
        <div 
          className="flex flex-col rounded-2xl overflow-hidden"
          style={{
            backgroundColor: 'rgba(28, 28, 30, 1)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          {playersForDisplay.length === 0 ? (
            <div className="p-6 text-center">
              <p style={{ color: 'rgba(235, 235, 245, 0.6)' }}>No players on roster</p>
            </div>
          ) : (
            playersForDisplay.map((player) => (
              <PlayerRow
                key={player.id}
                player={player}
                onClick={() => navigate(`/player/${player.id}`)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function StatBar({ label, value }: { label: string; value: number }) {
  const percentage = value;
  const color = getRatingColor(value);

  return (
    <div className="flex items-center gap-3">
      <div 
        className="w-20 text-[11px] font-medium uppercase tracking-wide"
        style={{ color: 'rgba(235, 235, 245, 0.6)' }}
      >
        {label}
      </div>
      <div className="flex items-center gap-3 flex-1">
        <div 
          className="flex-1 h-1.5 relative overflow-hidden rounded-full"
          style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
        >
          <div
            className="h-full transition-all duration-300 rounded-full"
            style={{
              width: `${percentage}%`,
              backgroundColor: color,
            }}
          />
        </div>
        <div 
          className="w-8 text-right text-sm font-semibold tabular-nums"
          style={{ color: color }}
        >
          {value}
        </div>
      </div>
    </div>
  );
}