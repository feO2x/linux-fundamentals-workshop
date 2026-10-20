import { Fragment, Slide } from '@revealjs/react'
import type { ReactNode } from 'react'
import { findBlock } from '../../data/agenda'
import { ContentLayout } from '../ContentLayout'
import { ExerciseSlide } from '../ExerciseSlide'
import { Principle } from '../Principle'
import { SearchPath } from '../SearchPath'
import { SectionSlide } from '../SectionSlide'
import { Spoiler } from '../Spoiler'
import { StepCode } from '../StepCode'
import { WhenDeckReady } from '../WhenDeckReady'

const BLOCK_ID = 'verzeichnisstruktur'

const linksBlock = findBlock('links-inodes')
const everythingIsAFileBlock = findBlock('alles-ist-eine-datei')

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

// Die Landkarte: Was sucht ihr, und in welchem Verzeichnis liegt so etwas?
const directoryMap: { question: string; paths: string[]; text: ReactNode }[] = [
  {
    question: 'Ein Programm?',
    paths: ['/usr/bin'],
    text: (
      <>
        auch über <code>/bin</code> erreichbar
      </>
    ),
  },
  { question: 'Eine Einstellung?', paths: ['/etc'], text: 'Konfigurationsdateien' },
  {
    question: 'Was ist passiert?',
    paths: ['/var/log'],
    text: (
      <>
        Logs; in <code>/var</code> liegt, was sich ändert
      </>
    ),
  },
  {
    question: 'Eure eigenen Dateien?',
    paths: ['/home', '/root'],
    text: (
      <>
        <code>/root</code> ist das Home von root
      </>
    ),
  },
  {
    question: 'Software ohne Paket?',
    paths: ['/opt'],
    text: 'zusätzliche Anwendungen, z. B. eure eigene',
  },
  { question: 'Nur für kurz?', paths: ['/tmp'], text: 'temporäre Dateien, für alle' },
]

// Gegen das gebaute Start-Image geprüft (siehe README).
const scavengerHunt: { question: ReactNode; path: string[]; answer: ReactNode }[] = [
  {
    question: (
      <>
        Wo liegt das Programm <code>ls</code>?
      </>
    ),
    path: ['which ls'],
    answer: <code>/usr/bin/ls</code>,
  },
  {
    question: 'Welche Ubuntu-Version läuft hier?',
    path: ['ls /etc', 'cat /etc/os-release'],
    answer: (
      <>
        Ubuntu 24.04.5 LTS (steht auch in <code>issue</code> und <code>lsb-release</code>)
      </>
    ),
  },
  {
    question: 'Welche Logdateien gibt es?',
    path: ['ls /var/log'],
    answer: (
      <>
        u. a. <code>dpkg.log</code>, <code>bootstrap.log</code>, <code>apt/</code>
      </>
    ),
  },
  {
    question: (
      <>
        In welchen Dateien unter <code>/etc</code> steht euer Rechnername{' '}
        <code>workshop</code>?
      </>
    ),
    path: ['grep -r workshop /etc'],
    answer: (
      <>
        <code>/etc/hostname</code> und <code>/etc/hosts</code>
      </>
    ),
  },
  {
    question: (
      <>
        Welche versteckten Dateien liegen in <code>/root</code>?
      </>
    ),
    path: ['ls -a /root'],
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
    path: ['tree /etc/apt'],
    answer: (
      <>
        7 Verzeichnisse, 12 Dateien, z. B. <code>sources.list.d/ubuntu.sources</code>
      </>
    ),
  },
]

