// Site footer.
import { Link } from "react-router-dom";
import { ArrowUpRight, Sun } from "lucide-react";
export default function Footer() {
  return <footer className="footer">
    <div className="footer-main">
      <div>
        <Link
          to="/"
          className="brand"
        >
          <span className="brand-icon">
              <Sun size={21} />
            </span>
          <span>
              utsav<span className="brand-dot">.</span>
              <small>OUR CULTURE, OUR LIGHT</small>
            </span>
        </Link>
        <p>
            A digital celebration of the traditions that bring us closer—through
            stories, places, light and creativity.
          </p>
        <p className="creator-credit">
            Designed and built by <strong>Sanjeev Kumar Shah</strong>
          </p>
        <div className="creator-links">
          <a
            href="https://www.linkedin.com/in/sanjeev-kumar-shah-749a11380/"
            target="_blank"
            rel="noreferrer"
          >
              LinkedIn <ArrowUpRight size={14} />
            </a>
          <a
            href="https://sanjeevkumarshah.com.np"
            target="_blank"
            rel="noreferrer"
          >
              Personal portfolio <ArrowUpRight size={14} />
            </a>
        </div>
      </div>
      <div className="footer-explore">
        <strong>EXPLORE UTSAV</strong>
        <div className="footer-nav">
          <Link to="/chhath">Chhath Ghat Explorer</Link>
          <Link to="/rangoli-studio">Rangoli Studio</Link>
          <Link to="/tihar">Tihar Festival</Link>
          <Link to="/about">Our Story</Link>
          <Link to="/countdown">Festival Countdown</Link>
          <Link to="/ritual-guide">Ritual Guide</Link>
          <Link to="/gallery">Festival Gallery</Link>
          <Link to="/wishes">Festival Wishes</Link>
          <Link to="/calendar">Festival Calendar</Link>
        </div>
      </div>
      <div className="footer-note">
        <strong>Made for everyone.</strong>
        <p>
            Built to celebrate living traditions with curiosity, respect and
            joy. Always confirm local festival arrangements before travelling.
          </p>
        <span>NEPAL · INDIA · SHARED HERITAGE</span>
      </div>
    </div>
    <div className="footer-bottom">
      <span>© 2026 Utsav · Crafted with care by Sanjeev Kumar Shah.</span>
      <span>ROOTED IN TRADITION · OPEN TO EVERYONE</span>
    </div>
  </footer>;
}
