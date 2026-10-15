import { Slide } from '@revealjs/react'
import type { ReactNode } from 'react'
import { findBlock } from '../data/agenda'
import { ContentLayout } from './ContentLayout'

interface Props {
  /** Agenda-Block, aus dem die Übungszeit stammt. */
  blockId: string
  title: string
  /** Aufgaben oder Fragen, eine pro Listeneintrag. */
  tasks: ReactNode[]
  /** Nummerierte Liste, z. B. für die Fragen der Schnitzeljagd. */
  numbered?: boolean
  /** Weiterer Inhalt unter dem Übungskasten, z. B. Kommandos oder Hinweise. */
  children?: ReactNode
}

/** Übungsfolie: die Aufgaben eines Blocks im Übungskasten. */
export function ExerciseSlide({
  blockId,
  title,
  tasks,
  numbered = false,
  children,
}: Props) {
  const block = findBlock(blockId)
  const List = numbered ? 'ol' : 'ul'

  return (
    <Slide>
      <ContentLayout title={title}>
        <div className="exercise exercise--slide">
          <span className="exercise__label">
            Übung{block.praxis ? ` · ${block.praxis} min` : null}
          </span>
          <List className="exercise__tasks">
            {tasks.map((task, index) => (
              <li key={index}>{task}</li>
            ))}
          </List>
        </div>
        {children}
      </ContentLayout>
    </Slide>
  )
}
