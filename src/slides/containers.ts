// TODO: Platzhalter durch die Pfade in der internen Registry ersetzen.
// Achtung: Die Folien liegen auf GitHub Pages – die Pfade sind dann öffentlich.

/** Start-Image für den ersten Block, gebaut aus `containers/start/`. */
export const START_IMAGE = 'registry.example.com/linux-workshop/start'

/** Nacktes Image ab der ersten Pause, gebaut aus `containers/bare/`. */
export const BARE_IMAGE = 'registry.example.com/linux-workshop/bare'

/** Ersatz, falls apt im Workshop nicht durchkommt, gebaut aus `containers/tools/`. */
export const TOOLS_IMAGE = 'registry.example.com/linux-workshop/tools'

/** Lädt das Image vor dem Workshop herunter. */
export function pullCommand(image: string): string {
  return `docker pull ${image}`
}

/** Startet eine interaktive Shell in einem Container, der beim Beenden verschwindet. */
export function runCommand(hostname: string, image: string): string {
  return `docker run --rm -it --hostname ${hostname} ${image}`
}
