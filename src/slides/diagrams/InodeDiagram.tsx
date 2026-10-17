import { Fragment } from '@revealjs/react'
import './diagrams.css'

/**
 * Links das Verzeichnis als Liste „Name → Inode-Nummer“, rechts die Inodes.
 * Erst kommt der Hardlink dazu, dann der Softlink mit seinem eigenen Inode.
 * Inode-Nummern wie in der Ausgabe von `ls -li` im Users-Image.
 */
export function InodeDiagram() {
  return (
    <div className="inodes">
      <figure className="inodes__column">
        <figcaption>Verzeichnis /root</figcaption>
        <div className="inodes__entry">
          <span>original</span>
          <span className="inodes__ref">57186</span>
        </div>
        <Fragment as="div" className="inodes__entry" index={0}>
          <span>hart</span>
          <span className="inodes__ref">57186</span>
        </Fragment>
        <Fragment as="div" className="inodes__entry" index={1}>
          <span>weich</span>
          <span className="inodes__ref inodes__ref--link">57187</span>
        </Fragment>
      </figure>

      <figure className="inodes__column">
        <figcaption>Inodes</figcaption>
        <div className="inode">
          <span className="inodes__ref">57186</span>
          <span>
            <code>-rw-r--r--</code> root root, 6 Bytes
          </span>
          <span className="inode__data">Daten: „hallo“</span>
        </div>
        <Fragment as="div" className="inode inode--link" index={1}>
          <span className="inodes__ref inodes__ref--link">57187</span>
          <span>
            <code>lrwxrwxrwx</code> Softlink
          </span>
          <span className="inode__data">Daten: der Pfad „original“</span>
        </Fragment>
      </figure>
    </div>
  )
}
