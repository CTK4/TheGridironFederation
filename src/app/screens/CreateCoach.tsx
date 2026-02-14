 (cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF' 
diff --git a/src/app/screens/CreateCoach.tsx b/src/app/screens/CreateCoach.tsx
index 3464a61029904c8062763f32b5ec4ec0301c1605..2a54e8613371c10722bdc6f63920c355280c5e61 100644
--- a/src/app/screens/CreateCoach.tsx
+++ b/src/app/screens/CreateCoach.tsx
@@ -13,56 +13,55 @@ export function CreateCoach() {
   const [coachName, setCoachName] = useState('');
   const [coachAge, setCoachAge] = useState<number>(35);
   const [hometown, setHometown] = useState('');
   const [personality, setPersonality] = useState('balanced');
 
   const handleSubmit = (e: React.FormEvent) => {
     e.preventDefault();
     
     if (!coachName.trim()) {
       alert('Please enter a coach name');
       return;
     }
 
     // Create new save with coach data
     setSave({
       userCharacterId: `COACH_${Date.now()}`,
       coach: {
         name: coachName,
         age: coachAge,
         hometown: hometown || 'Unknown',
         personality,
       },
       league: {
         season: 2026,
         week: 1,
         phase: 'offseason',
       },
       onboarding: {
         interviewsCompleted: [],
       }, 
     navigate('/interviews');
   };
 
   return (
     <div 
       className="min-h-screen"
       style={{ backgroundColor: 'var(--bg-primary)' }}
     >
       <TopHeader title="Create Your Coach" showBack={false} />
 
       <div className="p-4">
         <div 
           className="rounded-2xl p-6"
           style={{ backgroundColor: 'var(--bg-surface)' }}
         >
           <h2 className="text-xl font-bold text-white mb-6">Coach Profile</h2>
 
           <form onSubmit={handleSubmit} className="flex flex-col gap-6">
             <div className="flex flex-col gap-2">
               <Label htmlFor="coach-name" className="text-white/80 text-sm font-medium">
                 Name *
               </Label>
               <Input
 
EOF
)
