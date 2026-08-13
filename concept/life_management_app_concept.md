# Personal Life Management App — Concept Document

## 1. Purpose & Philosophy

This app is a personal life-management system, not a fitness tracker and not a
calendar. It exists to unify the scattered pieces of a life-organization setup
(todos, calendar, habits, projects, goals, notes) into one coherent, AI-assisted
system that is faster and more intuitive to use than a general-purpose tool like
Notion.

**Inspiration, not imitation.** The interaction feel of health apps like Bevel
Health or Whoop is a reference point — a native app where AI is integrated
directly into the interface (not a separate chatbot bolted onto a dashboard),
where statistics are glanceable rather than overwhelming, and where the AI can
respond to a question by rendering the relevant data inline. The visual design
and specific widgets are not to be copied; only this interaction philosophy is
carried over.

**Core design principles:**

- **Confidence over detail.** Every glanceable surface (dashboards) should
  give the user a sense of where they stand, not a spreadsheet. Detail is
  always one tap away, never forced onto the first screen.
- **Non-punishing.** No streaks that reset to zero, no red failure states, no
  guilt-driven language. Progress is shown as a trend that can dip and
  recover, not a pass/fail grade.
- **One mechanism, many uses.** Where possible, a single interaction pattern
  (e.g. the quick-add/plus button, the confirm-before-write step, the
  structured/freeform tracking choice) is reused across the app instead of
  building a bespoke mechanic per feature.
- **The app is not a calendar.** Calendar semantics (multi-day grids,
  rescheduling, invites) already exist in iOS/Google Calendar and are not
  rebuilt. The app reads and writes to the native calendar and presents a
  digest — a daily/weekly outline — rather than a calendar UI of its own.
- **User control over AI, not implicit trust.** The AI is a capable assistant
  with real access to the user's data, but every category of write access is
  explicitly and separately controllable by the user.

---

## 2. Organizing Principle: PARA, Adapted

The app is structured loosely around the PARA method (Projects, Areas,
Resources, Archive), adjusted to fit a life-management app rather than a
note-taking system:

| PARA concept | In this app | Reasoning |
|---|---|---|
| Projects | **Projects** (top-level section) | Unchanged — things with a defined outcome/end state |
| Areas | **Focuses** (top-level section) | Renamed; standing responsibilities with no end date |
| Resources | Folded into **Account** | Reference material the AI can read for context; not a frequently browsed section |
| Archive | Folded into **Account** | Inactive/completed items, kept for retrieval only |

Projects and Focuses are **siblings** — neither contains the other. Both get
full first-class treatment: a dashboard overview, a management tab, and
detail pages for individual items.

---

## 3. Top-Level Structure

The app has exactly four top-level sections:

1. **Dashboard** — the daily landing point; an overview of everything relevant
   right now.
2. **Projects** — things with a goal and an end state.
3. **Focuses** — standing life categories that don't end (health, learning,
   finances, etc.), including habits.
4. **Account** — user info, settings, AI permission controls, and the
   Resources/Archive knowledge layer.

Each section (except Account) follows the same three-tier navigation pattern:

```
Section overview (dashboard-style, customizable)
   → Management tab (browse/edit everything in this section)
      → Item detail page (full context on one specific thing, including
         relevant data pulled from the knowledge base)
```

**Account is the one exception to customization.** Because it is a control
surface (settings, permissions, data management) rather than a content
surface, nothing in it can be hidden or reordered — every setting and every
piece of account info must always be fully visible and accessible.

**Customization elsewhere:** Dashboard, Projects, and Focuses all let the user
choose which cards appear and in what order, on both the top-level overview
and (where applicable) the management tab. There is no fixed default layout
that must be lived with — the app adapts to what each individual user
considers worth seeing.

---

## 4. Dashboard

The Dashboard is the app's landing screen and defaults to **today**.

**Default (today) view contains, at a glance:**
- A daily schedule outline — a readable digest of the day's calendar events,
  not a calendar grid.
- Today's todos (pulled from across Projects and Focuses, not a separate
  list).
- Current trend indicators (habit consistency, project momentum, etc.) shown
  at a glance level — a small number of simple indicators, not a full
  statistics view.
- Any AI-generated insight relevant to the day (e.g. noting a light schedule,
  an upcoming deadline, or a suggestion based on recent patterns).

