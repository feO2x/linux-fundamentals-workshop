import { useReveal } from '@revealjs/react'
import type { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

/**
 * Rendert die Kinder erst, wenn Reveal bereit ist. Fragmente darin werden so
 * erst zusammen mit den Code-Schritten einsortiert und erscheinen danach.
 */
export function WhenDeckReady({ children }: Props) {
  return useReveal() ? children : null
}
