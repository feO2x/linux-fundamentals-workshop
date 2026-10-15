# Slides for the First Block and the Start Container

*Frozen at 2026-10-15T04:32Z*

## Rationale

The reveal.js spike (`2026-10-14-0252-reveal-js-spike.md`) set up the deck, but it only has placeholder slides. This plan adds the real content for the first block of the workshop, up to the first break: "Einstieg & Setup", "Kernel vs. User Space" and "Verzeichnisstruktur" (09:00–09:55). It also adds the container image that attendees start at the beginning.

The workshop uses several container images. The start image is `ubuntu:24.04` plus `ps` and `tree`, so the first block runs smoothly. After the break, attendees switch to the bare `ubuntu:24.04`. There, `ps` and `tree` are missing, which leads into the apt block. That switch, the backup image for attendees who get stuck with apt, and all later images are separate plans.

The images are not published from GitHub. The user builds them and pushes them to the company's internal registry by hand. Attendees pull from there.

## Acceptance Criteria

### Container

- [ ] `containers/start/Dockerfile` builds an image based on `ubuntu:24.04`. In that image, `ps`, `tree`, `which`, `whoami`, `id` and `uname` are available, the shell starts in `/root`, and `LANG` is `C.UTF-8`.
- [ ] `README.md` has a section (in German, like the rest of the README) on how to build and check the container images locally. It explains the `containers/<name>/` layout so that later images fit in.
- [ ] Every answer to the scavenger hunt (see below) has been checked against the built image.

### Slides

- [ ] The placeholder slides from the spike are gone. The deck contains, in this order: title slide, agenda overview, the three blocks, and a break slide.
- [ ] Every block starts with a section slide whose title and summary come from `src/data/agenda.ts`. It can be reached at `slides.html#/<block-id>`, using `einstieg`, `kernel-user-space` and `verzeichnisstruktur`.
- [ ] The agenda overview and the break slide take their times from `AGENDA`/`START_TIME` (break slide: "weiter um 10:05"). If the agenda changes, the times change with it.
- [ ] The slides show the exact `docker pull`/`docker run` commands for the start image, including `--hostname`. The image reference is defined in exactly one place in the code.
- [ ] The block contents match the outline in Technical Details. Each block has its own exercise slide, and the scavenger hunt also has a solutions slide.
- [ ] The two diagrams (kernel layers, VM vs. container) are made of HTML/CSS or inline SVG with the design tokens. They look right in both light and dark themes.
- [ ] Every command in `agenda.ts` for these three blocks appears on the slides, and `pwd` is added to the commands of "Verzeichnisstruktur".
- [ ] No slide overflows the 1280×720 canvas, in either theme.
- [ ] `npm run format:check`, `npm run lint` and `npm run build` pass.

## Technical Details

### Container Image

- One directory per image: `containers/<name>/Dockerfile`, with that directory as the build context. That keeps `node_modules` out of the context, and later images go next to it. This plan only adds `containers/start/`.
- Use `FROM ubuntu:24.04`, the same tag as the bare container after the break. That way, the only difference between the two is the installed tools.
- Packages: `procps` (for `ps`) and `tree`, both with `--no-install-recommends`. In the same layer, run `rm -rf /var/lib/apt/lists/*`. Don't add anything else. `less` and the rest are taught in the apt block.
- Set `WORKDIR /root`, so the prompt is `root@workshop:~#`. Set `ENV LANG=C.UTF-8`. The default user stays root, because the later blocks need root.
- Keep the default `CMD` (bash) from the base image.
- A Dockerfile can't set the hostname. It is passed to `docker run`.
- The image reference lives in a single constant, e.g. in `src/slides/containers.ts`. The user supplies the internal registry path. Until then, use an obvious placeholder. Note: the deck is published on GitHub Pages, so the registry path will be public.

### Commands on the Slides

These are exact, apart from the image reference:

- Before the workshop: `docker pull <image>`.
- Main container: `docker run --rm -it --hostname workshop <image>`. `--rm` is fine here, because the next block uses a different container anyway.
- Second container for the kernel exercise, in a second terminal: `docker run --rm -it --hostname nachbar <image>`.
- Note on Windows: use PowerShell or Windows Terminal, not Git Bash, which fails with "the input device is not a TTY".

### Slide Outline

Slide text is in German. Commands are shown as code blocks with step highlighting, like in the spike. Each bullet below is roughly one slide. The implementer may split or merge slides as long as everything fits on the canvas.

