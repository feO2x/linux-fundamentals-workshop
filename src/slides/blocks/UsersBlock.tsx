import { Fragment, Slide } from '@revealjs/react'
import { findBlock } from '../../data/agenda'
import { ContentLayout } from '../ContentLayout'
import { ExerciseSlide } from '../ExerciseSlide'
import { SectionSlide } from '../SectionSlide'
import { StepCode } from '../StepCode'
import { WhenDeckReady } from '../WhenDeckReady'

const BLOCK_ID = 'users-groups'

const permissionsBlock = findBlock('berechtigungen')

// Die Felder einer Zeile aus /etc/passwd, am Beispiel des Benutzers ubuntu.
const passwdFields = [
  { value: 'ubuntu', className: 'passwd-line__name', text: 'Benutzername' },
  { value: 'x', text: 'Passwort – steht in Wahrheit in /etc/shadow' },
  { value: '1000', className: 'passwd-line__id', text: 'UID, die Nummer des Benutzers' },
  {
    value: '1000',
    className: 'passwd-line__id',
    text: 'GID, die Nummer seiner Hauptgruppe',
  },
  { value: 'Ubuntu', text: 'Kommentar, oft der volle Name' },
  { value: '/home/ubuntu', text: 'Home-Verzeichnis' },
  { value: '/bin/bash', text: 'Shell nach der Anmeldung' },
]

