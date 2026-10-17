import { Fragment } from '@revealjs/react'
import './diagrams.css'

/** Eine Gastmaschine bzw. ein Container als Stapel von Kästen. */
function Guest({ label, kernel }: { label: string; kernel: boolean }) {
  return (
    <div className="guest">
      <span className="guest__label">{label}</span>
      <div className="box box--app">Programme</div>
      {kernel && <div className="box box--kernel">Kernel</div>}
    </div>
  )
}

/**
 * Links: Jede VM bringt ihren eigenen Kernel mit.
 * Rechts: Alle Container teilen sich den Kernel des Hosts.
 */
export function VmVsContainer() {
  return (
    <div className="vm-vs-container">
      <figure className="stack">
        <figcaption>Virtuelle Maschinen</figcaption>
        <div className="stack__guests">
          <Guest label="VM 1" kernel />
          <Guest label="VM 2" kernel />
        </div>
        <div className="box box--platform">Hypervisor</div>
        <div className="box box--hardware">Hardware</div>
      </figure>

      <Fragment as="figure" className="stack">
        <figcaption>Container</figcaption>
        <div className="stack__guests">
          <Guest label="workshop" kernel={false} />
          <Guest label="nachbar" kernel={false} />
          <Guest label="…" kernel={false} />
        </div>
        <div className="box box--kernel">Kernel des Hosts – geteilt</div>
        <div className="box box--hardware">Hardware</div>
      </Fragment>
    </div>
  )
}
