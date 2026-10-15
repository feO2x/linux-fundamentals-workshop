/**
 * Start-Image für den ersten Block, gebaut aus `containers/start/`.
 *
 * TODO: Platzhalter durch den Pfad in der internen Registry ersetzen.
 * Achtung: Die Folien liegen auf GitHub Pages – der Pfad ist dann öffentlich.
 */
export const START_IMAGE = 'registry.example.com/linux-workshop/start'

/** Lädt das Image vor dem Workshop herunter. */
export function pullCommand(image: string): string {
  return `docker pull ${image}`
}

/** Startet eine interaktive Shell in einem Container, der beim Beenden verschwindet. */
export function runCommand(hostname: string, image: string): string {
  return `docker run --rm -it --hostname ${hostname} ${image}`
}
