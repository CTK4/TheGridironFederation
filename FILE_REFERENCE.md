# File Location Reference

## New Files Created

### Context & State Management
- `/src/app/context/SaveProvider.tsx` - React context for game state (NEW)

### Data Layer
- `/src/app/data/leagueDB.json` - Game database with teams, players, staff (NEW)
- `/src/app/data/leagueAdapter.ts` - Data access functions (NEW)

### Components
- `/src/app/components/BootGate.tsx` - Route guard for onboarding (NEW)

### Screens - Onboarding
- `/src/app/screens/CreateCoach.tsx` - Coach creation screen (NEW)
- `/src/app/screens/Interviews.tsx` - Team interview screen (NEW)
- `/src/app/screens/Offers.tsx` - Contract offer screen (NEW)

### Screens - Game Features
- `/src/app/screens/Staff.tsx` - Staff management screen (NEW)
- `/src/app/screens/StaffMeeting.tsx` - Weekly meeting screen (NEW)

### Assets
- `/public/logos/birmingham.png` - Birmingham team logo (NEW)
- `/public/logos/milwaukee.png` - Milwaukee team logo (NEW)
- `/public/logos/atlanta.png` - Atlanta team logo (NEW)
- `/public/logos/free_agent.png` - Free agent logo (NEW)

### Documentation
- `/INTEGRATION_SUMMARY.md` - Complete implementation documentation (NEW)

## Modified Existing Files

### Core App Files
- `/src/app/App.tsx` - Added SaveProvider wrapper
- `/src/app/routes.tsx` - Added onboarding routes and BootGate

### Game Screens (Updated to use real data)
- `/src/app/screens/Hub.tsx` - Now uses leagueDB, shows staff meeting CTA
- `/src/app/screens/Roster.tsx` - Uses real roster data from leagueDB
- `/src/app/screens/PlayerProfile.tsx` - Fetches player from leagueDB

## Unchanged Files (No modifications needed)
- `/src/app/screens/Draft.tsx`
- `/src/app/screens/Game.tsx`
- `/src/app/screens/Phone.tsx`
- `/src/app/screens/NotFound.tsx`
- All component files in `/src/app/components/`
- All UI components in `/src/app/components/ui/`
- `/src/app/data/mock-data.ts` (still used for news)

## How State Flows

```
App.tsx (SaveProvider)
  ↓
routes.tsx (BootGate checks state)
  ↓
Onboarding Flow:
  CreateCoach → setSave({userCharacterId, coach})
  Interviews → setSave({onboarding.interviewsCompleted})
  Offers → setSave({userTeamId})
  ↓
Main App (after userTeamId set):
  Hub, Roster, Staff, etc. read from save.userTeamId
  Use leagueAdapter to fetch data from leagueDB.json
  StaffMeeting → setSave({staffMeetingCompleted: true})
```

## Key Functions & Hooks

### useSave() hook (from SaveProvider)
```tsx
const { save, setSave, clearSave } = useSave();

// Read state
console.log(save.userTeamId);
console.log(save.coach.name);

// Update state (functional update)
setSave(prev => ({
  ...prev,
  staffMeetingCompleted: true
}));

// Update state (partial object)
setSave({ userTeamId: 'BIR' });

// Clear all data
clearSave();
```

### leagueAdapter functions
```tsx
import { 
  getTeam, 
  getRoster, 
  getPlayer, 
  getStaff,
  normalizeRole,
  getTeamLogoPath 
} from '../data/leagueAdapter';

const team = getTeam('BIR'); // Returns Team object or null
const roster = getRoster('BIR'); // Returns Player[]
const player = getPlayer('P001'); // Returns Player or null
const staff = getStaff('BIR'); // Returns Personnel[]
const displayRole = normalizeRole('WR_RB_COACH'); // Returns "WR/RB Coach"
const logoPath = getTeamLogoPath('birmingham'); // Returns "/logos/birmingham.png"
```

## Testing Checklist

- [ ] Clear localStorage and refresh → redirects to /create-coach
- [ ] Create coach → redirects to /interviews
- [ ] Complete all 3 interviews → "View Offers" button appears
- [ ] Select team offer → redirects to Hub
- [ ] Hub shows staff meeting CTA (red alert)
- [ ] Complete staff meeting → CTA disappears
- [ ] Roster shows players from selected team
- [ ] Click player → see detailed profile with ratings
- [ ] Staff screen shows coaching staff with normalized roles
- [ ] All navigation works (bottom nav, back buttons)
- [ ] Page refresh preserves state (localStorage persists)
