# Personal Life Management App — Concept Document (v2)

*This document supersedes the earlier concept draft. It reflects a deeper
design pass that reframed the app's core premise and added the emotional/
visual design language, the local/cloud data model, the archive system, the
full AI capability layer, and screen-by-screen specifications.*

---

## 1. Core Premise

**This app does not offer todos, habits, or any fixed feature set as its
product.** It offers two things:

1. **Generic containers** — Projects and Focuses — that the user populates
   with whatever data, category, or style fits their own life.
2. **An AI capability layer** — read/write access to the user's data,
   collaborative planning, scheduled automation, and freeform-note
   classification — applied across those containers.

Todos, deadline tracking, habits, and similar concepts are common **default
templates** that live inside containers; they are not the product itself.
This distinction matters: it is the deliberate alternative to Notion's
failure mode of trying to be a general-purpose tool that does everything. The
promise of this app is narrower and more specific — supporting a good,
proactive lifestyle and light idea capture, not replacing a general workspace.

**North-star requirement.** The first-open Dashboard is the single most
important surface in the app. It must give the user a confident, accurate
overview of whatever containers they have built, without ever feeling
overwhelming, while still allowing fast entry of new information. Every other
design decision in this document should be evaluated against whether it
protects this property.

---

## 2. Origin & Problem Framing

This concept was developed directly against specific frustrations with the
user's current system (Notion), and specific things about it worth
preserving. Both lists are included here because they explain *why* later
sections are shaped the way they are.

**Frustrations to solve:**
- Slow loading, especially on mobile
- Needing an internet connection, and being slow even when online
- Information nested several levels deep — reaching anything takes effort
- A dashboard too busy to be useful, offering no fast way to capture new
  information, with too much scrolling
- An interaction model built for desktop, not mobile
- No stats or sense of progress — but also no pressure, which was valued
- No native iOS presence (widgets, quick interaction) — the app itself had to
  always be opened
- Trying to solve too many unrelated problems at once (notes, workspace,
  database, website builder) instead of staying focused

**What worked and had to be preserved:**
- A structured but aesthetically cozy, customizable homepage
- Effectively unlimited note-taking capacity, with the ability to freely
  associate notes to topics/projects (graph/subfolder-style)
- The specific feeling Bevel Health produces: motivation that sticks because
  the user builds their own plan collaboratively with the AI, rather than
  being told what to do by the app

---

## 3. Structure

The app has exactly **four top-level sections**: Dashboard, Projects,
Focuses, Account.

Each section, except Account, follows the same three-tier navigation
pattern, guaranteeing shallow and predictable depth everywhere in the app —
a direct countermeasure to Notion's deep-nesting problem:

```
Section overview (glanceable, customizable)
   → Management tab / "see all" (browse and edit everything in this section)
      → Item detail page (full context on one specific thing)
```

**Projects** are containers for things with a defined outcome — they can be
completed and archived. The user decides what each Project actually holds
(todos, milestones, notes, or something else entirely).

**Focuses** are containers for standing, evergreen parts of life — habits,
recurring lists, ongoing concerns. Again, the user decides what each Focus
holds and how it behaves. **General** is a built-in, always-present Focus
that acts as the default home for anything (typically todos) that isn't tied
to anything more specific.

**Account** is the one section that is deliberately **not customizable**. It
is a control surface, not a content surface — every setting, permission, and
piece of account information must always be fully visible and reachable,
never hidden by a layout choice.

**Standing design rule:** anything reachable from more than one entry point
in the app is always the *same underlying screen* — never a duplicate or
divergent copy. (Applies today to: Archive, AI Settings, Stored AI
Documents — and should be treated as a default expectation for any future
addition with multiple entry points.)

---

## 4. Screens

### 4.1 Dashboard

The default landing screen. Opens to **today**.

**Layout, top to bottom:**

1. **Three fixed glance metrics**, shown together but kept conceptually
   separate (never blended into one number):
   - Today's adherence/productivity (plan vs. actual — e.g. today's todo
     completion)
   - Overall Projects momentum
   - Overall Focuses momentum
2. **Today's outline** — a digest of the day's calendar events (not a
   calendar UI) plus remaining todos for today.
