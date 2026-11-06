import { useEffect, useMemo, useRef, useState } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Undo2, Redo2, Shuffle, Download, FileCode, Eye, EyeOff, Copy, Trash2, ChevronUp, ChevronDown, Plus, Eraser, FilePlus2 } from "lucide-react";
import { SHAPES, COLORS, PALETTES, TEMPLATES } from "./studio-data.js";
import "./studio.css";
const KEY = "utsav-rangoli-v2";
let counter = 0;
const uid = () => `i${++counter}${Math.random().toString(36).slice(2, 6)}`;
const mk = ([
  shape,
  r,
  s,
  k,
  rot,
  ci,
  o
], pal) => ({
  id: uid(),
  shape,
  r,
  s,
  k,
  rot,
  c: pal[ci % pal.length],
  o
});
const fromTemplate = t => ({
  name: t.name,
  bg: t.bg,
  sym: t.sym,
  mirror: true,
  pal: t.pal,
  layers: t.layers.map(l => mk(l, t.pal)),
  strokes: []
});
const blank = () => ({
  name: "Blank canvas",
  bg: "#1C1917",
  sym: 8,
  mirror: true,
  pal: PALETTES[0][1],
  layers: [],
  strokes: []
});
const load = () => {
  try {
    const d = JSON.parse(typeof window !== "undefined" ? window.localStorage.getItem(KEY) : "null");
    return (
      d &&
      typeof d.name === "string" &&
      typeof d.bg === "string" &&
      Array.isArray(d.pal) &&
      Array.isArray(d.layers) &&
      Array.isArray(d.strokes) &&
      Number.isFinite(d.sym)
    )
      ? d
      : null;
  } catch {
    return null;
  }
};

// Draws the background, every layer repeated around the centre, and any hand-drawn strokes.
function Art({
  doc,
  sel,
  bare,
  guides,
  live
}) {
  const { sym } = doc;
  const strokes = live ? [...doc.strokes, live] : doc.strokes;
  return <>
      <rect
      x="-200"
      y="-200"
      width="400"
      height="400"
      fill={doc.bg}
    />
      {guides && !bare && <g
      fill="none"
      stroke="#C8963E"
      strokeOpacity=".28"
      strokeWidth=".6"
    >
      {[
        50,
        100,
        150,
        195
      ].map(r => <circle
        key={r}
        r={r}
      />)}
      {Array.from({ length: sym }, (_, i) => <line
        key={i}
        x1="0"
        y1="0"
        x2="0"
        y2="-195"
        transform={`rotate(${i * 360 / sym})`}
      />)}
    </g>}
      {doc.layers.map(L => {
      const n = L.k ? sym * L.k : 1;
      return <g
        key={L.id}
        data-layer={bare ? undefined : L.id}
        fill={L.c}
        opacity={L.o}
        className={!bare && sel === L.id ? "layer-sel" : undefined}
      >
            {Array.from({ length: n }, (_, i) => <path
        key={i}
        d={SHAPES[L.shape]}
        fillRule="evenodd"
        transform={`rotate(${n === 1 ? L.rot : i * 360 / n + L.rot}) translate(0 ${-L.r}) scale(${L.s})`}
      />)}
          </g>;
    })}
      {strokes.map(S => {
      const d = "M" + S.p.map(p => p.join(" ")).join("L");
      return <g
        key={S.id}
        fill="none"
        stroke={S.c}
        strokeWidth={S.w}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
            {Array.from({ length: sym }, (_, i) => [<path
        key={i}
        d={d}
        transform={`rotate(${i * 360 / sym})`}
      />, doc.mirror && <path
        key={`m${i}`}
        d={d}
        transform={`rotate(${i * 360 / sym}) scale(-1 1)`}
      />])}
          </g>;
    })}
    </>;
}
const Thumb = ({ doc }) => <svg
  viewBox="-200 -200 400 400"
  aria-hidden="true"
>
    <Art
  doc={doc}
  bare
/>
  </svg>;
const ShapeIcon = ({ d }) => <svg
  viewBox="-1.5 -1.5 3 3"
  width="26"
  height="26"
  aria-hidden="true"
>
    <path
  d={d}
  fillRule="evenodd"
  fill="currentColor"
/>
  </svg>;
