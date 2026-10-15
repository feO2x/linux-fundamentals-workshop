import { Code, Deck, Fragment, Slide } from '@revealjs/react'
import type { RevealConfig } from 'reveal.js'
import RevealHighlight from 'reveal.js/plugin/highlight'
import { ThemeToggle } from '../components/ThemeToggle'
import { AGENDA, type AgendaBlock } from '../data/agenda'
import { CenteredLayout } from './CenteredLayout'
import { ContentLayout } from './ContentLayout'
import { WhenDeckReady } from './WhenDeckReady'

// Feste 16:9-Leinwand, die Reveal auf das Browserfenster skaliert.
const config: RevealConfig = {
  hash: true,
  width: 1280,
  height: 720,
  center: false,
}

// Plugins liest der Deck nur beim ersten Rendern – daher eine feste Liste.
const plugins = [RevealHighlight]

/** Sucht einen Agenda-Block über seinen Titel. Für den Spike reicht das. */
function findBlock(title: string): AgendaBlock {
  const block = AGENDA.find((block) => block.title === title)
  if (!block) throw new Error(`Agenda-Block "${title}" nicht gefunden`)
  return block
}

const kernelBlock = findBlock('Kernel vs. User Space')
const kernelCommands = kernelBlock.commands ?? []

export default function SlidesApp() {
  return (
    <>
      {/* Außerhalb des Decks, damit Reveal den Knopf nicht mitskaliert. */}
      <ThemeToggle className="slides-theme-toggle" />
      <Deck config={config} plugins={plugins}>
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
            {/* Ein Hervorhebungsschritt pro Kommando: "1|2|…" */}
            <Code
              language="bash"
              lineNumbers={kernelCommands.map((_, index) => index + 1).join('|')}
            >
              {kernelCommands.join('\n')}
            </Code>
            <WhenDeckReady>
              <Fragment as="p" className="exercise">
                <span className="exercise__label">Übung</span>
                {kernelBlock.praxisNote}
              </Fragment>
            </WhenDeckReady>
          </ContentLayout>
        </Slide>
      </Deck>
    </>
  )
}
