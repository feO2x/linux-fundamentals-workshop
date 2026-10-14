import { useReveal } from '@revealjs/react'
import type { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

/**
 * Rendert die Kinder erst, wenn Reveal bereit ist. Fragmente darin werden so
 * erst zusammen mit den Code-Schritten einsortiert und erscheinen danach.
 *
 * Hintergrund: `<Code>` kann erst hervorheben, wenn der Deck bereit ist. Erst
 * dann legt das Highlight-Plugin die Hervorhebungsschritte als Fragment-Kopien
 * an. Zu diesem Zeitpunkt hat Reveal alle übrigen Fragmente bereits nummeriert,
 * und Fragmente ohne Nummer sortiert es hinter alle nummerierten. Ohne diese
 * Komponente erschiene ein Fragment nach dem Codeblock also vor dessen Schritten.
 *
 * Explizite `index`-Props helfen nicht: Reveal nummeriert beim Start alle
 * Fragmente lückenlos neu, solange die Code-Schritte noch fehlen – ein
 * Fragment mit `index={1}` bekommt dabei die 0.
 */
export function WhenDeckReady({ children }: Props) {
  return useReveal() ? children : null
}
