import { Deck, Slide } from '@revealjs/react'
import type { RevealConfig } from 'reveal.js'
import { AGENDA, type AgendaBlock } from '../data/agenda'
import { CenteredLayout } from './CenteredLayout'
import { ContentLayout } from './ContentLayout'

// Feste 16:9-Leinwand, die Reveal auf das Browserfenster skaliert.
const config: RevealConfig = {
  hash: true,
  width: 1280,
  height: 720,
  center: false,
}

/** Sucht einen Agenda-Block über seinen Titel. Für den Spike reicht das. */
function findBlock(title: string): AgendaBlock {
  const block = AGENDA.find((block) => block.title === title)
  if (!block) throw new Error(`Agenda-Block "${title}" nicht gefunden`)
  return block
}

const kernelBlock = findBlock('Kernel vs. User Space')

export default function SlidesApp() {
  return (
    <Deck config={config}>
      <Slide>
        <CenteredLayout>
          <p className="eyebrow">Workshop</p>
          <h1>Linux Fundamentals</h1>
        </CenteredLayout>
      </Slide>

      <Slide id="kernel-user-space">
        <CenteredLayout>
          <h2>{kernelBlock.title}</h2>
          <p className="lede">{kernelBlock.summary}</p>
        </CenteredLayout>
      </Slide>

      <Slide>
        <ContentLayout title={kernelBlock.title}>
          <ul>
            {kernelBlock.commands?.map((command) => (
              <li key={command}>{command}</li>
            ))}
          </ul>
        </ContentLayout>
      </Slide>
    </Deck>
  )
}
