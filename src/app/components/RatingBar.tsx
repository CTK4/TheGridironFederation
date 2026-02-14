import { getRatingColor } from '../data/mock-data';

interface RatingBarProps {
  label: string;
  value: number;
  maxValue?: number;
}

export function RatingBar({ label, value, maxValue = 100 }: RatingBarProps) {
  const percentage = (value / maxValue) * 100;
  const color = getRatingColor(value);

  return (
    <div className="flex items-center gap-3">
      <div 
        className="w-16 text-[11px] font-medium uppercase tracking-wide"
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