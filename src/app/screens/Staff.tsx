 (cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF' 
diff --git a/src/app/screens/Staff.tsx b/src/app/screens/Staff.tsx
index cf60ac67eb533937d2aeaa90188d07ee3d71f3c4..e9f3c2580c5fb908c67da467d26d48a68b9e935b 100644
--- a/src/app/screens/Staff.tsx
+++ b/src/app/screens/Staff.tsx
@@ -1,108 +1,89 @@
-import { useState } from 'react';
 import { TopHeader } from '../components/TopHeader';
-import { OVRBadge } from '../components/OVRBadge';
 import { useSave } from '../context/SaveProvider';
-import { getStaff, normalizeRole, Personnel } from '../data/leagueAdapter';
 
-const tabs = ['Staff', 'Openings', 'Free Agents'];
+type Coordinator = 'oc' | 'dc' | 'stc';
+
+const labels: Record<Coordinator, string> = {
+  oc: 'Offensive Coordinator',
+  dc: 'Defensive Coordinator',
+  stc: 'Special Teams Coordinator',
+};
 
 export function Staff() {
-  const { save } = useSave();
-  const [activeTab, setActiveTab] = useState('Staff');
+  const { save, setSave } = useSave();
+
+  const setPlan = (slot: Coordinator, value: 'hire' | 'delegate') => {
+    setSave((prev) => ({
+      ...prev,
+      staffPlan: {
+        ...prev.staffPlan,
+        [slot]: value,
+      },
+    }));
+  };
 
-  if (!save.userTeamId) {
-    return null;
-  }
+  const allDecided = (['oc', 'dc', 'stc'] as Coordinator[]).every((slot) => Boolean(save.staffPlan[slot]));
 
-  const staff = getStaff(save.userTeamId);
+  const finalizeBuild = () => {
+    if (!allDecided) return;
+    setSave((prev) => ({
+      ...prev,
+      flags: {
+        ...prev.flags,
+        staffBuilt: true,
+      },
+      news: [
+        {
+          id: `news_staff_build_${Date.now()}`,
+          headline: 'Staff Build Completed',
+          description: 'You finalized OC/DC/STC responsibilities. Strategy Meeting is now unlocked.',
+          timestamp: 'Just now',
+          cta: 'Open Hub',
+        },
+        ...prev.news,
+      ],
+    }));
+  };
 
   return (
-    <div 
-      className="min-h-screen"
-      style={{ backgroundColor: 'var(--bg-primary)' }}
-    >
-      <TopHeader title="Coaching Staff" />
+    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
+      <TopHeader title="Staff Build" />
 
       <div className="flex flex-col gap-4 p-4">
-        {/* Tab Selector */}
-        <div 
-          className="flex items-center gap-2 p-1 rounded-xl overflow-x-auto"
-          style={{ backgroundColor: 'var(--bg-surface)' }}
-        >
-          {tabs.map((tab) => (
-            <button
-              key={tab}
-              onClick={() => setActiveTab(tab)}
-              className="px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all"
-              style={{
-                backgroundColor: activeTab === tab ? 'var(--accent-primary)' : 'transparent',
-                color: activeTab === tab ? 'white' : 'rgba(255, 255, 255, 0.6)',
-              }}
-            >
-              {tab}
-            </button>
-          ))}
-        </div>
-
-        {/* Staff List */}
-        {activeTab === 'Staff' && (
-          <div className="flex flex-col gap-2">
-            {staff.length === 0 ? (
-              <div 
-                className="rounded-2xl p-6 text-center"
-                style={{ backgroundColor: 'var(--bg-surface)' }}
-              >
-                <p className="text-white/60">No staff members</p>
-              </div>
-            ) : (
-              staff.map((member) => <StaffRow key={member.personnelId} member={member} />)
-            )}
-          </div>
-        )}
-
-        {activeTab === 'Openings' && (
-          <div 
-            className="rounded-2xl p-6 text-center"
-            style={{ backgroundColor: 'var(--bg-surface)' }}
-          >
-            <p className="text-white/60">Staff openings coming soon</p>
+        {(['oc', 'dc', 'stc'] as Coordinator[]).map((slot) => (
+          <div key={slot} className="rounded-2xl p-4" style={{ backgroundColor: 'var(--bg-surface)' }}>
+            <div className="text-white font-semibold mb-3">{labels[slot]}</div>
+            <div className="grid grid-cols-2 gap-2">
+              <ChoiceButton label="Hire" active={save.staffPlan[slot] === 'hire'} onClick={() => setPlan(slot, 'hire')} />
+              <ChoiceButton label="Delegate" active={save.staffPlan[slot] === 'delegate'} onClick={() => setPlan(slot, 'delegate')} />
+            </div>
           </div>
-        )}
+        ))}
 
-        {activeTab === 'Free Agents' && (
-          <div 
-            className="rounded-2xl p-6 text-center"
-            style={{ backgroundColor: 'var(--bg-surface)' }}
-          >
-            <p className="text-white/60">Free agent coaches coming soon</p>
-          </div>
-        )}
+        <button
+          onClick={finalizeBuild}
+          disabled={!allDecided || save.flags.staffBuilt}
+          className="w-full py-3 rounded-xl text-white font-semibold disabled:opacity-50"
+          style={{ backgroundColor: 'var(--accent-primary)' }}
+        >
+          {save.flags.staffBuilt ? 'Staff Build Complete' : 'Finalize Staff Build'}
+        </button>
       </div>
     </div>
   );
 }
 
-function StaffRow({ member }: { member: Personnel }) {
+function ChoiceButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
   return (
-    <div
-      className="rounded-xl p-3 flex items-center gap-3 cursor-pointer hover:brightness-110 transition-all"
-      style={{ backgroundColor: 'var(--bg-surface)' }}
+    <button
+      onClick={onClick}
+      className="py-2 rounded-lg text-sm font-medium"
+      style={{
+        backgroundColor: active ? 'var(--accent-primary)' : '#0B0F16',
+        color: 'white',
+      }}
     >
-      <OVRBadge ovr={member.ovr} size="small" />
-      
-      <div className="flex-1">
-        <div className="text-sm font-bold text-white">
-          {member.firstName} {member.lastName}
-        </div>
-        <div className="text-xs text-white/60">
-          {normalizeRole(member.role)} • {member.age} yrs
-        </div>
-      </div>
-
-      <div className="text-right">
-        <div className="text-xs text-white/60">Specialty</div>
-        <div className="text-xs font-semibold text-white">{member.specialty}</div>
-      </div>
-    </div>
+      {label}
+    </button>
   );
 }
 
EOF
)
