import { useReveal } from '@revealjs/react'
import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { REGISTRIES, setRegistry, useRegistry, type Registry } from './containers'

interface Props {
  /** Der Codeblock mit den Image-Pfaden, an dem die Tabs hängen. */
  children: ReactNode
}

/**
 * Tabs über einem Codeblock, die die Registry für alle Folien wechseln.
 *
 * Optisch Tabs, technisch Umschaltknöpfe (`aria-pressed`): Das Tab-Muster
 * verlangt Pfeiltasten, und die braucht Reveal zum Blättern.
 */
export function RegistryTabs({ children }: Props) {
  const deck = useReveal()
  const registry = useRegistry()
  const ref = useRef<HTMLDivElement>(null)
  // Fragment, das vor dem Wechsel zu sehen war; null, solange kein Wechsel ansteht.
  const fragmentBeforeSwitch = useRef<number | null>(null)

  function select(id: Registry) {
    if (id === registry) return
    fragmentBeforeSwitch.current = deck?.getIndices().f ?? -1
    setRegistry(id)
  }

  // Mit neuen Pfaden hebt `<Code>` den Block neu hervor und legt seine Schritte
  // als neue Fragmente ohne Nummer an. Reveal sortiert sie dann hinter Legende
  // und Hinweis, die ihre Nummern schon haben. Läuft nach dem Effekt von `<Code>`,
  // weil Effekte von Kindern zuerst laufen: Ohne Nummern sortiert Reveal alle
  // Fragmente der Folie in DOM-Reihenfolge, die Schritte also wieder nach vorn.
  useEffect(() => {
    const fragment = fragmentBeforeSwitch.current
    const slide = ref.current?.closest('section')
    if (!deck || fragment === null || !slide) return

    fragmentBeforeSwitch.current = null
    for (const element of slide.querySelectorAll('.fragment')) {
      element.removeAttribute('data-fragment-index')
    }
    deck.syncFragments(slide)
    deck.navigateFragment(fragment)
  }, [deck, registry])

  return (
    <div className="registry-tabs" ref={ref}>
      <div className="registry-tabs__list" role="group" aria-label="Registry">
        {REGISTRIES.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            className="registry-tabs__tab"
            aria-pressed={id === registry}
            onClick={() => select(id)}
            // Kein Fokus per Maus: Sonst löst die Leertaste, mit der Reveal
            // weiterblättert, den Knopf erneut aus (wie beim ThemeToggle).
            onMouseDown={(event) => event.preventDefault()}
          >
            {label}
          </button>
        ))}
      </div>
      {children}
    </div>
  )
}
