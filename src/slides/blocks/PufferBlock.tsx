import { Slide } from '@revealjs/react'
import { CenteredLayout } from '../CenteredLayout'
import { SCHEDULE } from '../schedule'
import { SectionSlide } from '../SectionSlide'
import nanaAvatar from '../assets/techworld-with-nana.jpg'

const BLOCK_ID = 'puffer'

const end = SCHEDULE[SCHEDULE.length - 1].end

// Zum Weiterlernen nach dem Workshop, ohne die Tracking-Parameter der Teilen-Links.
const NANA_CHANNEL = 'https://www.youtube.com/@TechWorldwithNana'
const nanaVideos = [
  { title: 'Bash Scripting Tutorial for Beginners', url: 'https://youtu.be/PNhq_4d-5ek' },
  {
    title: "20% of Linux Commands You'll Use 80% of the Time",
    url: 'https://youtu.be/CLh2ACdXNbc',
  },
]

/** Block „Puffer & Fragen“: offene Fragen und Tipps zum Weiterlernen. */
export function PufferBlock() {
  return (
    <>
      <SectionSlide blockId={BLOCK_ID} />

      <Slide>
        <CenteredLayout>
          <p className="eyebrow">Ende um {end}</p>
          <h2 className="section-title">Danke fürs Mitmachen!</h2>
          <div className="further">
            <img className="further__avatar" src={nanaAvatar} alt="" />
            <div>
              <p className="further__label">Zum Weiterlernen auf YouTube</p>
              <p className="further__channel">
                <a href={NANA_CHANNEL} target="_blank" rel="noreferrer">
                  TechWorld with Nana
                </a>{' '}
                <span className="further__handle">@TechWorldwithNana</span>
              </p>
              <ul className="further__videos">
                {nanaVideos.map((video) => (
                  <li key={video.url}>
                    <a href={video.url} target="_blank" rel="noreferrer">
                      {video.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CenteredLayout>
      </Slide>
    </>
  )
}
