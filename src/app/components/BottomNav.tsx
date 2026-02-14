import { useNavigate, useLocation } from 'react-router';
import { Home, Users, MessageSquare, TrendingUp, Settings } from 'lucide-react';

export function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: Home, label: 'Hub', path: '/' },
    { icon: Users, label: 'Roster', path: '/roster' },
    { icon: TrendingUp, label: 'Draft', path: '/draft' },
    { icon: MessageSquare, label: 'Phone', path: '/phone' },
    { icon: Settings, label: 'More', path: '/more' },
  ];

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 h-[83px] pb-[20px]"
      style={{ 
        backgroundColor: 'rgba(28, 28, 30, 0.95)',
        backdropFilter: 'blur(20px)',
        borderTop: '0.5px solid rgba(255, 255, 255, 0.1)',
      }}
    >
      <div className="max-w-md mx-auto h-full flex items-center justify-around px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="flex flex-col items-center justify-center gap-1 transition-all active:opacity-60 px-3 py-1"
            >
              <Icon 
                className="w-6 h-6" 
                style={{ 
                  color: isActive ? '#FF6B00' : 'rgba(235, 235, 245, 0.6)',
                  strokeWidth: isActive ? 2.5 : 2,
                }} 
              />
              <span 
                className="text-[10px] font-medium"
                style={{ 
                  color: isActive ? '#FF6B00' : 'rgba(235, 235, 245, 0.6)',
                }}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}