3. **Spotlight cards** — up to 5, user-configurable. Each can be pinned to a
   specific container or set to a dynamic filter (recently interacted,
   random, highest interaction, etc.). Ships with one default card
   ("recently interacted") so a new user's Dashboard is never empty.

**"My Week"** is a separate page, reached with one tap from the Dashboard —
not part of the default landing view, and not part of the same screen. It
presents a list/outline across the seven days of a chosen week. Navigating
to a different week is done through explicit controls (e.g. a button), not
swipe gestures.

### 4.2 Projects Overview

**Layout, top to bottom:**

1. **Overall project activity** — an aggregate summary, more detailed than
   the Dashboard's glance-level metric.
2. **Pinned Projects** — 0 to 5, user-chosen and user-ordered. Card content
   is fixed for MVP: last interaction (e.g. a recent note or a recently
   completed todo) and the next ~3 todos. Tapping a card's **title** opens
   that Project's detail page. (Per-Project card customization — letting the
   content shown differ by the Project's own style — is a planned future
   capability, intentionally not built for MVP.)
3. **"See all Projects"** — full list, with a toggle to reveal archived
   Projects (hidden by default).

### 4.3 Focuses Overview

**Layout, top to bottom:**

1. **Top 3 scored Focuses by momentum** — only Focuses with scoring
   configured are included here; this is not a blended aggregate across all
   Focuses.
2. **Pinned Focuses** — 0 to 5, user-chosen and user-ordered. Unlike Project
   cards, content here is **variable**: a card can be a passive summary, or
   a direct tracking interaction (e.g. marking a habit done right from the
   card, without opening the detail page). Tapping a card's **title** opens
   the detail page; the rest of the card is available for interaction.
3. **"See all Focuses"** — same pattern as Projects: full list, archived
   toggle, hidden by default.

### 4.4 Account

Fixed, non-customizable. Organized as:

- **Archive** — shown first, as its own prominent card, reflecting how
  central it is to the app's philosophy (see Section 8).
- **A 2-column grid of icon + subtitle cards** below it, each linking to a
  dedicated sub-screen: Account info, AI Settings/Permissions, Automations
  (scheduled triggers), Stored AI Documents, and any future settings
  category (e.g. theming, once reintroduced post-MVP).

### 4.5 AI Chat

Reached via its own persistent bottom-of-screen button (separate from the
plus/create button).

- Opens **directly into a conversation** — no inbox or menu gate first.
- If a recent conversation exists, it resumes automatically.
- If starting fresh, the empty state shows suggested entry points (e.g.
  "Plan new project," "Review recent notes") alongside the option to type
  freely.
- A button provides access to **recent chats**.
- A button provides access to **Stored AI Documents** — persistent,
  AI-authored content such as a collaboratively built weekly plan. Also
  reachable from Account (same screen, two entry points).
- A **settings button** on this screen opens the same AI Settings page
  reachable from Account — not a separate or divergent settings surface.

### 4.6 Persistent Navigation

Two buttons are present at the bottom of the screen across the entire app:

- **Plus button** — universal create surface (see Section 9)
- **AI Chat button** — opens the AI Chat screen (4.5)

---

## 5. Todos & Calendar

**Todos** are never a standalone top-level section. Every todo belongs to
either a Project or a Focus (General being the default Focus for anything
untethered). Two conceptual types exist: **general** (open-ended) and
**deadline/planned** (tied to a specific date or time).

A single **unified, filterable todo view** exists across the whole app —
reachable from anywhere, and pre-filtered automatically when opened from
within a specific Project or Focus.

**Calendar** functionality is deliberately not rebuilt inside the app.
Calendar data lives in the user's existing native calendar system (iOS/
Google), potentially spread across multiple named calendars (e.g. a
vacation calendar, a private calendar, a university calendar). The app:

- Reads events to build the Dashboard's daily outline and the "My Week"
  page
- Allows the AI to create or modify events, deciding which specific
  calendar an event belongs to using the same association logic used to
  route todos and notes to Projects/Focuses
- Supports genuine back-and-forth discussion with the AI before an event is
  created or changed (not one-shot insertion)

The app does **not** attempt to replicate calendar UI (multi-day grids,
drag-to-reschedule, invitations) — the user's existing calendar app remains
the tool for that.

