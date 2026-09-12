# Catharsa

An Indonesian mental wellbeing SPA with a warm cream and sage interface. Built with React 19, TypeScript, Tailwind CSS 4, Lucide React, Recharts, and accessible Base UI/Shadcn primitives. Vite runs through the Sites Vinext scaffold.

## Run locally

Requires Node.js 22.13+ and pnpm 11.

```sh
pnpm install
pnpm dev
```

The development server normally runs at `http://localhost:3000`. Use the exact address printed in your terminal. The public source repository is `https://github.com/SyntaxWasError/catharsa`.

```sh
pnpm typecheck
pnpm lint
pnpm test
pnpm build
pnpm start
```

`start` previews the compiled Cloudflare-compatible output locally. The source ZIP excludes dependencies, build caches, and machine-specific files. Install dependencies after extracting it.

## What works

- Home: an editorial two-column sanctuary hero, original walking-garden illustration, recurring “E” motif, responsive navigation, sprout quick check-in, direct feature links, and emergency help dialog.
- Consult: six fictional Indonesian profiles, composable search and specialty filters, three sort orders, total session prices, availability badges, reminder toast, and separate simulated chat threads. Replies arrive after 1.5 seconds and continue if the chat is closed.
- Track: five custom SVG sprout moods, an accessible slider, journal, save/loading/error states, browser persistence, an accessible seven-day Recharts chart and table, and asynchronous stepped-care analysis through `POST /api/analyze`. Mild results lead to matching education; moderate or urgent results prioritize a matching psychologist specialty. A new save replaces the same day's record. Old drafts keep their original date across midnight.
- Grow: topic filters, five complete short articles, a playable official WHO video, source links, and accessible dialogs.
- Keyboard support, visible focus, reduced-motion support, disabled/empty states, and optional WebMCP navigation.

## Source map

- `app/page.tsx`: React entry point, home view, navigation, and coordinated state.
- `components/catharsa-views.tsx`: directory, journal, and learning hub.
- `components/catharsa-modals.tsx`: chat, article/video, and emergency dialogs.
- `components/catharsa-ui.tsx`: brand, shared button styles, typography helpers, mood labels.
- `components/mood-sprout.tsx`: scalable mood-character SVG system.
- `components/mood-chart.tsx`: seven-day chart, accessible summary, and data table.
- `lib/catharsa-data.ts`: profiles, articles, and fallback mood samples.
- `lib/catharsa-model.ts`: pure date, storage, chart-record, and chat simulation logic.
- `lib/psychologist-directory.ts`: composable psychologist search, filtering, and sorting.
- `lib/mental-analysis.ts`: deterministic, non-diagnostic stepped-care classifier.
- `lib/mental-analysis-client.ts`: validated asynchronous client for the analysis endpoint.
- `app/api/analyze/route.ts`: Workers-compatible JSON analysis route.
- `app/globals.css`: Tailwind brand tokens, focus, and motion rules.
- `tests/catharsa-model.test.cjs`: domain tests run with Node's test runner.

## Simulation and privacy

This is a functional prototype. Profiles, credentials, ratings, prices, schedules, reminders, and chat replies are demonstration data. There is no psychologist connection, booking/payment backend, push-notification service, clinical diagnostic model, or real-time availability API.

Journal records use `localStorage` key `catharsa.journal.v1`. They stay in the current browser and are not encrypted; anyone using that browser profile can access them. On “Simpan & Analisis,” the selected mood and journal text are sent transiently to Catharsa's same-origin `/api/analyze` endpoint and are not persisted by the server. The current endpoint uses a deterministic, non-diagnostic rules engine (`catharsa-step-care-v1`) and does not call an external AI provider. Browser storage errors and analysis failures are reported separately, so an unavailable analysis service does not discard the local entry. Chat remains in memory and disappears after a reload. External YouTube content is loaded when the user chooses playback; the card thumbnail also comes from YouTube.

The optional Figma capture helper loads only when the URL explicitly contains a `figmacapture` hash parameter. Ordinary app sessions do not load it. Use synthetic journal/chat content when capturing designs, then remove the capture hash and reload to end the capture session.

The emergency panel links to real Indonesian services: 119 for medical emergencies and 119 extension 8 / Healing119 for psychological support. Only the emergency medical line is described as 24 hours; counselor availability follows the provider.

## Design and assets

Figma: https://www.figma.com/design/84VachDD0q4YAEN4rRAc8Z

The file contains brand foundations, reusable starter components, and editable baseline captures of desktop and mobile screens. The upgraded editorial hero, sprout mood system, and stepped-care states in this repository are the current implementation source of truth. Figma's Starter MCP quota prevented completing every screen as design-system component instances; captured screen layers remain editable.

| View            | Desktop                                                                          | Mobile                                                                           |
| --------------- | -------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| Beranda         | [Home](https://www.figma.com/design/84VachDD0q4YAEN4rRAc8Z?node-id=15-2)         | [Home](https://www.figma.com/design/84VachDD0q4YAEN4rRAc8Z?node-id=22-2)         |
| CatharsaConsult | [Directory](https://www.figma.com/design/84VachDD0q4YAEN4rRAc8Z?node-id=18-2)    | [Directory](https://www.figma.com/design/84VachDD0q4YAEN4rRAc8Z?node-id=23-2)    |
| CatharsaTrack   | [Journal](https://www.figma.com/design/84VachDD0q4YAEN4rRAc8Z?node-id=19-2)      | [Journal](https://www.figma.com/design/84VachDD0q4YAEN4rRAc8Z?node-id=24-2)      |
| Ruang Tumbuh    | [Learning hub](https://www.figma.com/design/84VachDD0q4YAEN4rRAc8Z?node-id=20-2) | [Learning hub](https://www.figma.com/design/84VachDD0q4YAEN4rRAc8Z?node-id=25-2) |

Additional mobile states: [Chat](https://www.figma.com/design/84VachDD0q4YAEN4rRAc8Z?node-id=26-2), [Emergency](https://www.figma.com/design/84VachDD0q4YAEN4rRAc8Z?node-id=28-2), [Journal reflection](https://www.figma.com/design/84VachDD0q4YAEN4rRAc8Z?node-id=29-2). The connector confirmed all captures completed. Direct browser inspection of Figma requires signing in.

- Sanctuary hero: original AI-generated artwork, included locally as `public/sanctuary-walk.png`; the supplied editorial reference guided layout and composition only.
- Mood marks: original SVG sprout characters derived from the supplied emotional-expression reference and rendered directly in React.
- Fonts: Plus Jakarta Sans for interface text and Cormorant Garamond for the editorial hero, fetched and served by the font integration.
- Icons: Lucide (ISC license).
- Video: WHO, “Doing What Matters in Times of Stress: An Illustrated Guide,” 2:12, embedded from its official YouTube channel.
- Original short reflections are labeled Catharsa editorial. WHO/NHS-derived educational summaries link to their sources.

## Validation

TypeScript, Oxlint, and production build pass. Fifteen domain tests cover date boundaries, same-day replacement, missing chart dates, storage validation, Unicode persistence, directory filters/sorting, chat escalation, analysis input validation, severe anxiety phrases, matching specialist destinations, and all four stepped-care paths. Browser checks cover the desktop editorial hero, 320px mobile layouts, sprout controls, loading/disabled behavior, live API results, and both education and psychologist routing. Synthetic journal text was used for browser testing.
