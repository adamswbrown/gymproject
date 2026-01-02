Good — this is already disciplined. We’re not throwing it away. We’re tightening it, renaming it, and hard-locking the Globo Gym identity so Cursor stops drifting or “interpreting”.

Below is a drop-in replacement rules file.
It keeps every architectural and behavioral constraint, but:
	•	Replaces Hitsona with Globo Gym
	•	Sharpens the corporate / parody-corporate tone
	•	Removes any ambiguity Cursor could exploit
	•	Explicitly separates “boring” from “friendly” (Globo Gym is boring and hostile)

⸻

📏 Cursor Project Rules — Globo Gym Booking System

1. Project Context (DO NOT RE-EVALUATE)
	•	Single-gym booking system (TeamUp-style)
	•	Brand identity: Globo Gym
	•	Fictional, hyper-corporate, impersonal gym chain
	•	Inspired by Dodgeball
	•	Performance-obsessed, sales-driven, sterile
	•	Backend is authoritative
	•	Frontend is Next.js App Router
	•	UI is functional, rigid, impersonal
	•	No second backend
	•	No client-side business logic

This is not a community gym, lifestyle brand, or friendly SaaS.

⸻

2. Core Architecture Rules (UNCHANGED, NON-NEGOTIABLE)

Backend
	•	Backend is the single source of truth
	•	Frontend must NEVER:
	•	Infer capacity
	•	Infer booking state
	•	Infer cancellation eligibility
	•	Infer role access
	•	Backend errors must be displayed verbatim

Frontend
	•	All API access goes through lib/api.ts
	•	No direct fetch() in pages or components
	•	No duplicated API logic

⸻

