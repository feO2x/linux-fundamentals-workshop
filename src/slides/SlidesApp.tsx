import { Deck } from '@revealjs/react'
import type { RevealConfig } from 'reveal.js'
import RevealHighlight from 'reveal.js/plugin/highlight'
import { ThemeToggle } from '../components/ThemeToggle'
import { BreakSlide } from './BreakSlide'
import { AptBlock } from './blocks/AptBlock'
import { DateiBlock } from './blocks/DateiBlock'
import { EinstiegBlock } from './blocks/EinstiegBlock'
import { KernelBlock } from './blocks/KernelBlock'
import { Opening } from './blocks/Opening'
import { UsersBlock } from './blocks/UsersBlock'
import { VerzeichnisBlock } from './blocks/VerzeichnisBlock'

// Feste 16:9-Leinwand, die Reveal auf das Browserfenster skaliert.
const config: RevealConfig = {
  hash: true,
  width: 1280,
  height: 720,
  center: false,
}

// Plugins liest der Deck nur beim ersten Rendern – daher eine feste Liste.
const plugins = [RevealHighlight]

export default function SlidesApp() {
  return (
    <>
      {/* Außerhalb des Decks, damit Reveal den Knopf nicht mitskaliert. */}
      <ThemeToggle className="slides-theme-toggle" />
      <Deck config={config} plugins={plugins}>
        <Opening />
        <EinstiegBlock />
        <KernelBlock />
        <VerzeichnisBlock />
        <BreakSlide blockId="pause-1">
          Danach startet ihr einen neuen Container. Den aktuellen beendet ihr mit{' '}
          <code>exit</code>.
        </BreakSlide>
        <AptBlock />
        <DateiBlock />
        <UsersBlock />
        <BreakSlide blockId="pause-2">
          Danach startet ihr wieder einen neuen Container. Den aktuellen beendet ihr mit{' '}
          <code>exit</code>.
        </BreakSlide>
      </Deck>
    </>
  )
}
