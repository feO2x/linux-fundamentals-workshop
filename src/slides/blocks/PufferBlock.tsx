import { Fragment, Slide } from '@revealjs/react'
import { CenteredLayout } from '../CenteredLayout'
import { ContentLayout } from '../ContentLayout'
import { Principle } from '../Principle'
import { SCHEDULE } from '../schedule'
import { SectionSlide } from '../SectionSlide'

const BLOCK_ID = 'puffer'

const end = SCHEDULE[SCHEDULE.length - 1].end

// Was aus dem Workshop im Dockerfile wieder auftaucht.
const transfer = [
  {
    workshop: 'Container teilen sich den Kernel',
    docker: (
      <>
        <code>FROM ubuntu:24.04</code> bringt nur den User Space mit
      </>
    ),
  },
  {
    workshop: (
      <>
        <code>apt update</code>, dann <code>apt install</code>
      </>
    ),
    docker: (
      <>
        <code>RUN apt-get update &amp;&amp; apt-get install -y …</code>
      </>
    ),
  },
  {
    workshop: 'PID 1 ist eure Anwendung',
    docker: (
      <>
        <code>CMD</code> legt PID 1 fest
      </>
    ),
  },
  {
    workshop: (
      <>
        <code>su - appuser</code>
      </>
    ),
    docker: <code>USER appuser</code>,
  },
  {
    workshop: (
      <>
        <code>chown</code>, <code>chmod</code>
      </>
    ),
    docker: (
      <>
        <code>COPY --chown</code>, <code>RUN chmod</code>
      </>
    ),
  },
  {
    workshop: 'UID und GID sind nur Zahlen',
    docker: 'Dateien in Volumes gehören einer Zahl, nicht einem Namen',
  },
]

/** Block „Puffer & Fragen“: Wiederholung und Transfer zu Docker. */
export function PufferBlock() {
  return (
    <>
      <SectionSlide blockId={BLOCK_ID} />

      <Slide>
        <ContentLayout title="Was ihr heute gelernt habt">
          <Principle />
          <ul className="points">
            <Fragment as="li">
              Wo ihr sucht: <code>/etc</code> für Einstellungen, <code>/var/log</code> für
              Logs, <code>/proc</code> für laufende Prozesse.
            </Fragment>
            <Fragment as="li">
              Wie ihr sucht: Was suche ich? Wo liegt so etwas? Umschauen, reinschauen.
            </Fragment>
            <Fragment as="li">
              Wer was darf: Besitzer, Gruppe, alle anderen - und es gilt die erste Gruppe
              von Rechten, die passt.
            </Fragment>
          </ul>
        </ContentLayout>
      </Slide>

      <Slide>
        <ContentLayout title="Von hier zu Docker">
          <table className="solutions">
            <thead>
              <tr>
                <th>Im Workshop</th>
                <th>Im Dockerfile</th>
              </tr>
            </thead>
            <tbody>
              {transfer.map((row, index) => (
                <Fragment key={index} as="tr">
                  <td>{row.workshop}</td>
                  <td>{row.docker}</td>
                </Fragment>
              ))}
            </tbody>
          </table>
        </ContentLayout>
      </Slide>

      <Slide>
        <CenteredLayout>
          <p className="eyebrow">Ende um {end}</p>
          <h2 className="section-title">Fragen?</h2>
          <p className="lede">Danke fürs Mitmachen!</p>
        </CenteredLayout>
      </Slide>
    </>
  )
}