3. Auth & Access Control (NON-NEGOTIABLE)
	•	Role enforcement is backend + middleware
	•	Frontend must NOT rely on client-side role checks
	•	Auth rules:
	•	Unauthenticated → blocked from /dashboard/*
	•	Authenticated → blocked from /login and /register
	•	/dashboard redirects by role
	•	Roles:
	•	MEMBER
	•	INSTRUCTOR
	•	ADMIN

⸻

4. UI Design Rules — Globo Gym Doctrine (STRICT)

Visual Style
	•	Dark theme (black: #0B0F14, background: #0F172A, surface: #020617)
	•	Flat, high-contrast
	•	Corporate, aggressive, impersonal
	•	Feels like a large chain gym optimised for scale, not care
	•	Red accent (#E10600) for critical actions/errors
	•	Steel gray (#1F2937) for secondary elements
	•	Text: #F8FAFC (primary), #94A3B8 (muted)

Color System (Tailwind Config Source of Truth)
	•	Primary black: globo.black (#0B0F14)
	•	Accent red: globo.red (#E10600)
	•	Steel: globo.steel (#1F2937)
	•	Background: globo.background (#0F172A)
	•	Surface: globo.surface (#020617)
	•	Text: globo.text (#F8FAFC)
	•	Muted: globo.muted (#94A3B8)

Typography
	•	Headings: Oswald (condensed, uppercase, bold)
	•	Body: Inter (system-ui fallback)
	•	Letter spacing: tightest (-0.05em) for headings, wide (0.15em) for uppercase
	•	Border radius: none (0px) or minimal (2px, 4px)
	•	Shadows: hard (0 4px 0 rgba(0,0,0,0.8)) or inset (inset 0 0 0 1px rgba(255,255,255,0.05))
	•	Transitions: snap timing (cubic-bezier(0.4, 0, 1, 1))

Explicitly Forbidden for Public UI (NO EXCEPTIONS)
	•	Rounded pill buttons
	•	Soft corners (use 0px, 2px, or 4px max)
	•	Soft shadows (use hard shadows or inset only)
	•	Gradients
	•	Icons (except admin UI - see below)
	•	Animations
	•	Toast notifications
	•	Friendly empty states
	•	Motivational copy
	•	Welcoming language

Admin UI Exception (Internal Tools Only)
	•	Modals allowed for create/edit forms (keeps main view clean)
	•	Cards allowed for data presentation (grid layouts)
	•	Tables allowed for sessions list (better data scanning)
	•	Icon buttons allowed for quick actions (Edit/Delete)
	•	Status badges allowed (visual indicators)
	•	Search/filter allowed (operational efficiency)
	•	Admin UI should still feel corporate and functional, not friendly

If it feels welcoming, friendly, or "nice" — it is wrong.

⸻

5. Allowed UI Primitives (ONLY THESE)

Public UI Primitives:
	•	PageHeader
	•	Section
	•	ActionButton
	•	ScheduleCard
	•	StatLabel
	•	Navbar
	•	Footer

Admin UI Primitives (Internal Tools):
	•	Modal (for create/edit forms)
	•	ModalFooter (for modal action buttons)
	•	StatusBadge (for status indicators)
	•	Cards (for grid layouts in admin pages)
	•	Tables (for sessions list)
	•	Icon buttons (for quick actions)

Rules:
	•	No new layout primitives without explicit instruction
	•	No generic containers
	•	Admin UI can use modals/cards/tables for operational efficiency
	•	Public UI must remain flat and rigid
	•	Composition over invention

⸻

6. Typography Rules (LOCKED)

Headings
	•	Font: Oswald (from Tailwind config)
	•	Uppercase only
	•	Bold
	•	Condensed
	•	Letter spacing: tightest (-0.05em) or wide (0.15em) for uppercase
	•	Assertive, dominant tone

Body
	•	Font: Inter (from Tailwind config, system-ui fallback)
	•	Neutral, compact
	•	No expressive styling
	•	Standard letter spacing

Buttons
	•	Uppercase text
	•	Bold, rectangular
	•	Aggressive, dominant
	•	Letter spacing: wide (0.15em) for uppercase

Forbidden:
	•	Decorative fonts
	•	Friendly typography tricks
	•	Lowercase headings
	•	Soft, rounded typography

⸻

7. Forms & Inputs
	•	Square inputs only
	•	Consistent padding: px-4 py-2
	•	Focus state:
	•	Border color → --color-accent-primary
	•	No helper text
	•	No inline hints
	•	No progressive disclosure
	•	Required fields enforced client-side only

Forms should feel transactional, not supportive.

⸻

8. State Handling (MANDATORY PATTERNS)

Loading
	•	Text only
	•	Muted
	•	Opacity: 0.7
	•	Copy:
"Loading …"

Error
	•	Flat block
	•	Background: --color-bg-secondary
	•	Border + text: --color-accent-primary
	•	Backend message shown verbatim
	•	No retry button
	•	No apology copy

Empty
	•	Text only
	•	Muted
	•	Opacity: 0.7
	•	Blunt copy
Example: "No sessions scheduled."

Forbidden:
	•	alert()
	•	Toasts
	•	Snackbars
	•	Friendly phrasing

⸻

9. Admin UI Rules — Control Panel, Not UX
	•	Admin pages are internal operational tools
	•	Must be:
	•	Functional
	•	Rigid
	•	Corporate
	•	Efficient (not friendly)

CRUD Patterns:
	•	Create: Button opens modal with form
	•	Read: Cards (class types/instructors) or Table (sessions)
	•	Update: Edit button opens modal with form
	•	Delete: Icon button with confirmation (confirm() dialog only)
	•	Search/Filter: Available for data discovery
	•	Status badges: Visual indicators (active/inactive, scheduled/cancelled)

Layout:
	•	Grid layouts for cards (responsive: 1 col mobile, 2-3 cols desktop)
	•	Table layout for sessions (better data scanning)
	•	Modal forms keep main view clean (no always-visible forms)
	•	Icon buttons for quick actions (Edit/Delete)

Errors:
	•	Backend errors shown verbatim
	•	No apology copy
	•	No retry buttons

Admins are operators, not users. UI should be efficient and corporate, not welcoming.

⸻

10. Time & Dates
	•	All times are UTC
	•	datetime-local inputs represent UTC
	•	No timezone conversion
	•	Display formatting only
	•	No inferred logic

⸻

11. Naming & Consistency
	•	API functions follow one naming convention
	•	No mixed patterns (getAdminX vs getX)
	•	Inconsistencies must be refactored when found
	•	No duplication tolerated

⸻

12. What Cursor Must NOT Do

Cursor must NOT:
	•	Suggest redesigns
	•	Introduce abstractions
	•	Add UX polish
	•	Add animations
	•	Add confirmation dialogs
	•	Add optimistic UI
	•	Add friendly copy
	•	Re-litigate settled decisions
	•	“Improve” the experience

⸻

13. Decision Authority

If unsure:
	•	Follow existing patterns
	•	Match existing pages
	•	Prefer blunt correctness over elegance

If a backend endpoint does not exist:
	•	Do NOT fake it
	•	Do NOT infer data
	•	Leave a TODO and stop

⸻

14. Tailwind Config (Source of Truth)

The Tailwind config defines the Globo Gym design system:
	•	Colors: globo.black, globo.red, globo.steel, globo.background, globo.surface, globo.text, globo.muted
	•	Fonts: heading (Oswald), body (Inter)
	•	Border radius: none (0px), sm (2px), md (4px)
	•	Shadows: hard, inset
	•	Letter spacing: tightest, wide
	•	Transitions: snap timing

All styling must align with this config. CSS variables should map to Tailwind colors.

⸻

15. Prime Directive

This project values discipline over creativity.

If a change makes the system feel nicer rather than clearer or stricter,
it is wrong.

Globo Gym is intentionally impersonal, corporate, and aggressive. The UI should
feel like it was designed by a hyper-corporate gym chain focused on scale and
dominance, not user comfort or community.
