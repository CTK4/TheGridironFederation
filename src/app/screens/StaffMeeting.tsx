import { useNavigate } from 'react-router';
import { useSave, SaveData } from '../context/SaveProvider';
import { TopHeader } from '../components/TopHeader';

export function StaffMeeting() {
  const navigate = useNavigate();
  const { save, setSave } = useSave();

  const setCareer = <K extends keyof SaveData['career']>(field: K, value: SaveData['career'][K]) => {
    setSave((prev) => ({
      ...prev,
      career: {
        ...prev.career,
        [field]: value,
      },
    }));
  };

  const completeMeeting = () => {
    setSave((prev) => ({
      ...prev,
      flags: {
        ...prev.flags,
        orgMeetingDone: true,
      },
      news: [
        {
          id: `news_org_meeting_${Date.now()}`,
          headline: 'Organizational Strategy Set',
          description: 'Your front office priorities are locked in for the offseason cycle.',
          timestamp: 'Just now',
          cta: 'Advance Timeline',
        },
        ...prev.news,
      ],
    }));
    navigate('/');
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <TopHeader title="Strategy Meeting" />
      <div className="p-4 flex flex-col gap-4">
        <Picker
          label="Draft Philosophy"
          value={save.career.draftPhilosophy}
          options={[
            ['balanced', 'Balanced'],
            ['best_player_available', 'Best Player Available'],
            ['trenches', 'Build the Trenches'],
            ['playmakers', 'Prioritize Playmakers'],
          ]}
          onSelect={(value) => setCareer('draftPhilosophy', value as SaveData['career']['draftPhilosophy'])}
        />

        <Picker
          label="FA Aggressiveness"
          value={save.career.faAggressiveness}
          options={[
            ['low', 'Low'],
            ['medium', 'Medium'],
            ['high', 'High'],
          ]}
          onSelect={(value) => setCareer('faAggressiveness', value as SaveData['career']['faAggressiveness'])}
        />

        <Picker
          label="Extension Priority"
          value={save.career.extensionPriority}
          options={[
            ['stars', 'Retain Stars'],
            ['depth', 'Depth First'],
            ['youth', 'Prioritize Youth'],
          ]}
          onSelect={(value) => setCareer('extensionPriority', value as SaveData['career']['extensionPriority'])}
        />

        <button onClick={completeMeeting} className="w-full py-3 rounded-xl text-white font-semibold" style={{ backgroundColor: 'var(--accent-primary)' }}>
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
