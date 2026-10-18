import { Fragment, Slide } from '@revealjs/react'
import { ContentLayout } from '../ContentLayout'
import { USERS_IMAGE, runCommand } from '../containers'
import { ExerciseSlide } from '../ExerciseSlide'
import { SectionSlide } from '../SectionSlide'
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
            Pause angelegt habt – dazu <code>tree</code>, <code>less</code> und das
            Teamverzeichnis <code>/srv/team</code>.
          </p>
        </ContentLayout>
      </Slide>

      <Slide>
        <ContentLayout title="Die Antwort steht bei ls -l">
          <StepCode
            language="shell"
            lines={[
              'root@workshop:~# ls -ld /root /home/alice',
              'drwxr-x--- 2 alice alice 4096 Oct 17 14:32 /home/alice',
              'drwx------ 2 root  root  4096 Sep 30 14:26 /root',
            ]}
            steps="1-3|2|3"
          />
          <WhenDeckReady>
            <Fragment as="ul" className="points">
              <li>
                Vorne stehen Typ und Rechte, dahinter Besitzer und Gruppe. <code>-d</code>{' '}
                zeigt das Verzeichnis selbst statt seines Inhalts.
              </li>
              <li>Linux schreibt dran, wer was darf. Ihr müsst es nur lesen können.</li>
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
            Vorsicht beim x auf Verzeichnissen – dazu gleich eine Übung zum Raten.
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
              'chmod u+x skript.sh    # u: Besitzer darf ausführen',
              'chmod g+w notiz.txt    # g: Gruppe darf schreiben',
              'chmod o-r notiz.txt    # o: alle anderen nicht mehr lesen',
              'chmod 640 notiz.txt    # alles auf einmal, als Zahl: rw-r-----',
            ]}
          />
          <WhenDeckReady>
            <Fragment as="p" className="note">
              <code>chmod</code> kennt ihr aus dem Bash-Workshop. <code>u</code>,{' '}
              <code>g</code> und <code>o</code> stehen für user, group und others – die
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
        <ContentLayout title="Drill: Was bedeutet …?">
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
        </ContentLayout>
      </Slide>

      <Slide>
        <ContentLayout title="Woher kommen die Rechte neuer Dateien?">
          <StepCode
            language="shell"
            lines={[
              'alice@workshop:~$ umask',
              '0002',
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
                Neue Dateien starten bei <code>666</code>, Verzeichnisse bei{' '}
                <code>777</code>. Die <code>umask</code> nimmt Rechte weg: 666 − 002 =
                664.
              </li>
              <li>
                root hat <code>0022</code> und bekommt <code>644</code>. Bei alice ist
                Gruppe-schreiben harmlos: In der Gruppe alice ist nur alice selbst.
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
          'Sorgt dafür, dass nur alice und team die Datei lesen können. Welche Zahl braucht ihr?',
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

      <ExerciseSlide
        blockId={BLOCK_ID}
        minutes={10}
        title="Übung: Das x-Bit auf Verzeichnissen"
        tasks={[
          <>
            Als alice: Legt <code>/tmp/ordner</code> mit einer Datei darin an.
          </>,
          <>
            Nehmt mit <code>chmod 644 /tmp/ordner</code> das x weg.
          </>,
          <>
            <strong>Ratet zuerst:</strong> Was passiert bei <code>ls /tmp/ordner</code>,{' '}
            <code>cd /tmp/ordner</code> und <code>cat /tmp/ordner/datei</code>? Dann
            probiert es aus.
          </>,
        ]}
      >
        <p className="note">
          Mit <code>chmod 755 /tmp/ordner</code> bekommt ihr den Ordner wieder.
        </p>
      </ExerciseSlide>

      <Slide>
        <ContentLayout title="Auflösung: x heißt hineingehen">
          <StepCode
            language="shell"
            lines={[
              'alice@workshop:~$ ls /tmp/ordner',
              "ls: cannot access '/tmp/ordner/datei': Permission denied",
              'datei',
              'alice@workshop:~$ cd /tmp/ordner',
              '-bash: cd: /tmp/ordner: Permission denied',
              'alice@workshop:~$ cat /tmp/ordner/datei',
              'cat: /tmp/ordner/datei: Permission denied',
            ]}
            steps="1-3|4-5|6-7"
            className="code--small"
          />
          <WhenDeckReady>
            <Fragment as="ul" className="points">
              <li>
                Mit <code>r</code>, aber ohne <code>x</code> seht ihr nur die Namen.
                Hinein und an die Dateien kommt ihr nicht – auch dann nicht, wenn euch der
                Ordner gehört.
              </li>
              <li>
                Umgekehrt geht es auch: Mit <code>x</code>, aber ohne <code>r</code>{' '}
                öffnet ihr Dateien, deren Namen ihr kennt, könnt aber nicht auflisten.
              </li>
            </Fragment>
          </WhenDeckReady>
        </ContentLayout>
      </Slide>
    </>
  )
}
