import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { TopHeader } from '../components/TopHeader';
import { NewsCard } from '../components/NewsCard';
import { mockNews } from '../data/mock-data';
import { Calendar, Clipboard, Users, TrendingUp, AlertCircle } from 'lucide-react';
import { useSave } from '../context/SaveProvider';
import { getTeam, getRoster, getTeamLogoPath } from '../data/leagueAdapter';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

export function Hub() {
  const navigate = useNavigate();
  const { save } = useSave();

  // Get user's team data
  const userTeam = save.userTeamId ? getTeam(save.userTeamId) : null;
  const roster = save.userTeamId ? getRoster(save.userTeamId) : [];
  
  // Calculate team average
  const teamAvgOvr = roster.length > 0 
    ? Math.round(roster.reduce((sum, p) => sum + p.ovr, 0) / roster.length)
    : 0;

  // Mock opponent for now
  const opponentTeam = getTeam('ATL');

  return (
    <div 
      className="min-h-screen pb-[83px]"
      style={{ backgroundColor: '#000000' }}
    >
      <TopHeader title="Hub" showBack={false} />

      <div className="flex flex-col gap-4 p-4">
        {/* Staff Meeting CTA */}
        {!save.staffMeetingCompleted && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <button
              onClick={() => navigate('/staff-meeting')}
              className="w-full rounded-2xl p-4 flex items-center gap-3 transition-all active:opacity-60"
              style={{ backgroundColor: '#FF453A' }}
            >
              <AlertCircle className="w-6 h-6 text-white" />
              <div className="flex-1 text-left">
                <div className="text-[15px] font-semibold text-white">Action Required</div>
                <div className="text-[13px] text-white/90">Complete weekly staff meeting to advance</div>
              </div>
            </button>
          </motion.div>
        )}

        {/* Matchup Card */}
        {userTeam && opponentTeam && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div 
              className="rounded-2xl p-5 relative overflow-hidden"
              style={{
                backgroundColor: 'rgba(28, 28, 30, 1)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              {/* Matchup Header */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <ImageWithFallback
                    src={getTeamLogoPath(opponentTeam.logoKey)}
                    alt={opponentTeam.name}
                    className="w-12 h-12 object-contain"
                  />
                  <div>
                    <div className="text-[17px] font-semibold text-white">
                      {opponentTeam.name}
                    </div>
                    <div className="text-[12px]" style={{ color: 'rgba(235, 235, 245, 0.6)' }}>Week {save.league.week} Opponent</div>
                  </div>
                </div>
                <div className="text-[13px] font-medium" style={{ color: 'rgba(235, 235, 245, 0.6)' }}>
                  AT
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-[17px] font-semibold text-white">
                      {userTeam.name}
                    </div>
                    <div className="text-[12px]" style={{ color: 'rgba(235, 235, 245, 0.6)' }}>Your Team</div>
                  </div>
                  <ImageWithFallback
                    src={getTeamLogoPath(userTeam.logoKey)}
                    alt={userTeam.name}
                    className="w-12 h-12 object-contain"
                  />
                </div>
              </div>

              {/* Comparison Stats */}
              <div className="grid grid-cols-3 gap-4 mb-5">
                {[
                  { stat: 'OFF', yours: userTeam.off, opponent: opponentTeam.off },
                  { stat: 'DEF', yours: userTeam.def, opponent: opponentTeam.def },
                  { stat: 'OVR', yours: userTeam.ovr, opponent: opponentTeam.ovr },
                ].map(({ stat, yours, opponent }) => (
                  <div key={stat} className="flex flex-col items-center gap-1.5">
                    <div className="text-[11px] font-medium uppercase tracking-wide" style={{ color: 'rgba(235, 235, 245, 0.6)' }}>
                      {stat}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[15px] font-semibold ${yours > opponent ? 'text-[#32D74B]' : ''}`} style={{ color: yours > opponent ? '#32D74B' : 'rgba(235, 235, 245, 0.6)' }}>
                        {yours}
                      </span>
                      <span style={{ color: 'rgba(235, 235, 245, 0.3)' }}>vs</span>
                      <span className={`text-[15px] font-semibold`} style={{ color: opponent > yours ? '#FF453A' : 'rgba(235, 235, 245, 0.6)' }}>
                        {opponent}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => navigate('/game')}
                className="w-full py-3 rounded-xl font-semibold text-white transition-all active:opacity-60"
                style={{ backgroundColor: '#FF6B00' }}
              >
                Set Gameplan
              </button>
            </div>
          </motion.div>
        )}

        {/* Weekly Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="grid grid-cols-2 gap-3"
        >
          <ActionButton
            icon={<Users className="w-5 h-5" />}
            label="Roster"
            onClick={() => navigate('/roster')}
          />
          <ActionButton
            icon={<Clipboard className="w-5 h-5" />}
            label="Draft"
            onClick={() => navigate('/draft')}
          />
          <ActionButton
            icon={<Calendar className="w-5 h-5" />}
            label="Staff"
            onClick={() => navigate('/staff')}
          />
          <ActionButton
            icon={<TrendingUp className="w-5 h-5" />}
            label="Analytics"
            onClick={() => {}}
          />
        </motion.div>

        {/* News Feed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="flex flex-col gap-3"
        >
          <h3 className="text-[17px] font-bold text-white px-1">Latest News</h3>
          {mockNews.map((news, index) => (
            <motion.div
              key={news.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
            >
              <NewsCard news={news} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

function ActionButton({ 
  icon, 
  label, 
  onClick 
}: { 
  icon: React.ReactNode; 
  label: string; 
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="h-20 p-4 flex flex-col items-center justify-center gap-2 transition-all active:opacity-60 rounded-2xl"
      style={{ 
        backgroundColor: 'rgba(28, 28, 30, 1)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
      }}
    >
      <div style={{ color: '#FF6B00' }}>{icon}</div>
      <div className="text-[12px] font-medium text-white">
        {label}
      </div>
    </button>
  );
}