---

## 6. Tracking, Scoring & Journaling

**Scoring is a configurable capability of a Focus, not a property exclusive
to "habits."** Any Focus can optionally have a trend/momentum score turned
on. Habits are simply the most common example of a Focus with scoring
enabled — not a structurally distinct type. A scored Focus's score should
move gradually with consistency and dip gradually on a lapse; it should
never reset to zero on a single miss. This reflects a deliberate,
non-punishing design stance (see Section 10). The exact scoring inputs/rules
are left open at concept stage.

Focuses (scored or not) should be easy to edit, pause, or remove — this is
treated as a normal, expected user action, not a failure state to be
resisted by the design.

**Daily tracking** is opt-in per item (Project, Focus, or sub-item). Two
logging modes exist:

- **Structured** — quick taps, toggles, fields, or dropdowns. Produces
  exact, reliable data, suitable for feeding a trend score.
- **Freeform** — a written note instead of structured fields. Freeform
  entries are not parsed into a score; they register only as a
  presence/consistency signal (the item was engaged with that day or not),
  while the written content is stored in the knowledge base as context,
  equivalent to a quick-add note tagged to that day and item.

Each trackable item has a **global default** logging mode, which the user
can override for any individual entry at the moment of creating it.

**Progress should be communicated as a hybrid**: a numeric/visual score
alongside AI-generated language. Wording is treated as essential to how
progress actually *feels*, not a secondary or cosmetic layer — careless or
clinical AI phrasing at a low point in a score can undermine the
non-punishing design intent entirely, so this should be treated with real
care.

---

## 7. Quick-Add

The plus button is the **universal creation surface** for the entire app —
new Project, new Focus, new todo, new calendar event, a journal/tracking
entry, or a freeform note/info dump.

**Freeform notes** (dumped with no specified destination) can be resolved
two ways, both always available to the user:

- **Manual sort** — the user files it themselves.
- **AI-sort with confirmation** — the AI proposes where the note belongs
  (a Project, a Focus, or general knowledge base context), and the user
  confirms before it is filed.

Sorting does not have to happen immediately. Unresolved notes accumulate in
a **deferred, unsorted inbox**, which the app can prompt the user to review
later as a batch — a quick swipe/tap-confirm flow where the AI shows its
best-guess classification per item and the user confirms or redirects it.

---

## 8. Archive

Archive is a **first-class, soft-delete destination**, not a passive
overflow bin. It exists specifically so that deleting something the user
might regret losing is never the only option.

- **Directly accessible** — an explicit "Archive this" action is available
  wherever a Project or Focus can be managed, independent of any delete
  flow.
- **Also offered inside deletion** — attempting to delete something offers
  archiving as the default, safer alternative before committing to
  permanent removal.
- **Contents:** AI reference material (the "Resources" concept from PARA),
  completed/inactive Projects and Focuses, and anything the user chose to
  archive instead of delete.
- **Access:** shown as its own prominent card at the top of the Account
  screen; also reachable via each section's "see all" view through an
  archived-items toggle (hidden by default).

---

## 9. AI Capability Layer

The AI has real read/write access to the app's data — but strictly bounded
by user-controlled settings. This is treated as a first-class system, not an
implicit trust relationship.

**Permissions:**
- Set **per action type** (Create, Read, Update, Delete) **× per bucket**
  (Projects, Focuses) — not a single global switch, and not per individual
  item by default.
- A narrow, rarely-used escape hatch exists: an individual item can be
  excluded from AI access entirely, set at the moment of its creation.

**Confirm-before-write:**
- An independent toggle, separate from the permission settings above.
  Permission answers "is the AI allowed to do this kind of action at all";
  confirmation answers "does this specific instance still need my
  approval."
- Has a general default, and can be **overridden per scheduled trigger**, so
  a routine automation doesn't need to re-request approval every time it
  runs.

**AI-authored persistent documents:** beyond reading/classifying data the
user creates, the AI can author and maintain its own content over time — for
example, a weekly plan built collaboratively in conversation. These are
surfaced within the AI Chat screen and also reachable from Account (Stored
AI Documents).

