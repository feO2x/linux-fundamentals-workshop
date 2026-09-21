import { AgendaList } from './components/AgendaList'
import { AGENDA, START_TIME } from './data/agenda'
import { buildSchedule, formatDuration } from './lib/time'
import './App.css'

const total = AGENDA.reduce((sum, block) => sum + block.duration, 0)
const praxis = AGENDA.reduce((sum, block) => sum + (block.praxis ?? 0), 0)
const end = buildSchedule(START_TIME, [total])[0].end

export default function App() {
  return (
    <div className="page">
      <header className="hero">
        <p className="hero__eyebrow">Workshop</p>
        <h1 className="hero__title">Linux Fundamentals</h1>
        <p className="hero__lede">
          Vom Kernel bis zu Dateirechten — alles direkt im Container geübt. Der Workshop
          baut auf den Bash-Grundlagen auf und bereitet den Umgang mit Linux-basierten
          Docker-Containern vor.
        </p>

        <dl className="stats">
          <div className="stat">
            <dt>Dauer</dt>
            <dd>{formatDuration(total)}</dd>
          </div>
          <div className="stat">
            <dt>Zeitrahmen</dt>
            <dd>
              {START_TIME}–{end}
            </dd>
          </div>
          <div className="stat stat--accent">
            <dt>Praxisanteil</dt>
            <dd>{formatDuration(praxis)}</dd>
          </div>
          <div className="stat">
            <dt>Umgebung</dt>
            <dd>
              <code>ubuntu:24.04</code>
            </dd>
          </div>
        </dl>
      </header>

      <main>
        <AgendaList blocks={AGENDA} start={START_TIME} />
      </main>

      <footer className="footer">
        <p>
          {formatDuration(praxis)} der {formatDuration(total)} sind praktische Übung. Der
          Block <strong>Links &amp; Inodes</strong> dient als Zeitpuffer und kann
          entfallen, ohne dass etwas Wesentliches fehlt.
        </p>
      </footer>
    </div>
  )
}
