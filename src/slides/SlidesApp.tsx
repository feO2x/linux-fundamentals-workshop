import { Deck, Slide } from '@revealjs/react'
import type { RevealConfig } from 'reveal.js'
import { AGENDA, type AgendaBlock } from '../data/agenda'

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
        <h1>Linux Fundamentals</h1>
      </Slide>

      <Slide id="kernel-user-space">
        <h2>{kernelBlock.title}</h2>
        <p>{kernelBlock.summary}</p>
      </Slide>

      <Slide>
        <h2>{kernelBlock.title}</h2>
        <ul>
          {kernelBlock.commands?.map((command) => (
            <li key={command}>{command}</li>
          ))}
        </ul>
      </Slide>
    </Deck>
  )
}
