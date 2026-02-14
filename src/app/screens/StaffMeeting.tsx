import { useMemo } from 'react';
import { useNavigate } from 'react-router';
import { TopHeader } from '../components/TopHeader';
import { useSave } from '../context/SaveProvider';

type DraftPhilosophy = 'balanced' | 'best_player_available' | 'trenches' | 'playmakers';
type FAAggressiveness = 'low' | 'medium' | 'high';
type ExtensionPriority = 'stars' | 'depth' | 'youth';

type CareerStrategy = {
  draftPhilosophy: DraftPhilosophy;
  faAggressiveness: FAAggressiveness;
  extensionPriority: ExtensionPriority;
};

function isoNow(): string {
  return new Date().toISOString();
}

function withDefaults<T extends object>(value: unknown, defaults: T): T {
  if (!value || typeof value !== 'object') return defaults;
  return { ...defaults, ...(value as Partial<T>) };
}

export function StaffMeeting() {
  const navigate = useNavigate();
  const { save, setSave } = useSave();

  const defaults: CareerStrategy = useMemo(
    () => ({
      draftPhilosophy: 'balanced',
      faAggressiveness: 'medium',
      extensionPriority: 'stars',
    }),
    []
  );

  const currentCareer = withDefaults((save as any).career, defaults);

  const setCareerField = <K extends keyof CareerStrategy>(field: K, value: CareerStrategy[K]) => {
    setSave((prev: any) => {
      const prevCareer = withDefaults(prev.career, defaults);
      return {
        ...prev,
        career: {
          ...prevCareer,
          [field]: value,
        },
      };
    });
  };

  const completeMeeting = () => {
    setSave((prev: any) => {
      const prevFlags = withDefaults(prev.flags, { orgMeetingDone: false });
      const prevNews = Array.isArray(prev.news) ? prev.news : [];

      return {
        ...prev,
        flags: {
          ...prevFlags,
          orgMeetingDone: true,
        },
        news: [
          {
            id: `news_org_meeting_${Date.now()}`,
            headline: 'Organizational Strategy Set',
            description: 'Front office priorities are locked in for the offseason cycle.',
            timestampISO: isoNow(),
            ctaRoute: '/', // optional, safe if unused
          },
          ...prevNews,
        ],
      };
    });

    navigate('/');
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <TopHeader title="Strategy Meeting" />

      <div className="p-4 flex flex-col gap-4">
        <Picker
          label="Draft Philosophy"
          value={currentCareer.draftPhilosophy}
          options={[
            ['balanced', 'Balanced'],
            ['best_player_available', 'Best Player Available'],
            ['trenches', 'Build the Trenches'],
            ['playmakers', 'Prioritize Playmakers'],
          ]}
          onSelect={(v) => setCareerField('draftPhilosophy', v as DraftPhilosophy)}
        />

        <Picker
          label="FA Aggressiveness"
          value={currentCareer.faAggressiveness}
          options={[
            ['low', 'Low'],
            ['medium', 'Medium'],
            ['high', 'High'],
          ]}
          onSelect={(v) => setCareerField('faAggressiveness', v as FAAggressiveness)}
        />

        <Picker
          label="Extension Priority"
          value={currentCareer.extensionPriority}
          options={[
            ['stars', 'Retain Stars'],
            ['depth', 'Depth First'],
            ['youth', 'Prioritize Youth'],
          ]}
          onSelect={(v) => setCareerField('extensionPriority', v as ExtensionPriority)}
        />

        <button
          onClick={completeMeeting}
          className="w-full py-3 rounded-xl text-white font-semibold"
          style={{ backgroundColor: 'var(--accent-primary)' }}
        >
          Complete Strategy Meeting
        </button>
      </div>
    </div>
  );
}

function Picker({
  label,
  value,
  options,
  onSelect,
}: {
  label: string;
  value: string;
  options: [string, string][];
  onSelect: (value: string) => void;
}) {
  return (
    <div className="rounded-2xl p-4" style={{ backgroundColor: 'var(--bg-surface)' }}>
      <div className="text-white font-semibold mb-3">{label}</div>
      <div className="grid grid-cols-1 gap-2">
        {options.map(([key, text]) => (
          <button
            key={key}
            onClick={() => onSelect(key)}
            className="text-left px-3 py-2 rounded-lg text-sm"
            style={{
              backgroundColor: key === value ? 'var(--accent-primary)' : '#0B0F16',
              color: 'white',
            }}
          >
            {text}
          </button>
        ))}
      </div>
    </div>
  );
}
