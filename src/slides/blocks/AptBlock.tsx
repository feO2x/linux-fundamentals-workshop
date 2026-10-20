import { Fragment, Slide } from '@revealjs/react'
import toolsDockerfile from '../../../containers/tools/Dockerfile?raw'
import { ContentLayout } from '../ContentLayout'
import { BARE_IMAGE, TOOLS_IMAGE, runCommand } from '../containers'
import { ExerciseSlide } from '../ExerciseSlide'
import { SectionSlide } from '../SectionSlide'
import { StepCode } from '../StepCode'
import { WhenDeckReady } from '../WhenDeckReady'

const BLOCK_ID = 'apt'

// Die RUN-Anweisung aus dem Ersatz-Image: dieselben Schritte wie in der Übung.
const dockerfileLines = toolsDockerfile.split('\n')
const runStart = dockerfileLines.findIndex((line) => line.startsWith('RUN '))
const runEnd = dockerfileLines.findIndex(
  (line, index) => index >= runStart && !line.endsWith('\\'),
)
const runInstruction = dockerfileLines.slice(runStart, runEnd + 1)

// Ausgabe von `dpkg -L tree` im nackten Image.
const dpkgOutput = [
  'root@workshop:~# dpkg -L tree',
  '/.',
  '/usr',
  '/usr/bin',
  '/usr/bin/tree',
  '/usr/share',
  '/usr/share/doc',
  '/usr/share/doc/tree',
  '/usr/share/doc/tree/README.gz',
  '/usr/share/doc/tree/TODO',
  '/usr/share/doc/tree/changelog.Debian.gz',
  '/usr/share/doc/tree/copyright',
  '/usr/share/man',
  '/usr/share/man/man1',
  '/usr/share/man/man1/tree.1.gz',
]

// Farbigen Prompt im nackten Image einschalten, wie im Start-Image.
const colorPromptSteps = [
  "root@workshop:~# grep -n '#force' ~/.bashrc",
  '39:#force_color_prompt=yes',
  "root@workshop:~# sed -i 's/^#force/force/' ~/.bashrc",
  'root@workshop:~# source ~/.bashrc',
]

