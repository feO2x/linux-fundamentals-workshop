import { Fragment, Slide } from '@revealjs/react'
import { ContentLayout } from '../ContentLayout'
import { InodeDiagram } from '../diagrams/InodeDiagram'
import { ExerciseSlide } from '../ExerciseSlide'
import { SectionSlide } from '../SectionSlide'
import { StepCode } from '../StepCode'
import { WhenDeckReady } from '../WhenDeckReady'

const BLOCK_ID = 'links-inodes'

/** Block „Links & Inodes“: Hard- und Softlinks, und dass der Name nicht die Datei ist. */
export function LinksBlock() {
  return (
    <>
      <SectionSlide blockId={BLOCK_ID} />

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
                <code>hart</code> ist ein zweiter Name für denselben Inode. Die{' '}
                <code>2</code> zählt die Namen.
              </li>
              <li>
                <code>weich</code> hat einen eigenen Inode. Darin steht nur der Pfad{' '}
                <code>original</code>.
              </li>
            </Fragment>
          </WhenDeckReady>
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
            Ändert die Rechte über den Hardlink (<code>chmod 600 hart</code>). Was
            passiert mit dem Original - und warum?
          </>,
          'Löscht das Original. Was sagen beide Links jetzt?',
        ]}
      />
    </>
  )
}
