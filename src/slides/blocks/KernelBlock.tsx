import { Fragment, Slide } from '@revealjs/react'
import { ContentLayout } from '../ContentLayout'
import { START_IMAGE, runCommand } from '../containers'
import { KernelLayers } from '../diagrams/KernelLayers'
import { VmVsContainer } from '../diagrams/VmVsContainer'
import { ExerciseSlide } from '../ExerciseSlide'
import { SectionSlide } from '../SectionSlide'
import { StepCode } from '../StepCode'
import { WhenDeckReady } from '../WhenDeckReady'

const BLOCK_ID = 'kernel-user-space'

const kernelTasks = [
  { title: 'Prozesse', text: 'startet Programme, verteilt die CPU, beendet sie wieder' },
  { title: 'Speicher', text: 'teilt jedem Prozess Arbeitsspeicher zu' },
  { title: 'Dateien & Geräte', text: 'Festplatten, Terminals, USB-Sticks' },
  { title: 'Netzwerk', text: 'Verbindungen, Pakete, Netzwerkkarten' },
]

const syscalls = [
  { name: 'open', text: 'Kernel prüft, ob cat die Datei lesen darf, und öffnet sie' },
  { name: 'read', text: 'Kernel liest den Inhalt von der Festplatte' },
  { name: 'write', text: 'Kernel gibt den Inhalt im Terminal aus' },
  { name: 'close', text: 'Kernel schließt die Datei wieder' },
]

/** Block „Kernel vs. User Space“: Kernel, Syscalls, Prozesse, VM vs. Container. */
export function KernelBlock() {
  return (
    <>
      <SectionSlide blockId={BLOCK_ID} />

      <Slide>
        <ContentLayout title="Der Kernel verwaltet alles">
          <ul className="cards">
            {kernelTasks.map((task) => (
              <li key={task.title} className="card">
                <strong>{task.title}</strong>
                <span>{task.text}</span>
              </li>
            ))}
          </ul>
          <Fragment as="p" className="takeaway">
            Keins eurer Programme spricht direkt mit der Hardware – das darf nur der
            Kernel.
          </Fragment>
        </ContentLayout>
      </Slide>

      <Slide>
        <ContentLayout title="Wo eure Programme laufen">
          <KernelLayers />
        </ContentLayout>
      </Slide>

      <Slide>
        <ContentLayout title="Was passiert bei cat datei?">
          <p className="note">
            <code>cat</code> gibt eine Datei im Terminal aus. Dafür fragt es den Kernel,
            mit sogenannten Syscalls:
          </p>
          <StepCode lines={['cat datei']} />
          <ol className="syscalls">
            {syscalls.map((syscall) => (
              <Fragment key={syscall.name} as="li">
                <code>{syscall.name}</code>
                <span>{syscall.text}</span>
              </Fragment>
            ))}
          </ol>
          <Fragment as="p" className="note">
            So arbeitet jedes Programm – auch eure Shell, auch im Container.
          </Fragment>
        </ContentLayout>
      </Slide>

      <Slide>
        <ContentLayout title="Warum hier so wenig los ist">
          <StepCode
            language="shell"
            lines={[
              'root@workshop:~# ps aux',
              'USER         PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND',
              'root           1  0.5  0.0   5028  4260 pts/0    Ss   09:01   0:00 /bin/bash',
              'root           9  0.0  0.0   8296  4368 pts/0    R+   09:04   0:00 ps aux',
            ]}
            steps="1|3|4"
            className="code--small"
          />
          <WhenDeckReady>
            <Fragment as="ul" className="points">
              <li>
                Eure <code>bash</code> ist PID 1, also der erste Prozess im Container.
                Daneben läuft nur <code>ps</code> selbst.
              </li>
              <li>
                Auf eurem Rechner laufen Hunderte Prozesse. Der Kernel zeigt eurem
                Container nur dessen eigene.
              </li>
            </Fragment>
          </WhenDeckReady>
        </ContentLayout>
      </Slide>

      <Slide>
        <ContentLayout title="Warum Container sofort starten">
          <VmVsContainer />
          <Fragment as="p" className="takeaway">
            Ein Container bringt keinen eigenen Kernel mit, der erst booten müsste.
            Deshalb startet er sofort, und Images sind klein.
          </Fragment>
        </ContentLayout>
      </Slide>

      <ExerciseSlide
        blockId={BLOCK_ID}
        title="Übung: Der Nachbar"
        tasks={[
          <>
            Öffnet ein zweites Terminal und startet einen Nachbarn:
            <StepCode
              lines={[runCommand('nachbar', START_IMAGE)]}
              className="code--small"
            />
          </>,
          <>
            Vergleicht den Kernel. Er beschreibt sich selbst in der Datei{' '}
            <code>/proc/version</code> – lest sie in beiden Containern mit{' '}
            <code>cat</code>.
          </>,
          <>
            Vergleicht die Prozesse mit <code>ps aux</code>.
          </>,
        ]}
      >
        <p className="question">
          <span className="question__label">Findet heraus</span>
          Was teilen sich die beiden Container, und was hat jeder für sich?
        </p>
        <p className="note">
          <strong>Windows und macOS:</strong> Der Host ist eine Linux-VM im Hintergrund
          (WSL 2 bzw. Docker Desktop).
        </p>
      </ExerciseSlide>
    </>
  )
}
