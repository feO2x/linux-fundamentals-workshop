import type { ReactNode } from 'react'
import { REGISTRIES, setRegistry, useRegistry } from './containers'

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
  const registry = useRegistry()

  return (
    <div className="registry-tabs">
      <div className="registry-tabs__list" role="group" aria-label="Registry">
        {REGISTRIES.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            className="registry-tabs__tab"
            aria-pressed={id === registry}
            onClick={() => setRegistry(id)}
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
