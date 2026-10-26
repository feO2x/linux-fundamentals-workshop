import { Fragment, Slide } from '@revealjs/react'
import { AGENDA } from '../../data/agenda'
import { CenteredLayout } from '../CenteredLayout'
import { ContentLayout } from '../ContentLayout'
import { Principle } from '../Principle'
import { SCHEDULE, slotOf } from '../schedule'

const end = SCHEDULE[SCHEDULE.length - 1].end
const finalExercise = slotOf('abschlussuebung')

/** Titelfolie, Ziel des Workshops und Agenda-Übersicht. */
export function Opening() {
  return (
    <>
      <Slide>
        <CenteredLayout>
          <p className="eyebrow">Workshop</p>
          <h1>Linux Fundamentals</h1>
        </CenteredLayout>
      </Slide>

      <Slide>
        <ContentLayout title="Euer Ziel für heute">
          <p className="lede lede--strong">
            Um {finalExercise.start} bekommt ihr ein absichtlich kaputtes Setup: Eine
            Anwendung soll laufen, Logs schreiben und ihr Passwort schützen - das klappt
            aber nicht so richtig. Ihr findet die Fehler und repariert sie.
          </p>
          <Fragment as="p" className="note">
            Dafür braucht ihr keinen riesigen Satz an auswendig gelernten Kommandos,
            sondern einen Grundsatz:
          </Fragment>
          <Fragment as="div">
            <Principle />
          </Fragment>
        </ContentLayout>
      </Slide>

      <Slide>
        <ContentLayout title="Agenda">
          {/* Spaltenweise füllen: erste Hälfte links, zweite rechts. */}
          <ol
            className="agenda-overview"
            style={{ gridTemplateRows: `repeat(${Math.ceil(AGENDA.length / 2)}, auto)` }}
          >
            {AGENDA.map((block, index) => (
              <li key={block.id} data-kind={block.kind}>
                <time dateTime={SCHEDULE[index].start}>{SCHEDULE[index].start}</time>
                <span className="agenda-overview__title">{block.title}</span>
                <span className="agenda-overview__duration">{block.duration} min</span>
              </li>
            ))}
          </ol>
          <p className="agenda-overview__end">Ende um {end}</p>
        </ContentLayout>
      </Slide>
    </>
  )
}
