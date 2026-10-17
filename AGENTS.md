# Root AGENTS.md

This repo contains all assets for my Linux Fundamentals workshop that I give at TELIS/GWVS. This workshop is aimed at beginners.

## General

- When committing, sign off and use a Conventional Commits message and . Decide whether a message body should be included depending on the size.

## Guided Coding

This repository uses Guided Coding. Plans and Plan Deviations documents live in [`ai-plans/`](ai-plans/AGENTS.md); its `AGENTS.md` holds the file naming conventions and the rules for working with Frozen Plans.

## Feedback Loops

Install dependencies with `npm ci` before running these commands.

- `npm run lint`: lints `src/` with oxlint (React, TypeScript, and oxc rules from `.oxlintrc.json`).
- `npm run build`: type-checks the project with `tsc -b` and builds the production bundle into `dist/` with Vite.
- `npm run format:check`: checks formatting with Prettier. Use `npm run format` to fix formatting issues.

CI (`.github/workflows/deploy.yml`) runs these commands before deploying to GitHub Pages.

## This is your space

If you find something noteworthy about the codebase while implementing, list it here. A reviewer will discuss this with you afterwards.

- highlight.js' `shell` grammar only recognizes prompts made of `[/~\w\d[\]()@-]*` followed by `$`, `#`, `%` or `>`. `root@workshop:~#` contains a `:`, so prompt/output blocks on the slides render without syntax colors (step highlighting still works).
- The deck hides the line-number gutter (`.hljs-ln-numbers`) globally and code blocks are as tall as their content (the spike's `flex: 1` on `pre` was removed), since most slides combine code with text.
- The `docker run` line uses `.code--small`, which fits an image reference of roughly 44 characters on the canvas. A longer registry path than the placeholder in `src/slides/containers.ts` would make the code block scroll horizontally.
- Reveal merges URL query parameters into its config, so `slides.html?fragments=false&transition=none` is handy for screenshots. Fragments rendered by `WhenDeckReady` stay hidden in that mode, because Reveal reveals fragments only once at startup.
- `summary` in `agenda.ts` describes a block for the agenda page (third person). Slides address the attendees directly ("ihr"), so section slides show `leitfrage` instead. The principle ("Linux beschreibt sich selbst in Dateien …") and the four-step search path live in `src/slides/Principle.tsx` and `src/slides/SearchPath.tsx`, so later blocks can reuse them.
- `ubuntu:24.04` already ships `procps`, so `ps` is available in every image. Only `tree` and `less` are missing in `bare`, which is what the apt block installs.
- The "Dasselbe im Dockerfile" slide imports `containers/tools/Dockerfile?raw` and shows its `RUN` instruction, so the slide and the image cannot drift apart.
- Outputs on the slides after the first break were taken from the built `bare` and `tools` images. IDs like `1002(team)` assume the order of the demo slides (alice, then team), not the exercise order (alice, bob, team).
- On Ubuntu, regular users get umask `0002` (user private groups), root gets `0022`. A file alice creates is `rw-rw-r--`, which the umask slide in the permissions block explains.
- The final exercise lives in the `users` image, so attendees can start a fresh, untouched container for it. `containers/users/fixed.Dockerfile` is the repaired setup; the slide shows it and the README explains how to check that the repairs are enough.
