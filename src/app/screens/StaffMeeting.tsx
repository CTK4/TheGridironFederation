 (cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF' 
diff --git a/src/app/screens/StaffMeeting.tsx b/src/app/screens/StaffMeeting.tsx
index e074a6302e4c27e1f5074f8bbf5cc8a29426fdaa..d2cdbfbc7ca00b74ae2f5c896cac77c2687aee0f 100644
--- a/src/app/screens/StaffMeeting.tsx
+++ b/src/app/screens/StaffMeeting.tsx
@@ -1,79 +1,117 @@
 import { useNavigate } from 'react-router';
-import { useSave } from '../context/SaveProvider';
+import { useSave, SaveData } from '../context/SaveProvider';
 import { TopHeader } from '../components/TopHeader';
-import { Button } from '../components/ui/button';
-import { Users } from 'lucide-react';
 
 export function StaffMeeting() {
   const navigate = useNavigate();
-  const { setSave } = useSave();
+  const { save, setSave } = useSave();
 
-  const handleComplete = () => {
+  const setCareer = <K extends keyof SaveData['career']>(field: K, value: SaveData['career'][K]) => {
     setSave((prev) => ({
       ...prev,
-      staffMeetingCompleted: true,
+      career: {
+        ...prev.career,
+        [field]: value,
+      },
+    }));
+  };
+
+  const completeMeeting = () => {
+    setSave((prev) => ({
+      ...prev,
+      flags: {
+        ...prev.flags,
+        orgMeetingDone: true,
+      },
+      news: [
+        {
+          id: `news_org_meeting_${Date.now()}`,
+          headline: 'Organizational Strategy Set',
+          description: 'Your front office priorities are locked in for the offseason cycle.',
+          timestamp: 'Just now',
+          cta: 'Advance Timeline',
+        },
+        ...prev.news,
+      ],
     }));
     navigate('/');
   };
 
   return (
-    <div 
-      className="min-h-screen"
-      style={{ backgroundColor: 'var(--bg-primary)' }}
-    >
-      <TopHeader title="Staff Meeting" />
+    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
+      <TopHeader title="Strategy Meeting" />
+      <div className="p-4 flex flex-col gap-4">
+        <Picker
+          label="Draft Philosophy"
+          value={save.career.draftPhilosophy}
+          options={[
+            ['balanced', 'Balanced'],
+            ['best_player_available', 'Best Player Available'],
+            ['trenches', 'Build the Trenches'],
+            ['playmakers', 'Prioritize Playmakers'],
+          ]}
+          onSelect={(value) => setCareer('draftPhilosophy', value as SaveData['career']['draftPhilosophy'])}
+        />
 
-      <div className="p-4">
-        <div 
-          className="rounded-2xl p-6 flex flex-col items-center gap-6"
-          style={{ backgroundColor: 'var(--bg-surface)' }}
-        >
-          <div 
-            className="w-20 h-20 rounded-full flex items-center justify-center"
-            style={{ backgroundColor: 'var(--accent-primary)' }}
-          >
-            <Users className="w-10 h-10 text-white" />
-          </div>
+        <Picker
+          label="FA Aggressiveness"
+          value={save.career.faAggressiveness}
+          options={[
+            ['low', 'Low'],
+            ['medium', 'Medium'],
+            ['high', 'High'],
+          ]}
+          onSelect={(value) => setCareer('faAggressiveness', value as SaveData['career']['faAggressiveness'])}
+        />
 
-          <div className="text-center">
-            <h2 className="text-xl font-bold text-white mb-3">
-              Weekly Staff Meeting
-            </h2>
-            <p className="text-sm text-white/80 leading-relaxed">
-              Your coordinators and position coaches have prepared reports on player development, 
-              game planning, and upcoming opponents. Review the briefing materials and set your 
-              priorities for the week ahead.
-            </p>
-          </div>
+        <Picker
+          label="Extension Priority"
+          value={save.career.extensionPriority}
+          options={[
+            ['stars', 'Retain Stars'],
+            ['depth', 'Depth First'],
+            ['youth', 'Prioritize Youth'],
+          ]}
+          onSelect={(value) => setCareer('extensionPriority', value as SaveData['career']['extensionPriority'])}
+        />
 
-          <div 
-            className="w-full rounded-xl p-4 space-y-3"
-            style={{ backgroundColor: '#0B0F16' }}
-          >
-            <MeetingTopic title="Offensive Game Plan" status="Reviewed" />
-            <MeetingTopic title="Defensive Adjustments" status="Reviewed" />
-            <MeetingTopic title="Special Teams" status="Reviewed" />
-            <MeetingTopic title="Injury Updates" status="Reviewed" />
-          </div>
-
-          <Button
-            onClick={handleComplete}
-            className="w-full py-6 font-semibold text-white"
-            style={{ backgroundColor: 'var(--accent-primary)' }}
-          >
-            Complete Meeting
-          </Button>
-        </div>
+        <button onClick={completeMeeting} className="w-full py-3 rounded-xl text-white font-semibold" style={{ backgroundColor: 'var(--accent-primary)' }}>
+          Complete Strategy Meeting
+        </button>
       </div>
     </div>
   );
 }
 
-function MeetingTopic({ title, status }: { title: string; status: string }) {
+function Picker({
+  label,
+  value,
+  options,
+  onSelect,
+}: {
+  label: string;
+  value: string;
+  options: [string, string][];
+  onSelect: (value: string) => void;
+}) {
   return (
-    <div className="flex items-center justify-between">
-      <span className="text-sm text-white/80">{title}</span>
-      <span className="text-xs font-semibold text-[#22C55E]">{status}</span>
+    <div className="rounded-2xl p-4" style={{ backgroundColor: 'var(--bg-surface)' }}>
+      <div className="text-white font-semibold mb-3">{label}</div>
+      <div className="grid grid-cols-1 gap-2">
+        {options.map(([key, text]) => (
+          <button
+            key={key}
+            onClick={() => onSelect(key)}
+            className="text-left px-3 py-2 rounded-lg text-sm"
+            style={{
+              backgroundColor: key === value ? 'var(--accent-primary)' : '#0B0F16',
+              color: 'white',
+            }}
+          >
+            {text}
+          </button>
+        ))}
+      </div>
     </div>
   );
 }
 
EOF
)
