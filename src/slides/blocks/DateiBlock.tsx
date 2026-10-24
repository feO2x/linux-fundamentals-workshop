import { Fragment, Slide } from '@revealjs/react'
import { ContentLayout } from '../ContentLayout'
import { ExerciseSlide } from '../ExerciseSlide'
import { SearchPath } from '../SearchPath'
import { SectionSlide } from '../SectionSlide'
import { StepCode } from '../StepCode'
import { WhenDeckReady } from '../WhenDeckReady'

const BLOCK_ID = 'alles-ist-eine-datei'

/** Block „Alles ist eine Datei“: /proc, File Descriptors und /dev. */
export function DateiBlock() {
  return (
    <>
      <SectionSlide blockId={BLOCK_ID} />

      <Slide>
        <ContentLayout title="Prozesse als Verzeichnisse">
          <StepCode
            language="shell"
            lines={[
              'root@workshop:~# ls /proc',
              '1  9  cmdline  cpuinfo  …  meminfo  …  self  …  version  …',
            ]}
          />
          <WhenDeckReady>
            <ul className="points">
              <Fragment as="li">
                Jede Zahl ist ein laufender Prozess, benannt nach seiner PID:{' '}
                <code>1</code> ist eure <code>bash</code>, <code>9</code> das{' '}
                <code>ls</code> selbst.
              </Fragment>
              <Fragment as="li">
                Der Kernel erzeugt <code>/proc</code> erst, wenn ihr hinschaut. Nichts
                davon liegt auf der Festplatte.
              </Fragment>
              <Fragment as="li">
                Genau hier liest <code>ps</code>. Sein Paket <code>procps</code>{' '}
                beschreibt sich als „/proc file system utilities“.
              </Fragment>
            </ul>
          </WhenDeckReady>
        </ContentLayout>
      </Slide>

      <Slide>
        <ContentLayout title="PID 1 ist eure Anwendung">
          <StepCode
            language="shell"
            lines={['root@workshop:~# cat /proc/1/cmdline', '/bin/bashroot@workshop:~#']}
            steps="1-2"
          />
          <ul className="points">
            <Fragment as="li">
              Auf einem normalen Linux ist PID 1 ein Init-System wie <code>systemd</code>,
              das alle anderen Programme startet.
            </Fragment>
            <Fragment as="li">
              Im Container ist PID 1 eure Anwendung - hier <code>bash</code>. Endet sie,
              endet der Container. Deshalb beendet <code>exit</code> ihn.
            </Fragment>
            <Fragment as="li" className="note">
              Am Ende der Datei fehlt der Zeilenumbruch, deshalb klebt der Prompt direkt
              dahinter.
            </Fragment>
          </ul>
        </ContentLayout>
      </Slide>

      <Slide>
        <ContentLayout title="Jeder Prozess hat offene Dateien">
          <StepCode
            language="shell"
            lines={[
              'root@workshop:~# ls -l /proc/self/fd',
              'total 0',
              'lrwx------ 1 root root 64 Oct 17 14:15 0 -> /dev/pts/0',
              'lrwx------ 1 root root 64 Oct 17 14:15 1 -> /dev/pts/0',
              'lrwx------ 1 root root 64 Oct 17 14:15 2 -> /dev/pts/0',
              'lr-x------ 1 root root 64 Oct 17 14:15 3 -> /proc/12/fd',
            ]}
            steps="1-6|3-5"
            className="code--small"
          />
          <WhenDeckReady>
            <Fragment as="dl" className="legend legend--auto">
              <dt>0</dt>
              <dd>Eingabe (stdin) - was ihr tippt</dd>
              <dt>1</dt>
              <dd>Ausgabe (stdout)</dd>
              <dt>2</dt>
              <dd>Fehlermeldungen (stderr)</dd>
              <dt>/dev/pts/0</dt>
              <dd>euer Terminal - auch nur eine Datei</dd>
            </Fragment>
          </WhenDeckReady>
        </ContentLayout>
      </Slide>

      <Slide>
        <ContentLayout title="Redirects biegen nur Verweise um">
          <StepCode
            language="shell"
            lines={[
              'root@workshop:~# ls -l /proc/self/fd > /tmp/fds',
              'root@workshop:~# cat /tmp/fds',
              'total 0',
              'lrwx------ 1 root root 64 Oct 17 14:15 0 -> /dev/pts/0',
              'l-wx------ 1 root root 64 Oct 17 14:15 1 -> /tmp/fds',
              'lrwx------ 1 root root 64 Oct 17 14:15 2 -> /dev/pts/0',
              'lr-x------ 1 root root 64 Oct 17 14:15 3 -> /proc/13/fd',
            ]}
            steps="1|2-7|5"
            className="code--small"
          />
          <WhenDeckReady>
            <Fragment as="ul" className="points">
              <li>
                <code>&gt;</code> kennt ihr aus dem Bash-Workshop. Es lässt Ausgabe 1 auf
                eine Datei zeigen statt aufs Terminal. <code>ls</code> merkt davon nichts.
              </li>
              <li>
                <code>2&gt;</code> macht dasselbe mit den Fehlermeldungen.
              </li>
            </Fragment>
          </WhenDeckReady>
        </ContentLayout>
      </Slide>

      <Slide>
        <ContentLayout title="Auch Pipes sind nur Verweise">
          <StepCode
            language="shell"
            lines={[
              'root@workshop:~# ls -l /proc/self/fd | cat',
              'total 0',
              'lrwx------ 1 root root 64 Oct 17 14:16 0 -> /dev/pts/0',
              'l-wx------ 1 root root 64 Oct 17 14:16 1 -> pipe:[81831]',
              'lrwx------ 1 root root 64 Oct 17 14:16 2 -> /dev/pts/0',
              'lr-x------ 1 root root 64 Oct 17 14:16 3 -> /proc/14/fd',
            ]}
            steps="1|2-6|4"
            className="code--small"
          />
          <WhenDeckReady>
            <Fragment as="ul" className="points">
              <li>
                <code>|</code> lässt Ausgabe 1 von <code>ls</code> auf eine Pipe zeigen
                und Eingabe 0 von <code>cat</code> auf dieselbe Pipe.
              </li>
              <li>
                Pipes und Redirects aus dem Bash-Workshop sind also dasselbe: umgebogene
                Verweise, die der Kernel verwaltet.
              </li>
            </Fragment>
          </WhenDeckReady>
        </ContentLayout>
      </Slide>

      <Slide>
        <ContentLayout title="Geräte in /dev">
          <StepCode
            language="shell"
            lines={[
              'root@workshop:~# ls /dev',
              'console  fd    mqueue  ptmx  random  stderr  stdout  urandom',
              'core     full  null    pts   shm     stdin   tty     zero',
              'root@workshop:~# ls /gibtsnicht',
              "ls: cannot access '/gibtsnicht': No such file or directory",
              'root@workshop:~# ls /gibtsnicht 2> /dev/null',
              'root@workshop:~#',
            ]}
            steps="1-3|4-5|6-7"
            className="code--small"
          />
          <WhenDeckReady>
            <Fragment as="ul" className="points">
              <li>
                In <code>/dev</code> liegen Geräte als Dateien - im Container nur eine
                Handvoll.
              </li>
              <li>
                <code>/dev/null</code> schluckt alles, was hineingeschrieben wird. Ideal
                für Meldungen, die niemand sehen will.
              </li>
            </Fragment>
          </WhenDeckReady>
        </ContentLayout>
      </Slide>

      <ExerciseSlide
        blockId={BLOCK_ID}
        title="Übung: Stöbert in /proc"
        tasks={[
          <>
            Vergleicht <code>ls /proc</code> mit <code>ps aux</code>. Findet ihr die PIDs
            wieder?
          </>,
          <>
            Was läuft als PID 1? Lest <code>/proc/1/cmdline</code>.
          </>,
          <>
            Schaut euch mit <code>ls -l /proc/self/fd</code> eure offenen Dateien an -
            direkt, mit <code className="nowrap">&gt; /tmp/fds</code> und mit{' '}
            <code className="nowrap">| cat</code>.
          </>,
          <>
            Lasst eine Fehlermeldung in <code>/dev/null</code> verschwinden.
          </>,
          <>
            Wie viel Arbeitsspeicher sieht euer Container? Die Antwort steht in{' '}
            <code>/proc</code>.
          </>,
        ]}
      >
        <div className="question">
          <span className="question__label">Für die letzte Frage: der Suchweg</span>
          <SearchPath compact />
        </div>
      </ExerciseSlide>
    </>
  )
}