**Scheduled triggers:** fully user-configurable automations, not a fixed
built-in set. A trigger consists of a prompt (what the AI does or checks),
a time, and recurrence settings — creatable and editable by both the user
and the AI. This is the mechanism that enables genuine collaborative,
ritual-style planning (e.g. an evening planning session, a recurring weekly
review) to exist as an emergent behavior of general capabilities, rather
than a single bespoke "planning" feature.

**Absolute user authority.** No AI action — whether manually requested or
triggered on a schedule — bypasses the user's permission or confirmation
settings. This principle governs every capability in this section without
exception.

---

## 10. Feel, UX & Visual Design Language

### 10.1 Target Emotional Profile

Ranked by importance, as defined by the user:

**Most important:**
- Feeling at home, comfortable
- Feeling progress

**Also important:**
- Feeling a sense of professionalism
- Feeling understood
- Feeling in control

**Hard no-gos (avoid at all costs):**
- Feeling overwhelmed
- Feeling rushed
- Feeling out of control
- Feeling like effort spent in the app was useless

Where these are in tension (e.g. "professional" pulling toward density and
sharper visual language, "at home/comfortable" pulling toward softness),
**comfort and progress take priority** — professionalism should be expressed
as a quality bar (nothing sloppy or inconsistent), not as a dominant visual
register.

### 10.2 Color

- **Base palette: washed/pastel, low saturation**, applied consistently
  across the whole interface, including status indicators — a "needs
  attention" state should not default to alarm-red.
- **Situational override:** genuinely extreme states (true urgency, a
  standout achievement) may use a brighter, more saturated color, breaking
  from the pastel baseline. This must be used sparingly and only for
  meaningful, rare moments — overuse would erode both the calm baseline and
  the signal's own meaning.
- **Light and dark mode are both required**, designed as a matched pair from
  the start rather than one derived automatically from the other — a pastel
  palette does not invert cleanly and needs its own consideration for dark
  backgrounds.
- **Color coding by container type:** Projects and Focuses each use a
  distinct, consistent color family across every place they appear (cards,
  icons, detail pages) — a wayfinding tool that lets a user recognize what
  kind of container they're looking at before reading any label.

### 10.3 Shape & Layout

- Rounded, soft geometry throughout — avoid sharp/angular shapes.
- Generous whitespace is the primary tool for calm — "calm" should mean
  unhurried and warm, not sparse or cold.
- Low information density per screen; one clear focal point per view.

### 10.4 Motion & Interaction Pacing

- No countdown timers, no urgency cues unless a situation is genuinely
  urgent.
- Animations should feel calm, not snappy or aggressive.
- No auto-advancing flows, no modal takeovers, no auto-dismissing content.
- Every AI-initiated action should be traceable and consistent with the
  permission/confirmation settings the user has chosen — nothing should
  change silently in a way the user didn't cause or approve.

### 10.5 Card Interaction Rule

Tapping a card's **title** opens its detail page. The remainder of the
card's body is available for direct interaction (e.g. marking a habit done
from a Focus card without opening the detail page). This single rule applies
uniformly to both Project and Focus cards, and is intended to extend
naturally to future interactive card types.

### 10.6 AI Persona & Voice

- The AI has a **single, consistent persona** — not a selectable character,
  not game-like. Whether it has a name (and what that name is) is
  intentionally left undecided at this stage; if named, the name should read
  as a quietly competent professional assistant, not a mascot or game
  companion.
- **Tone is configurable** on top of that fixed identity (e.g. warmer/more
  encouraging vs. more terse/direct) — the persona itself does not change,
  only how it speaks.
- Wording matters as much as any numeric indicator for how "progress" feels
  to the user (see Section 6) — this should be treated as a core design
  concern, not incidental copywriting.

### 10.7 Deferred to Post-MVP

- **Theme presets** — a curated set of selectable visual styles/vibes,
  chosen in Account settings (distinct from light/dark mode, which is
  required for MVP). Designed conceptually, but explicitly descoped from
  the initial build.

---

## 11. Knowledge Base & Data Model (Conceptual)

- **Structured domains** — todos, calendar event references, habit/Focus
  logs — remain strictly relational: always explicitly tied to one owning
  Project or Focus.