/** Block „Verzeichnisstruktur“: der Verzeichnisbaum und wie man darin sucht. */
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
            <StepCode
              language="shell"
              lines={treeOutput}
              steps="1"
              className="code--dense code--command"
            />
          </div>
        </ContentLayout>
      </Slide>

      <Slide>
        <ContentLayout title="Bewegen und umschauen">
          <p className="note">Kennt ihr aus dem Bash-Workshop – hier zum Nachschlagen:</p>
          <StepCode
            lines={[
              'pwd        # print working directory – Wo bin ich?',
              'ls         # list – Was liegt hier?',
              'ls -la     # alles, auch versteckte Dateien (beginnen mit .)',
              'cd /etc    # change directory – absoluter Pfad: beginnt mit /',
              'cd apt     # relativer Pfad: ab dem aktuellen Verzeichnis',
              'cd ..      # eine Ebene nach oben',
              'cd ~       # ins Home-Verzeichnis (cd allein tut dasselbe)',
              'cd -       # zurück ins vorherige Verzeichnis',
            ]}
          />
        </ContentLayout>
      </Slide>

      <Slide>
        <ContentLayout title="Wo liegt so etwas?">
          <dl className="directories">
            {directoryMap.map((entry) => (
              <div key={entry.question} className="directories__row">
                <dt>{entry.question}</dt>
                <dd className="directories__paths">
                  {entry.paths.map((path) => (
                    <code key={path}>{path}</code>
                  ))}
                </dd>
                <dd>{entry.text}</dd>
              </div>
            ))}
            <Fragment as="div" className="directories__row directories__row--later">
              <dt>Prozesse, Geräte?</dt>
              <dd className="directories__paths">
                <code>/proc</code>
                <code>/dev</code>
              </dd>
              <dd>nach der Pause: „{everythingIsAFileBlock.title}“</dd>
            </Fragment>
          </dl>
        </ContentLayout>
      </Slide>

      <Slide>
        <ContentLayout title="Wo liegt ein Programm genau?">
          <StepCode
            language="shell"
            lines={[
              'root@workshop:~# which ls',
              '/usr/bin/ls',
              'root@workshop:~# echo $PATH',
              '/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin',
              'root@workshop:~# ls -ld /bin',
              'lrwxrwxrwx 1 root root 7 Apr 22  2024 /bin -> usr/bin',
            ]}
            steps="1-2|3-4|5-6"
            className="code--small"
          />
          <WhenDeckReady>
            <Fragment as="ul" className="points">
              <li>
                <code>which</code> sucht ein Programm in den Verzeichnissen aus{' '}
                <code>$PATH</code>, von links nach rechts. Die Variable kennt ihr aus dem
                Bash-Workshop.
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

      <Slide>
        <ContentLayout title="So findet ihr alles">
          <Principle />
          <SearchPath />
        </ContentLayout>
      </Slide>

      <Slide>
        <ContentLayout title="Beispiel: Welche Shells gibt es hier?">
          <div className="columns">
            <ol className="walkthrough">
              <li>
                <strong>Was suche ich?</strong> Welche Shells erlaubt sind, ist eine
                Einstellung.
              </li>
              <li>
                <strong>Wo liegt so etwas?</strong> Einstellungen liegen in{' '}
                <code>/etc</code>.
              </li>
              <li>
                <strong>Umschauen:</strong> In <code>ls /etc</code> klingt{' '}
                <code>shells</code> passend.
              </li>
              <li>
                <strong>Reinschauen:</strong> <code>cat /etc/shells</code>
              </li>
            </ol>
            <StepCode
              language="shell"
              lines={[
                'root@workshop:~# ls /etc',
                '…  passwd  profile  shells  skel  …',
                'root@workshop:~# cat /etc/shells',
                '# /etc/shells: valid login shells',
                '/bin/sh',
                '/usr/bin/sh',
                '/bin/bash',
                '/usr/bin/bash',
                '/bin/rbash',
                '/usr/bin/rbash',
                '/usr/bin/dash',
              ]}
              steps="1-2|3-11"
              className="code--small"
            />
          </div>
        </ContentLayout>
      </Slide>

      <ExerciseSlide
        blockId={BLOCK_ID}
        title="Übung: Schnitzeljagd"
        numbered
        tasks={scavengerHunt.map((entry) => entry.question)}
      >
        <div className="question">
          <span className="question__label">Kein Kommando parat? Geht den Suchweg</span>
          <SearchPath compact />
        </div>
      </ExerciseSlide>

      <Slide>
        <ContentLayout title="Schnitzeljagd: So geht's">
          <Spoiler>
            <table className="solutions">
              <tbody>
                {scavengerHunt.map((entry, index) => (
                  <tr key={index}>
                    <td className="solutions__number">{index + 1}</td>
                    <td className="solutions__path">
                      {entry.path.map((command, step) => (
                        <span key={command}>
                          {step > 0 && ' → '}
                          <code>{command}</code>
                        </span>
                      ))}
                    </td>
                    <td>{entry.answer}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Spoiler>
        </ContentLayout>
      </Slide>

      <Slide>
        <ContentLayout title="Welches System ist das denn nun?">
          <StepCode
            language="shell"
            lines={[
              'root@workshop:~# uname -a',
              'Linux workshop 6.… #1 SMP … x86_64 GNU/Linux',
              'root@workshop:~# cat /etc/os-release',
              'PRETTY_NAME="Ubuntu 24.04.5 LTS"',
              '…',
            ]}
            steps="1-2|3-5"
            className="code--small"
          />
          <WhenDeckReady>
            <Fragment as="ul" className="points">
              <li>
                <code>uname</code> fragt den Kernel – und der gehört dem Host.
              </li>
              <li>
                <code>/etc/os-release</code> ist eine Datei im Container. Sie beschreibt
                Ubuntu, also Programme und Dateien.
              </li>
            </Fragment>
            <Fragment as="p" className="takeaway">
              Ein Container bringt seinen User Space mit. Den Kernel leiht er sich vom
              Host.
            </Fragment>
          </WhenDeckReady>
        </ContentLayout>
      </Slide>
    </>
  )
}
