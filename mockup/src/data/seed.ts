/**
 * Sample data for the mockup. Everything the app shows is derived from here;
 * nothing is fetched. Mirrors the data in the Claude Design prototype.
 */
import type {
  AiMessage, ArchiveStaticItem, Automation, CalEvent, Focus, InboxItem, Milestone, ModuleId,
  Note, Permissions, Project, Resource, SimpleDate, SpotlightCard, StoredDoc, Subitem, Todo,
} from '../domain/types';

/** The mock clock: "today" and "now" are frozen so the sample data stays coherent. */
export const TODAY: SimpleDate = { y: 2026, m: 7, d: 13 };
export const NOW_MIN = 13 * 60 + 45;

export const USER = { name: 'Alex Rivera', email: 'alex@example.com', initial: 'A', notesStored: '1,284' };

export const DASHBOARD_INSIGHT = 'Light day ahead — good window to push on Website Redesign.';
export const DASHBOARD_INSIGHT_CHAT = 'Light day ahead — good window to push on Website Redesign this afternoon.';

/** Projects momentum shown on the dashboard glance card. */
export const PROJECTS_MOMENTUM = 71;

export const projects: Project[] = [
  { id: 'p1', name: 'Website Redesign', progress: 64, status: 'active', archived: false, pinned: true,
    goal: 'Work on this 3 days a week', weekBars: [1, 1, 0, 1, 1, 0, 0],
    last: 'Note added — “Client wants a lighter hero”', lastWhen: '2h ago', touched: '2h ago' },
  { id: 'p2', name: 'Certification Prep', progress: 38, status: 'active', archived: false, pinned: true,
    goal: 'Study 4x weekly', weekBars: [1, 0, 1, 0, 1, 0, 0],
    last: 'Completed — “Module 4 quiz”', lastWhen: 'Yesterday', touched: 'Yesterday' },
  { id: 'p3', name: 'Apartment Move', progress: 82, status: 'active', archived: false, pinned: false,
    goal: null, weekBars: [1, 1, 1, 0, 0, 0, 0],
    last: 'Completed — “Pack kitchen boxes”', lastWhen: '3d ago', touched: '3d ago' },
  { id: 'p5', name: 'Tax return 2025', progress: 45, status: 'paused', archived: false, pinned: false,
    goal: null, weekBars: [0, 0, 0, 0, 0, 0, 0],
    last: 'Paused — receipts collected, filing left', lastWhen: 'Aug 30', touched: '2w ago' },
  { id: 'p6', name: 'Balcony garden', progress: 100, status: 'completed', archived: false, pinned: false,
    goal: null, weekBars: [0, 0, 0, 0, 0, 0, 0],
    last: 'Completed — beds planted and watered in', lastWhen: 'Sep 11', touched: '5d ago' },
  { id: 'p4', name: 'Journal App Side Project', progress: 100, status: 'completed', archived: true, archivedOn: 'Jun 2', pinned: false,
    goal: null, weekBars: [0, 0, 0, 0, 0, 0, 0],
    last: 'Archived on completion', lastWhen: 'Jun 2', touched: 'Jun 2' },
  { id: 'p7', name: 'Freelance portfolio', progress: 100, status: 'completed', archived: true, archivedOn: 'Mar 18', pinned: false,
    goal: null, weekBars: [0, 0, 0, 0, 0, 0, 0],
    last: 'Archived on completion', lastWhen: 'Mar 18', touched: 'Mar 18' },
];

