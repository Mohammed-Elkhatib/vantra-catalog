# Vantra Catalog: Design Strategy & Direction

**Date:** 2026-06-26
**Status:** Proposed direction for the client demo. Not final. This document is the
playbook for iterating or pivoting *after* the client meeting, so we apply their
feedback with a defined strategy instead of re-deriving from scratch (or repeating
the "AI-generated" mistakes we already caught and fixed this session).

---

## 1. Why this document exists

The visual design may be tweaked or rejected wholesale after the client sees it. That
is expected and fine. What must survive the meeting is the *reasoning*: the constraints,
the anti-pattern rules, the chosen direction with justifications, the axes that are still
open, and the fallback directions. With this written down, the post-feedback round is a
short, confident pass rather than a restart.

Read this first, then `PROJECT_EXPLAINER.md` (business/industry context) and
`CMS_WEBSITE_AUDIT.md` (the competitor we are beating).

---

## 2. Brief and constraints (locked this session)

- **Freedom:** Free hand to define a fresh identity. Differentiate *upward* from CMS
  Global, whose site is the dated reference we are beating (slow, gated, PDF-bound,
  Avenir + Bootstrap-blue + charcoal/white).
- **Personality:** Technical and precise (chosen over clinical, premium-editorial, and
  industrial). Engineering-grade, spec-forward, exact.
- **Audience:** HVAC engineers, MEP contractors, facility managers. Technical, spec-hungry,
  often on tablets on a job site. Plus a non-technical client buyer who must be impressed
  enough to pay a fair price.
- **Demo purpose:** Win the engagement at a fair price and surface what the client actually
  wants. The design is a conversation starter, not a final deliverable.
- **Data scope for the demo:** Curate ~15-20 *bulletproof* products (correctness over
  breadth). See the deep-review findings for the credibility issues to fix.
- **Practical consequence:** Keep the design cheap to change. Centralize design tokens
  (color, type, spacing as CSS variables / a single tokens module) so a pivot touches one
  place, not every component.

---

## 3. The anti-"AI-slop" strategy (most important to remember)

The client's reference (CMS) is low quality, but we must not look auto-generated either.
The `frontend-design` skill identifies three default looks that AI design clusters around,
regardless of subject. **Do not spend a free design axis on any of these:**

1. Warm cream background (~`#F4F1EA`) + high-contrast serif display + terracotta accent.
2. Near-black background + a single acid-green or vermilion accent.
3. Broadsheet layout: hairline rules, zero border-radius, dense newspaper columns.

**Specific tells we caught and removed this session:**

- The colored "candy pill" badge on a rounded card with one trendy accent (the
  shadcn/Tailwind default). This was in the first homepage/cards pass and is the single
  most recognizable vibe-coded signature.
- Decorative numbered eyebrows (`01 / 02 / 03`) that do not encode a real sequence.
- Default `Inter` everywhere and a generic sky-blue accent.
- Inflated/!-decorative stats with a gradient accent as the hero.

**Principles we design by (apply these on every future pass):**

- **Ground every distinctive choice in filtration's own world:** gauges, the efficiency
  curve, classification scales (MERV, EN 1822), octave-band insertion loss, pleated media,
  fusible links, coded model numbers. Distinctiveness comes from the subject, not from a
  trendy accent.
- **Type carries the personality.** Deliberate pairing, not the defaults.
- **Structure encodes truth.** Labels, scales, and dividers must mean something real.
- **Spend boldness in exactly one signature place;** keep everything else quiet. Then
  remove one more thing.
- **Quality floor (non-negotiable, never announced):** responsive to mobile, visible
  keyboard focus, `prefers-reduced-motion` respected, real (not lorem) copy.

---

## 4. Chosen direction: "Instrument"

**One line:** an engineering-grade catalog whose signature is that it renders filtration
*physics* as live instruments. Calm ink-on-paper, monospace data, a single instrument-red
indicator. It looks like a precision instrument's manual, not a SaaS landing page.

### Token system

**Color** (named hex):

| Token | Hex | Role |
|---|---|---|
| Paper | `#F6F7F9` | Background. Cool grey-white, deliberately *not* the cliché warm cream. |
| Ink | `#15181C` | Primary text, strong rules. |
| Steel | `#5B636E` | Secondary text (the galvanized-frame grey of the products). |
| Rule | `#E3E5E8` | Hairlines, table separators. |
| Instrument Red | `#D6321E` | Indicator ONLY: gauge needle, MPPS marker, active state. Never a fill. |
| Carbon | `#0B0C0E` | Optional dark anchor (footer, a single dark hero band if wanted). |

**Type:**

- Display + body: **IBM Plex Sans** (weights 400/500/600/700, tight tracking on headings).
- Data + utility: **IBM Plex Mono** (tabular numerals) for spec values, model codes, axis
  labels, classification ladders.
