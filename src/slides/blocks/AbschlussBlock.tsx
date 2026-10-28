import { Fragment, Slide } from '@revealjs/react'
import type { ReactNode } from 'react'
import fixedDockerfile from '../../../containers/users/fixed.Dockerfile?raw'
import { BlockStack } from '../BlockStack'
import { ContentLayout } from '../ContentLayout'
import { namedRunCommand, removeCommand, startCommand, useImage } from '../containers'
import { ExerciseSlide } from '../ExerciseSlide'
import { SectionSlide } from '../SectionSlide'
import { Spoiler } from '../Spoiler'
import { StepCode } from '../StepCode'

const BLOCK_ID = 'abschlussuebung'

// Ohne --rm, damit die Reparaturen ein versehentliches exit überleben.
const CONTAINER_NAME = 'abschluss'

// Das reparierte Setup als Dockerfile, ohne die Kommentare am Anfang.
const dockerfileLines = fixedDockerfile
  .trimEnd()
  .split('\n')
  .filter((line) => !line.startsWith('#'))

// Zeilennummern für die Schritte: COPY --chown, die RUN-Reparaturen, USER.
const lineOf = (prefix: string) =>
  dockerfileLines.findIndex((line) => line.startsWith(prefix)) + 1
const dockerfileSteps = `${lineOf('COPY --chown')}|${lineOf('RUN chmod')}-${lineOf('USER') - 1}|${lineOf('USER')}`

// Gegen das gebaute Users-Image geprüft (siehe README).
const fixes: { symptom: ReactNode; cause: ReactNode; commands: string[] }[] = [
  {
    symptom: 'Permission denied beim Start',
    cause: (
      <>
        <code>start.sh</code> ist nicht ausführbar
      </>
    ),
    commands: ['chmod +x /opt/app/start.sh'],
  },
  {
    symptom: 'Config ist für alle lesbar',
    cause: (
      <>
        <code>app.conf</code> hat <code>rw-r--r--</code>
      </>
    ),
    commands: ['chown root:appuser /etc/app/app.conf', 'chmod o-r /etc/app/app.conf'],
  },
  {
    symptom: 'No such file or directory',
    cause: (
      <>
        <code>current</code> zeigt auf <code>releases/1.0</code>
      </>
    ),
    commands: ['rm /opt/app/current', 'ln -s releases/1.1 /opt/app/current'],
  },
  {
    symptom: 'Permission denied beim Log',
    cause: (
      <>
        <code>/var/log/app</code> gehört root
      </>
    ),
    commands: ['chown -R appuser:appuser /var/log/app'],
  },
]

