// Tihar page: the five days and the diya.
import { useState } from "react";
import { Heart, CalendarDays, Flame } from "lucide-react";
import { photos } from "../data/photos";
import Eyebrow from "../components/Eyebrow";
import { tiharDays } from "../data/tiharDays";
export default function TiharExperience() {
  const [active, setActive] = useState(2);
  const [lit, setLit] = useState(false);
  return <main className="page-shell tihar-page">
    <section className="page-hero tihar-hero">
      <div
        className="page-hero-image"
        style={{ backgroundImage: `url(${photos.tihar})` }}
      />
      <div className="page-hero-shade" />
      <div className="page-hero-copy">
        <Eyebrow>FIVE DAYS, COUNTLESS LITTLE LIGHTS</Eyebrow>
        <h1 style={{ color: "white" }}>
            Tihar, <em>the light within.</em>
          </h1>
        <p>
            A festival of devotion and togetherness, where homes sparkle,
            animals are honoured and family bonds shine brighter.
          </p>
        <div className="hero-tags">
          <span>
              <Flame size={15} /> Festival of lights
            </span>
          <span>
              <Heart size={15} /> Family & community
            </span>
          <span>
              <CalendarDays size={15} /> Five-day tradition
            </span>
        </div>
      </div>
    </section>
    <section className="tihar-content section-pad">
      <div className="tihar-intro">
        <div>
          <Eyebrow>THE FIVE DAYS OF TIHAR</Eyebrow>
          <h2>
              Every day has
              <br />
              its own <em>glow.</em>
            </h2>
        </div>
        <p>
            Explore the symbolism behind each day. Traditions vary across
            families and communities, but the spirit of gratitude, respect and
            renewal runs through them all.
          </p>
      </div>
      <div className="tihar-timeline">
          {tiharDays.map((d, i) => <button
        key={d.name}
        className={`tihar-day ${active === i ? "active" : ""}`}
        onClick={() => setActive(i)}
      >
        <span className="day-index">0{i + 1}</span>
        <span className="day-emoji">{d.icon}</span>
        <span className="day-title">{d.name}</span>
        <span className="day-tag">{d.tag}</span>
      </button>)}
        </div>
      <article className="day-feature">
        <div className="day-feature-icon">{tiharDays[active].icon}</div>
        <div>
          <Eyebrow>
              DAY 0{active + 1} · {tiharDays[active].tag}
            </Eyebrow>
          <h3>{tiharDays[active].name}</h3>
          <p>{tiharDays[active].desc}</p>
          <div className="day-progress">
              {tiharDays.map((d, i) => <button
            key={d.name}
            className={i === active ? "active" : ""}
            onClick={() => setActive(i)}
            aria-label={`View ${d.name}`}
          />)}
            </div>
        </div>
        <div className="day-feature-number">
            0{active + 1}
            <span>/ 05</span>
          </div>
      </article>
    </section>
    <section className="festival-story tihar-story section-pad">
      <div
        role="img"
        aria-label="Tihar festival lights and decorated homes"
        className="festival-story-image"
        style={{ backgroundImage: `url(${photos.tihar})` }}
      />
      <div className="festival-story-copy">
        <Eyebrow>THE STORY AND ROOTS OF TIHAR</Eyebrow>
        <h2>
            Why Tihar fills homes
            <br />
            with <em>light.</em>
          </h2>
        <p>
            Tihar, also known as Deepawali in Nepal, is a multi-day festival
            that celebrates the relationship between people, animals, nature and
            the divine. Its rituals express gratitude to the lives and forces
            believed to support everyday wellbeing.
          </p>
        <p>
            One popular Hindu story associated with the festival tells of Yama,
            the god of death, and his sister Yamuna. In the story, Yamuna
            welcomes her brother with a loving tika ceremony; the tradition is
            remembered as a symbol of affection, protection and the enduring
            bond between siblings. The worship of Lakshmi, lamps, flower
            garlands and decorated doorways also express hopes for prosperity
            and a welcoming home.
          </p>
        <div className="story-note">
          <Heart size={18} />
          <span>
              Tihar customs vary among communities. Its shared themes are
              gratitude, care, hope and relationships.
            </span>
        </div>
      </div>
    </section>
    <section className="diya-section">
      <div className="diya-copy">
        <Eyebrow>A LITTLE LIGHT, JUST FOR YOU</Eyebrow>
        <h2>
            Make a wish.
            <br />
            <em>Light a diya.</em>
          </h2>
        <p>
            Tap the diya to bring a warm glow to the screen. Let it be a little
            reminder to share kindness and hope.
          </p>
        <button
          className="btn btn-gold"
          onClick={() => setLit(!lit)}
        >
          {lit ? "Blow out gently" : "Light your diya"}
          <Flame size={16} />
        </button>
        <span className="diya-note">
            {lit ? "Your light is shining. Share it with someone." : "A tiny moment of calm in a busy day."}
          </span>
      </div>
      <button
        className={`diya-art ${lit ? "lit" : ""}`}
        onClick={() => setLit(!lit)}
        aria-label={lit ? "Blow out the diya" : "Light the diya"}
      >
        <span className="diya-halo" />
        <span className="diya-flame">
            <i />
          </span>
        <span className="diya-bowl" />
        <span className="diya-base" />
        <span className="diya-sparks">✦　·　✧</span>
      </button>
    </section>
    <section className="tihar-values">
      <Eyebrow>THE HEART OF TIHAR</Eyebrow>
      <h2>
          Light shared is <em>light multiplied.</em>
        </h2>
      <div className="values-grid">
        <div>
          <span>✿</span>
          <h3>Gratitude</h3>
          <p>Recognise the life, nature and relationships that sustain us.</p>
        </div>
        <div>
          <span>🪔</span>
          <h3>Renewal</h3>
          <p>Bring warmth, care and hope into our homes and communities.</p>
        </div>
        <div>
          <span>♡</span>
          <h3>Togetherness</h3>
          <p>Celebrate the bonds that make a place feel like home.</p>
        </div>
      </div>
    </section>
  </main>;
}
