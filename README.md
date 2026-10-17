# Linux Fundamentals — Workshop-Agenda

Agenda-Seite und Slides für den vierstündigen Workshop „Linux Fundamentals“.

## Container-Images

Die Teilnehmer arbeiten im Workshop in Containern. Jedes Image hat ein eigenes Verzeichnis unter `containers/`:

```text
containers/
└── <name>/
    └── Dockerfile
```

Das Verzeichnis `containers/<name>/` ist zugleich der Build-Kontext. So landet nichts aus dem Rest des Repos (z. B. `node_modules`) im Kontext, und weitere Images kommen einfach als neues Verzeichnis daneben.

| Image   | Inhalt                                    | Einsatz                                       |
| ------- | ----------------------------------------- | --------------------------------------------- |
| `start` | `ubuntu:24.04` plus `tree`                | erster Block bis zur ersten Pause             |
| `bare`  | `ubuntu:24.04` ohne zusätzliche Pakete    | ab der ersten Pause; `tree` und `less` fehlen |
| `tools` | `ubuntu:24.04` plus `tree` und `less`     | Ersatz für `bare`, falls apt nicht durchkommt |

`ps` bringt `ubuntu:24.04` schon mit. Alle drei Images setzen `LANG=C.UTF-8` und starten in `/root`.

### Lokal bauen und prüfen

Ein Image wird mit seinem Verzeichnis als Kontext gebaut, hier am Beispiel von `start`:

```bash
docker build -t linux-workshop-start containers/start
```

Prüfen, ob die erwarteten Werkzeuge da sind:

```bash
docker run --rm linux-workshop-start sh -c 'command -v ps; command -v tree'
```

Und wie im Workshop interaktiv starten (der Prompt sollte `root@workshop:~#` lauten):

```bash
docker run --rm -it --hostname workshop linux-workshop-start
```

Die Images werden nicht von GitHub aus veröffentlicht, sondern von Hand in die interne Registry gepusht. Die Image-Pfade, die die Folien anzeigen, legt `src/slides/containers.ts` fest. Achtung: Die Folien liegen öffentlich auf GitHub Pages, die Pfade sind dort also sichtbar.

Ändert sich ein Image, müssen auch die Folien passen: Die Lösungen der Schnitzeljagd und die Beispielausgaben (`/etc/shells`, `/etc/os-release`) in `src/slides/blocks/VerzeichnisBlock.tsx` sind gegen das gebaute `start`-Image geprüft, die Ausgaben in `AptBlock.tsx`, `DateiBlock.tsx` und `UsersBlock.tsx` gegen `bare` bzw. `tools`. Die Folie zu Dockerfiles liest `containers/tools/Dockerfile` direkt ein.
