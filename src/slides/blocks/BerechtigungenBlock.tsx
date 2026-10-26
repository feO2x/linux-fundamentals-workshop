import { Fragment, Slide } from '@revealjs/react'
import type { ReactNode } from 'react'
import { ContentLayout } from '../ContentLayout'
import { USERS_IMAGE, runCommand } from '../containers'
import { ExerciseSlide } from '../ExerciseSlide'
import { SectionSlide } from '../SectionSlide'
import { Spoiler } from '../Spoiler'
import { StepCode } from '../StepCode'
import { WhenDeckReady } from '../WhenDeckReady'

const BLOCK_ID = 'berechtigungen'

// Die zehn Zeichen vorne bei `ls -l`, am Beispiel von /home/alice.
const modeParts = [
  { value: 'd', className: 'mode__type', text: 'Typ: d Verzeichnis, - Datei, l Link' },
  { value: 'rwx', className: 'mode__user', text: 'Besitzer (alice)' },
  { value: 'r-x', className: 'mode__group', text: 'Gruppe (alice)' },
  { value: '---', className: 'mode__other', text: 'alle anderen' },
]

const bits = [
  {
    bit: 'r',
    file: 'Inhalt lesen',
    directory: (
      <>
        Namen auflisten (<code>ls</code>)
      </>
    ),
  },
  { bit: 'w', file: 'Inhalt ändern', directory: 'Dateien anlegen, umbenennen, löschen' },
  {
    bit: 'x',
    file: 'als Programm ausführen',
    directory: (
      <>
        hineingehen (<code>cd</code>) und auf Dateien darin zugreifen
      </>
    ),
  },
]

const octalDrill = [
  { octal: '644', mode: 'rw-r--r--', use: 'normale Datei' },
  { octal: '755', mode: 'rwxr-xr-x', use: 'Programm oder Verzeichnis' },
  { octal: '600', mode: 'rw-------', use: 'private Datei, z. B. ein SSH-Schlüssel' },
  { octal: '660', mode: 'rw-rw----', use: 'Datei für ein Team' },
  { octal: '750', mode: 'rwxr-x---', use: 'Verzeichnis für ein Team' },
]

// Wie alices umask die Rechte einer neuen Datei filtert, Teil für Teil.
const umaskRows = [
  { label: 'touch wünscht sich', parts: ['rw-', 'rw-', 'rw-'] },
  { label: 'alices umask erlaubt', parts: ['rwx', 'rwx', 'r-x'] },
  { label: 'die Datei bekommt', parts: ['rw-', 'rw-', 'r--'] },
]
const umaskPartClasses = ['mode__user', 'mode__group', 'mode__other']

// Lösungen zur Übung „Teilt eine Datei“, gegen das gebaute Users-Image geprüft.
const sharingSolutions: { task: string; commands: string[]; answer: ReactNode }[] = [
  {
    task: 'Anlegen',
    commands: ['su - alice', 'touch /srv/team/notiz.txt', 'ls -l /srv/team/notiz.txt'],
    answer: (
      <>
        Besitzer und Gruppe sind alice, die Rechte <code>rw-rw-r--</code>
      </>
    ),
  },
  {
    task: 'Lesen, anhängen',
    commands: [
      'su - bob',
      'cat /srv/team/notiz.txt',
      'echo Milch >> /srv/team/notiz.txt',
    ],
    answer: (
      <>
        Lesen klappt, anhängen nicht: Für bob gelten die letzten drei, <code>r--</code>
      </>
    ),
  },
  {
    task: 'An team geben',
    commands: ['su - alice', 'chown alice:team /srv/team/notiz.txt'],
    answer: (
      <>
        Jetzt gelten für bob die mittleren drei, <code>rw-</code>. Anhängen klappt.
      </>
    ),
  },
  {
    task: 'Nur alice und team',
    commands: ['chmod o-r /srv/team/notiz.txt'],
    answer: (
      <>
        Alle anderen verlieren das r: <code>rw-rw----</code>
      </>
    ),
  },
  {
    task: 'Bonus: an bob verschenken',
    commands: ['chown bob /srv/team/notiz.txt'],
    answer: 'Operation not permitted: Einen neuen Besitzer legt nur root fest.',
  },
]

