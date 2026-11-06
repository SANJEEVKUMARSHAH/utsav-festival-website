import { useState } from "react";
import { chhathRituals, tiharRituals } from "../data/rituals";
import Eyebrow from "../components/Eyebrow";
import "../styles/phase2.css";
export default function RitualGuide() {
  const [festival, setFestival] = useState("Chhath");
  const [active, setActive] = useState(0);
  const days = festival === "Chhath" ? chhathRituals : tiharRituals;
  return <main className="phase-page">
    <section className="phase-hero">
      <Eyebrow>KNOW THE MEANING</Eyebrow>
      <h1>Traditions carried<br /><em>with devotion.</em></h1>
      <p>A thoughtful guide to the rituals, stories and practices of Chhath and Tihar.</p>
    </section>
    <section className="phase-section">
      <div className="phase-switch">
        <button
          className={festival === "Chhath" ? "selected" : ""}
          onClick={() => {
            setFestival("Chhath");
            setActive(0);
          }}
        >Chhath Puja</button>
        <button
          className={festival === "Tihar" ? "selected" : ""}
          onClick={() => {
            setFestival("Tihar");
            setActive(0);
          }}
        >Tihar</button>
      </div>
      <div className="ritual-layout">
        <nav
          className="ritual-timeline"
          aria-label={`${festival} days`}
        >{days.map((d, i) => <button
          key={d.name}
          className={active === i ? "selected" : ""}
          onClick={() => setActive(i)}
        >
          <span>{String(i + 1).padStart(2, "0")}</span>
          <b>{d.name}</b>
          <small>{d.date || `Day ${d.day}`}</small>
        </button>)}</nav>
        <article className="ritual-detail">
          <div className="ritual-icon">{days[active].icon}</div>
          <Eyebrow>{festival.toUpperCase()} · DAY {active + 1}</Eyebrow>
          <h2>{days[active].name}</h2>
          <h3>{days[active].meaning}</h3>
          <p>{days[active].description}</p>
          <h4>Common practices</h4>
          <ul>{days[active].practices.map(p => <li key={p}>{p}</li>)}</ul>
          {days[active].food && <><h4>Food and offerings</h4><p>{days[active].food}</p></>}
          <div className="ritual-controls">
            <button
              disabled={active === 0}
              onClick={() => setActive(v => v - 1)}
            >Previous</button>
            <button
              disabled={active === days.length - 1}
              onClick={() => setActive(v => v + 1)}
            >Next day →</button>
          </div>
        </article>
      </div>
    </section>
  </main>;
}
