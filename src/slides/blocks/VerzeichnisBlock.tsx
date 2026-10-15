import { Fragment, Slide } from '@revealjs/react'
import { findBlock } from '../../data/agenda'
import { ContentLayout } from '../ContentLayout'
import { ExerciseSlide } from '../ExerciseSlide'
import { SectionSlide } from '../SectionSlide'
import { StepCode } from '../StepCode'
import { WhenDeckReady } from '../WhenDeckReady'

const BLOCK_ID = 'verzeichnisstruktur'

const linksBlock = findBlock('links-inodes')

// Ausgabe von `tree -L 1 /` im Start-Image, ohne die Zusammenfassung am Ende.
const treeOutput = [
  'root@workshop:~# tree -L 1 /',
  '/',
  '├── bin -> usr/bin',
  '├── boot',
  '├── dev',
  '├── etc',
  '├── home',
  '├── lib -> usr/lib',
  '├── lib64 -> usr/lib64',
  '├── media',
  '├── mnt',
  '├── opt',
  '├── proc',
  '├── root',
  '├── run',
  '├── sbin -> usr/sbin',
  '├── srv',
  '├── sys',
  '├── tmp',
  '├── usr',
  '└── var',
]

const directories = [
  { paths: ['/usr', '/bin'], text: 'Programme – /bin zeigt heute auf /usr/bin' },
  { paths: ['/etc'], text: 'Konfigurationsdateien' },
  { paths: ['/home', '/root'], text: 'Home-Verzeichnisse der Benutzer, /root für root' },
  { paths: ['/var'], text: 'veränderliche Daten, z. B. Logs in /var/log' },
  { paths: ['/tmp'], text: 'temporäre Dateien' },
]

// Gegen das gebaute Start-Image geprüft (siehe README).
const scavengerHunt = [
  {
    question: (
      <>
        Wo liegt das Programm <code>ls</code>?
      </>
    ),
    command: 'which ls',
    answer: <code>/usr/bin/ls</code>,
  },
  {
    question: 'Welche Ubuntu-Version läuft?',
    command: 'cat /etc/os-release',
    answer: 'Ubuntu 24.04.5 LTS (Noble Numbat)',
  },
  {
    question: 'Welche Logdateien gibt es?',
    command: 'ls /var/log',
    answer: (
      <>
        u. a. <code>dpkg.log</code>, <code>bootstrap.log</code>, <code>apt/</code>
      </>
    ),
  },
  {
    question: 'In welchem Verzeichnis startet die Shell?',
    command: 'pwd',
    answer: <code>/root</code>,
  },
  {
    question: (
      <>
        Welche versteckten Dateien liegen in <code>/root</code>?
      </>
    ),
    command: 'ls -a /root',
    answer: (
      <>
        <code>.bashrc</code> und <code>.profile</code>
      </>
    ),
  },
  {
    question: (
      <>
        Wie sieht <code>/etc/apt</code> als Baum aus?
      </>
    ),
    command: 'tree /etc/apt',
    answer: (
      <>
        7 Verzeichnisse, 12 Dateien, z. B. <code>sources.list.d/ubuntu.sources</code>
      </>
    ),
  },
]

/** Block „Verzeichnisstruktur“: der Verzeichnisbaum und die Navigation darin. */
export function VerzeichnisBlock() {
  return (
    <>
      <SectionSlide blockId={BLOCK_ID} />

      <Slide>
        <ContentLayout title="Ein Baum statt Laufwerke">
          <div className="columns">
            <ul className="points">
              <li>
                Kein <code>C:</code> oder <code>D:</code> – alles hängt unter{' '}
                <code>/</code>, der Wurzel.
              </li>
              <li>
                Das Trennzeichen ist <code>/</code>, nicht <code>\</code>.
              </li>
              <li>Weitere Festplatten werden irgendwo in den Baum eingehängt.</li>
            </ul>
            <StepCode language="shell" lines={treeOutput} className="code--dense" />
          </div>
        </ContentLayout>
      </Slide>

      <Slide>
        <ContentLayout title="Navigieren">
          <StepCode
            lines={[
              'pwd        # Wo bin ich?',
              'ls         # Was liegt hier?',
              'ls -la     # alles, auch versteckte Dateien (beginnen mit .)',
              'cd /etc    # absoluter Pfad: beginnt mit /',
              'cd apt     # relativer Pfad: ab dem aktuellen Verzeichnis',
              'cd ..      # eine Ebene nach oben',
              'cd ~       # ins Home-Verzeichnis (cd allein tut dasselbe)',
              'cd -       # zurück ins vorherige Verzeichnis',
            ]}
          />
        </ContentLayout>
      </Slide>

      <Slide>
        <ContentLayout title="Die wichtigsten Verzeichnisse">
          <dl className="directories">
            {directories.map((directory) => (
              <div key={directory.paths.join()} className="directories__row">
                <dt>
                  {directory.paths.map((path) => (
                    <code key={path}>{path}</code>
                  ))}
                </dt>
                <dd>{directory.text}</dd>
              </div>
            ))}
            <Fragment as="div" className="directories__row directories__row--later">
              <dt>
                <code>/proc</code>
                <code>/dev</code>
              </dt>
              <dd>nach der Pause: „Alles ist eine Datei“</dd>
            </Fragment>
          </dl>
        </ContentLayout>
      </Slide>

      <Slide>
        <ContentLayout title="Wo liegt ein Programm?">
          <StepCode
            language="shell"
            lines={[
              'root@workshop:~# which ls',
              '/usr/bin/ls',
              'root@workshop:~# ls -ld /bin',
              'lrwxrwxrwx 1 root root 7 Apr 22  2024 /bin -> usr/bin',
            ]}
            steps="1-2|3-4"
          />
          <WhenDeckReady>
            <Fragment as="ul" className="points">
              <li>
                <code>which</code> sucht ein Programm in den Verzeichnissen, in denen die
                Shell nach Programmen schaut.
              </li>
              <li>
                <code>/bin</code> ist nur ein Verweis auf <code>/usr/bin</code> (der{' '}
                <code>-&gt;</code>). Früher waren das zwei Verzeichnisse. Mehr dazu im
                Block „{linksBlock.title}“.
              </li>
            </Fragment>
          </WhenDeckReady>
        </ContentLayout>
      </Slide>

      <ExerciseSlide
        blockId={BLOCK_ID}
        title="Übung: Schnitzeljagd"
        numbered
        tasks={scavengerHunt.map((entry) => entry.question)}
      >
        <p className="note">
          Jede Frage lässt sich mit einem einzigen Kommando beantworten.
        </p>
      </ExerciseSlide>

      <Slide>
        <ContentLayout title="Schnitzeljagd: Lösungen">
          <table className="solutions">
            <tbody>
              {scavengerHunt.map((entry, index) => (
                <tr key={entry.command}>
                  <td className="solutions__number">{index + 1}</td>
                  <td>
                    <code>{entry.command}</code>
                  </td>
                  <td>{entry.answer}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </ContentLayout>
      </Slide>
    </>
  )
}
