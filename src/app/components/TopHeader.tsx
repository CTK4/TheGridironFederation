import { ChevronLeft, Bell, Smile } from 'lucide-react';
import { useNavigate } from 'react-router';

interface TopHeaderProps {
  title: string;
  showBack?: boolean;
  showNotification?: boolean;
  ownerMood?: 'happy' | 'neutral' | 'angry';
}

export function TopHeader({ 
  title, 
  showBack = true, 
  showNotification = true,
  ownerMood = 'neutral' 
}: TopHeaderProps) {
  const navigate = useNavigate();

  const getMoodColor = () => {
    switch (ownerMood) {
      case 'happy': return 'text-[#32D74B]';
      case 'angry': return 'text-[#FF453A]';
      default: return 'text-[#FFD60A]';
    }
  };

  return (
    <div 
      className="h-14 flex items-center justify-between px-4"
      style={{ 
        backgroundColor: 'rgba(0, 0, 0, 1)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      }}
    >
      <div className="flex items-center gap-3">
        {showBack && (
          <button 
            onClick={() => navigate(-1)}
            className="w-9 h-9 flex items-center justify-center text-white/80 hover:text-white transition-all active:opacity-60 rounded-full"
            style={{
              backgroundColor: 'rgba(118, 118, 128, 0.24)',
            }}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}
        <h2 className="text-[17px] font-bold text-white tracking-tight">
          {title}
        </h2>
      </div>

      <div className="flex items-center gap-2">
        {showNotification && (
          <button 
            className="w-9 h-9 flex items-center justify-center text-white/80 hover:text-white relative transition-all active:opacity-60 rounded-full"
            style={{
              backgroundColor: 'rgba(118, 118, 128, 0.24)',
            }}
          >
            <Bell className="w-4 h-4" />
            <span 
              className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
              style={{ backgroundColor: '#FF453A' }}
            />
          </button>
        )}
        <div 
          className={`w-9 h-9 flex items-center justify-center ${getMoodColor()} rounded-full`}
          style={{
            backgroundColor: 'rgba(118, 118, 128, 0.24)',
          }}
        >
          <Smile className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
}