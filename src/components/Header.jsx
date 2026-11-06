import { useCallback, useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { ArrowUpRight, Sun, Menu, X, ChevronDown } from "lucide-react";
const extra = [
  ["/countdown", "Festival Countdown"],
  ["/ritual-guide", "Ritual Guide"],
  ["/gallery", "Festival Gallery"],
  ["/wishes", "Festival Wishes"],
  ["/calendar", "Festival Calendar"]
];
export default function Header() {
  const [open, setOpen] = useState(false);
  const [more, setMore] = useState(false);
  const links = [
    ["/", "Home"],
    ["/chhath", "Chhath Explorer"],
    ["/rangoli-studio", "Rangoli Studio"],
    ["/tihar", "Tihar"],
    ["/about", "Our Story"]
  ];
  const { pathname } = useLocation();
  const moreRef = useRef(null);
  const closeMenus = useCallback(() => {
    setOpen(false);
    setMore(false);
  }, []);

  // Close menus when the route changes (including browser back and forward).
  useEffect(() => {
    closeMenus();
  }, [pathname, closeMenus]);

  // Keep the page from scrolling behind the open mobile menu.
  useEffect(() => {
    document.body.classList.toggle("nav-locked", open);
    return () => document.body.classList.remove("nav-locked");
  }, [open]);

  // Escape closes menus; a click outside closes the "Explore More" dropdown.
  useEffect(() => {
    if (!open && !more) return undefined;
    const onKeyDown = e => {
      if (e.key === "Escape") closeMenus();
    };
    const onPointerDown = e => {
      if (more && !moreRef.current?.contains(e.target)) setMore(false);
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open, more, closeMenus]);
  return <header className="header">
    <Link
      to="/"
      className="brand"
      onClick={closeMenus}
    >
      <span className="brand-icon"><Sun size={21} /></span>
      <span>utsav<span className="brand-dot">.</span><small>OUR CULTURE, OUR LIGHT</small></span>
    </Link>
    <button
      type="button"
      className="mobile-menu"
      onClick={() => setOpen(v => !v)}
      aria-label={open ? "Close navigation" : "Open navigation"}
      aria-expanded={open}
      aria-controls="main-nav"
    >
        {open ? <X /> : <Menu />}
      </button>
    <nav
      id="main-nav"
      className={open ? "nav open" : "nav"}
      aria-label="Main navigation"
    >
      {links.map(([to, label]) => <NavLink
        key={to}
        to={to}
        end={to === "/"}
        onClick={closeMenus}
        className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
      >{label}</NavLink>)}
      <div
        className="nav-more"
        ref={moreRef}
      >
        <button
          type="button"
          className="nav-link nav-more-trigger"
          onClick={() => setMore(v => !v)}
          aria-expanded={more}
          aria-haspopup="true"
        >
            Explore More <ChevronDown size={13} />
          </button>
        {more && <div className="nav-dropdown">{extra.map(([to, label]) => <NavLink
          key={to}
          to={to}
          onClick={closeMenus}
        >{label}</NavLink>)}</div>}
      </div>
      <Link
        className="nav-cta"
        to="/rangoli-studio"
        onClick={closeMenus}
      >Create <ArrowUpRight size={15} /></Link>
    </nav>
  </header>;
}