/** Block „Paketverwaltung mit apt“: Werkzeuge selbst installieren. */
export function AptBlock() {
  return (
    <>
      <SectionSlide blockId={BLOCK_ID} />

      <Slide>
        <ContentLayout title="Ein neuer, nackter Container">
          <StepCode
            lines={[runCommand('workshop', BARE_IMAGE)]}
            className="code--small"
          />
          <StepCode
            language="shell"
            lines={[
              'root@workshop:~# tree',
              'bash: tree: command not found',
              'root@workshop:~# less /etc/passwd',
              'bash: less: command not found',
            ]}
            steps="1-2|3-4"
          />
          <WhenDeckReady>
            <Fragment as="p" className="takeaway">
              Dieses Image ist so nackt wie ein frisches <code>ubuntu:24.04</code>. Was
              fehlt, installiert ihr selbst – mit apt, dem Paketmanager von Ubuntu.
            </Fragment>
          </WhenDeckReady>
        </ContentLayout>
      </Slide>

      <Slide>
        <ContentLayout title="apt install allein reicht nicht">
          <StepCode
            language="shell"
            lines={[
              'root@workshop:~# apt install tree',
              'Reading package lists... Done',
              '…',
              'E: Unable to locate package tree',
              'root@workshop:~# ls /var/lib/apt/lists',
              'root@workshop:~#',
            ]}
            steps="1-4|5-6"
            className="code--small"
          />
          <WhenDeckReady>
            <Fragment as="ul" className="points">
              <li>
                apt kennt Pakete nur aus seinen Paketlisten in{' '}
                <code>/var/lib/apt/lists</code> – und die sind im Image leer.
              </li>
              <li>
                <code>apt update</code> lädt die Listen herunter. Erst danach findet{' '}
                <code>apt install</code> etwas.
              </li>
            </Fragment>
          </WhenDeckReady>
        </ContentLayout>
      </Slide>

      <Slide>
        <ContentLayout title="Erst update, dann install">
          <StepCode
            lines={[
              'apt update              # Paketlisten herunterladen',
              'apt search tree         # in Namen und Beschreibungen suchen',
              'apt install tree less   # Pakete installieren',
            ]}
          />
          <WhenDeckReady>
            <ul className="points">
              <Fragment as="li">
                Paketname und Programmname sind nicht immer gleich: <code>ps</code> steckt
                zum Beispiel im Paket <code>procps</code>.
              </Fragment>
              <Fragment as="li">
                Die Liste von <code>apt search</code> ist lang. Sobald <code>less</code>{' '}
                da ist, blättert ihr darin: <code>apt search tree | less</code>, beenden
                mit <code>q</code>.
              </Fragment>
            </ul>
          </WhenDeckReady>
        </ContentLayout>
      </Slide>

      <Slide>
        <ContentLayout title="Wohin landen die Dateien?">
          <div className="columns">
            <ul className="points">
              <li>
                <code>dpkg -L</code> listet jede Datei eines installierten Pakets.
              </li>
              <li>
                Das Programm landet in <code>/usr/bin</code>, die Doku in{' '}
                <code>/usr/share/doc</code> – die Landkarte von vorhin.
              </li>
              <li>
                Es gibt keinen Programmordner wie <code>C:\Programme</code>. Ein Paket
                verteilt sich über den ganzen Baum.
              </li>
            </ul>
            <StepCode
              language="shell"
              lines={dpkgOutput}
              steps="1"
              className="code--dense code--command"
            />
          </div>
        </ContentLayout>
      </Slide>

      <Slide>
        <ContentLayout title="Dasselbe im Dockerfile">
          <p className="note">
            So ist das Ersatz-Image für diesen Block gebaut – mit euren Schritten:
          </p>
          <StepCode
            language="dockerfile"
            lines={runInstruction}
            className="code--small"
          />
          <WhenDeckReady>
            <dl className="legend legend--auto">
              <Fragment as="div" className="legend__row">
                <dt>apt-get</dt>
                <dd>
                  wie <code>apt</code>, aber für Skripte gedacht
                </dd>
              </Fragment>
              <Fragment as="div" className="legend__row">
                <dt>-y</dt>
                <dd>ohne Rückfrage – beim Bauen tippt niemand</dd>
              </Fragment>
              <Fragment as="div" className="legend__row">
                <dt>--no-install-recommends</dt>
                <dd>nur das Nötigste, das Image bleibt klein</dd>
              </Fragment>
              <Fragment as="div" className="legend__row">
                <dt>rm -rf …/lists/*</dt>
                <dd>Paketlisten wieder löschen – deshalb war eure Liste eben leer</dd>
              </Fragment>
            </dl>
          </WhenDeckReady>
        </ContentLayout>
      </Slide>

      <Slide>
        <ContentLayout title="Wo sind die Farben hin?">
          <p className="note">
            Im Start-Image war euer Prompt grün und blau. Der Prompt ist eine Einstellung
            eurer Shell – und die steht in <code>~/.bashrc</code>.
          </p>
          <StepCode
            language="shell"
            lines={colorPromptSteps}
            steps="1-2|3|4"
            className="code--small"
          />
          <WhenDeckReady>
            <dl className="legend legend--auto">
              <Fragment as="div" className="legend__row">
                <dt>grep -n</dt>
                <dd>Zeilen mit einem Suchbegriff finden, samt Zeilennummer</dd>
              </Fragment>
              <Fragment as="div" className="legend__row">
                <dt>#</dt>
                <dd>macht die Zeile zum Kommentar – die Einstellung ist aus</dd>
              </Fragment>
              <Fragment as="div" className="legend__row">
                <dt>sed -i 's/alt/neu/'</dt>
                <dd>ersetzt Text direkt in der Datei</dd>
              </Fragment>
              <Fragment as="div" className="legend__row">
                <dt>source</dt>
                <dd>
                  liest die Datei neu ein – sonst wirkt sie erst in der nächsten Shell
                </dd>
              </Fragment>
            </dl>
          </WhenDeckReady>
        </ContentLayout>
      </Slide>

      <ExerciseSlide
        blockId={BLOCK_ID}
        title="Übung: Besorgt euch eure Werkzeuge"
        tasks={[
          'Startet den neuen Container mit dem Kommando von eben.',
          <>
            Prüft, dass <code>tree</code> und <code>less</code> fehlen. Installiert dann
            beide.
          </>,
          <>
            Findet mit <code>dpkg -L</code> heraus, wo das Programm <code>less</code>{' '}
            liegt.
          </>,
          <>
            Blättert mit <code>less</code> durch eine lange Liste:{' '}
            <code>apt search tree | less</code>
          </>,
          'Bonus: Holt euch den farbigen Prompt zurück.',
        ]}
      >
        <p className="note">
          <strong>apt kommt nicht durch?</strong> Dann startet stattdessen das
          Ersatz-Image, in dem beides schon installiert ist:
        </p>
        <StepCode lines={[runCommand('workshop', TOOLS_IMAGE)]} className="code--small" />
      </ExerciseSlide>
    </>
  )
}
