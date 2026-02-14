import { TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import { Player, getRatingColor } from '../data/mock-data';
import { OVRBadge } from './OVRBadge';

interface PlayerRowProps {
  player: Player;
  onClick?: () => void;
  variant?: 'normal' | 'selected';
}

export function PlayerRow({ player, onClick, variant = 'normal' }: PlayerRowProps) {
  const isSelected = variant === 'selected';
  
  const getStatusIcon = () => {
    switch (player.status) {
      case 'injured':
        return <AlertCircle className="w-3.5 h-3.5 text-[#FF453A]" />;
      case 'rising':
        return <TrendingUp className="w-3.5 h-3.5 text-[#32D74B]" />;
      case 'declining':
        return <TrendingDown className="w-3.5 h-3.5 text-[#FF9F0A]" />;
      default:
        return null;
    }
  };

  return (
    <button
      onClick={onClick}
      className="w-full px-4 py-3 flex items-center gap-3 transition-all active:opacity-60"
      style={{
        backgroundColor: isSelected ? 'rgba(44, 44, 46, 1)' : 'rgba(28, 28, 30, 1)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      }}
    >
      {/* Position Badge */}
      <div 
        className="w-10 h-10 flex items-center justify-center font-semibold text-xs rounded-lg"
        style={{ 
          backgroundColor: 'rgba(255, 107, 0, 0.15)',
          color: '#FF6B00',
        }}
      >
        {player.position}
      </div>

      {/* Player Info */}
      <div className="flex-1 flex flex-col items-start justify-center gap-1">
        <div className="flex items-center gap-2">
          <h3 className="text-[15px] font-semibold text-white">
            {player.name}
          </h3>
          {getStatusIcon()}
        </div>
        <div 
          className="flex items-center gap-1.5 text-[11px] font-medium"
          style={{ color: 'rgba(235, 235, 245, 0.6)' }}
        >
          <span>{player.archetype}</span>
          <span>•</span>
          <span>Age {player.age}</span>
        </div>
      </div>

      {/* OVR Display */}
      <div 
        className="text-2xl font-bold tabular-nums"
        style={{ color: getRatingColor(player.ovr) }}
      >
        {player.ovr}
      </div>
    </button>
  );
}