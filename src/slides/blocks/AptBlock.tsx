import { Fragment, Slide } from '@revealjs/react'
import type { ReactNode } from 'react'
import { ContentLayout } from '../ContentLayout'
import { BARE_IMAGE, runCommand } from '../containers'
import { ExerciseSlide } from '../ExerciseSlide'
import { SectionSlide } from '../SectionSlide'
import { Spoiler } from '../Spoiler'
import { StepCode } from '../StepCode'
import { WhenDeckReady } from '../WhenDeckReady'

const BLOCK_ID = 'apt'

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

// Lösungen zur Übung, gegen das gebaute Tools-Image geprüft.
const solutions: { task: string; commands: string[]; answer: ReactNode }[] = [
  {
    task: 'tree und less installieren',
    commands: ['apt update', 'apt install tree less'],
    answer: (
      <>
        Ohne <code>apt update</code> findet apt keines der beiden Pakete
      </>
    ),
  },
  {
    task: 'Wo liegt less?',
    commands: ['dpkg -L less'],
    answer: (
      <>
        <code>/usr/bin/less</code>
      </>
    ),
  },
  {
    task: 'Durch die Liste blättern',
    commands: ['apt search tree | less'],
    answer: (
      <>
        Pfeiltasten und Leertaste blättern, <code>q</code> beendet
      </>
    ),
  },
  {
    task: 'Bonus: farbiger Prompt',
    commands: [
      "grep -n '#force' ~/.bashrc",
      "sed -i 's/^#force/force/' ~/.bashrc",
      'source ~/.bashrc',
    ],
    answer: 'Der Prompt ist wieder grün',
  },
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
              fehlt, installiert ihr selbst - mit apt, dem Paketmanager von Ubuntu.
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
                <code>/var/lib/apt/lists</code> - und die sind im Image leer.
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
                <code>/usr/share/doc</code> - die Landkarte von vorhin.
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
        <ContentLayout title="Wo sind die Farben hin?">
          <p className="note">
            Im Start-Image war euer Prompt grün. Der Prompt ist eine Einstellung eurer
            Shell - und die steht in <code>~/.bashrc</code>.
          </p>
          <StepCode
            language="shell"
            lines={colorPromptSteps}
            steps="1-2|3|4"
            className="code--small"
          />
          {/* Jede Zeile erscheint mit ihrem Code-Schritt: Die ersten beiden gehören
              zu den Zeilen 1-2, die von Anfang an hervorgehoben sind, die anderen
              teilen sich den Index mit den Schritten für Zeile 3 und 4. */}
          <WhenDeckReady>
            <dl className="legend legend--auto">
              <div className="legend__row">
                <dt>grep -n</dt>
                <dd>Zeilen mit einem Suchbegriff finden, samt Zeilennummer</dd>
              </div>
              <div className="legend__row">
                <dt>#</dt>
                <dd>macht die Zeile zum Kommentar - die Einstellung ist aus</dd>
              </div>
              <Fragment as="div" className="legend__row" index={0}>
                <dt>sed -i 's/alt/neu/'</dt>
                <dd>ersetzt Text direkt in der Datei</dd>
              </Fragment>
              <Fragment as="div" className="legend__row" index={1}>
                <dt>source</dt>
                <dd>
                  liest die Datei neu ein - sonst wirkt sie erst in der nächsten Shell
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
      />

      <Slide>
        <ContentLayout title="Werkzeuge: So geht's">
          <Spoiler>
            <table className="solutions solutions--stacked">
              <tbody>
                {solutions.map((solution) => (
                  <tr key={solution.task}>
                    <td>{solution.task}</td>
                    <td className="solutions__path">
                      {solution.commands.map((command) => (
                        <code key={command}>{command}</code>
                      ))}
                    </td>
                    <td>{solution.answer}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Spoiler>
        </ContentLayout>
      </Slide>
    </>
  )
}