/** Block „Users & Groups“: Benutzer, Gruppen und was der Kernel davon sieht. */
export function UsersBlock() {
  return (
    <>
      <SectionSlide blockId={BLOCK_ID} />

      <Slide>
        <ContentLayout title="Wer ist sonst noch da?">
          <p className="note">
            Benutzer sind eine Einstellung, also <code>/etc</code>. Dort klingt{' '}
            <code>passwd</code> passend:
          </p>
          <StepCode
            language="shell"
            lines={[
              'root@workshop:~# cat /etc/passwd',
              'root:x:0:0:root:/root:/bin/bash',
              'daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin',
              '…',
              'nobody:x:65534:65534:nobody:/nonexistent:/usr/sbin/nologin',
              'ubuntu:x:1000:1000:Ubuntu:/home/ubuntu:/bin/bash',
            ]}
            steps="1-6|3-5|6"
            className="code--small"
          />
          <WhenDeckReady>
            <Fragment as="ul" className="points">
              <li>
                Die meisten Einträge sind für Dienste, nicht für Menschen.{' '}
                <code>nologin</code> heißt: Anmelden geht nicht.
              </li>
              <li>
                Den Benutzer <code>ubuntu</code> bringt das Image schon mit.
              </li>
            </Fragment>
          </WhenDeckReady>
        </ContentLayout>
      </Slide>

      <Slide>
        <ContentLayout title="Eine Zeile, sieben Felder">
          <p className="passwd-line">
            {passwdFields.map((field, index) => (
              <span key={index}>
                {index > 0 && ':'}
                <span className={field.className}>{field.value}</span>
              </span>
            ))}
          </p>
          <dl className="legend legend--auto legend--compact">
            {passwdFields.map((field, index) => (
              <Fragment key={index} as="div" className="legend__row">
                <dt className={field.className}>{field.value}</dt>
                <dd>{field.text}</dd>
              </Fragment>
            ))}
          </dl>
        </ContentLayout>
      </Slide>

      <Slide>
        <ContentLayout title="UID und GID sind nur Zahlen">
          <StepCode
            language="shell"
            lines={[
              'root@workshop:~# ls -l /home',
              'total 4',
              'drwxr-x--- 2 ubuntu ubuntu 4096 Sep 30 14:26 ubuntu',
              'root@workshop:~# ls -ln /home',
              'total 4',
              'drwxr-x--- 2 1000 1000 4096 Sep 30 14:26 ubuntu',
            ]}
            steps="1-3|4-6"
            className="code--small"
          />
          <WhenDeckReady>
            <Fragment as="ul" className="points">
              <li>
                Der Kernel speichert nur die Zahl. Den Namen schlägt <code>ls</code> in{' '}
                <code>/etc/passwd</code> nach.
              </li>
              <li>
                Container und Host teilen sich den Kernel – und der kennt nur die Zahlen.
                root im Container hat UID&nbsp;0, dieselbe Zahl wie root auf dem Host.
              </li>
              <li>
                Docker schränkt diesen root zwar ein, trotzdem lässt man Anwendungen im
                Container besser als eigenen Benutzer laufen. Wie, seht ihr in der
                Abschlussübung.
              </li>
            </Fragment>
          </WhenDeckReady>
        </ContentLayout>
      </Slide>

      <Slide>
        <ContentLayout title="Benutzer und Gruppen anlegen">
          <StepCode
            lines={[
              'useradd -m -s /bin/bash alice   # -m: Home anlegen, -s: Shell',
              'groupadd team                   # neue Gruppe',
              'usermod -aG team alice          # alice in team aufnehmen',
              'id alice                        # prüfen',
            ]}
          />
          <ul className="points">
            <Fragment as="li">
              Ohne <code>-m</code> gibt es kein Home-Verzeichnis, ohne <code>-s</code>{' '}
              bekommt alice nur <code>/bin/sh</code>.
            </Fragment>
            <Fragment as="li">
              Vergesst das <code>-a</code> nicht: Ohne ersetzt <code>usermod -G</code>{' '}
              alle Zusatzgruppen, statt eine hinzuzufügen.
            </Fragment>
          </ul>
        </ContentLayout>
      </Slide>

      <Slide>
        <ContentLayout title="Gruppen und Passwörter">
          <StepCode
            language="shell"
            lines={[
              'root@workshop:~# id alice',
              'uid=1001(alice) gid=1001(alice) groups=1001(alice),1002(team)',
              'root@workshop:~# cat /etc/group',
              'root:x:0:',
              '…',
              'team:x:1002:alice',
              'root@workshop:~# ls -l /etc/passwd /etc/shadow',
              '-rw-r--r-- 1 root root   929 Oct 17 14:18 /etc/passwd',
              '-rw-r----- 1 root shadow 529 Oct 17 14:18 /etc/shadow',
            ]}
            steps="1-2|3-6|7-9"
            className="code--small"
          />
          <WhenDeckReady>
            <Fragment as="p" className="note">
              <code>/etc/passwd</code> darf jeder lesen, <code>/etc/shadow</code> mit den
              Passwörtern nur root. Was die Buchstaben vorne bedeuten, klärt der Block „
              {permissionsBlock.title}“.
            </Fragment>
          </WhenDeckReady>
        </ContentLayout>
      </Slide>

      <Slide>
        <ContentLayout title="Als alice arbeiten">
          <StepCode
            language="shell"
            lines={[
              'root@workshop:~# su - alice',
              'alice@workshop:~$ pwd',
              '/home/alice',
              'alice@workshop:~$ cat /etc/shadow',
              'cat: /etc/shadow: Permission denied',
              'alice@workshop:~$ exit',
              'root@workshop:~#',
            ]}
            steps="1|2-3|4-5|6-7"
            className="code--small"
          />
          <WhenDeckReady>
            <Fragment as="ul" className="points">
              <li>
                root wird ohne Passwort zu jedem anderen Benutzer. Das <code>-</code>{' '}
                sorgt für eine frische Anmeldung mit eigenem Home.
              </li>
              <li>
                Der Prompt zeigt jetzt <code>$</code> statt <code>#</code>: Ihr seid nicht
                mehr root.
              </li>
            </Fragment>
          </WhenDeckReady>
        </ContentLayout>
      </Slide>

      <Slide>
        <ContentLayout title="Auf eurem eigenen Linux: sudo">
          <StepCode
            language="shell"
            lines={[
              'ich@laptop:~$ id',
              'uid=1000(ich) gid=1000(ich) groups=1000(ich),27(sudo),…',
              'ich@laptop:~$ apt install tree',
              'E: Could not open lock file … (13: Permission denied)',
              'E: Unable to acquire the dpkg frontend lock (…), are you root?',
              'ich@laptop:~$ sudo apt install tree',
              '[sudo] password for ich:',
            ]}
            steps="1-2|3-5|6-7"
            className="code--small"
          />
          <WhenDeckReady>
            <Fragment as="ul" className="points">
              <li>
                Im Container seid ihr root. In WSL oder auf einem Server seid ihr ein
                normaler Benutzer – wie alice.
              </li>
              <li>
                <code>sudo</code> führt ein einzelnes Kommando als root aus. Das dürfen
                nur Mitglieder der Gruppe sudo, mit ihrem eigenen Passwort.
              </li>
              <li>
                Erst lesen, was ein Kommando tut, dann <code>sudo</code> davor – erst
                recht, wenn ein Agent es vorschlägt.
              </li>
            </Fragment>
          </WhenDeckReady>
        </ContentLayout>
      </Slide>

      <ExerciseSlide
        blockId={BLOCK_ID}
        title="Übung: alice und bob"
        tasks={[
          'Findet mit dem Suchweg heraus, welche Benutzer es schon gibt. Welche UID hat ubuntu?',
          <>
            Legt alice und bob an und nehmt beide in die Gruppe <code>team</code> auf.
            Prüft das Ergebnis mit <code>id</code>.
          </>,
          <>
            Werdet mit <code>su - alice</code> zu alice. Was sagen <code>whoami</code> und{' '}
            <code>id</code> jetzt?
          </>,
          <>
            Versucht als alice <code>cd /root</code>.
          </>,
          <>
            Bonus: Warum ist der Prompt von alice nicht farbig? Vergleicht ihre{' '}
            <code>~/.bashrc</code> mit <code>/etc/skel/.bashrc</code>.
          </>,
        ]}
      >
        <p className="question">
          <span className="question__label">Findet heraus</span>
          Warum darf alice nicht nach <code>/root</code> – und woher weiß Linux das?
        </p>
      </ExerciseSlide>
    </>
  )
}