**Opening**

- Title slide (as in the spike).
- Agenda overview: all blocks with their start times, generated from `AGENDA` with `buildSchedule`. With 12 entries, it probably needs two columns or a smaller font.

**Einstieg & Setup** (15 min, 10 min hands-on)

- Starting the container: the `docker run` command and what its flags do (`-it`, `--rm`, `--hostname`), plus the Windows note.
- Reading the prompt: `root@workshop:~#` broken down into user, host and directory, and `#` vs. `$`.
- Who am I, where am I: `whoami`, `id` (`uid=0` means root), `uname -a`.
- The shell is just a program: `bash` is a file in `/usr/bin`, and `docker run` starts it as the container's process. This is the bridge to the Bash workshop.
- Exercise: run the commands, `ls /`. Guiding question: "Warum ist hier so viel weniger los als auf dem eigenen Rechner?" It is answered in the next block.

**Kernel vs. User Space** (15 min, 5 min hands-on)

- What the kernel does: processes, memory, files and devices, network. Only the kernel talks to the hardware.
- Diagram: hardware → kernel → syscall boundary → user space (`bash`, `ls`, `docker`, …), built up with fragments.
- Syscalls: illustrated with `cat datei` → open, read, write, close. No `strace`.
- Processes: `ps aux` in the container shows almost nothing; `bash` is PID 1. This answers the guiding question.
- Diagram VM vs. container: a VM has its own kernel, containers share the host's kernel. That's why images are small and start immediately.
- Exercise: start the second container (`nachbar`). In both, compare `cat /proc/version` (same kernel) and `ps aux` (different processes). Note: on Windows and macOS, the host is a Linux VM in the background (WSL 2 or Docker Desktop).

**Verzeichnisstruktur** (25 min, 15 min hands-on)

- One tree instead of drives: everything hangs under `/`, and the separator is `/`. Show the output of `tree -L 1 /`.
- Navigation: `pwd`, `ls`, `ls -la` (hidden files start with a dot), `cd` with absolute and relative paths, `~`, `..`, `cd -`.
- The most important directories: `/usr` and `/bin`, `/etc`, `/home` and `/root`, `/var` (logs in `/var/log`), `/tmp`. Mention `/proc` and `/dev` briefly as "after the break".
- Where is a program? `which ls` → `/usr/bin/ls`. `ls -ld /bin` shows that `/bin` is a link (usr merge). This is a teaser for the links block.
- Exercise "Schnitzeljagd", six questions, each answered by one command:
  1. Wo liegt das Programm `ls`? → `which ls`
  2. Welche Ubuntu-Version läuft? → `cat /etc/os-release`
  3. Welche Logdateien gibt es? → `ls /var/log`
  4. In welchem Verzeichnis startet die Shell? → `pwd`
  5. Welche versteckten Dateien liegen in `/root`? → `ls -a /root`
  6. Wie sieht `/etc/apt` als Baum aus? → `tree /etc/apt`
- Solutions slide with the expected answers, as checked against the built image.

**Break**

- Break slide with the time it ends. It also says that the next block uses a new container.

### Code Structure

- Add a stable `id` field to `AgendaBlock` (deferred by the spike), and look blocks up by `id` instead of by title.
- Split the deck into one component per block under `src/slides/blocks/`. `SlidesApp.tsx` only puts them together.
- New reusable components: a section slide that takes a block id, and an exercise slide. The exercise slide reuses the `.exercise` style and holds a task list or numbered questions. Diagrams are their own components.
- Keep `WhenDeckReady` for fragments that come after step-highlighted code.
- Use `language="bash"` for commands only. Use `shell` for blocks that show a prompt or output, like `tree -L 1 /`.

### Verification

- The image is built and checked locally; there is no CI integration. Build it with `docker build -t linux-workshop-start containers/start`, then check in a container that `ps` and `tree` are present (e.g. `docker run --rm linux-workshop-start sh -c 'command -v ps tree'`). The agent runs this and checks the scavenger hunt answers against the built image itself, since Docker is available in its environment.
- In the browser, the user checks every slide for overflow in both themes, the section-slide anchors, and that the agenda page still matches the slides.

### Out of Scope

- The blocks after the first break, the bare container and the backup image for the apt block.
- Updating the apt block's `praxisNote` ("bewusst nicht im Image vorinstalliert"). The plan for the apt block takes care of that.
- Publishing images. The user does that manually.
- Speaker notes, PDF export, automated browser tests.