export const focuses: Focus[] = [
  { id: 'h1', name: 'Morning run', scored: true, score: 82, trend: 'up', pinned: true, paused: false, archived: false,
    card: { kind: 'log', items: ['Morning run', 'Post-run stretch'] }, lastLog: 'logged today' },
  { id: 'h2', name: 'Read 20 min', scored: true, score: 64, trend: 'flat', pinned: true, paused: false, archived: false,
    card: { kind: 'log', items: ['20 minutes read'] }, lastLog: 'logged yesterday' },
  { id: 'h3', name: 'No late screens', scored: true, score: 41, trend: 'down', pinned: false, paused: false, archived: false,
    card: { kind: 'log', items: ['Screens off by 23:00'] }, lastLog: 'logged 3d ago' },
  { id: 'h4', name: 'Meditate', scored: true, score: 73, trend: 'up', pinned: false, paused: true, archived: false,
    card: { kind: 'text', caption: 'Paused', text: 'Paused since Sep 11 — the score and history are kept.' }, lastLog: 'paused 5d ago' },
  { id: 's1', name: 'Nutrition', scored: false, pinned: true, paused: false, archived: false,
    summary: { note: 'Logging most meals this week.', ai: 'Protein intake trending up week over week.' },
    card: { kind: 'log', items: ['Breakfast', 'Lunch', 'Dinner'], caption: 'Meals' }, lastLog: 'noted 2d ago' },
  { id: 's2', name: 'Finances', scored: false, pinned: false, paused: false, archived: false,
    summary: { note: 'Budget reviewed last Sunday.', ai: 'Spending is tracking on plan for the month.' },
    card: { kind: 'note', caption: 'Recent note', text: 'Budget reviewed last Sunday — on plan for the month.' }, lastLog: 'noted Sunday' },
  { id: 'gen', name: 'General', scored: false, pinned: false, paused: false, archived: false, builtIn: true,
    card: { kind: 'text', caption: 'Your note on this focus', text: 'Default home for anything that is not tied to something more specific.' }, lastLog: 'used today' },
  { id: 's3', name: 'Language practice', scored: true, score: 28, trend: 'down', pinned: false, paused: true, archived: true, archivedOn: 'Jul 8',
    card: { kind: 'text', caption: 'Archived', text: 'Last logged Jul 8 — restore it to pick the streak back up.' }, lastLog: 'last logged Jul 8' },
];

export const todos: Todo[] = [
  { id: 't1', title: 'Send proposal draft', owner: 'Website Redesign', done: false, project: 'p1', type: 'deadline', due: 'Today', bucket: 'today' },
  { id: 't2', title: 'Book dentist appointment', owner: 'General', done: false, project: null, type: 'general', bucket: 'today' },
  { id: 't3', title: 'Pack kitchen boxes', owner: 'Apartment Move', done: true, project: 'p3', type: 'general', bucket: 'today' },
  { id: 't4', title: 'Review flashcards', owner: 'Certification Prep', done: false, project: 'p2', type: 'deadline', due: 'Fri' },
  { id: 't5', title: 'Reply to the landlord email', owner: 'General', done: false, project: null, type: 'deadline', due: 'Yesterday', bucket: 'overdue' },
  { id: 't6', title: 'Confirm van for Saturday', owner: 'Apartment Move', done: false, project: 'p3', type: 'deadline', due: 'Sat', bucket: 'week' },
  { id: 't7', title: 'Renew passport', owner: 'General', done: false, project: null, type: 'deadline', due: 'Oct 2', bucket: 'later' },
  { id: 't8', title: 'Rework hero section', owner: 'Website Redesign', done: false, project: 'p1', type: 'general', bucket: 'nodate' },
  { id: 't9', title: 'Module 4 quiz', owner: 'Certification Prep', done: true, project: 'p2', type: 'general' },
  { id: 't10', title: 'Replace worn shoes', owner: 'Morning run', done: false, project: null, type: 'general' },
  { id: 't11', title: 'Book physio check', owner: 'Morning run', done: false, project: null, type: 'deadline', due: 'Fri' },
  { id: 't12', title: 'Share staging link', owner: 'Website Redesign', done: false, project: 'p1', type: 'general', bucket: 'nodate' },
  { id: 't13', title: 'Book the exam slot', owner: 'Certification Prep', done: false, project: 'p2', type: 'deadline', due: 'Sep 26', bucket: 'later' },
];

/** Today's calendar, shown as a list on the dashboard. */
export const schedule: CalEvent[] = [
  { time: '8:30', end: '9:00', title: 'Team standup', cal: 'work' },
  { time: '12:30', end: '13:30', title: 'Lunch with Sam', cal: 'private' },
  { time: '15:00', end: '17:00', title: 'Deep work block', cal: 'work', linked: 'Website Redesign' },
  { time: '18:30', end: '19:30', title: 'Gym', cal: 'private', linked: 'Morning run' },
];

/** The current week, Monday first. Thursday (index 3) is today. */
export const weekEvents: CalEvent[][] = [
  [{ time: '9:00', end: '9:30', title: 'Standup', cal: 'work' }, { time: '11:00', end: '12:30', title: 'Design review', cal: 'work', linked: 'Website Redesign' }, { time: '18:30', end: '19:30', title: 'Gym', cal: 'private', linked: 'Morning run' }],
  [{ time: '8:30', end: '9:00', title: 'Standup', cal: 'work' }, { time: '14:00', end: '16:00', title: 'Deep work', cal: 'work', linked: 'Website Redesign' }, { time: '20:00', end: '21:00', title: 'Study block', cal: 'private', linked: 'Certification Prep' }],
  [{ time: '8:30', end: '9:00', title: 'Standup', cal: 'work' }, { time: '13:00', end: '14:00', title: 'Client call', cal: 'work', linked: 'Website Redesign' }, { time: '18:30', end: '19:30', title: 'Gym', cal: 'private', linked: 'Morning run' }],
  schedule,
  [{ time: '8:30', end: '9:00', title: 'Standup', cal: 'work' }, { time: '10:00', end: '11:00', title: 'Retro', cal: 'work' }, { time: '17:00', end: '18:00', title: 'Exam booking', cal: 'private', linked: 'Certification Prep' }],
  [{ time: '10:00', end: '12:00', title: 'Van + packing', cal: 'private', linked: 'Apartment Move' }],
  [{ time: '18:00', end: '19:00', title: 'Weekly review', cal: 'private' }],
];

