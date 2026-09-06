# Catharsa

An Indonesian mental wellbeing SPA with a warm cream and sage interface. Built with React 19, TypeScript, Tailwind CSS 4, Lucide React, Recharts, and accessible Base UI/Shadcn primitives. Vite runs through the Sites Vinext scaffold.

## Run locally

Requires Node.js 22.13+ and pnpm 11.

```sh
pnpm install
pnpm dev
```

The development server normally runs at `http://localhost:3000`. Use the exact address printed in your terminal. The private source repository is `https://github.com/SyntaxWasError/catharsa`.

```sh
pnpm typecheck
pnpm lint
pnpm test
pnpm build
pnpm start
```

`start` previews the compiled Cloudflare-compatible output locally. The source ZIP excludes dependencies, build caches, and machine-specific files. Install dependencies after extracting it.

## What works

- Home: responsive desktop/mobile navigation, quick mood check-in, direct feature links, emergency help dialog.
- Consult: six fictional Indonesian profiles, composable search and specialty filters, three sort orders, total session prices, availability badges, reminder toast, and separate simulated chat threads. Replies arrive after 1.5 seconds and continue if the chat is closed.
- Track: accessible mood slider, journal, save/loading/error states, browser persistence, an accessible seven-day Recharts chart and table, and contextual reflections. A new save replaces the same day's record. Old drafts keep their original date across midnight.
- Grow: topic filters, five complete short articles, a playable official WHO video, source links, and accessible dialogs.
- Keyboard support, visible focus, reduced-motion support, disabled/empty states, and optional WebMCP navigation.

## Source map

- `app/page.tsx`: React entry point, home view, navigation, and coordinated state.
- `components/catharsa-views.tsx`: directory, journal, chart, and learning hub.
- `components/catharsa-modals.tsx`: chat, article/video, and emergency dialogs.
- `components/catharsa-ui.tsx`: brand, shared button styles, typography helpers, mood labels.
- `lib/catharsa-data.ts`: profiles, articles, and fallback mood samples.
- `lib/catharsa-model.ts`: pure date, storage, filtering, and simulation logic.
- `app/globals.css`: Tailwind brand tokens, focus, and motion rules.
- `tests/catharsa-model.test.cjs`: domain tests run with Node's test runner.

## Simulation and privacy

This is a functional frontend prototype. Profiles, credentials, ratings, prices, schedules, reminders, chat replies, and automated insights are demonstration data. There is no psychologist connection, booking/payment backend, push-notification service, clinical diagnostic model, or real-time availability API.

Journal records use `localStorage` key `catharsa.journal.v1`. They stay in the current browser and are not encrypted; anyone using that browser profile can access them. Browser storage errors are surfaced without claiming a successful save. Chat remains in memory and disappears after a reload. External YouTube content is loaded when the user chooses playback; the card thumbnail also comes from YouTube.

The optional Figma capture helper loads only when the URL explicitly contains a `figmacapture` hash parameter. Ordinary app sessions do not load it. Use synthetic journal/chat content when capturing designs, then remove the capture hash and reload to end the capture session.

The emergency panel links to real Indonesian services: 119 for medical emergencies and 119 extension 8 / Healing119 for psychological support. Only the emergency medical line is described as 24 hours; counselor availability follows the provider.

## Design and assets

Figma: https://www.figma.com/design/84VachDD0q4YAEN4rRAc8Z

The file contains brand foundations and reusable starter components, plus editable captures of desktop and mobile app screens. Figma's Starter MCP quota prevented completing every screen as design-system component instances; captured screen layers remain editable.

| View            | Desktop                                                                          | Mobile                                                                           |
| --------------- | -------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| Beranda         | [Home](https://www.figma.com/design/84VachDD0q4YAEN4rRAc8Z?node-id=15-2)         | [Home](https://www.figma.com/design/84VachDD0q4YAEN4rRAc8Z?node-id=22-2)         |
| CatharsaConsult | [Directory](https://www.figma.com/design/84VachDD0q4YAEN4rRAc8Z?node-id=18-2)    | [Directory](https://www.figma.com/design/84VachDD0q4YAEN4rRAc8Z?node-id=23-2)    |
| CatharsaTrack   | [Journal](https://www.figma.com/design/84VachDD0q4YAEN4rRAc8Z?node-id=19-2)      | [Journal](https://www.figma.com/design/84VachDD0q4YAEN4rRAc8Z?node-id=24-2)      |
| Ruang Tumbuh    | [Learning hub](https://www.figma.com/design/84VachDD0q4YAEN4rRAc8Z?node-id=20-2) | [Learning hub](https://www.figma.com/design/84VachDD0q4YAEN4rRAc8Z?node-id=25-2) |

Additional mobile states: [Chat](https://www.figma.com/design/84VachDD0q4YAEN4rRAc8Z?node-id=26-2), [Emergency](https://www.figma.com/design/84VachDD0q4YAEN4rRAc8Z?node-id=28-2), [Journal reflection](https://www.figma.com/design/84VachDD0q4YAEN4rRAc8Z?node-id=29-2). The connector confirmed all captures completed. Direct browser inspection of Figma requires signing in.

- Forest hero: original AI-generated image, included locally as `public/forest.png`.
- Font: Plus Jakarta Sans, fetched and served by the font integration.
- Icons: Lucide (ISC license).
- Video: WHO, “Doing What Matters in Times of Stress: An Illustrated Guide,” 2:12, embedded from its official YouTube channel.
- Original short reflections are labeled Catharsa editorial. WHO/NHS-derived educational summaries link to their sources.

## Validation

TypeScript and production build pass. Eight domain tests cover date boundaries, same-day replacement, missing chart dates, storage validation, Unicode persistence, filters/sorting, and contextual recommendations. Browser checks cover desktop and 320px mobile views, search/sort/reminders, saving/reloading, simulated chat, articles, video playback, emergency links, and WebMCP valid/invalid navigation. A synthetic, explicitly labeled journal entry was used for browser testing.
