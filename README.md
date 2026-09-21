# Linux Fundamentals — Workshop-Agenda

Agenda-Seite für den vierstündigen Workshop „Linux Fundamentals“.
React + Vite + TypeScript.

## Inhalt anpassen

Die komplette Agenda steckt in [`src/data/agenda.ts`](src/data/agenda.ts) — ein Array
von Blöcken mit Titel, Dauer, Praxisanteil und Übungsnotiz. Die Uhrzeiten werden aus
`START_TIME` und den Dauern berechnet, Gesamtdauer und Praxisanteil summiert die Seite
selbst. Einen Block verschieben, kürzen oder streichen heißt also: nur dieses eine Array
bearbeiten.

`kind: 'break'` und `kind: 'buffer'` stellen einen Block optisch zurück.

## Handout

Die Seite hat Druckstyles (helles Layout, keine Seitenumbrüche mitten in einem Block).
Im Browser einfach „Drucken → Als PDF sichern“.