/** Last 14 days of a scored focus. */
export const habitHistory = [40, 55, 62, 58, 70, 66, 74, 80, 76, 82, 78, 85, 82, 82];

export const storedDocs: StoredDoc[] = [
  { id: 'd1', title: 'Weekly plan — week of Sep 14', kind: 'Weekly plan', meta: 'Updated 2h ago · built with you Sunday' },
  { id: 'd2', title: 'Website Redesign rollout outline', kind: 'Outline', meta: 'Sep 9 · drafted from your notes' },
  { id: 'd3', title: 'Habit review — August', kind: 'Review', meta: 'Sep 1 · after your monthly review' },
];

export const docBodies: Record<string, string> = {
  d1: 'Week of Sep 14\n\nThe shape we agreed on Sunday: three deep-work mornings on Website Redesign, two study blocks for Certification Prep, and the move admin kept to Saturday so it does not leak into the week.\n\nMonday — deep work, 15:00–17:00. Hero rework.\nTuesday — study block, 20:00. Flashcards.\nWednesday — deep work, 14:00–16:00.\nThursday — study block, 20:00. Book the exam slot first.\nFriday — lighter day on purpose. Nothing scheduled after 16:00.\nSaturday — van at 10:00, packing until noon.\n\nOne thing to watch: the last two weeks both slipped on Thursday. If it slips again, moving the study block to the morning is the obvious fix.',
  d2: 'Website Redesign — rollout outline\n\nDrafted from your notes of Aug 30 and Sep 2.\n\n1. Staging build behind a password, shared with the client for a week of feedback.\n2. Copy freeze once the hero is settled — this is where the last project lost time.\n3. Launch on a Tuesday morning, never a Friday.\n4. Keep the current nav pattern. The client asked for this explicitly.',
  d3: 'Habit review — August\n\nMorning run carried the month: nineteen of thirty-one days, and the score ended higher than it started for the first time since spring.\n\nNo late screens was the opposite story, though the dips cluster around two work weeks rather than spreading evenly — which suggests it is a workload signal, not a willpower one.\n\nNothing here needs a change. If you want one anyway, the smallest useful move is a fixed reading slot before eleven.',
};

export const automations: Automation[] = [
  { id: 'a1', title: 'Evening planning session', when: 'Daily · 21:00', prompt: 'Review tomorrow and draft a plan with me.', confirm: true },
  { id: 'a2', title: 'Weekly review', when: 'Sundays · 18:00', prompt: 'Summarise the week across Projects and Focuses.', confirm: false },
];

/** Archive entries that are not Projects or Focuses. */
export const archivedResources: ArchiveStaticItem[] = [
  { id: 'r1', name: 'Mortgage paperwork notes', meta: 'AI reference · added May 3' },
  { id: 'r2', name: 'Course syllabus PDF', meta: 'AI reference · added Apr 22' },
];
export const archivedNotes: ArchiveStaticItem[] = [
  { id: 'an1', name: 'Old gym routine ideas', meta: 'Archived Aug 1' },
];

export const moduleCatalog: { id: ModuleId; label: string }[] = [
  { id: 'todos', label: 'Todos' },
  { id: 'milestones', label: 'Milestones' },
  { id: 'log', label: "Today's log" },
  { id: 'notes', label: 'Notes' },
  { id: 'events', label: 'Linked events' },
  { id: 'subitems', label: 'Checklists' },
  { id: 'resources', label: 'Resources' },
];