**"My Week"** is a separate, dedicated page reachable with one tap from the
Dashboard. It is not part of the default landing view (to preserve the
glanceable nature of the Dashboard) and does not use swipe gestures. It shows
a list/outline view across the seven days of a week, and the user can
navigate to other weeks (past or near-future) by explicit navigation (e.g. a
button), not by swiping.

The Dashboard is fully user-customizable: the user chooses which cards to
show and in what order. There is no assumption that every user wants the same
glance-level information.

---

## 5. Projects

Projects are things with a defined outcome — they can be completed, and they
can be archived once done or abandoned.

**Projects overview (dashboard-style) shows:**
- Active projects, prioritized/curated by the user's customization choices.
- High-level trend/progress indicators per project and overall.

**Projects management tab shows:**
- Full list of active projects.
- Archived projects, separately accessible (not deleted, kept for reference
  and for the AI's knowledge base).
- Editing capability for any project's core info.

**Each project detail page includes:**
- Its own todos (see Section 7).
- Its own trend data (see below).
- Its own notes/knowledge base scoped to that project.
- An optional goal (e.g. "work on this 3 days a week") — see Section 9 for
  how goals and tracking work generally. Goals here are intentionally framed
  as a gentle, non-punishing reminder rather than a scored target.

**Project tracking:** each project can optionally track engagement over time
(e.g. how many days per week it was actively worked on). This is opt-in per
project, following the same tracking mechanism used across the rest of the
app (Section 9).

---

## 6. Focuses

Focuses are standing life categories with no end date — the things a person
keeps paying attention to indefinitely. This section houses three distinct
kinds of content:

### 6.1 Habits
- Tracked with a **trend/momentum score**, not a binary pass/fail and not a
  streak that resets on a miss. The score moves up with consistency and down
  with lapses, but a single missed day should dent the score, not zero it
  out.
- Both an overall habit score and individual per-habit scores are shown.
- Habits are easy to edit, pause, or delete if they turn out not to fit the
  user's life — this is treated as a normal, expected action, not a failure.
- The detail page for an individual habit shows its trend over time.

### 6.2 Standing life categories (non-habit)
Some parts of life are ongoing but don't reduce to a habit or a score —
for example nutrition, personal finances, or ongoing health/rehab matters.
These get the same card-based treatment as habits on the Focuses dashboard,
but instead of a numeric score, they show a status/notes summary, optionally
with an AI-generated one-line overview (e.g. summarizing recent notes or
flagging something worth attention), rather than a quantified metric.

### 6.3 General (default Focus)
"General" is always present as a built-in Focus. It exists so that todos or
notes with no natural Project or other Focus still have a home — every
trackable item belongs to either a Project or a Focus, with General acting as
the default when nothing more specific applies.

**Focuses overview (dashboard-style) shows:**
- Cards for active habits, standing categories, and general status —
  customizable by the user, same as the main Dashboard.

**Focuses management tab shows:**
- Full editable list of all habits and standing categories, including the
  ability to add, edit, pause, or remove any of them.

**Note on staggered habit installation:** users may want to introduce new
habits gradually rather than all at once (e.g. adopting one new habit every
few weeks rather than several simultaneously). The habit creation flow should
accommodate this pattern rather than assuming every habit becomes active
immediately upon creation.

---

## 7. Todos

Todos are not a separate top-level section — they always belong to either a
**Project** or a **Focus** (with General Focus as the default owner for
anything untethered).

Two conceptual types of todos exist:
- **General todos** — open-ended, no specific deadline.
- **Deadline/planned todos** — tied to a specific date or time.

**Unified todo view:** tapping into "todos" from anywhere in the app opens a
single, filterable view across all todos, regardless of which Project or
Focus owns them. The user can filter this view (e.g. by owner, by type, by
date). When opened from within a specific Project or Focus, the view is
pre-filtered to that context. The Dashboard shows the most relevant subset for
today, not the entire unified list.

---

## 8. Calendar Integration

The app does not contain a built-in calendar interface. Calendar data lives in
the user's existing iOS/Google Calendar system, across multiple named
calendars (e.g. a vacation calendar, a private calendar, a university
calendar).

**What the app does:**
- Reads events from the native calendar system to build the daily/weekly
  outline shown on the Dashboard and "My Week" page.
- Allows the AI to create or modify calendar events on the user's behalf,
  including deciding which specific calendar an event belongs to (e.g. a
  vacation goes to the vacation calendar, a friend meetup to the private
  calendar, a university event to the university calendar). This
  classification uses the same Project/Focus association logic used
  elsewhere in the app.
- Supports a genuine back-and-forth discussion with the AI before an event is
  created or changed (e.g. discussing scheduling options), not just one-shot
  insertion.

**What the app does not do:**
- It does not attempt to replicate calendar UI such as multi-day grid views,
  drag-to-reschedule, or invitations. The user's existing calendar app
  remains the tool for that.

All AI-initiated calendar writes are subject to the permission and
confirmation settings described in Section 11.

---

## 9. Tracking & Journaling

Any trackable item (a habit, a project, a standing Focus category) can
optionally be marked for **daily tracking**. This is opt-in, decided when the
item is created or edited — not every item needs to be tracked daily.

**Entry point:** the plus button (see Section 10) provides a journaling flow
that surfaces the specific items the user has opted into tracking.

**Two modes of logging an entry, chosen per tracked item:**

- **Structured** — quick taps, fields, toggles, or dropdowns (predefined
  options). This is the **global default** for a given tracked item, and
  produces exact, reliable data suitable for feeding a trend score.
- **Freeform** — the user writes a normal note instead of filling structured
  fields. Freeform entries are not parsed into a score; instead, they simply
  register as a presence/consistency signal (the item was engaged with today
  or not), while the written content itself is stored as context in the
  knowledge base — equivalent to a quick-add note, timestamped to that day
  and tagged to the relevant item.

**Per-entry override:** although each tracked item has a global default mode
(structured or freeform), the user can choose the other mode for a specific
entry at the moment of creating that entry, without changing the item's
default going forward.

This structured/freeform split intentionally keeps exact, scoreable data
separate from narrative context — the trend scores stay trustworthy because
they're only ever built from explicit structured input, while freeform
writing still contributes to the system without needing to be interpreted.

---

## 10. Quick-Add & the Plus Button

A single plus button, always accessible, is the universal entry point for
creating anything in the app:

- A new Project
- A new Focus (habit or standing category)
- A new todo
- A calendar event
- A journal/tracking entry (Section 9)
- A freeform info dump / note

**Freeform info dumps** (notes with no specified destination) are handled by
one of two paths, both available to the user:

- **Manual sort** — the user files the note themselves.
- **AI sort with confirmation** — the AI proposes where the note belongs
  (which Project, Focus, or the general knowledge base) and the user confirms
  before it is filed.

**Deferred sorting (unsorted inbox):** the user is not required to resolve
every quick-add immediately. Unsorted notes accumulate in an inbox, and the
app can prompt the user later to review and sort them together — a batch
review pass rather than forcing a decision at capture time. This review can
work as a quick swipe/tap-confirm flow: the AI shows its best-guess
classification for each unsorted item, and the user confirms or redirects it.

---

## 11. AI Access & Permissions

The AI has the ability to read, create, update, and delete data across the
app's knowledge base — but only to the extent the user allows. This is
treated as a first-class, user-controlled system, not an assumed default.

**Permission granularity:**
- Permissions are set **per action type** (Create, Read, Update, Delete) —
  not a single global on/off switch.
- Permissions are set **per bucket** (e.g. Projects, Focuses) — not globally
  across the whole app, and not individually per item.
- As a narrow escape hatch, an individual item can be marked as excluded from
  AI access at the moment of its creation, for edge cases where a specific
  item should never be touched by the AI regardless of the bucket-level
  setting. This is expected to be rarely used.

**Confirm-before-write:** independent of the CRUD permission settings, the
user can separately choose whether AI-initiated writes (create/update/delete
actions) require an explicit confirmation before they take effect, or happen
automatically once permitted. Read access does not require confirmation, as
it is non-destructive. Permission answers "is the AI allowed to do this kind
of action at all"; confirmation answers "does this specific instance still
need my approval" — these are two separate, independently configurable
settings.

All of these settings live in the Account section (Section 12) and are always
fully visible there, never hidden behind customization.

---

## 12. Account

Account is the app's fixed control surface — deliberately **not**
customizable, since every setting and control here needs to always be
reachable.

**Contains:**
- Core user account information.
- **Resources** — reference material the AI can draw on for context, not
  meant to be browsed frequently (the PARA "Resources" category).
- **Archive** — completed projects, removed habits/focuses, and other
  inactive material, retained for retrieval rather than shown actively
  elsewhere in the app.
- App settings, including all AI permission and confirmation controls from
  Section 11.

---

## 13. Knowledge Base

Underlying the entire app is a single knowledge base that every section reads
from and (with permission) the AI can write to. Conceptually, it holds:

- Todos (tagged to their owning Project or Focus, with type: general or
  deadline/planned)
- Calendar event references (cached view of what's in the native calendar,
  tagged by owning Project/Focus for routing purposes)
- Habits and their trend/momentum history
- Standing Focus categories and their status/notes
- Projects, their todos, trend/engagement history, and goals
- Freeform notes and quick-add dumps, sorted or unsorted
- Journal/tracking entries, structured or freeform, tagged to their date and
  owning item

Freeform, open-ended content (notes, quick-add dumps, resources) is treated
differently from the app's structured domains (todos, events, habits): the
structured domains are always explicitly related to a specific Project or
Focus, while the freeform knowledge layer is where looser, emergent
connections between pieces of information are allowed to exist — this is the
part of the system where a note might reasonably connect to multiple things
without a rigid, predefined structure.

The AI is expected to be able to answer questions using this knowledge base
with exact, grounded answers (pulling real data), and — subject to the
permission system in Section 11 — to modify it directly when asked.

---

## 14. Feature Summary (Traceability to Original Requirements)

| Original requirement | Where it lives in this concept |
|---|---|
| Reminds of todos, stores new ones | Todos (Section 7), tied to Project/Focus |
| Reads calendar, daily updates | Dashboard daily outline (Section 4), Calendar Integration (Section 8) |
| Inserts events into correct named calendars | Calendar Integration (Section 8) |
| Morning todos overview | Dashboard, default today view (Section 4) |
| Evening next-day planning with AI | Calendar Integration discussion flow (Section 8) + Dashboard/My Week |
| Easy access, not buried in a chat app | Native app, plus-button and Dashboard as primary surfaces |
| Widget-style overview anytime | Dashboard (today view), designed to be glanceable |
| Habit tracker with statistics | Focuses → Habits (Section 6.1) |
| Weekly plan overview | "My Week" page (Section 4) |
| Workout tracking | Handled as a Project or Focus per user's own setup (not a hardcoded feature — see Section 15) |
| Goals and achievements | Project goals (Section 5), Focus/habit trends (Section 6) |
| Central knowledge/database | Knowledge Base (Section 13) |
| AI has full CRUD access with exact answers | AI Access & Permissions (Section 11), Knowledge Base (Section 13) |
| Shopping list | Not a dedicated feature — modeled as a Project or Focus depending on the user's own life structure (Section 15) |
| General vs deadline/planned todos | Section 7 |
| Project progress tracking, own knowledge base | Section 5 |
| Notion-equivalent but simpler | Overall structure (Sections 2–4), customization (Section 3) |
| Bevel/Whoop-style interface, not health features | Design Philosophy (Section 1) |

---

## 15. Generalization Principle

The app is intentionally not built around a fixed list of life domains. Rather
than hardcoding features like "shopping list" or "workouts" as dedicated
sections, the app provides two generic building blocks — **Projects** and
**Focuses** — flexible enough that any individual user can model their own
specific needs on top of them. A user who wants a shopping list can create it
as a Focus (if it's a recurring, standing part of their life) or as needed
within an existing Focus; a user who doesn't need one simply never creates it.
This keeps the app applicable across different users' lives without forcing
a one-size-fits-all feature set.

---

## 16. Future Improvements (Out of Scope For Now)

The following ideas are intentionally not part of the current concept and
should be ignored for the initial design/build. They are recorded here for
future reference only.

- **Collaboration on Projects.** The ability to add other people to a
  Project, so that a Project can be worked on as a team rather than solely by
  the individual user — including assigning todos to specific people, and
  creating calendar events collectively rather than for one person's
  calendar alone.
- **Cloud sync + companion desktop app.** A cloud-based backend enabling the
  app's data to sync across devices, paired with a Mac/laptop version of the
  app rather than iOS-only.
