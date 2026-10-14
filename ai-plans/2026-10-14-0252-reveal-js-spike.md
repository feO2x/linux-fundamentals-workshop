# Integrate reveal.js Slide Deck (Spike)

*Frozen at 2026-10-14T02:52Z*

## Rationale

The workshop site currently only has the agenda page. The talk also needs a slide deck that is presented directly from GitHub Pages. We decided on `@revealjs/react` (the official React wrapper for reveal.js) on its own Vite entry page, so Reveal's CSS and hash navigation stay away from the agenda.

This spike only verifies that the integration works: dev server, production build, GitHub Pages paths, React StrictMode, hash navigation, fragments, syntax highlighting, slide layouts that are not centered by default, and styling with the agenda's design tokens. It contains three slides. The full deck is a separate plan.

## Acceptance Criteria

- [ ] `npm run lint` and `npm run build` pass.
- [x] `npm run build` emits `dist/slides.html` next to `dist/index.html`.
- [ ] `slides.html` shows a German deck with exactly three slides:
  1. A title slide ("Linux Fundamentals"), vertically centered.
  2. A vertically centered section slide for the agenda block "Kernel vs. User Space" whose title and summary come from `src/data/agenda.ts`. It has the slide id `kernel-user-space`.
  3. A content slide using `<ContentLayout>`: the title is at the top, and below it the block's commands appear as a syntax-highlighted shell code block that fills the remaining height. Its lines are highlighted step by step, and a short exercise note appears afterwards as a fragment.
