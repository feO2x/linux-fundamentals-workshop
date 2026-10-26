import { Fragment, Slide } from '@revealjs/react'
import type { ReactNode } from 'react'
import { ContentLayout } from '../ContentLayout'
import { InodeDiagram } from '../diagrams/InodeDiagram'
import { ExerciseSlide } from '../ExerciseSlide'
import { SectionSlide } from '../SectionSlide'
import { Spoiler } from '../Spoiler'
import { StepCode } from '../StepCode'
import { WhenDeckReady } from '../WhenDeckReady'

const BLOCK_ID = 'links-inodes'

// Lösungen zur Übung, gegen das gebaute Users-Image geprüft.
const solutions: { task: string; commands: string[]; answer: ReactNode }[] = [
  {
    task: 'Anlegen',
    commands: ['echo hallo > original', 'ln original hart', 'ln -s original weich'],
    answer: (
      <>
        Ohne <code>-s</code> entsteht ein Hardlink, mit <code>-s</code> ein Softlink
      </>
    ),
  },
  {
    task: 'Vergleichen',
    commands: ['ls -li'],
    answer: (
      <>
        <code>hart</code> und <code>original</code> haben dieselbe Inode-Nummer und zählen
        2&nbsp;Namen. <code>weich</code> hat eine eigene Nummer.
      </>
    ),
  },
  {
    task: 'Rechte über hart ändern',
    commands: ['chmod go-r hart', 'ls -l original'],
    answer: (
      <>
        Auch <code>original</code> zeigt <code>rw-------</code>: Die Rechte hängen am
        Inode, und den teilen sich beide Namen.
      </>
    ),
  },
  {
    task: 'Original löschen',
    commands: ['rm original', 'cat hart', 'cat weich'],
    answer: (
      <>
        <code>hart</code> zeigt weiter „hallo“, jetzt mit nur noch einem Namen.{' '}
        <code>weich</code> ist ein toter Link: No such file or directory.
      </>
    ),
  },
]

/** Block „Links & Inodes“: Hard- und Softlinks, und dass der Name nicht die Datei ist. */
export function LinksBlock() {
  return (
    <>
      <SectionSlide blockId={BLOCK_ID} />

      <Slide>
        <ContentLayout title="Hardlink und Softlink anlegen">
          <StepCode
            language="shell"
            lines={[
              'root@workshop:~# echo hallo > original',
              'root@workshop:~# ln original hart',
              'root@workshop:~# ln -s original weich',
              'root@workshop:~# ls -li',
              'total 8',
              '57186 -rw-r--r-- 2 root root 6 Oct 17 14:32 hart',
              '57186 -rw-r--r-- 2 root root 6 Oct 17 14:32 original',
              '57187 lrwxrwxrwx 1 root root 8 Oct 17 14:32 weich -> original',
            ]}
            steps="1|2|3|4-8|6-7|8"
            className="code--small"
          />
          <WhenDeckReady>
            <Fragment as="ul" className="points">
              <li>
                Die erste Spalte ist die Inode-Nummer: Darunter verwaltet der Kernel die
                eigentliche Datei. <code>hart</code> und <code>original</code> haben
                dieselbe - die <code>2</code> zählt die Namen.
              </li>
              <li>
                <code>weich</code> hat eine eigene Nummer, also eine eigene kleine Datei.
                Darin steht nur der Pfad <code>original</code>.
              </li>
            </Fragment>
          </WhenDeckReady>
        </ContentLayout>
      </Slide>

      <Slide>
        <ContentLayout title="Der Name ist nicht die Datei">
          <InodeDiagram />
          <Fragment as="p" className="note">
            Ein Verzeichnis ist nur eine Liste: Name → Inode-Nummer. Rechte, Besitzer und
            Größe hängen am Inode, nicht am Namen.
          </Fragment>
        </ContentLayout>
      </Slide>

      <Slide>
        <ContentLayout title="Und jetzt das Original löschen">
          <StepCode
            language="shell"
            lines={[
              'root@workshop:~# rm original',
              'root@workshop:~# cat hart',
              'hallo',
              'root@workshop:~# cat weich',
              'cat: weich: No such file or directory',
            ]}
            steps="1|2-3|4-5"
            className="code--small"
          />
          <WhenDeckReady>
            <Fragment as="ul" className="points">
              <li>
                Die Daten bleiben, solange noch ein Name auf den Inode zeigt.{' '}
                <code>rm</code> löscht nur einen Namen.
              </li>
              <li>
                Der Softlink zeigt auf einen Namen, den es nicht mehr gibt - ein toter
                Link. <code>/bin -&gt; usr/bin</code> ist auch ein Softlink, nur ein
                lebendiger.
              </li>
            </Fragment>
          </WhenDeckReady>
        </ContentLayout>
      </Slide>

      <ExerciseSlide
        blockId={BLOCK_ID}
        title="Übung: Zwei Arten von Links"
        tasks={[
          'Legt eine Datei an, dazu einen Hardlink und einen Softlink.',
          <>
            Vergleicht mit <code>ls -li</code> die Inode-Nummern und die Zahl der Namen.
          </>,
          <>
            Ändert die Rechte über den Hardlink (<code>chmod go-r hart</code>). Was
            passiert mit dem Original - und warum?
          </>,
          'Löscht das Original. Was sagen beide Links jetzt?',
        ]}
      />

      <Slide>
        <ContentLayout title="Zwei Arten von Links: So geht's">
          <Spoiler>
            <table className="solutions solutions--stacked">
              <tbody>
                {solutions.map((solution) => (
                  <tr key={solution.task}>
                    <td>{solution.task}</td>
                    <td className="solutions__path">
                      {solution.commands.map((command) => (
                        <code key={command}>{command}</code>
                      ))}
                    </td>
                    <td>{solution.answer}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Spoiler>
        </ContentLayout>
      </Slide>
    </>
  )
}
