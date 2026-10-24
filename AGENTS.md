# Root AGENTS.md

This repo contains all assets for my Linux Fundamentals workshop that I give at TELIS/GWVS. This workshop is aimed at beginners.

## General

- When committing, sign off and use a Conventional Commits message. Decide whether a message body should be included depending on the changes.

## Guided Coding

This repository uses Guided Coding. Plans and Plan Deviations documents live in [`ai-plans/`](ai-plans/AGENTS.md); its `AGENTS.md` holds the file naming conventions and the rules for working with Frozen Plans.

## Feedback Loops

Install dependencies with `npm ci` before running these commands.

- `npm run lint`: lints `src/` with oxlint (React, TypeScript, and oxc rules from `.oxlintrc.json`).
- `npm run build`: type-checks the project with `tsc -b` and builds the production bundle into `dist/` with Vite.
- `npm run format:check`: checks formatting with Prettier. Use `npm run format` to fix formatting issues.

CI (`.github/workflows/deploy.yml`) runs these commands before deploying to GitHub Pages.

## Good to know

- highlight.js' `shell` grammar only recognizes prompts made of `[/~\w\d[\]()@-]*` followed by `$`, `#`, `%` or `>`. `root@workshop:~#` contains a `:`, so prompt/output blocks on the slides render without syntax colors (step highlighting still works).
- The deck hides the line-number gutter (`.hljs-ln-numbers`) globally and code blocks are as tall as their content (the spike's `flex: 1` on `pre` was removed), since most slides combine code with text.
- The `docker run` line uses `.code--small`, which fits an image reference of roughly 44 characters on the canvas. The `hub.gwvs.de/levelup/linux-fundamentals/...` paths in `src/slides/containers.ts` (43–44 characters) are at that limit, so a longer image reference would make the code block scroll horizontally. `containers/build-images.sh` repeats the prefix when it tags the images; keep both in sync.
- Reveal merges URL query parameters into its config, so `slides.html?fragments=false&transition=none` is handy for screenshots. Fragments rendered by `WhenDeckReady` stay hidden in that mode, because Reveal reveals fragments only once at startup.
- Fragments that follow a `StepCode` with more than one step belong inside `WhenDeckReady`. Otherwise Reveal numbers them before the code steps exist, and the text appears before the remaining lines are highlighted (see the comment in `src/slides/WhenDeckReady.tsx`). `WhenDeckReady` renders one commit after the deck is ready, because every `<Code>` renumbers its slide's fragments: with two code blocks on a slide, a fragment inserted together with them would be numbered by the first block, before the second block's steps exist.
- `summary` in `agenda.ts` describes a block for the agenda page (third person). Slides address the attendees directly ("ihr"), so section slides show `question` (labeled "Findet heraus") instead. The principle ("Linux beschreibt sich selbst in Dateien …") and the four-step search path live in `src/slides/Principle.tsx` and `src/slides/SearchPath.tsx`, so later blocks can reuse them.
- `ubuntu:24.04` already ships `procps`, so `ps` is available in every image. Only `tree` and `less` are missing in `bare`, which is what the apt block installs.
- Outputs on the slides after the first break were taken from the built `bare` and `tools` images. IDs like `1002(team)` assume the order of the demo slides (alice, then team), not the exercise order (alice, bob, team).
- On Ubuntu, regular users get umask `0002` (user private groups), root gets `0022`. A file alice creates is `rw-rw-r--`, which the umask slide in the permissions block explains.
- Containers share the host kernel's `fs.protected_regular` (systemd sets it to `1` or `2`; it is `2` under Docker Desktop on WSL 2). It blocks `>>` on a file someone else owns in a sticky, world-writable directory like `/tmp`, even with group write permission. That is why the file-sharing exercise uses `/srv/team` (`root:team`, `770`) from the `users` image instead of `/tmp`.
- The final exercise lives in the `users` image, so attendees can start a fresh, untouched container for it. `containers/users/fixed.Dockerfile` is the repaired setup; the slide shows it and the README explains how to check that the repairs are enough.
- The colors in `src/tokens.css` come from gwvs.de (navy `#002c46`, lime `#b8db04`, blue `#006fb9`). Lime on white has a contrast of only ~1.6:1, so the light theme uses the darker brand green `#5c6e02` for `--accent` text and keeps lime for `--accent-dim` borders and `--accent-wash` areas.
- The GWVS font DIN Pro is licensed and self-hosted on gwvs.de, so we cannot load it. `--font-sans` lists `'DIN Pro'` first (used if it is installed locally) and falls back to Barlow from Google Fonts, a DIN-like typeface.
- Ubuntu's `.bashrc` enables its colored prompt only for `TERM=xterm-color` (root) or `*-256color` (`/etc/skel`), while `docker run -it` sets `TERM=xterm`. All images except `bare` therefore uncomment `force_color_prompt=yes` with the same `sed` that the apt block shows as a bonus task. `tools` changes only `/root/.bashrc`, like the attendees do in `bare`, so users created in the Users block get an uncolored prompt there (the bonus task of its exercise asks why, to show that `useradd -m` copies `/etc/skel`); `users` changes `/etc/skel/.bashrc` too, before its `useradd` calls.

## This is your space

If you find something noteworthy about the codebase while implementing, list it here. A reviewer will discuss this with you afterwards.
