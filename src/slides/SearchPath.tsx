import { Fragment } from '@revealjs/react'
import type { ReactNode } from 'react'

interface Step {
  title: string
  text: string
  /** Werkzeuge für diesen Schritt, auf der Folie unter dem Text. */
  tools?: ReactNode
  /** Fassung für die kompakte Darstellung. */
  short: ReactNode
}

const STEPS: Step[] = [
  {
    title: 'Was suche ich?',
    text: 'ein Programm, eine Einstellung, ein Log, eigene Dateien?',
    short: 'Was suche ich?',
  },
  {
    title: 'Wo liegt so etwas?',
    text: 'die Landkarte der Verzeichnisse',
    tools: (
      <>
        <code>/etc</code> <code>/var/log</code> …
      </>
    ),
    short: 'Wo liegt so etwas?',
  },
  {
    title: 'Umschauen',
    text: 'Was liegt in diesem Verzeichnis?',
    tools: (
      <>
        <code>ls</code> <code>tree</code>
      </>
    ),
    short: (
      <>
        Umschauen mit <code>ls</code>
      </>
    ),
  },
  {
    title: 'Reinschauen',
    text: 'die Datei lesen, die passend klingt - oder alle auf einmal durchsuchen',
    tools: (
      <>
        <code>cat</code> <code>grep -r</code>
      </>
    ),
    short: (
      <>
        Reinschauen mit <code>cat</code> oder <code>grep -r</code>
      </>
    ),
  },
]

interface Props {
  /** Einzeilig als Erinnerung, z. B. auf einer Übungsfolie. */
  compact?: boolean
}

/**
 * Der Suchweg, mit dem die Teilnehmer Fragen ans System selbst beantworten.
 * In voller Größe erscheinen die Schritte nacheinander als Fragmente.
 */
export function SearchPath({ compact = false }: Props) {
  if (compact) {
    return (
      <ol className="search-path search-path--compact">
        {STEPS.map((step) => (
          <li key={step.title}>{step.short}</li>
        ))}
      </ol>
    )
  }

  return (
    <ol className="search-path">
      {STEPS.map((step) => (
        <Fragment key={step.title} as="li" className="search-path__step">
          <strong>{step.title}</strong>
          <span className="search-path__text">{step.text}</span>
          {step.tools && <span className="search-path__tools">{step.tools}</span>}
        </Fragment>
      ))}
    </ol>
  )
}
