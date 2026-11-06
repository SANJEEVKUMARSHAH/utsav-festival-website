// Home page.
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, Sun } from "lucide-react";
import { photos } from "../data/photos";
import Eyebrow from "../components/Eyebrow";
export default function Home() {
  return <>
      <section className="hero">
      <div
        className="hero-bg"
        style={{ backgroundImage: `url(${photos.hero})` }}
      />
      <div className="hero-shade" />
      <div className="hero-inner">
        <Eyebrow>NEPAL & INDIA · A SHARED CELEBRATION</Eyebrow>
        <h1>
            Where traditions
            <br />
            come <em>alive.</em>
          </h1>
        <p>
            Follow the first light of Chhath. Paint your own rangoli. Let Tihar
            glow. Explore the rituals, places and little moments that bring us
            home.
          </p>
        <div className="hero-actions">
          <Link
            to="/chhath"
            className="btn btn-gold"
          >
              Explore Chhath <ArrowRight size={17} />
            </Link>
          <Link
            to="/rangoli-studio"
            className="btn btn-outline"
          >
              Create your rangoli <ArrowUpRight size={17} />
            </Link>
        </div>
        <div className="hero-foot">
          <span>
              <span className="gold-line" /> TRADITION IS A LIVING THING
            </span>
          <span>01 — 03 / FESTIVAL STORIES</span>
        </div>
      </div>
      <div className="hero-stamp">
        <Sun size={25} />
        <span>
            LIGHT
            <br />
            CONNECTS US
          </span>
      </div>
    </section>
      <section className="intro section-pad">
      <div className="intro-symbol">
        <Sun size={74} />
        <span>
            OUR ROOTS,
            <br />
            OUR STORIES
          </span>
      </div>
      <div>
        <Eyebrow>MORE THAN A FESTIVAL</Eyebrow>
        <h2>
            Some things are
            <br />
            felt, not <em>explained.</em>
          </h2>
        <p>
            In the glow of a diya, the rhythm of a prayer, and the colours at
            our doorstep, we find pieces of who we are. Utsav celebrates the
            people who keep these traditions alive—and invites a new generation
            to make them their own.
          </p>
        <Link
          className="text-link"
          to="/about"
        >
            Discover our purpose <ArrowRight size={16} />
          </Link>
      </div>
    </section>
      <section className="feature-section section-pad">
      <div className="section-top">
        <div>
          <Eyebrow>CELEBRATIONS THAT CONNECT US</Eyebrow>
          <h2>
              Three ways to
              <br />
              <em>feel the magic.</em>
            </h2>
        </div>
        <p>
            Discover the meaning, explore real-world places, and create
            something beautiful of your own.
          </p>
      </div>
      <div className="feature-grid">
        <Link
          to="/chhath"
          className="feature-card feature-chhath"
        >
          <img
            src={photos.chhath}
            alt="Golden light over a peaceful river"
          />
          <span className="feature-num">01 / SUNRISE & GRATITUDE</span>
          <div>
            <h3>
                Chhath
                <br />
                <em>Puja</em>
              </h3>
            <p>
                Find community worship sites and plan your route to the water's
                edge.
              </p>
            <span className="circle-arrow">
                <ArrowUpRight />
              </span>
          </div>
        </Link>
        <Link
          to="/rangoli-studio"
          className="feature-card feature-rangoli"
        >
          <img
            src={photos.rangoli}
            alt="Colourful traditional rangoli artwork"
          />
          <span className="feature-num">02 / COLOUR & CREATIVITY</span>
          <div>
            <h3>
                Rangoli
                <br />
                <em>Studio</em>
              </h3>
            <p>
                Choose a template, customise your palette and design with
                symmetry.
              </p>
            <span className="circle-arrow">
                <ArrowUpRight />
              </span>
          </div>
        </Link>
        <Link
          to="/tihar"
          className="feature-card feature-tihar"
        >
          <img
            src={photos.tihar}
            alt="Warm festive lights in the evening"
          />
          <span className="feature-num">03 / LIGHT & TOGETHERNESS</span>
          <div>
            <h3>
                Tihar
                <br />
                <em>Festival</em>
              </h3>
            <p>
                Explore five days of devotion, joy, family and the festival of
                lights.
              </p>
            <span className="circle-arrow">
                <ArrowUpRight />
              </span>
          </div>
        </Link>
      </div>
    </section>
      <section className="quote-band">
      <div className="quote-mark">“</div>
      <p>
          Tradition is not the ashes we preserve.
          <br />
          <em>It is the fire we pass on.</em>
        </p>
      <span>A CELEBRATION OF CULTURE, CREATIVITY & COMMUNITY</span>
    </section>
      <section className="home-bottom section-pad">
      <div className="home-bottom-copy">
        <Eyebrow>YOUR FESTIVAL, YOUR WAY</Eyebrow>
        <h2>
            Make room for
            <br />
            <em>a little wonder.</em>
          </h2>
        <p>
            Find a nearby ghat, create a rangoli that feels like you, or
            discover the meaning behind a familiar tradition.
          </p>
        <div className="hero-actions">
          <Link
            to="/rangoli-studio"
            className="btn btn-dark"
          >
              Open Rangoli Studio <ArrowRight size={16} />
            </Link>
          <Link
            to="/chhath"
            className="text-link"
          >
              Find a ghat <ArrowRight size={16} />
            </Link>
        </div>
      </div>
      <img
        src={photos.ghat}
        alt="Historic riverside steps beside the water"
      />
    </section>
    </>;
}
