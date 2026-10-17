import { Fragment } from '@revealjs/react'
import './diagrams.css'

/**
 * Schichten von unten nach oben: Hardware, Kernel, Syscall-Grenze, User Space.
 * Die Schichten erscheinen nacheinander als Fragmente. Im DOM steht die
 * Hardware zuerst, `column-reverse` stellt sie nach unten.
 */
export function KernelLayers() {
  return (
    <div className="kernel-layers">
      <div className="layer layer--hardware">
        <span className="layer__name">Hardware</span>
        <span className="layer__items">
          CPU · Arbeitsspeicher · Festplatte · Netzwerkkarte
        </span>
      </div>

      <Fragment as="div" className="layer layer--kernel">
        <span className="layer__name">Kernel</span>
        <span className="layer__items">
          Prozesse · Speicher · Dateien &amp; Geräte · Netzwerk
        </span>
      </Fragment>

      <Fragment as="div" className="syscall-boundary">
        <span>Syscalls</span>
      </Fragment>

      <Fragment as="div" className="layer layer--user">
        <span className="layer__name">User Space</span>
        <span className="layer__items">
          <code>bash</code> <code>ls</code> <code>ps</code> <code>docker</code> …
        </span>
      </Fragment>
    </div>
  )
}
