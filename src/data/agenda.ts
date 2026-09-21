export type BlockKind = 'content' | 'break' | 'buffer'

export interface AgendaBlock {
  /** Kurzer Titel des Blocks, wie er in der Agenda steht. */
  title: string
  /** Dauer in Minuten. */
  duration: number
  /** Davon praktische Übungszeit in Minuten. */
  praxis?: number
  kind: BlockKind
  /** Ein bis zwei Sätze zum Inhalt. */
  summary?: string
  /** Kommandos, die in diesem Block eingeführt werden. */
  commands?: string[]
  /** Was die Teilnehmer in der Übung konkret tun. */
  praxisNote?: string
}

/** Startzeit des Workshops, Basis für alle berechneten Uhrzeiten. */
export const START_TIME = '09:00'

export const AGENDA: AgendaBlock[] = [
  {
    title: 'Einstieg & Setup',
    duration: 15,
    praxis: 10,
    kind: 'content',
    summary:
      'Alle starten ihren Container und schauen sich um. Die Shell ist dabei nur ein ganz normales Programm im User Space — die Brücke zum Bash-Workshop.',
    commands: ['docker run', 'whoami', 'id', 'uname -a'],
    praxisNote:
      'Container starten, erste Orientierung. Leitfrage: Warum ist hier so viel weniger los als auf dem eigenen Rechner?',
  },
  {
    title: 'Kernel vs. User Space',
    duration: 15,
    praxis: 5,
    kind: 'content',
    summary:
      'Was macht der Kernel eigentlich? Syscalls, Prozesse — und warum sich alle Container den Kernel des Hosts teilen. Genau deshalb sind Images klein und starten sofort.',
    commands: ['ps aux', 'cat /proc/version'],
    praxisNote:
      'Zwei Container parallel starten und die identische Kernel-Version vergleichen. Hinweis: Auf Windows und macOS läuft im Hintergrund eine kleine Linux-VM — die ist der Host.',
  },
  {
    title: 'Verzeichnisstruktur',
    duration: 25,
    praxis: 15,
    kind: 'content',
    summary:
      'Die wichtigsten Verzeichnisse und was davon im Container-Alltag wirklich zählt: /bin, /etc, /home, /var, /tmp, /usr.',
    commands: ['ls', 'cd', 'which', 'tree'],
    praxisNote:
      'Schnitzeljagd statt Rundgang: sechs Fragen, jede mit einem Kommando beantwortbar. Wo liegt das ls-Binary? Welche Logdateien gibt es?',
  },
  { title: 'Pause', duration: 10, kind: 'break' },
  {
    title: 'Paketverwaltung mit apt',
    duration: 20,
    praxis: 12,
    kind: 'content',
    summary:
      'Warum ein frisches Image erst ein apt update braucht, wohin Pakete ihre Dateien legen — und die apt-Idiome, die später in jedem Dockerfile auftauchen.',
    commands: ['apt update', 'apt install', 'apt search', 'dpkg -L'],
    praxisNote:
      'Die Teilnehmer installieren selbst die Werkzeuge, die im Rest des Workshops gebraucht werden: ps, less, tree. Bewusst nicht im Image vorinstalliert.',
  },
  {
    title: 'Alles ist eine Datei',
    duration: 20,
    praxis: 12,
    kind: 'content',
    summary:
      'Prozesse, Geräte und offene Dateien — alles über denselben Mechanismus erreichbar. /proc, /dev/null und File Descriptors machen Redirects plötzlich erklärbar.',
    commands: ['/proc', '/dev/null', 'ls -l /proc/self/fd'],
    praxisNote:
      'In /proc stöbern: eigene offene Dateien ansehen, cat /proc/1/cmdline — in einem Container ist PID 1 die eigene Anwendung, kein Init-System.',
  },
  {
    title: 'Users & Groups',
    duration: 30,
    praxis: 20,
    kind: 'content',
    summary:
      'UID und GID sind nur Zahlen — das ist der Schlüssel zu Container-Berechtigungen. Dazu /etc/passwd, /etc/group und der Unterschied zu /etc/shadow.',
    commands: ['useradd', 'groupadd', 'usermod -aG', 'id', 'su -'],
    praxisNote:
      'Benutzer alice und bob anlegen, Gruppe team, dann su - alice und cd /root versuchen. Das "Permission denied" ist der Übergang zum nächsten Block.',
  },
  { title: 'Pause', duration: 10, kind: 'break' },
  {
    title: 'Berechtigungen',
    duration: 45,
    praxis: 30,
    kind: 'content',
    summary:
      'Das Kernstück des Workshops. rwx und die Oktalschreibweise, Besitzer und Gruppe — und das x-Bit auf Verzeichnissen, das erfahrungsgemäß niemand auf Anhieb richtig rät.',
    commands: ['ls -l', 'chmod', 'chown', 'umask'],
    praxisNote:
      'In Stufen: ls -l gemeinsam entziffern, Datei zwischen alice und bob freigeben, Oktal-Drill, dann chmod 644 auf ein Verzeichnis und cd versuchen.',
  },
  {
    title: 'Links & Inodes',
    duration: 15,
    praxis: 10,
    kind: 'content',
    summary:
      'Hard- und Softlinks, und warum der Name nicht die Datei ist, sondern der Inode. Dieser Block ist gleichzeitig der Zeitpuffer.',
    commands: ['ln -s', 'ln', 'ls -li'],
    praxisNote:
      'Beide Link-Arten anlegen, mit ls -li die identischen Inode-Nummern zeigen, das Original löschen — der Softlink bricht, der Hardlink überlebt.',
  },
  {
    title: 'Abschlussübung',
    duration: 30,
    praxis: 30,
    kind: 'content',
    summary:
      'Ein absichtlich kaputtes Setup: Die Anwendung soll als appuser laufen, Logs schreiben, und die Config darf nicht für alle lesbar sein. Diagnose und Reparatur.',
    commands: ['ls -l', 'id', 'chmod +x', 'chown -R'],
    praxisNote:
      'Nicht ausführbares Startskript, weltlesbare Config mit Passwort, nicht beschreibbares Logverzeichnis, toter Symlink. Zum Schluss: genau das macht ein Dockerfile mit COPY --chown und USER.',
  },
  {
    title: 'Puffer & Fragen',
    duration: 5,
    kind: 'buffer',
    summary: 'Wiederholung, offene Fragen und der Transfer zum Thema Docker.',
  },
]
