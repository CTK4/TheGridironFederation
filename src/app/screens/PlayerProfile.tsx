import { useState } from 'react';
import { useParams } from 'react-router';
import { TopHeader } from '../components/TopHeader';
import { OVRBadge } from '../components/OVRBadge';
import { RatingBar } from '../components/RatingBar';
import { getPlayer } from '../data/leagueAdapter';
import { getRatingColor } from '../data/mock-data';

const tabs = ['Overview', 'Traits', 'Stats', 'Career', 'Awards'];

export function PlayerProfile() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('Overview');
  
  // Get player from real data
  const playerData = id ? getPlayer(id) : null;

  if (!playerData) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: 'var(--bg-primary)' }}
      >
        <div className="text-white/60">Player not found</div>
      </div>
    );
  }

  // Convert to display format
  const player = {
    id: playerData.playerId,
    name: `${playerData.firstName} ${playerData.lastName}`,
    position: playerData.position,
    archetype: playerData.archetype,
    age: playerData.age,
    ovr: playerData.ovr,
    status: playerData.status,
    contractYears: playerData.contractYears,
    ratings: playerData.ratings,
    traits: playerData.traits,
  };

  return (
    <div 
      className="min-h-screen pb-[83px]"
      style={{ backgroundColor: '#000000' }}
    >
      <TopHeader title={player.name} />

      <div className="flex flex-col gap-3 p-4">
        {/* Player Header */}
        <div 
          className="p-5 rounded-2xl"
          style={{ 
            backgroundColor: 'rgba(28, 28, 30, 1)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          <div className="flex items-center gap-4">
            {/* Position Badge */}
            <div 
              className="w-16 h-16 flex items-center justify-center font-bold text-lg rounded-2xl"
              style={{ 
                backgroundColor: 'rgba(255, 107, 0, 0.15)',
                color: '#FF6B00',
              }}
            >
              {player.position}
            </div>
            
            <div className="flex-1">
              <h2 className="text-xl font-bold text-white mb-1">
                {player.name}
              </h2>
              <div 
                className="text-[12px] font-medium mb-2"
                style={{ color: 'rgba(235, 235, 245, 0.6)' }}
              >
                {player.archetype} • Age {player.age}
                {player.contractYears && ` • ${player.contractYears}yr Contract`}
              </div>
            </div>

            {/* OVR Display */}
            <div className="flex flex-col items-end gap-1">
              <div 
                className="text-[11px] font-medium uppercase tracking-wide"
                style={{ color: 'rgba(235, 235, 245, 0.6)' }}
              >
                Overall
              </div>
              <div 
                className="text-4xl font-bold tabular-nums leading-none"
                style={{ color: getRatingColor(player.ovr) }}
              >
                {player.ovr}
              </div>
            </div>
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

        {/* Tab Content */}
        {activeTab === 'Overview' && (
          <div className="flex flex-col gap-3">
            {player.ratings?.physical && (
              <RatingSection title="Physical" ratings={player.ratings.physical} />
            )}
            {player.ratings?.mental && (
              <RatingSection title="Mental" ratings={player.ratings.mental} />
            )}
            {player.ratings?.technical && (
              <RatingSection title="Technical" ratings={player.ratings.technical} />
            )}
          </div>
        )}

        {activeTab === 'Traits' && player.traits && (
          <div className="flex flex-col gap-2">
            {player.traits.map((trait, index) => (
              <div
                key={index}
                className="px-4 py-3 rounded-xl"
                style={{
                  backgroundColor: 'rgba(28, 28, 30, 1)',
                  borderLeft: `4px solid ${
                    trait.type === 'positive' 
                      ? '#32D74B' 
                      : trait.type === 'negative'
                      ? '#FF453A'
                      : '#FFD60A'
                  }`,
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <span className="text-[14px] font-medium text-white">
                  {trait.text}
                </span>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'Stats' && (
          <div 
            className="p-6 text-center rounded-2xl"
            style={{ 
              backgroundColor: 'rgba(28, 28, 30, 1)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            <p style={{ color: 'rgba(235, 235, 245, 0.6)' }}>Season stats coming soon...</p>
          </div>
        )}
      </div>
    </div>
  );
}

function RatingSection({ title, ratings }: { title: string; ratings: Record<string, number> }) {
  return (
    <div 
      className="p-4 flex flex-col gap-3 rounded-2xl"
      style={{ 
        backgroundColor: 'rgba(28, 28, 30, 1)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
      }}
    >
      <h3 
        className="text-[13px] font-semibold uppercase tracking-wide mb-1"
        style={{ color: '#FF6B00' }}
      >
        {title}
      </h3>
      {Object.entries(ratings).map(([key, value]) => (
        <RatingBar key={key} label={key} value={value} />
      ))}
    </div>
  );
}