/** Block „Abschlussübung“: ein kaputtes Setup diagnostizieren und reparieren. */
export function AbschlussBlock() {
  const usersImage = useImage('users')

  return (
    <BlockStack>
      <SectionSlide blockId={BLOCK_ID} />

      <Slide>
        <ContentLayout title="Euer Auftrag">
          <StepCode
            lines={[namedRunCommand(CONTAINER_NAME, 'workshop', usersImage)]}
            className="code--smaller"
          />
          <p className="note">
            Startet einen frischen Container, diesmal ohne <code>--rm</code> und mit
            Namen. Die App in <code>/opt/app</code> soll Folgendes tun - leider klappt
            nichts davon:
          </p>
          <ul className="points">
            <li>
              Sie läuft als Benutzer <code>appuser</code>.
            </li>
            <li>
              Ihre Config <code>/etc/app/app.conf</code> enthält ein Passwort. Lesen
              dürfen sie nur appuser und root.
            </li>
            <li>
              Sie schreibt Logs nach <code>/var/log/app/app.log</code>.
            </li>
            <li>
              <code>/opt/app/current</code> zeigt auf die aktuelle Version.
            </li>
          </ul>
        </ContentLayout>
      </Slide>

      <ExerciseSlide
        blockId={BLOCK_ID}
        title="Abschlussübung: Repariert die App"
        tasks={[
          <>
            Lest <code>/opt/app/LIESMICH</code>.
          </>,
          <>
            Startet die App als appuser: <code>su - appuser</code>, dann{' '}
            <code>/opt/app/start.sh</code>.
          </>,
          'Lest die Fehlermeldung, sucht die Ursache und repariert sie als root.',
          <>
            Wiederholt das, bis „Workshop-App 1.1 läuft.“ erscheint. Vier Fehler sind
            versteckt.
          </>,
        ]}
      >
        <p className="question">
          <span className="question__label">Bei jeder Fehlermeldung</span>
          Wer bin ich (<code>id</code>)? Wem gehört das (<code>ls -l</code>)? Welche drei
          Zeichen gelten für mich?
        </p>
        <p className="note">
          <strong>Aus Versehen beendet?</strong>{' '}
          <code>{startCommand(CONTAINER_NAME)}</code> holt euch zurück, eure Reparaturen
          sind noch da. Neu anfangen: <code>{removeCommand(CONTAINER_NAME)}</code>, dann
          wieder <code>docker run</code>.
        </p>
      </ExerciseSlide>

      <Slide>
        <ContentLayout title="Falls ihr feststeckt">
          <dl className="legend legend--auto">
            <Fragment as="div" className="legend__row">
              <dt>Permission denied beim Start</dt>
              <dd>Was braucht ein Skript, damit man es starten kann?</dd>
            </Fragment>
            <Fragment as="div" className="legend__row">
              <dt>„für alle lesbar“</dt>
              <dd>
                Wer muss lesen dürfen? Besitzer oder Gruppe - und alle anderen nicht.
              </dd>
            </Fragment>
            <Fragment as="div" className="legend__row">
              <dt>No such file or directory</dt>
              <dd>
                Wohin zeigt <code>/opt/app/current</code>? Was liegt in{' '}
                <code>/opt/app/releases</code>?
              </dd>
            </Fragment>
            <Fragment as="div" className="legend__row">
              <dt>Permission denied beim Log</dt>
              <dd>
                Wem gehört <code>/var/log/app</code>, und wer will dort schreiben?
              </dd>
            </Fragment>
          </dl>
        </ContentLayout>
      </Slide>

      <Slide>
        <ContentLayout title="Abschlussübung: So geht's">
          <Spoiler>
            <table className="solutions solutions--stacked">
              <tbody>
                {fixes.map((fix, index) => (
                  <tr key={index}>
                    <td className="solutions__number">{index + 1}</td>
                    <td>{fix.symptom}</td>
                    <td>{fix.cause}</td>
                    <td className="solutions__path">
                      {fix.commands.map((command) => (
                        <code key={command}>{command}</code>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Spoiler>
        </ContentLayout>
      </Slide>

      <Slide>
        <ContentLayout title="Warum nicht einfach chmod 777?">
          <p className="note">Ein Agent schlägt vor:</p>
          <StepCode lines={['chmod -R 777 /opt/app /etc/app /var/log/app']} />
          <ul className="points">
            <Fragment as="li">
              <code>777</code> heißt <code>rwxrwxrwx</code>: Jeder darf alles. Start und
              Log würden klappen, den toten Link repariert es nicht.
            </Fragment>
            <Fragment as="li">
              Jeder Benutzer könnte jetzt <code>start.sh</code> umschreiben, und das
              Passwort in <code>app.conf</code> läge offen. Genau das verweigert die App.
            </Fragment>
          </ul>
          <Fragment as="p" className="takeaway">
            Fragt stattdessen: Welche Rechte benötigt der Nutzer meines Prozesses?
          </Fragment>
        </ContentLayout>
      </Slide>

      <Slide>
        <ContentLayout title="Ein Einblick in den nächsten Workshop">
          <div className="columns columns--wide-first">
            <StepCode
              language="dockerfile"
              lines={dockerfileLines}
              steps={dockerfileSteps}
              className="code--dense"
            />
            <ul className="points">
              <li>
                <code>COPY --chown</code> legt Besitzer und Gruppe gleich beim Kopieren
                fest.
              </li>
              <li>
                <code>RUN chmod</code>, <code>ln -s</code> und <code>chown</code>: eure
                Reparaturen, nur ein für alle Mal.
              </li>
              <li>
                <code>USER appuser</code> ist wie <code>su - appuser</code> - alles danach
                läuft als appuser, auch PID 1.
              </li>
            </ul>
          </div>
        </ContentLayout>
      </Slide>
    </BlockStack>
  )
}