/** Block „Berechtigungen“: rwx, Oktalschreibweise, Besitzer und Gruppe. */
export function BerechtigungenBlock() {
  return (
    <>
      <SectionSlide blockId={BLOCK_ID} />

      <Slide>
        <ContentLayout title="alice und bob sind schon da">
          <StepCode
            lines={[runCommand('workshop', USERS_IMAGE)]}
            className="code--small"
          />
          <StepCode
            language="shell"
            lines={[
              'root@workshop:~# id alice',
              'uid=1001(alice) gid=1001(alice) groups=1001(alice),1003(team)',
            ]}
            steps="1-2"
          />
          <p className="note">
            Das Image bringt alice, bob und die Gruppe team so mit, wie ihr sie vor der
            Pause angelegt habt - dazu <code>tree</code>, <code>less</code> und das
            Teamverzeichnis <code>/srv/team</code>.
          </p>
        </ContentLayout>
      </Slide>

      <Slide>
        <ContentLayout title="Warum darf alice nicht nach /root?">
          <StepCode
            language="shell"
            lines={[
              'alice@workshop:~$ cd /root',
              '-bash: cd: /root: Permission denied',
              'root@workshop:~# ls -ld /root /home/alice',
              'drwxr-x--- 2 alice alice 4096 Oct 17 14:32 /home/alice',
              'drwx------ 2 root  root  4096 Sep 30 14:26 /root',
            ]}
            steps="1-2|3-5|4|5"
          />
          <WhenDeckReady>
            <Fragment as="ul" className="points">
              <li>Vorne stehen Typ und Rechte, dahinter Besitzer und Gruppe.</li>
              <li>
                Die Rechte zeigen an, welche Operationen (lesen, schreiben, ausführen)
                erlaubt sind.
              </li>
            </Fragment>
          </WhenDeckReady>
        </ContentLayout>
      </Slide>

      <Slide>
        <ContentLayout title="Zehn Zeichen, vier Teile">
          <p className="mode-anatomy">
            {modeParts.map((part) => (
              <span key={part.className} className={part.className}>
                {part.value}
              </span>
            ))}
          </p>
          <dl className="legend legend--auto">
            {modeParts.map((part) => (
              <Fragment key={part.className} as="div" className="legend__row">
                <dt className={part.className}>{part.value}</dt>
                <dd>{part.text}</dd>
              </Fragment>
            ))}
          </dl>
        </ContentLayout>
      </Slide>

      <Slide>
        <ContentLayout title="r, w und x">
          <table className="bits">
            <thead>
              <tr>
                <th />
                <th>bei einer Datei</th>
                <th>bei einem Verzeichnis</th>
              </tr>
            </thead>
            <tbody>
              {bits.map((row) => (
                <tr key={row.bit}>
                  <td className="bits__bit">{row.bit}</td>
                  <td>{row.file}</td>
                  <td>{row.directory}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <Fragment as="p" className="takeaway">
            Vorsicht beim x auf Verzeichnissen: Ohne x kommt ihr nicht hinein, auch wenn
            ihr die Namen lesen dürft.
          </Fragment>
          <Fragment as="p" className="note">
            <code>/tmp</code> zeigt <code>drwxrwxrwt</code>: Dort dürfen alle Dateien
            anlegen. Das <code>t</code> (Sticky Bit) sorgt dafür, dass jeder nur seine
            eigenen löschen darf.
          </Fragment>
        </ContentLayout>
      </Slide>

      <Slide>
        <ContentLayout title="Welche drei Zeichen gelten für mich?">
          <ol className="walkthrough">
            <Fragment as="li">
              <strong>Bin ich der Besitzer?</strong> Dann gelten die ersten drei.
            </Fragment>
            <Fragment as="li">
              <strong>Sonst: Bin ich in der Gruppe?</strong> Dann die mittleren drei.
            </Fragment>
            <Fragment as="li">
              <strong>Sonst</strong> die letzten drei.
            </Fragment>
          </ol>
          <Fragment as="p" className="takeaway">
            alice ist bei <code>/root</code> weder Besitzer noch in der Gruppe root. Für
            alice gilt <code>---</code>, also kein Zutritt.
          </Fragment>
          <Fragment as="p" className="note">
            Es gilt immer nur eine Gruppe von Rechten, die erste, die passt. Und root darf
            fast alles, egal was dort steht.
          </Fragment>
        </ContentLayout>
      </Slide>

      <Slide>
        <ContentLayout title="chmod: Rechte ändern">
          <StepCode
            lines={[
              'chmod u+x skript.sh          # u: Besitzer darf ausführen',
              'chmod g+w notiz.txt          # g: Gruppe darf schreiben',
              'chmod o-r notiz.txt          # o: alle anderen nicht mehr lesen',
              'chmod 640 notiz.txt          # alles auf einmal, als Zahl: rw-r-----',
              'chmod u=rw,g=r,o= notiz.txt  # dasselbe mit =',
            ]}
            className="code--small"
          />
          <WhenDeckReady>
            <Fragment as="p" className="note">
              <code>chmod</code> kennt ihr aus dem Bash-Workshop. <code>u</code>,{' '}
              <code>g</code> und <code>o</code> stehen für user, group und others - die
              drei Teile von eben. Ändern darf die Rechte nur der Besitzer (und root).
            </Fragment>
          </WhenDeckReady>
        </ContentLayout>
      </Slide>

      <Slide>
        <ContentLayout title="Rechte als Zahl">
          <div className="octal">
            <span>
              <code>r</code> = 4
            </span>
            <span>
              <code>w</code> = 2
            </span>
            <span>
              <code>x</code> = 1
            </span>
          </div>
          <ul className="points">
            <li>
              Jede Ziffer ist die Summe für einen Teil: <code>6</code> = 4 + 2 ={' '}
              <code>rw-</code>, <code>5</code> = 4 + 1 = <code>r-x</code>.
            </li>
            <li>
              Drei Ziffern für Besitzer, Gruppe und alle anderen: <code>640</code> ={' '}
              <code>rw-</code> <code>r--</code> <code>---</code>.
            </li>
          </ul>
        </ContentLayout>
      </Slide>

      <Slide>
        <ContentLayout title="Was bedeutet …?">
          <table className="solutions">
            <tbody>
              {octalDrill.map((row) => (
                <tr key={row.octal}>
                  <td>
                    <code>{row.octal}</code>
                  </td>
                  <Fragment as="td">
                    <code>{row.mode}</code>
                  </Fragment>
                  <Fragment as="td">{row.use}</Fragment>
                </tr>
              ))}
            </tbody>
          </table>
        </ContentLayout>
      </Slide>

      <Slide>
        <ContentLayout title="chown: Besitzer und Gruppe ändern">
          <StepCode
            lines={[
              'chown bob notiz.txt          # neuer Besitzer',
              'chown alice:team notiz.txt   # Besitzer und Gruppe',
              'chown -R alice:team /srv/x   # -R: mit allem, was darin liegt',
            ]}
          />
          <WhenDeckReady>
            <ul className="points">
              <Fragment as="li">
                Einen neuen Besitzer festlegen darf nur root. Sonst könnte jeder anderen
                Dateien unterschieben.
              </Fragment>
              <Fragment as="li">
                Die Gruppe darf auch der Besitzer ändern, aber nur auf eine Gruppe, in der
                man selbst Mitglied ist.
              </Fragment>
            </ul>
          </WhenDeckReady>
        </ContentLayout>
      </Slide>

      <Slide>
        <ContentLayout title="Die umask filtert neue Rechte">
          <p className="note">
            <code>touch datei</code> legt eine leere Datei an - gibt es sie schon, ändert
            es nur ihre Uhrzeit.
          </p>
          <div className="umask-filter">
            {umaskRows.map((row, index) => {
              const content = (
                <>
                  <span className="umask-filter__label">{row.label}</span>
                  <span className="umask-filter__mode">
                    {row.parts.map((part, partIndex) => (
                      <span key={partIndex} className={umaskPartClasses[partIndex]}>
                        {part}
                      </span>
                    ))}
                  </span>
                </>
              )
              // Der Wunsch steht von Anfang an da, umask und Ergebnis folgen.
              return index === 0 ? (
                <div key={row.label} className="umask-filter__row">
                  {content}
                </div>
              ) : (
                <Fragment key={row.label} as="div" className="umask-filter__row">
                  {content}
                </Fragment>
              )
            })}
          </div>
          <Fragment as="p" className="takeaway">
            Durch kommt nur, was in beiden oberen Zeilen steht. Ein x, das{' '}
            <code>touch</code> nie wollte, kommt auch nicht dazu - deshalb braucht ein
            neues Skript <code>chmod +x</code>.
          </Fragment>
        </ContentLayout>
      </Slide>

      <Slide>
        <ContentLayout title="Woher kommen die Rechte neuer Dateien?">
          <StepCode
            language="shell"
            lines={[
              'alice@workshop:~$ umask -S',
              'u=rwx,g=rwx,o=rx',
              'alice@workshop:~$ touch neu.txt',
              'alice@workshop:~$ mkdir neuordner',
              'alice@workshop:~$ ls -ld neu.txt neuordner',
              '-rw-rw-r-- 1 alice alice    0 Oct 17 14:32 neu.txt',
              'drwxrwxr-x 2 alice alice 4096 Oct 17 14:32 neuordner',
            ]}
            steps="1-2|3-7"
            className="code--small"
          />
          <WhenDeckReady>
            <Fragment as="ul" className="points">
              <li>
                <code>umask -S</code> zeigt, was die umask erlaubt. Die Datei bekommt kein
                x, weil <code>touch</code> keins wollte. <code>mkdir</code> wünscht sich{' '}
                <code>rwxrwxrwx</code>, deshalb hat das Verzeichnis eins.
              </li>
              <li>
                Bei root erlaubt die umask der Gruppe kein w (<code>g=rx</code>), neue
                Dateien bekommen <code>rw-r--r--</code>. Bei alice ist Gruppe-schreiben
                harmlos: In der Gruppe alice ist nur alice selbst.
              </li>
            </Fragment>
          </WhenDeckReady>
        </ContentLayout>
      </Slide>

      <ExerciseSlide
        blockId={BLOCK_ID}
        minutes={15}
        title="Übung: Teilt eine Datei"
        tasks={[
          <>
            Als alice: Legt <code>/srv/team/notiz.txt</code> an. Wem gehört sie, welche
            Rechte hat sie?
          </>,
          <>
            Als bob: Könnt ihr sie lesen? Könnt ihr etwas anhängen?{' '}
            <code className="nowrap">echo Milch &gt;&gt; /srv/team/notiz.txt</code>
          </>,
          <>
            Als alice: Gebt die Datei der Gruppe team. Probiert es als bob noch einmal.
          </>,
          'Sorgt dafür, dass nur alice und team die Datei lesen können.',
          <>
            Bonus: Versucht als alice, die Datei mit <code>chown</code> an bob zu
            verschenken.
          </>,
        ]}
      >
        <p className="note">
          In <code>/srv/team</code> dürfen nur root und die Gruppe team. Den Benutzer
          wechselt ihr mit <code>exit</code> zurück zu root und dann{' '}
          <code className="nowrap">su - bob</code>.
        </p>
      </ExerciseSlide>

      <Slide>
        <ContentLayout title="Teilt eine Datei: So geht's">
          <Spoiler>
            <table className="solutions solutions--stacked">
              <tbody>
                {sharingSolutions.map((solution) => (
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
            <p className="note">
              Vor jedem <code>su -</code> geht ihr mit <code>exit</code> zurück zu root.{' '}
              <code>chmod</code> und <code>chown</code> führt alice aus.
            </p>
          </Spoiler>
        </ContentLayout>
      </Slide>
    </>
  )
}