function Slider({
  label,
  v,
  min,
  max,
  step = 1,
  on,
  fmt
}) {
  return <label className="st-sl">
    <span>
      {label}
      <b>{fmt ? fmt(v) : v}</b>
    </span>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={v}
      onChange={e => on(+e.target.value)}
    />
  </label>;
}
function Swatches({
  value,
  on,
  label
}) {
  const hex = /^#[0-9a-f]{6}$/i.test(value) ? value : "#E8821E";
  return <div
    className="st-sw"
    role="group"
    aria-label={label}
  >
    {COLORS.map(([n, c]) => <button
      key={c}
      type="button"
      title={n}
      aria-label={n}
      aria-pressed={value?.toLowerCase() === c.toLowerCase()}
      style={{ background: c }}
      onClick={() => on(c)}
    />)}
    <label className="st-cust">
        <input
      type="color"
      value={hex}
      onChange={e => on(e.target.value)}
    />{" "}
        Custom colour
      </label>
  </div>;
}
export default function RangoliStudio() {
  const [doc, setDoc] = useState(() => load() || fromTemplate(TEMPLATES[0]));
  const [tab, setTab] = useState("templates");
  const [sel, setSel] = useState(null);
  const [guides, setGuides] = useState(true);
  const [brush, setBrush] = useState("#E7B93C");
  const [bw, setBw] = useState(3);
  const [live, setLive] = useState(null);
  const [exportMessage, setExportMessage] = useState("");
  const past = useRef([]);
  const future = useRef([]);
  const last = useRef({
    key: "",
    t: 0
  });
  const svgRef = useRef(null);
  const thumbs = useMemo(() => TEMPLATES.map(fromTemplate), []);
  const L = doc.layers.find(l => l.id === sel);
  const commit = (next, key) => {
    const now = Date.now();
    if (!(key && last.current.key === key && now - last.current.t < 700)) {
      past.current.push(doc);
      if (past.current.length > 80) past.current.shift();
    }
    last.current = {
      key,
      t: now
    };
    future.current = [];
    setDoc(next);
  };
  const undo = () => {
    const p = past.current.pop();
    if (p) {
      future.current.push(doc);
      setDoc(p);
    }
  };
  const redo = () => {
    const n = future.current.pop();
    if (n) {
      past.current.push(doc);
      setDoc(n);
    }
  };
  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(doc));
    } catch {
      /* storage unavailable */
    }
  }, [doc]);
  useEffect(() => {
    const onKey = e => {
      if (/INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) return;
      const mod = e.ctrlKey || e.metaKey;
      if (mod && e.key.toLowerCase() === "z") {
        e.preventDefault();
        e.shiftKey ? redo() : undo();
      } else if (mod && e.key.toLowerCase() === "y") {
        e.preventDefault();
        redo();
      } else if ((e.key === "Delete" || e.key === "Backspace") && sel) {
        e.preventDefault();
        removeLayer();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });
  const setL = (patch, key) => commit({
    ...doc,
    layers: doc.layers.map(l => l.id === sel ? {
      ...l,
      ...patch
    } : l)
  }, key + sel);
  const addLayer = shape => {
    const n = {
      id: uid(),
      shape,
      r: 100,
      s: 16,
      k: 1,
      rot: 0,
      c: brush,
      o: 1
    };
    commit({
      ...doc,
      layers: [...doc.layers, n]
    });
    setSel(n.id);
    setTab("layers");
  };
  const removeLayer = () => {
    commit({
      ...doc,
      layers: doc.layers.filter(l => l.id !== sel)
    });
    setSel(null);
  };
  const dupLayer = () => {
    const i = doc.layers.findIndex(l => l.id === sel);
    if (i < 0) return;
    const c = {
      ...doc.layers[i],
      id: uid(),
      rot: doc.layers[i].rot + 10
    };
    const layers = [...doc.layers];
    layers.splice(i + 1, 0, c);
    commit({
      ...doc,
      layers
    });
    setSel(c.id);
  };
  const moveLayer = d => {
    const i = doc.layers.findIndex(l => l.id === sel),
      j = i + d;
    if (i < 0 || j < 0 || j >= doc.layers.length) return;
    const layers = [...doc.layers];
    [layers[i], layers[j]] = [layers[j], layers[i]];
    commit({
      ...doc,
      layers
    });
  };
  const useTemplate = i => {
    commit(fromTemplate(TEMPLATES[i]));
    setSel(null);
  };
  const applyPalette = pal => commit({
    ...doc,
    pal,
    layers: doc.layers.map((l, i) => ({
      ...l,
      c: pal[i % pal.length]
    }))
  });
  const surprise = () => {
    const t = fromTemplate(TEMPLATES[Math.floor(Math.random() * TEMPLATES.length)]);
    const pal = PALETTES[Math.floor(Math.random() * PALETTES.length)][1];
    commit({
      ...t,
      pal,
      layers: t.layers.map((l, i) => ({
        ...l,
        c: pal[i % pal.length]
      }))
    });
    setSel(null);
  };
  const pt = e => {
    const r = svgRef.current.getBoundingClientRect();
    return [+((e.clientX - r.left) / r.width * 400 - 200).toFixed(1), +((e.clientY - r.top) / r.height * 400 - 200).toFixed(1)];
  };
  const down = e => {
    if (tab === "draw") {
      e.currentTarget.setPointerCapture(e.pointerId);
      const p = pt(e);
      setLive({
        id: uid(),
        c: brush,
        w: bw,
        p: [p, p]
      });
      return;
    }
    const g = e.target.closest("[data-layer]");
    setSel(g ? g.dataset.layer : null);
    if (g) setTab("layers");
  };
  const move = e => {
    if (live) setLive(s => ({
      ...s,
      p: [...s.p, pt(e)]
    }));
  };
  const up = () => {
    if (live) {
      commit({
        ...doc,
        strokes: [...doc.strokes, live]
      });
      setLive(null);
    }
  };
  const svgString = () => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-200 -200 400 400" width="2000" height="2000">${renderToStaticMarkup(<Art
    doc={doc}
    bare
  />)}</svg>`;
  const save = (blob, name) => {
    try {
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");

      anchor.href = url;
      anchor.download = name;
      document.body.append(anchor);
      anchor.click();
      anchor.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1500);
      setExportMessage(`${name} downloaded successfully.`);
    } catch (error) {
      console.error("Unable to save the rangoli export:", error);
      setExportMessage("The file could not be saved. Please try again.");
    }
  };

  const exportSvg = () => {
    try {
      const blob = new Blob([svgString()], {
        type: "image/svg+xml",
      });

      save(blob, "utsav-rangoli.svg");
    } catch (error) {
      console.error("Unable to create the rangoli SVG:", error);
      setExportMessage("The SVG could not be created. Please try again.");
    }
  };

  const exportPng = () => {
    setExportMessage("Preparing PNG…");

    try {
      const image = new Image();

      image.onerror = () => {
        setExportMessage(
          "The rangoli preview could not be rendered as a PNG. Try the SVG export instead."
        );
      };

      image.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = 2000;
        canvas.height = 2000;

        const context = canvas.getContext("2d");

        if (!context) {
          setExportMessage("Your browser could not create an export canvas.");
          return;
        }

        context.drawImage(image, 0, 0, 2000, 2000);
        canvas.toBlob(blob => {
          if (!blob) {
            setExportMessage("The PNG could not be created. Please try again.");
            return;
          }

          save(blob, "utsav-rangoli.png");
        }, "image/png");
      };

      image.src =
        "data:image/svg+xml;charset=utf-8," +
        encodeURIComponent(svgString());
    } catch (error) {
      console.error("Unable to create the rangoli PNG:", error);
      setExportMessage("The PNG could not be created. Please try again.");
    }
  };
  const tabs = [
    ["templates", "Templates"],
    ["layers", "Layers"],
    ["draw", "Draw"],
    ["canvas", "Canvas"]
  ];
  return <main className="st">
    <div className="st-top">
      <div>
        <h1>Rangoli Studio</h1>
        <p>
            Start from one of 20 templates or a blank canvas. Every change
            repeats around the centre, so a simple idea becomes a full design.
          </p>
      </div>
      <div
        className="st-tools"
        role="toolbar"
        aria-label="Studio actions"
      >
        <button
          className="st-b"
          onClick={undo}
          disabled={!past.current.length}
        >
            <Undo2 size={16} /> Undo
          </button>
        <button
          className="st-b"
          onClick={redo}
          disabled={!future.current.length}
        >
            <Redo2 size={16} /> Redo
          </button>
        <button
          className="st-b"
          onClick={surprise}
        >
            <Shuffle size={16} /> Surprise me
          </button>
        <button
          className="st-b"
          onClick={() => {
            commit(blank());
            setSel(null);
            setTab("layers");
          }}
        >
            <FilePlus2 size={16} /> Blank canvas
          </button>
        <button
          className="st-b"
          aria-pressed={guides}
          onClick={() => setGuides(!guides)}
        >
            {guides ? <Eye size={16} /> : <EyeOff size={16} />} Guides
          </button>
        <button
          className="st-b pri"
          onClick={exportPng}
        >
            <Download size={16} /> PNG
          </button>
        <button
          className="st-b"
          onClick={exportSvg}
        >
            <FileCode size={16} /> SVG
          </button>
      </div>
    </div>
    {exportMessage && (
      <p className="st-export-status" role="status">
        {exportMessage}
      </p>
    )}
    <div className="st-grid">
      <section
        className="st-stage"
        aria-label="Canvas"
      >
        <svg
          ref={svgRef}
          viewBox="-200 -200 400 400"
          role="group"
          aria-label={`${doc.name}, ${doc.sym}-fold symmetry, ${doc.layers.length} layers`}
          style={{
            touchAction: tab === "draw" ? "none" : "auto",
            cursor: tab === "draw" ? "crosshair" : "default"
          }}
          onPointerDown={down}
          onPointerMove={move}
          onPointerUp={up}
          onPointerCancel={up}
        >
            <Art
          doc={doc}
          sel={sel}
          guides={guides}
          live={live}
        />
          </svg>
        <p>
            {tab === "draw" ? "Draw on the canvas. Your strokes repeat around the centre." : "Select a ring on the canvas, or choose it in the Layers tab, to edit it."}
          </p>
      </section>
      <aside className="st-panel">
        <div
          className="st-tabs"
          role="tablist"
          aria-label="Studio tools"
        >
            {tabs.map(([k, n]) => <button
          key={k}
          role="tab"
          aria-selected={tab === k}
          onClick={() => setTab(k)}
        >
                {n}
              </button>)}
          </div>
        <div
          className="st-body"
          role="tabpanel"
        >
          {tab === "templates" && <>
                <h3>20 templates</h3>
                <div className="st-tpl">
                  {TEMPLATES.map((t, i) => <button
              key={t.name}
              aria-pressed={doc.name === t.name}
              onClick={() => useTemplate(i)}
            >
              <Thumb doc={thumbs[i]} />
              <span>
                <b>{t.name}</b>
                <small>{t.tag}</small>
              </span>
            </button>)}
                </div>
              </>}
          {tab === "layers" && <>
                <h3>Layers (top first)</h3>
                {doc.layers.length === 0 && <p className="st-empty">
                    The canvas is empty. Add a shape below, or pick a template.
                  </p>}
                <ul className="st-layers">
                  {[...doc.layers].reverse().map(l => <li key={l.id}>
                      <button
              aria-pressed={sel === l.id}
              onClick={() => setSel(sel === l.id ? null : l.id)}
            >
              <i style={{ background: l.c }} />
              {l.shape}
              {" "}
              <small>r {Math.round(l.r)}</small>
            </button>
                    </li>)}
                </ul>
                <h3>Add a shape</h3>
                <div className="st-shapes">
                  {Object.keys(SHAPES).map(k => <button
              key={k}
              title={`Add ${k}`}
              aria-label={`Add ${k}`}
              onClick={() => addLayer(k)}
            >
                      <ShapeIcon d={SHAPES[k]} />
                    </button>)}
                </div>
                {L ? <>
                    <h3>Edit selected layer</h3>
                    <div className="st-row">
                <button
                  className="st-b"
                  onClick={dupLayer}
                >
                        <Copy size={14} /> Duplicate
                      </button>
                <button
                  className="st-b"
                  onClick={() => moveLayer(1)}
                >
                        <ChevronUp size={14} /> Forward
                      </button>
                <button
                  className="st-b"
                  onClick={() => moveLayer(-1)}
                >
                        <ChevronDown size={14} /> Back
                      </button>
                <button
                  className="st-b"
                  onClick={removeLayer}
                >
                        <Trash2 size={14} /> Delete
                      </button>
              </div>
                    <div
                className="st-shapes"
                role="group"
                aria-label="Change shape"
              >
                      {Object.keys(SHAPES).map(k => <button
                key={k}
                title={k}
                aria-label={k}
                aria-pressed={L.shape === k}
                onClick={() => setL({ shape: k }, "shape")}
              >
                          <ShapeIcon d={SHAPES[k]} />
                        </button>)}
                    </div>
                    <Slider
                label="Distance from centre"
                v={L.r}
                min={0}
                max={180}
                on={v => setL({ r: v }, "r")}
              />
                    <Slider
                label="Size"
                v={L.s}
                min={3}
                max={60}
                on={v => setL({ s: v }, "s")}
              />
                    <Slider
                label="Repeats per symmetry step"
                v={L.k}
                min={0}
                max={4}
                on={v => setL({ k: v }, "k")}
                fmt={v => v === 0 ? "single" : `× ${v}`}
              />
                    <Slider
                label="Rotation"
                v={L.rot}
                min={0}
                max={360}
                on={v => setL({ rot: v }, "rot")}
                fmt={v => `${Math.round(v)}°`}
              />
                    <Slider
                label="Opacity"
                v={L.o}
                min={0.1}
                max={1}
                step={0.05}
                on={v => setL({ o: v }, "o")}
                fmt={v => `${Math.round(v * 100)}%`}
              />
                    <h3>Colour</h3>
                    <Swatches
                value={L.c}
                on={c => setL({ c }, "c")}
                label="Layer colour"
              />
                  </> : doc.layers.length > 0 && <p className="st-empty">
                      Select a layer to change its shape, size, rotation and
                      colour.
                    </p>}
              </>}
          {tab === "draw" && <>
                <h3>Draw from scratch</h3>
                <p className="st-empty">
                  Draw anywhere on the canvas. Each stroke is repeated around
                  the centre{doc.mirror ? " and mirrored" : ""}.
                </p>
                <Slider
              label="Brush width"
              v={bw}
              min={1}
              max={14}
              on={setBw}
            />
                <h3>Brush colour</h3>
                <Swatches
              value={brush}
              on={setBrush}
              label="Brush colour"
            />
                <div className="st-row">
              <button
                className="st-b"
                aria-pressed={doc.mirror}
                onClick={() => commit({
                  ...doc,
                  mirror: !doc.mirror
                })}
              >
                    Mirror: {doc.mirror ? "on" : "off"}
                  </button>
              <button
                className="st-b"
                onClick={() => commit({
                  ...doc,
                  strokes: doc.strokes.slice(0, -1)
                })}
                disabled={!doc.strokes.length}
              >
                    <Eraser size={14} /> Remove last stroke
                  </button>
              <button
                className="st-b"
                onClick={() => commit({
                  ...doc,
                  strokes: []
                })}
                disabled={!doc.strokes.length}
              >
                    <Trash2 size={14} /> Clear drawing
                  </button>
            </div>
              </>}
          {tab === "canvas" && <>
                <h3>Symmetry</h3>
                <Slider
              label="Fold"
              v={doc.sym}
              min={2}
              max={24}
              on={v => commit({
                ...doc,
                sym: v
              }, "sym")}
              fmt={v => `${v}-fold`}
            />
                <div className="st-row">
                  {[
              4,
              6,
              8,
              12,
              16,
              24
            ].map(n => <button
              key={n}
              className="st-b"
              aria-pressed={doc.sym === n}
              onClick={() => commit({
                ...doc,
                sym: n
              })}
            >
                      {n}
                    </button>)}
                </div>
                <h3>Background</h3>
                <Swatches
              value={doc.bg}
              on={bg => commit({
                ...doc,
                bg
              }, "bg")}
              label="Background colour"
            />
                <h3>Palette presets (recolours all layers)</h3>
                <div className="st-pal">
                  {PALETTES.map(([n, p]) => <button
              key={n}
              onClick={() => applyPalette(p)}
            >
              <span>
                        {p.map(c => <i
                key={c}
                style={{ background: c }}
              />)}
                      </span>
              {n}
            </button>)}
                </div>
                <div className="st-row">
                  <button
              className="st-b"
              onClick={() => commit({
                ...doc,
                layers: [],
                strokes: []
              })}
            >
                    <Plus
              size={14}
              style={{ transform: "rotate(45deg)" }}
            />{" "}
                    Clear everything
                  </button>
                </div>
              </>}
        </div>
      </aside>
    </div>
  </main>;
}