export const defaultModules: Record<string, ModuleId[]> = {
  p1: ['milestones', 'todos', 'notes', 'events', 'resources'],
  p2: ['milestones', 'todos', 'notes'],
  p3: ['todos', 'subitems', 'notes', 'events'],
  p4: ['milestones', 'notes'],
  p5: ['todos', 'notes'],
  p6: ['milestones', 'notes'],
  p7: ['notes'],
  h1: ['log', 'todos', 'notes', 'events'],
  h2: ['log', 'notes'],
  h3: ['log', 'notes'],
  h4: ['log'],
  s1: ['log', 'subitems', 'notes'],
  s2: ['notes', 'resources'],
  gen: ['todos', 'notes'],
  s3: ['log', 'notes'],
};

export const milestonesMap: Record<string, Milestone[]> = {
  p1: [
    { title: 'Brief signed off', when: 'Aug 12', done: true },
    { title: 'Wireframes approved', when: 'Sep 2', done: true },
    { title: 'Staging build live', when: 'Sep 24', done: false },
    { title: 'Launch', when: 'Oct 10', done: false },
  ],
  p2: [
    { title: 'Modules 1–4 complete', when: 'Sep 8', done: true },
    { title: 'Exam slot booked', when: 'Sep 26', done: false },
    { title: 'Sit the exam', when: 'Nov 3', done: false },
  ],
  p4: [
    { title: 'First working build', when: 'Apr 4', done: true },
    { title: 'Shipped to TestFlight', when: 'Jun 1', done: true },
  ],
  p6: [
    { title: 'Beds built', when: 'Aug 20', done: true },
    { title: 'Planted out', when: 'Sep 11', done: true },
  ],
};

export const subitemsMap: Record<string, Subitem[]> = {
  p3: [
    { title: 'Kitchen boxes', done: true },
    { title: 'Books and records', done: false },
    { title: 'Bathroom', done: false },
    { title: 'Balcony pots', done: false },
  ],
  s1: [
    { title: 'Protein at breakfast', done: true },
    { title: 'Two litres of water', done: true },
    { title: 'Vegetables at lunch', done: false },
  ],
};

export const resourcesMap: Record<string, Resource[]> = {
  p1: [
    { title: 'Brand guidelines.pdf', meta: 'AI reference · 8 pages' },
    { title: 'Competitor teardown', meta: 'Note · Aug 30' },
  ],
  s2: [{ title: 'Budget template', meta: 'AI reference · updated Sep 1' }],
};

/** The AI sentence in a tier-3 header: short by default, long behind "More". */
export const detailCopy: Record<string, { short: string; long: string }> = {
  p1: { short: 'Three of the four planned days worked this week. The hero rework is the only thing standing between you and the staging build.', long: 'Three of the four planned days worked this week. The hero rework is the only thing standing between you and the staging build.\n\nYou have been steadiest on mornings — the two missed days were both afternoons with meetings after three. Staging is due Sep 24, and at the current pace that lands with about two days to spare.' },
  p2: { short: 'Two study sessions so far this week against a target of four. Booking the exam slot would settle the rest of the plan.', long: 'Two study sessions so far this week against a target of four. Booking the exam slot would settle the rest of the plan.\n\nThe exam slots open on the first of the month and the morning ones fill quickly, according to your own note from Tuesday. Everything after that milestone is flexible.' },
  p3: { short: 'Nearly there — the van is confirmed for Saturday and packing is the only open thread.', long: 'Nearly there — the van is confirmed for Saturday and packing is the only open thread.\n\nKitchen is done. Books, bathroom and the balcony pots are left, which historically takes you about an evening each.' },
  h1: { short: 'Four runs in the last seven days — your most consistent stretch since June.', long: 'Four runs in the last seven days — your most consistent stretch since June.\n\nBoth skipped days followed a late meeting the night before. Nothing about the score needs attention; it is holding well above where it sat in August.' },
  h2: { short: 'Reading has settled into most evenings, a little shorter than usual but steady.', long: 'Reading has settled into most evenings, a little shorter than usual but steady.\n\nThe pattern looks like twenty minutes on weeknights and longer on Sundays.' },
  h3: { short: 'A couple of late nights this week nudged the score down. It recovers on its own with two normal evenings.', long: 'A couple of late nights this week nudged the score down. It recovers on its own with two normal evenings.\n\nYour note from Thursday wondered whether sleep quality tracks with this one — worth turning on if you want to find out.' },
  h4: { short: 'Sitting most mornings, and the score has been climbing quietly for three weeks.', long: 'Sitting most mornings, and the score has been climbing quietly for three weeks.' },
  s1: { short: 'Most meals logged this week, with protein at breakfast showing up as the change that sticks.', long: 'Most meals logged this week, with protein at breakfast showing up as the change that sticks.\n\nThis Focus is not scored, so nothing here is being graded — the log is only building context.' },
  s2: { short: 'Budget reviewed on Sunday and spending is tracking on plan for the month.', long: 'Budget reviewed on Sunday and spending is tracking on plan for the month.' },
  gen: { short: 'Four loose todos are living here, which is exactly what this is for.', long: 'Four loose todos are living here, which is exactly what this is for.\n\nNothing needs sorting unless you want it somewhere more specific.' },
  s3: { short: 'Archived in July. The score and the whole history are kept exactly as they were.', long: 'Archived in July. The score and the whole history are kept exactly as they were.' },
};

