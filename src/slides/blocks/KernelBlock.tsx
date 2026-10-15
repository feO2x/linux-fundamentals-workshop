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
        <ContentLayout title="Was macht der Kernel?">
          <ul className="cards">
            {kernelTasks.map((task) => (
              <li key={task.title} className="card">
                <strong>{task.title}</strong>
                <span>{task.text}</span>
              </li>
            ))}
          </ul>
          <Fragment as="p" className="takeaway">
            Nur der Kernel spricht direkt mit der Hardware.
          </Fragment>
        </ContentLayout>
      </Slide>

      <Slide>
        <ContentLayout title="Kernel und User Space">
          <KernelLayers />
        </ContentLayout>
      </Slide>

      <Slide>
        <ContentLayout title="Syscalls: Programme fragen den Kernel">
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
            Jedes Programm im User Space arbeitet so – auch im Container.
          </Fragment>
        </ContentLayout>
      </Slide>

      <Slide>
        <ContentLayout title="Prozesse im Container">
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
                <code>bash</code> ist PID 1, also der erste Prozess im Container. Daneben
                läuft nur <code>ps</code> selbst.
              </li>
              <li>
                Auf dem eigenen Rechner laufen Hunderte Prozesse. Der Container sieht nur
                seine eigenen – deshalb ist hier so wenig los.
              </li>
            </Fragment>
          </WhenDeckReady>
        </ContentLayout>
      </Slide>

      <Slide>
        <ContentLayout title="VM vs. Container">
          <VmVsContainer />
          <Fragment as="p" className="takeaway">
            Container haben keinen eigenen Kernel. Deshalb sind Images klein und starten
            sofort.
          </Fragment>
        </ContentLayout>
      </Slide>

      <ExerciseSlide
        blockId={BLOCK_ID}
        title="Übung: Der Nachbar"
        tasks={[
          <>
            In einem zweiten Terminal einen zweiten Container starten:
            <StepCode
              lines={[runCommand('nachbar', START_IMAGE)]}
              className="code--small"
            />
          </>,
          <>
            In beiden Containern <code>cat /proc/version</code> ausführen – gleicher
            Kernel?
          </>,
          <>
            In beiden Containern <code>ps aux</code> ausführen – gleiche Prozesse?
          </>,
        ]}
      >
        <p className="note">
          <strong>Windows und macOS:</strong> Der Host ist eine Linux-VM im Hintergrund
          (WSL 2 bzw. Docker Desktop).
        </p>
      </ExerciseSlide>
    </>
  )
}
