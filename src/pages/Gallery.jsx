import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { X, ChevronLeft, ChevronRight, Share2, Images } from "lucide-react";
import Eyebrow from "../components/Eyebrow";
import { galleryCategories, galleryItems } from "../data/gallery";
import "../styles/phase2.css";
export default function Gallery() {
  const [category, setCategory] = useState("All");
  const [active, setActive] = useState(null);
  const filtered = useMemo(() => category === "All" ? galleryItems : galleryItems.filter(x => x.category === category), [category]);
  const current = active === null ? null : filtered[active];
  const closeRef = useRef(null);
  const openerRef = useRef(null);
  const open = (i, e) => {
    openerRef.current = e.currentTarget;
    setActive(i);
  };
  useEffect(() => {
    if (active !== null) closeRef.current?.focus();else if (openerRef.current) {
      openerRef.current.focus();
      openerRef.current = null;
    }
  }, [active]);
  const move = useCallback(
    step =>
      setActive(current =>
        current === null
          ? null
          : (current + step + filtered.length) % filtered.length
      ),
    [filtered.length]
  );
  useEffect(() => {
    if (active === null) return;
    const key = e => {
      if (e.key === "Escape") setActive(null);
      if (e.key === "ArrowRight") move(1);
      if (e.key === "ArrowLeft") move(-1);
    };
    window.addEventListener("keydown", key);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", key);
      document.body.style.overflow = "";
    };
  }, [active, filtered.length, move]);
  const share = async item => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: item.title,
          text: item.description,
          url: item.src,
        });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(item.src);
      }
    } catch (error) {
      if (error?.name !== "AbortError") {
        console.error("Unable to share this gallery image:", error);
      }
    }
  };
  return <main className="phase-page">
    <section className="phase-hero">
      <Eyebrow>MEMORIES IN EVERY FRAME</Eyebrow>
      <h1>Our culture,<br /><em>in pictures.</em></h1>
      <p>Explore the rituals, colours, food and everyday moments that make our festivals unforgettable.</p>
      <div className="gallery-count">
        <Images size={17} />
        {galleryItems.length} photographs · {galleryCategories.length} collections
      </div>
    </section>
    <section className="phase-section">
      <div className="filter-row gallery-filters">
        <button
          className={category === "All" ? "selected" : ""}
          onClick={() => {
            setCategory("All");
            setActive(null);
          }}
        >
          All collections <span>{galleryItems.length}</span>
        </button>
        {galleryCategories.map((c, i) => <button
          key={c}
          className={category === c ? "selected" : ""}
          onClick={() => {
            setCategory(c);
            setActive(null);
          }}
        >
          {c}
          <span>{galleryItems.filter(item => item.category === c).length}</span>
        </button>)}
      </div>
      <div className="gallery-grid">{filtered.map((item, i) => <button
        key={item.id}
        className="gallery-tile"
        onClick={e => open(i, e)}
        aria-label={`Open ${item.title}`}
      >
        <img
          src={item.src}
          alt={item.description}
          loading="lazy"
          onError={e => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = "/assets/images/pattern.svg";
          }}
        />
        <span>
          <b>{item.title}</b>
          <small>{item.category}</small>
        </span>
      </button>)}</div>
    </section>
    {current && <div
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label="Gallery image viewer"
      onClick={() => setActive(null)}
    >
      <button
        ref={closeRef}
        className="lightbox-close"
        onClick={() => setActive(null)}
        aria-label="Close viewer"
      ><X /></button>
      <button
        className="lightbox-prev"
        onClick={e => {
          e.stopPropagation();
          move(-1);
        }}
        aria-label="Previous image"
      ><ChevronLeft /></button>
      <figure onClick={e => e.stopPropagation()}>
        <img
          src={current.src}
          alt={current.description}
          onError={e => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = "/assets/images/pattern.svg";
          }}
        />
        <figcaption>
          <div>
            <b>{current.title}</b>
            <p>{current.description}</p>
            <small>{active + 1} of {filtered.length} · {current.category}</small>
            <small className="gallery-credit">Photo source: <a
              href={current.sourceUrl}
              target="_blank"
              rel="noreferrer"
            >Wikimedia Commons file page</a>
              {current.attribution && ` · ${current.attribution}`}
              {current.license && ` · ${current.license}`}
            </small>
          </div>
          <button onClick={() => share(current)}><Share2 size={16} /> Share</button>
        </figcaption>
      </figure>
      <button
        className="lightbox-next"
        onClick={e => {
          e.stopPropagation();
          move(1);
        }}
        aria-label="Next image"
      ><ChevronRight /></button>
    </div>}
  </main>;
}
