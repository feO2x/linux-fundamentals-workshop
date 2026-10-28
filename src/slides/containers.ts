import { useSyncExternalStore } from 'react'

// Achtung: Die Folien liegen auf GitHub Pages - die Pfade sind dann öffentlich.

/** Registrys, aus denen die Teilnehmer die Images holen können. */
export type Registry = 'hub.gwvs.de' | 'docker.io'

/** Die Images aus `containers/<name>/`. */
export type ImageName = 'start' | 'bare' | 'tools' | 'users'

/** Reihenfolge und Beschriftung der Tabs auf „Euer Linux für heute“. */
export const REGISTRIES: { id: Registry; label: string }[] = [
  { id: 'hub.gwvs.de', label: 'hub.gwvs.de' },
  { id: 'docker.io', label: 'Docker Hub' },
]

const DEFAULT_REGISTRY: Registry = 'hub.gwvs.de'

/**
 * Pfad eines Images in einer Registry, passend zu `image_prefix` in
 * `containers/build-images.sh`. Docker Hub kennt keine verschachtelten Pfade,
 * deshalb dort linux-fundamentals-<name>; `docker.io/` lassen die Folien weg.
 */
export function imageRef(registry: Registry, image: ImageName): string {
  return registry === 'docker.io'
    ? `feo2x/linux-fundamentals-${image}`
    : `hub.gwvs.de/gwvs/linux-fundamentals/${image}`
}

/** Lädt das Image vor dem Workshop herunter. */
export function pullCommand(image: string): string {
  return `docker pull ${image}`
}

/** Startet eine interaktive Shell in einem Container, der beim Beenden verschwindet. */
export function runCommand(hostname: string, image: string): string {
  return `docker run --rm -it --hostname ${hostname} ${image}`
}

// ---------- Gewählte Registry ----------

/** Query-Parameter, mit dem ein Link die Registry vorgibt: `slides.html?registry=docker.io`. */
const REGISTRY_PARAM = 'registry'

/** Schlüssel im localStorage für die zuletzt gewählte Registry. */
const REGISTRY_STORAGE_KEY = 'linux-fundamentals-registry'

function isRegistry(value: string | null): value is Registry {
  return REGISTRIES.some((registry) => registry.id === value)
}

/** Der Link hat Vorrang vor der gespeicherten Wahl, sonst gilt hub.gwvs.de. */
function initialRegistry(): Registry {
  const fromUrl = new URLSearchParams(location.search).get(REGISTRY_PARAM)
  if (isRegistry(fromUrl)) return fromUrl

  try {
    const stored = localStorage.getItem(REGISTRY_STORAGE_KEY)
    if (isRegistry(stored)) return stored
  } catch {
    // Ohne Speicher (z. B. privates Fenster) gilt der Standard.
  }
  return DEFAULT_REGISTRY
}

let currentRegistry = initialRegistry()
const listeners = new Set<() => void>()

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function getRegistry() {
  return currentRegistry
}

/**
 * Wechselt die Registry auf allen Folien und merkt sie sich. Gibt der Link sie
 * vor, zieht er mit, sonst gälte nach dem Neuladen wieder die alte.
 */
export function setRegistry(registry: Registry) {
  currentRegistry = registry
  try {
    localStorage.setItem(REGISTRY_STORAGE_KEY, registry)
  } catch {
    // Ohne Speicher gilt die Wahl nur bis zum Neuladen.
  }

  const url = new URL(location.href)
  if (url.searchParams.has(REGISTRY_PARAM)) {
    url.searchParams.set(REGISTRY_PARAM, registry)
    history.replaceState(history.state, '', url)
  }

  for (const listener of listeners) listener()
}

/** Die gewählte Registry; die Komponente rendert neu, wenn sie wechselt. */
export function useRegistry(): Registry {
  return useSyncExternalStore(subscribe, getRegistry)
}

/** Pfad eines Images in der gewählten Registry. */
export function useImage(image: ImageName): string {
  return imageRef(useRegistry(), image)
}
