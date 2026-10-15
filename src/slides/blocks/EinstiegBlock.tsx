import { Fragment, Slide } from '@revealjs/react'
import { ContentLayout } from '../ContentLayout'
import { START_IMAGE, pullCommand, runCommand } from '../containers'
import { ExerciseSlide } from '../ExerciseSlide'
import { SectionSlide } from '../SectionSlide'
import { StepCode } from '../StepCode'
import { WhenDeckReady } from '../WhenDeckReady'

const BLOCK_ID = 'einstieg'

/** Block „Einstieg & Setup“: Container starten und erste Orientierung. */
export function EinstiegBlock() {
  return (
    <>
      <SectionSlide blockId={BLOCK_ID} />

      <Slide>
        <ContentLayout title="Den Container starten">
          <StepCode
            lines={[
              '# Vor dem Workshop: Image herunterladen',
              pullCommand(START_IMAGE),
              '# Container starten',
              runCommand('workshop', START_IMAGE),
            ]}
            steps="1-2|3-4"
            className="code--small"
          />
          <WhenDeckReady>
            <Fragment as="dl" className="legend">
              <dt>
                <code>-it</code>
              </dt>
              <dd>interaktiv, mit Terminal – wir wollen tippen</dd>
              <dt>
                <code>--rm</code>
              </dt>
              <dd>Container beim Beenden automatisch löschen</dd>
              <dt>
                <code>--hostname</code>
              </dt>
              <dd>Rechnername im Container, taucht gleich im Prompt auf</dd>
            </Fragment>
            <Fragment as="p" className="note">
              <strong>Windows:</strong> PowerShell oder Windows Terminal verwenden. In Git
              Bash scheitert der Start mit „the input device is not a TTY“.
            </Fragment>
          </WhenDeckReady>
        </ContentLayout>
      </Slide>

      <Slide>
        <ContentLayout title="Der Prompt verrät viel">
          <p className="prompt-anatomy">
            <span className="prompt-anatomy__user">root</span>@
            <span className="prompt-anatomy__host">workshop</span>:
            <span className="prompt-anatomy__dir">~</span>
            <span className="prompt-anatomy__sign">#</span>
          </p>
          <dl className="legend">
            <Fragment as="div" className="legend__row">
              <dt className="prompt-anatomy__user">root</dt>
              <dd>Benutzer, als der die Shell läuft</dd>
            </Fragment>
            <Fragment as="div" className="legend__row">
              <dt className="prompt-anatomy__host">workshop</dt>
              <dd>
                Rechnername – kommt aus <code>--hostname</code>
              </dd>
            </Fragment>
            <Fragment as="div" className="legend__row">
              <dt className="prompt-anatomy__dir">~</dt>
              <dd>
                aktuelles Verzeichnis; <code>~</code> ist das Home-Verzeichnis, bei root{' '}
                <code>/root</code>
              </dd>
            </Fragment>
            <Fragment as="div" className="legend__row">
              <dt className="prompt-anatomy__sign">#</dt>
              <dd>
                <code>#</code> heißt root, normale Benutzer sehen <code>$</code>
              </dd>
            </Fragment>
          </dl>
        </ContentLayout>
      </Slide>

      <Slide>
        <ContentLayout title="Wer bin ich, wo bin ich?">
          <StepCode
            language="shell"
            lines={[
              'root@workshop:~# whoami',
              'root',
              'root@workshop:~# id',
              'uid=0(root) gid=0(root) groups=0(root)',
              'root@workshop:~# uname -a',
              'Linux workshop 6.… #1 SMP … x86_64 GNU/Linux',
            ]}
            steps="1-2|3-4|5-6"
          />
          <WhenDeckReady>
            <Fragment as="ul" className="points">
              <li>
                <code>uid=0</code> ist root – der Benutzer, der alles darf.
              </li>
              <li>
                <code>uname -a</code> zeigt den Kernel. Die Version unterscheidet sich von
                Rechner zu Rechner – dazu gleich mehr.
              </li>
            </Fragment>
          </WhenDeckReady>
        </ContentLayout>
      </Slide>

      <Slide>
        <ContentLayout title="Die Shell ist nur ein Programm">
          <StepCode
            language="shell"
            lines={[
              'root@workshop:~# ls -l /usr/bin/bash',
              '-rwxr-xr-x 1 root root 1446024 Mar 31  2024 /usr/bin/bash',
            ]}
          />
          <ul className="points">
            <Fragment as="li">
              <code>bash</code> ist eine ganz normale Datei in <code>/usr/bin</code> – ein
              Programm wie <code>ls</code> oder <code>whoami</code>.
            </Fragment>
            <Fragment as="li">
              <code>docker run</code> startet genau dieses Programm als Prozess im
              Container. <code>exit</code> beendet die Shell – und damit den Container.
            </Fragment>
            <Fragment as="li">
              Wie man mit der Shell arbeitet, war Thema im Bash-Workshop. Heute geht es um
              das System darunter.
            </Fragment>
          </ul>
        </ContentLayout>
      </Slide>

      <ExerciseSlide
        blockId={BLOCK_ID}
        title="Übung: Umschauen"
        tasks={[
          'Den Container starten (Kommando von eben).',
          <>
            <code>whoami</code>, <code>id</code> und <code>uname -a</code> ausführen.
          </>,
          <>
            Mit <code>ls /</code> ansehen, was im Wurzelverzeichnis liegt.
          </>,
        ]}
      >
        <p className="question">
          <span className="question__label">Leitfrage</span>
          Warum ist hier so viel weniger los als auf dem eigenen Rechner?
        </p>
      </ExerciseSlide>
    </>
  )
}
