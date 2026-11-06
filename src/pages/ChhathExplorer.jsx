// Chhath Explorer page: city search, site list and map.
import { useMemo, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Sun,
  MapPin,
  Search,
  Compass,
  Heart,
  ExternalLink,
  LocateFixed,
  ChevronDown,
} from "lucide-react";
import { photos } from "../data/photos";
import Eyebrow from "../components/Eyebrow";
import { cities } from "../data/cities";
export default function ChhathExplorer() {
  const [q, setQ] = useState("");
  const [city, setCity] = useState("All cities");
  const [selected, setSelected] = useState(null);
  const flat = useMemo(() => cities.flatMap(c => c.sites.map(([name, place], i) => ({
    city: c.city,
    region: c.region,
    name,
    place,
    source: c.source,
    sourceUrl: c.url,
    id: `${c.city}-${i}`
  }))), []);
  const filtered = flat.filter(group => {
    const matchesCity = city === "All cities" || group.city === city;
    const searchableText =
      `${group.city} ${group.region} ${group.name} ${group.place}`.toLowerCase();

    return matchesCity && searchableText.includes(q.toLowerCase());
  });
  const focus = (selected && filtered.some(g => g.id === selected.id) ? selected : null) || filtered[0] || flat[0];
  return <main className="page-shell chhath-page">
    <section className="page-hero chhath-hero">
      <div
        className="page-hero-image"
        style={{ backgroundImage: `url(${photos.chhath})` }}
      />
      <div className="page-hero-shade" />
      <div className="page-hero-copy">
        <Eyebrow>FOLLOW THE LIGHT TO THE WATER</Eyebrow>
        <h1 style={{ color: "white" }}>
            Chhath, <em>closer to you.</em>
          </h1>
        <p>
            Explore reported Chhath celebration sites across Nepal and India,
            then open directions to plan your visit.
          </p>
        <div className="hero-tags">
          <span>
              <MapPin size={15} /> 10 cities
            </span>
          <span>
              <Compass size={15} /> 20+ mapped areas
            </span>
          <span>
              <Sun size={15} /> Sunrise & sunset rituals
            </span>
        </div>
      </div>
    </section>
    <section className="explorer-section">
      <div className="explorer-intro">
        <div>
          <Eyebrow>THE CHHATH GHAT FINDER</Eyebrow>
          <h2>
              Find your place
              <br />
              to <em>offer arghya.</em>
            </h2>
        </div>
        <p>
            Locations are drawn from municipal announcements, tourism sources
            and published city guides where available. Local arrangements can
            change each year—always confirm before travelling.
          </p>
      </div>
      <div className="explorer-layout">
        <div className="site-list-panel">
          <div className="finder-toolbar">
            <label className="finder-search">
              <Search size={17} />
              <input
                value={q}
                onChange={e => setQ(e.target.value)}
                placeholder="Search city, ghat or area…"
              />
              <span>{filtered.length}</span>
            </label>
            <label className="city-select">
              <span>City</span>
              <select
                value={city}
                onChange={e => setCity(e.target.value)}
              >
                <option>All cities</option>
                {cities.map(c => <option key={c.city}>{c.city}</option>)}
              </select>
              <ChevronDown size={15} />
            </label>
          </div>
          <div className="site-results">
            {filtered.map(g => <button
              key={g.id}
              className={`site-result ${focus.id === g.id ? "active" : ""}`}
              onClick={() => setSelected(g)}
              aria-label={`${g.name}, ${g.place}, ${g.city}`}
            >
              <span className="site-pin">
                    <MapPin size={17} />
                  </span>
              <span className="site-info">
                <strong>{g.name}</strong>
                <small>
                      {g.city} · {g.region}
                    </small>
                <em>
                      Open map & directions <ArrowUpRight size={12} />
                    </em>
              </span>
              <ArrowRight
                className="site-arrow"
                size={17}
              />
            </button>)}
            {!filtered.length && <div className="empty-results">
              <Search size={25} />
              <strong>No locations found</strong>
              <p>Try another city or a shorter search term.</p>
            </div>}
          </div>
          <div className="city-counts">
            <strong>Explore by city</strong>
            <div>
                {cities.map(c => <button
              key={c.city}
              className={city === c.city ? "active" : ""}
              onClick={() => setCity(city === c.city ? "All cities" : c.city)}
            >
              {c.city}
              <span>{c.sites.length}</span>
            </button>)}
              </div>
          </div>
        </div>
        <div className="map-panel">
          <div className="map-head">
            <div>
              <Eyebrow>YOUR ROUTE STARTS HERE</Eyebrow>
              <h3>{focus.name}</h3>
              <p>
                  <MapPin size={14} />
                  {focus.city}, {focus.region}
                </p>
            </div>
            <a
              className="map-open"
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(focus.place)}`}
              target="_blank"
              rel="noreferrer"
            >
                Open maps <ExternalLink size={14} />
              </a>
          </div>
          <div className="place-quick-info">
            <div>
              <span className="quick-info-icon">
                  <MapPin size={17} />
                </span>
              <div>
                <strong>About this place</strong>
                <p>
                    {focus.name} is listed as a Chhath gathering point in{" "}
                    {focus.city}. Devotees may use the water’s edge for prayer
                    and arghya when local arrangements permit.
                  </p>
              </div>
            </div>
            <div>
              <span className="quick-info-icon">
                  <Heart size={17} />
                </span>
              <div>
                <strong>Facilities to check before you go</strong>
                <p>
                    Public toilets, drinking water, lighting, parking,
                    accessible paths and crowd support can vary by site and
                    year.  
                  </p>
              </div>
            </div>
          </div>
          <div className="map-frame">
            <iframe
              title={`Map showing ${focus.name}`}
              src={`https://maps.google.com/maps?q=${encodeURIComponent(focus.place)}&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
            <div className="map-overlay-label">
              <MapPin size={16} />
              <span>
                {focus.name}
                <small>{focus.city}</small>
              </span>
            </div>
          </div>
          <div className="map-directions">
            <div>
              <span className="source-badge">
                  <LocateFixed size={14} /> LOCATION SOURCE
                </span>
              <p>
                  Source:{" "}
                  <a
                href={focus.sourceUrl}
                target="_blank"
                rel="noreferrer"
              >
                {focus.source}
                <ExternalLink size={11} />
              </a>
                </p>
            </div>
            <a
              className="btn btn-dark"
              href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(focus.place)}`}
              target="_blank"
              rel="noreferrer"
            >
                Get directions <ArrowRight size={15} />
              </a>
          </div>
          <div className="map-caution">
              Please verify event-day access, water conditions, traffic
              restrictions and the exact ghat with local organisers before
              departure.
            </div>
        </div>
      </div>
    </section>
    <section className="festival-story section-pad">
      <div
        role="img"
        aria-label="Chhath Puja devotees gathered beside a river at sunrise"
        className="festival-story-image"
        style={{ backgroundImage: `url(${photos.chhath})` }}
      />
      <div className="festival-story-copy">
        <Eyebrow>THE MEANING BEHIND THE RITUAL</Eyebrow>
        <h2>
            Why we celebrate
            <br />
            <em>Chhath Puja.</em>
          </h2>
        <p>
            Chhath is a deeply meaningful festival dedicated to Surya, the Sun
            God, and Chhathi Maiya. Devotees express gratitude for the energy
            that sustains life, and pray for the health and wellbeing of their
            families.
          </p>
        <p>
            Families observe the festival through days of preparation, fasting,
            offerings and prayers at a river, pond or other clean water body.
            The evening and morning arghya—offerings to the setting and rising
            sun—make the water’s edge a place of devotion, discipline and
            community.
          </p>
      </div>
    </section>
  </main>;
}