- Rationale: IBM Plex was designed for "the relationship between humans and machines,"
  which is exactly the subject. Monospace is *true* to coded nomenclature like
  `EHHT900-24x24x11.5-H14`. This is a justified choice, not Inter-by-default.

**Layout:** precise modular grid, generous left-aligned margins, hairline rules for
structure (not newspaper columns), small consistent radius (~2-4px). Density that feels
engineered, with real whitespace discipline.

**Signature (the one memorable thing):** filtration data rendered as instruments.
- The hero shows filtration's own artifact: the **MPPS efficiency curve** (the efficiency
  valley at ~0.3µm), drawn cleanly and optionally animated on load.
- Classification shown as an **EN 1822 grade ladder with a red needle** (E12 -> H13 ->
  **H14** -> U15 -> U16), replacing the candy pill.
- Pressure drop shown as a minimal **Magnehelic-style gauge**.
- Sound attenuators get **octave-band insertion-loss bars**.

No template ships any of this, and it is all literally true to the products.

### Why each choice is a choice, not a default

- Cool paper instead of warm cream: dodges AI-default #1.
- Light base instead of dark+acid: dodges AI-default #2 (the dark "Control Room" option is
  kept as a fallback, see section 6).
- Radius and instrument visuals instead of zero-radius newspaper columns: dodges #3.
- Plex over Inter; red as a needle not a badge; data-viz as furniture instead of stock
  cards: each is derived from the brief and the subject.

---

## 5. Page-by-page treatment (concise)

- **Home:** hero thesis = the physics (efficiency curve / airflow) + the value prop (open
  catalog, instant specs, no gate) + category entry. No inflated stat-with-gradient hero.
- **Catalog / listing:** filter rail + product cards using the grade-ladder/needle and mono
  specs. Honest counts (fix the inflated category counts from the review).
- **Product detail (the crown jewel, already the strongest page):** spec tables as
  instruments, the variant selection chart, the model-number decoder, ungated downloads,
  and an inquiry CTA. Keep this information architecture; restyle into the token system.
- **Contact:** inquiry form. (Mock submit for the demo; real backend is post-demo.)

---

## 6. Tunable axes and fallback directions (for the post-feedback round)

**Open knobs on "Instrument" (cheap to change if tokens are centralized):**

- Accent: "instrument red" vs. a more unexpected, ownable hue.
- Paper tone: cool grey-white (current) vs. warmer.
- Hero signature: efficiency curve vs. ΔP gauge vs. animated airflow field. Pick one.
- A single dark band (borrowing the "Control Room" energy) for the hero, while pages stay
  light.

**Directions explored and parked (so a pivot is fast):**

- **B "Control Room":** dark graphite + luminous cyan, HMI/dashboard energy. Highest "wow,"
  most premium-tech. Risk: dark UI for long spec reading, and it drifts toward AI-default
  #2 if the cyan goes acid. Use only if the client explicitly wants drama.
- **C "Architectural Blueprint":** paper + faint drafting grid + technical navy + a red
  registration accent. On-theme for ductwork/CAD but more decorative; risks AI-default #3.

**If the client rejects "Instrument" entirely, pivot guide:**

1. Re-apply section 3 (the anti-slop rules) no matter what they ask for.
2. Map their reaction to a direction:
   - "Too plain / want more impact" -> push type scale and whitespace toward premium-editorial,
     or introduce the dark hero band.
   - "Too cold / want to feel part of CMS" -> align closer to CMS cues (their blue, corporate
     calm) but keep the instrument signature so it is still distinctive.
   - "Too technical for our buyers" -> dial back the data-viz density, keep Plex Mono + the
     grade ladder as the lightweight signature.
3. Keep the product-detail information architecture in every case. It is the real
   differentiator over CMS and is independent of the skin.

---

## 7. Session decision log

1. **Repo foundation** established first: git init, `.gitignore`/`.gitattributes`/`.nvmrc`,
   working ESLint config, baseline commit, pushed to a private GitHub repo
   (`Mohammed-Elkhatib/vantra-catalog`).
2. **Brand constraint:** free hand, differentiate upward from CMS.
3. **Personality:** Technical and precise.
4. **First directions (A/B/C) drifted toward AI defaults.** Client (user) flagged the
   amber pill as a vibe-coded tell. Confirmed against the `frontend-design` calibration.
5. **Corrected to "Instrument":** grounded the look in filtration artifacts, swapped the
   pill for a grade ladder + needle, chose IBM Plex, restricted red to an indicator.
   Direction approved at the demo-appropriate level; detailed tuning deferred to
   post-feedback.

---

## 8. What we are deliberately NOT doing now

- Detailed visual tuning (deferred until we have client reaction).
- Building anything before the implementation plan is written and approved.
- Treating this design as final. Implementation must keep tokens centralized so the skin
  is swappable, because there is a real chance the client redirects it.