- **Freeform layer** — notes, quick-add dumps, Resources — is graph-like and
  loosely associative. A note can connect to multiple Projects, Focuses, or
  topics without needing a rigid, predefined relationship type. This is
  deliberately where the "unlimited configuration" quality of the user's
  previous Notion setup is preserved, scoped specifically to this layer
  rather than the whole app.
- **No practical ceiling on note-taking capacity.**

### 11.1 Local/Cloud Storage Model

- **Cloud** holds the complete, permanent record of everything, always —
  this is the backup and the source of truth, and also what allows moving
  between devices without data loss.
- **Local storage is a performance subset**, not the primary store:
  - Active items (Projects/Focuses currently in use) are mirrored locally
    for instant access.
  - Items that are **explicitly archived** by the user become cloud-only
    immediately.
  - Items that go **untouched for a standard, uniform timeout** (exact
    duration to be defined during implementation — no special per-type
    treatment) also become cloud-only.
  - Even for cloud-only items, **overview-level information (current score,
    short status summary) remains resident locally**, so glance-level
    screens (Dashboard, overviews) never depend on a network fetch. Only
    opening a full detail page for a cold item triggers a cloud fetch.
  - Interacting with any cloud-only item automatically restores its full
    data to local storage.
- **All score/trend calculations run on local data.**

This model directly addresses two of the original Notion frustrations
(slow loading, dependency on a live network connection) while still
preserving effectively unlimited storage.

---

## 12. Explicitly Out of Scope (Future Improvements)

The following are intentionally excluded from the current concept and
should not be designed or built as part of the initial version. Recorded
here for future reference only:

- **Team collaboration on Projects** — adding other people to a Project,
  assigning todos to them, working on shared calendar events, and
  collaborating on a Project as a team rather than as an individual.
- **Cloud sync + a Mac/desktop companion app** — extending beyond iOS-only.
- **Theme presets** (selectable visual style variants beyond light/dark
  mode) — designed conceptually (Section 10.7) but deferred from MVP.

---

## 13. Traceability — Original Frustrations to Resolution

| Frustration | Resolution |
|---|---|
| Slow loading | Native app + local-first storage of active/overview data |
| Needs internet, slow even then | Local mirror for active data; cloud only for backup/cold storage; overview data always local |
| Deep nesting | Fixed 3-tier depth (overview → management → detail) everywhere |
| Busy dashboard, no fast info dumping | Customizable Dashboard + universal plus button |
| Too much scrolling | Confidence-over-detail philosophy, capped spotlight card counts |
| Built for desktop, not mobile | Native, touch-first design throughout |
| Liked: structured, cozy, customizable homepage | Layout customization (card selection/order); theme presets designed, deferred to post-MVP |
| No stats but liked zero pressure; Bevel's co-planning feel | Non-punishing trend scores + AI-authored planning documents + user-configurable scheduled triggers |
| Liked: unlimited storage/configuration | No storage ceiling + graph-style freeform linking, scoped to the notes/resources layer |
| No native iOS presence | Native app with widgets |
| Notion tries to solve too much | Strict reframing: containers + AI capability is the product, not a fixed feature set |
| First-open moment is the most important feature | Explicit north-star requirement governing the Dashboard design |

---

## 14. Summary of Key Design Principles

For quick reference during design and development:

1. **Containers, not features.** Projects and Focuses are generic; the user
   decides what they hold.
2. **Shallow by construction.** Every section follows the same three-tier
   depth; nothing requires more taps than that to reach.
3. **Confidence over detail.** Glanceable surfaces show status, not
   statistics dumps; detail is always one tap away.
4. **Non-punishing by design.** No resets to zero, no guilt-driven language,
   no forced pressure — progress trends can dip and recover.
5. **User authority is absolute.** Every AI capability, however powerful, is
   bounded by explicit, user-controlled permission and confirmation
   settings — no exceptions, including for automations.
6. **Archive over delete.** The default assumption is that data is worth
   keeping; deletion is a deliberate, secondary choice.
7. **Multiple entry points, one destination.** Anything reachable from more
   than one place in the app is the same screen, never a divergent copy.
8. **Local-fast, cloud-complete.** Nothing the user actively uses should
   ever wait on a network request; nothing is ever truly lost.
