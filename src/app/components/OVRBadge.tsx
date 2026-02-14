import { getRatingColor } from '../data/mock-data';

interface OVRBadgeProps {
  ovr: number;
  size?: 'small' | 'medium' | 'large';
}

export function OVRBadge({ ovr, size = 'medium' }: OVRBadgeProps) {
  const color = getRatingColor(ovr);
  
  const dimensions = {
    small: { size: 44, text: 'text-lg', label: 'text-[9px]' },
    medium: { size: 64, text: 'text-3xl', label: 'text-[10px]' },
    large: { size: 88, text: 'text-5xl', label: 'text-xs' },
  };

  const { size: badgeSize, text, label } = dimensions[size];

  return (
    <div 
      className="relative flex flex-col items-center justify-center rounded-2xl"
      style={{ 
        width: badgeSize, 
        height: badgeSize,
        backgroundColor: 'rgba(44, 44, 46, 1)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
      }}
    >
      <div 
        className={`${text} font-bold leading-none tabular-nums`}
        style={{ color: color }}
      >
        {ovr}
      </div>
      <div 
        className={`${label} font-semibold uppercase tracking-wide mt-0.5`}
        style={{ color: 'rgba(235, 235, 245, 0.6)' }}
      >
        OVR
      </div>
    </div>
  );
}