- [ ] The title of a content slide stays in the same position no matter how much content the slide has. To check, temporarily add lines to the code block; the title must not move.
- [ ] Text on content slides is left-aligned (Reveal's default `text-align: center` is overridden).
- [x] Keyboard navigation (arrow keys, space) works. The URL hash follows the current slide, and reloading the page stays on that slide.
- [x] Opening `slides.html#/kernel-user-space` directly shows the section slide.
- [x] The deck renders at 16:9 and scales to fit the browser window without scroll bars, in both `npm run dev` and `npm run preview`.
- [ ] The deck, including the code highlighting, uses the agenda's colors and fonts. No bundled Reveal theme or highlight theme (Monokai, Zenburn) is loaded.
- [ ] The agenda page's JavaScript bundle doesn't contain reveal.js or highlight.js.
- [x] In `npm run dev` (StrictMode), there are no console errors and Reveal's controls and progress bar are not duplicated.
- [ ] The agenda page has a link to the slides, and it otherwise looks unchanged (no Reveal CSS leaks into it).
- [ ] Served under the GitHub Pages subpath via `npm run build && npx vite preview --base /linux-fundamentals-workshop/`, both the agenda and the deck work, including the link between them and a reload on a slide.

## Technical Details

### Dependencies

- Add `reveal.js` (`^6.0.2`). It ships its own types and exports `reveal.js/reveal.css`.
- Add `@revealjs/react` pinned exactly to `0.2.2`, because the 0.x API may still change.
- The only Reveal plugin is highlight (`reveal.js/plugin/highlight`). There is no speaker view and no PDF export.

### Multi-Page Setup

- Add `slides.html` at the repository root. Mirror `index.html`: `lang="de"`, the same fonts and favicon, and the title `Linux Fundamentals — Folien`. Its entry is a new module under `src/slides/`.
- Register both pages in `vite.config.ts` under `build.rolldownOptions.input`. In Vite 8, `rollupOptions` is deprecated. Keep `base: './'` so that the paths work under the GitHub Pages subpath.
- The deploy workflow already uploads all of `dist/`, so it needs no change.
- Link from the agenda to the deck with the relative URL `slides.html` (no leading slash).

### Deck

- Render the deck with `<Deck>` from `@revealjs/react`, wrapped in `<StrictMode>` like the agenda. The wrapper delays `destroy()` so that StrictMode's double mount doesn't leave two instances. This spike should confirm that.
- Illustrative config: `{ hash: true, width: 1280, height: 720, center: false }`.
- The `id` prop on `<Slide>` makes the slide addressable as `#/<id>`.
- Build the fragments with `<Fragment>`, e.g. `as="p"`.
- For the section slide, look the block up from `AGENDA` instead of copying its text. A lookup by title is fine for the spike. A stable `id` field on `AgendaBlock` belongs in the full-deck plan.

### Layout

- Reveal 6 lays out slides on a fixed canvas that it scales to fit the window. Each slide is only as tall as its content. With `center: true` (the default), Reveal moves every slide down by half of the free space, so titles shift between slides. `reveal.css` also centers text horizontally (`text-align: center` on `.reveal .slides`), even without a theme.
- Set `center: false` and give slides the full canvas height (`.reveal .slides > section { height: 100% }`). Reveal shows and hides slides by changing their `display` value, so don't make the `<section>` itself a grid or flex container. Put the layout on a wrapper element inside the slide.
- Add two layout components under `src/slides/`: a centered one for the title and section slides, and `<ContentLayout title=…>` for content slides (title row at the top, content area that takes the remaining height). The `center` class on a `<Slide>` is an alternative for the centered case. The implementer picks one.
- The code block must fill the remaining height inside the content area, either via the grid or via Reveal's `r-stretch`. It must not overflow the canvas.
- Slides need their own base font size for the 1280×720 canvas (roughly 28–32px). The agenda's 16px base is for a web page. Colors and fonts still come from the shared tokens.

### Syntax Highlighting

- Register `RevealHighlight` via `<Deck plugins={[...]}>` and render code with `<Code>` from `@revealjs/react`. `<Code>` calls the plugin's `highlightBlock` itself, so it also works after React re-renders.
- Use `language="bash"` for plain commands. `shell` is meant for sessions with a `$` prompt and output.
- Step highlighting uses the `lineNumbers` prop with Reveal's step syntax, e.g. `"1|2"`, one step per command.
- The plugin bundles every highlight.js language (about 1 MB, ~320 KB gzipped). This is acceptable for the slides page. Thanks to the separate entry, it must not end up in the agenda bundle. Making the bundle smaller is out of scope.
- `reveal.js/plugin/highlight` imports its types from `highlight.js`, which isn't installed. `skipLibCheck` should cover this. Add `highlight.js` as a dev dependency only if `tsc -b` complains.

### Styling

- Import `reveal.js/reveal.css` only in the slides entry. Don't import any `reveal.js/theme/*`.
- Reuse the custom properties from `src/index.css`. Its resets (list style, heading margins) can conflict with Reveal's layout. Either move the tokens into their own file that both pages import, or scope the deck overrides under `.reveal`. The implementer decides which.
- Write a small highlight theme of our own: style `.hljs` and the few `.hljs-*` token classes that shell code uses (e.g. `built_in`, `string`, `variable`, `meta`, `comment`) with the existing tokens (`--surface`, `--font-mono`, `--accent`, `--praxis`). Also style the dimmed and highlighted lines of a step-highlighted block.

### Implementation Notes

Suggested milestones. Each one leaves lint and build passing and can be committed on its own:

1. **Multi-page setup:** `slides.html`, a minimal slides entry, the Vite input config, and the agenda link. The build emitting `dist/slides.html` proves the Vite part before Reveal is involved.
2. **Deck basics:** the dependencies, `<Deck>` with three plain slides, `hash`, the slide id, StrictMode and scaling.
3. **Layout and styling:** shared tokens, the two layout components, the slide font size, overriding Reveal's centering. No Reveal theme.
4. **Highlighting and fragments:** the highlight plugin, `<Code>` with step highlighting, our own highlight colors, the fragment.

Reveal docs to explain from: [React](https://revealjs.com/react/), [Config](https://revealjs.com/config/), [Presentation Size](https://revealjs.com/presentation-size/), [Layout](https://revealjs.com/layout/), [Code](https://revealjs.com/code/), [Fragments](https://revealjs.com/fragments/).

### Verification

The repository has no automated test runner, and this spike adds none. Lint and build are the automated feedback loops. Everything else is checked as follows:

- **Checked by the coding agent from the shell** after `npm run build`:
  - `dist/slides.html` exists.
  - The agenda bundle is free of Reveal: none of the JS files referenced from `dist/index.html` (entry script and `modulepreload` links) contains reveal.js or highlight.js code. Vite may create chunks shared by both pages (e.g. React), so checking only `index-*.js` is not enough. Illustrative: `grep -oE 'assets/[^"]+\.js' dist/index.html`, then search those files for `reveal` and `hljs`.
- **Checked by the user in the browser**, because these need a rendered page. The agent says what to look for:
  - Navigation, hash and reload, the direct link to `#/kernel-user-space`, scaling and the absence of scroll bars, colors and fonts, left alignment, and that the agenda looks unchanged.
  - StrictMode: no console errors, and the page contains exactly one `.reveal .controls` and one `.reveal .progress` (DevTools → Elements, or `document.querySelectorAll('.reveal .controls').length` in the console).
  - Stable title: temporarily add lines to the code block, check that the title does not move, then revert.
  - Subpath: run `npm run build && npx vite preview --base /linux-fundamentals-workshop/` and open `http://localhost:4173/linux-fundamentals-workshop/`.
- **After the merge**, during review: check the real GitHub Pages deployment once. This is not an acceptance criterion, because deployments only run from `main`.

### Out of Scope

- The deck content beyond the three slides.
- Per-block links from the agenda into the deck.
- A speaker view and PDF export.
- Making the highlight.js bundle smaller.
- Further layouts (two columns, exercise box, images) and fine-tuning the font sizes.
- Automated browser tests (e.g. Playwright). Worth considering for the full-deck plan.
