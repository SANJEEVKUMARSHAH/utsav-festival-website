// Our Story page.
import { Link } from "react-router-dom";
import { ArrowRight, Compass, Sparkles, Heart } from "lucide-react";
import { photos } from "../data/photos";
import Eyebrow from "../components/Eyebrow";
export default function About() {
  return <main className="about-page page-shell">
    <section className="page-hero about-hero">
      <div
        className="page-hero-image"
        style={{ backgroundImage: `url(${photos.ghat})` }}
      />
      <div className="page-hero-shade" />
      <div className="page-hero-copy">
        <Eyebrow>A DIGITAL HOME FOR LIVING TRADITIONS</Eyebrow>
        <h1>
            Culture is something
            <br />
            we <em>carry forward.</em>
          </h1>
        <p>
            Utsav is a celebration of the festivals, places and creativity that
            connect people across generations and borders.
          </p>
      </div>
    </section>
    <section className="about-body section-pad">
      <div>
        <Eyebrow>OUR PURPOSE</Eyebrow>
        <h2>
            Built with respect.
            <br />
            <em>Designed to share.</em>
          </h2>
      </div>
      <div>
        <p>
            Utsav is a small digital celebration of the traditions that make our
            homes feel like home. It brings the sunrise offerings of Chhath, the
            colour and craft of rangoli, and the warmth of Tihar into one
            welcoming place—where people can discover, learn, explore and
            create.
          </p>
        <p>
            Our aim is to make cultural discovery useful as well as beautiful.
            The Chhath Explorer connects visitors to map searches and published
            references; Rangoli Studio invites everyone to create without
            needing artistic experience; and the Tihar journey shares the
            meaning behind its five days. We know customs differ by family,
            region and community, so we approach these stories with humility and
            respect. Location listings can change from year to year, and we
            encourage visitors to verify local arrangements before travelling.
            Utsav was designed and built by Sanjeev Kumar Shah as a celebration
            of living heritage, thoughtful design and accessible creativity.
          </p>
        <div className="about-principles">
          <span>
              <Compass /> Useful, not just beautiful
            </span>
          <span>
              <Heart /> Respect for living traditions
            </span>
          <span>
              <Sparkles /> Creativity for everyone
            </span>
        </div>
      </div>
    </section>
    <section className="about-cta">
      <h2>Ready to explore?</h2>
      <p>Start with a place, a pattern or a story.</p>
      <div className="hero-actions">
        <Link
          to="/chhath"
          className="btn btn-gold"
        >
            Find a ghat <ArrowRight size={16} />
          </Link>
        <Link
          to="/rangoli-studio"
          className="btn btn-outline"
        >
            Make rangoli <ArrowRight size={16} />
          </Link>
      </div>
    </section>
  </main>;
}
