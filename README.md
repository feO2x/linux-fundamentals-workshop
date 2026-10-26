# Linux Fundamentals — Workshop-Agenda

**Zur Website: [feo2x.github.io/linux-fundamentals-workshop](https://feo2x.github.io/linux-fundamentals-workshop/)**

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
| `users` | wie `tools`, dazu alice, bob, team, das Teamverzeichnis `/srv/team` und die kaputte App der Abschlussübung | ab der zweiten Pause bis zum Ende |

`ps` bringt `ubuntu:24.04` schon mit. Alle Images setzen `LANG=C.UTF-8` und starten in `/root`. Bis auf `bare` schalten alle den farbigen Prompt aus Ubuntus `.bashrc` ein (`force_color_prompt=yes`), in `users` auch in `/etc/skel` für alice, bob und appuser. In `bare` holen ihn sich die Teilnehmer in der Bonusaufgabe des apt-Blocks selbst zurück.

### Lokal bauen und prüfen

`containers/build-images.sh` baut jedes Image mit seinem Verzeichnis als Kontext und taggt es als `hub.gwvs.de/gwvs/linux-fundamentals/<name>`, also mit dem Pfad, den die Folien anzeigen:

```bash
containers/build-images.sh              # alle Images
containers/build-images.sh start users  # nur die genannten
```

Mit `--push` pusht das Skript die Images danach in die Registry, mit `--push --no-build` pusht es die schon gebauten, ohne neu zu bauen. Beides funktioniert auch zusammen mit Image-Namen.

Jedes Image wird für `linux/amd64` und `linux/arm64` gebaut, damit es auf Intel/AMD-Rechnern genauso nativ läuft wie auf ARM, z. B. Macs mit Apple Silicon. `docker run` wählt automatisch die passende Variante. Dafür braucht Docker den containerd-Image-Store. Bei neuen Installationen ist er standardmäßig aktiv, bei älteren lässt er sich in Docker Desktop unter Settings → General → „Use containerd for pulling and storing images“ einschalten. Die fremde Plattform baut Docker per Emulation (QEMU), das dauert etwas länger. Docker Desktop bringt QEMU mit, unter Linux richtet es `docker run --privileged --rm tonistiigi/binfmt --install all` ein. Eine bestimmte Variante lässt sich mit `--platform` starten:

```bash
docker run --rm --platform linux/amd64 hub.gwvs.de/gwvs/linux-fundamentals/start uname -m  # x86_64
```

Prüfen, ob die erwarteten Werkzeuge da sind, hier am Beispiel von `start`:

```bash
docker run --rm hub.gwvs.de/gwvs/linux-fundamentals/start sh -c 'command -v ps; command -v tree'
```

Und wie im Workshop interaktiv starten (der Prompt sollte `root@workshop:~#` lauten):

```bash
docker run --rm -it --hostname workshop hub.gwvs.de/gwvs/linux-fundamentals/start
```

### Abschlussübung prüfen

Die App der Abschlussübung liegt in `containers/users/app/`, ihre Config in `containers/users/app.conf`. Das `Dockerfile` baut sie absichtlich mit vier Fehlern ein (siehe Kommentar dort). `containers/users/fixed.Dockerfile` ist dasselbe Setup ohne Fehler und erscheint so auf der letzten Folie der Übung. Damit lässt sich prüfen, dass die Reparaturen genügen:

```bash
docker build -f containers/users/fixed.Dockerfile -t linux-workshop-app-fixed containers/users
docker run --rm linux-workshop-app-fixed
```

Die letzte Zeile der Ausgabe muss `Workshop-App 1.1 läuft.` lauten.

Die Images werden nicht von GitHub aus veröffentlicht, sondern von Hand mit `containers/build-images.sh --push` in die interne Registry gepusht. Die Image-Pfade, die die Folien anzeigen, legt `src/slides/containers.ts` fest; der Präfix in `containers/build-images.sh` muss dazu passen. Achtung: Die Folien liegen öffentlich auf GitHub Pages, die Pfade sind dort also sichtbar.

Ändert sich ein Image, müssen auch die Folien passen: Die Lösungen der Schnitzeljagd und die Beispielausgaben (`/etc/shells`, `/etc/os-release`) in `src/slides/blocks/VerzeichnisBlock.tsx` sind gegen das gebaute `start`-Image geprüft, die Ausgaben in `AptBlock.tsx`, `DateiBlock.tsx` und `UsersBlock.tsx` gegen `bare` bzw. `tools`, die in `BerechtigungenBlock.tsx`, `LinksBlock.tsx` und `AbschlussBlock.tsx` gegen `users`. Die sudo-Folie in `UsersBlock.tsx` stammt aus einem `ubuntu:24.04`-Container mit nachinstalliertem `sudo`. Die Dockerfile-Folien lesen `containers/tools/Dockerfile` und `containers/users/fixed.Dockerfile` direkt ein.