export const notes: Note[] = [
  { id: 'n1', text: 'Client wants a lighter hero — less copy, one image, and the CTA above the fold.', when: '2h ago', topics: ['Website Redesign'] },
  { id: 'n2', text: 'Runs feel easier when I go before breakfast. Try three early ones next week and see if it holds.', when: 'Yesterday', topics: ['Morning run', 'Nutrition'] },
  { id: 'n3', text: 'Exam slots open on the 1st of each month — book the morning one, afternoons are always full.', when: 'Yesterday', topics: ['Certification Prep'] },
  { id: 'n4', text: 'Ping landlord about the deposit refund — he said six weeks, it has been nine.', when: '3d ago', topics: ['General'] },
  { id: 'n5', text: 'Idea: track sleep quality alongside the screens habit. Might explain the dips.', when: '4d ago', topics: ['No late screens', 'General'] },
  { id: 'n6', text: 'Van is confirmed for Saturday 10am. Two hours, keys back by noon.', when: 'Sep 10', topics: ['Apartment Move'] },
  { id: 'n7', text: 'Protein at breakfast makes the biggest difference — eggs or skyr, not cereal.', when: 'Sep 8', topics: ['Nutrition'] },
];

export const noteBacklinksMap: Record<string, { label: string; meta: 'Project' | 'Focus' | 'AI document' }[]> = {
  n1: [{ label: 'Website Redesign', meta: 'Project' }, { label: 'Weekly plan — week of Sep 14', meta: 'AI document' }],
  n2: [{ label: 'Morning run', meta: 'Focus' }],
  n5: [{ label: 'No late screens', meta: 'Focus' }, { label: 'Habit review — August', meta: 'AI document' }],
};

export const noteAttachmentsMap: Record<string, Resource[]> = {
  n1: [{ title: 'hero-feedback.png', meta: 'Screenshot' }],
  n6: [{ title: 'van-booking.pdf', meta: 'Confirmation' }],
};

export const recentChats = [
  { id: 'rc1', title: 'Website Redesign pacing', when: 'Today' },
  { id: 'rc2', title: 'Moving Gym to evenings', when: 'Yesterday' },
  { id: 'rc3', title: 'Weekly plan draft', when: 'Sunday' },
];

/** Scripted assistant replies, cycled through in order. */
export const aiScript: { text: string; hasConfirm: boolean; confirmMsg?: string }[] = [
  { text: 'Sure — I can move Gym to 7:00 PM tonight and keep it on your Private calendar. Want me to make the change?', hasConfirm: true, confirmMsg: 'Done — moved Gym to 7:00 PM on your Private calendar.' },
  { text: "Your habit score dipped slightly on 'No late screens' this week — a couple of late nights, nothing urgent.", hasConfirm: false },
  { text: 'Based on your notes, Certification Prep needs two more study sessions to stay on your 4x/week goal.', hasConfirm: false },
];

export const initialAiMessages: AiMessage[] = [
  { id: 'seed1', role: 'user', text: "What's left on Website Redesign this week?" },
  { id: 'seed2', role: 'ai', text: "One open todo, and you're on pace — 3 of 4 planned days worked this week.", widgetLabels: ['Send proposal draft'] },
];

export const initialSpotlight: SpotlightCard[] = [
  { id: 'sp1', kind: 'dynamic', label: 'Recently interacted', target: 'Website Redesign', open: { kind: 'project', id: 'p1' }, body: 'Note added 2h ago — “Client wants a lighter hero”' },
  { id: 'sp2', kind: 'pinned', label: 'Focus', target: 'Morning run', open: { kind: 'focus', id: 'h1' }, body: 'Logged 5 of the last 7 days.' },
];

export const initialInbox: InboxItem[] = [
  { id: 'i1', text: 'Ping landlord about the deposit refund', guess: 'Focus → General' },
  { id: 'i2', text: 'Idea: track sleep quality alongside habits', guess: 'Focus → Health' },
];

export const initialPermissions: Permissions = {
  Projects: { C: true, R: true, U: true, D: false },
  Focuses: { C: true, R: true, U: false, D: false },
};
