import { useEffect, useRef, useState } from "react";
import {
  Download,
  MessageCircle,
  Share2,
  Undo2,
  Redo2,
  Plus,
  Type,
  ImagePlus,
  Sparkles,
  Trash2,
  Square,
  Circle,
} from "lucide-react";
import Eyebrow from "../components/Eyebrow";
import "../styles/phase2.css";
const templates = [
  {
    id: "sunrise",
    name: "Sunrise Blessings",
    bg: "#542b3d",
    accent: "#e8bf70",
    ink: "#fff4dc",
    pattern: "sun",
    sticker: "☀️"
  },
  {
    id: "heritage",
    name: "Heritage Frame",
    bg: "#f4e4c6",
    accent: "#a64c4b",
    ink: "#392329",
    pattern: "frame",
    sticker: "✺"
  },
  {
    id: "diya",
    name: "Festival of Lights",
    bg: "#25151b",
    accent: "#f0bd62",
    ink: "#fff0d5",
    pattern: "glow",
    sticker: "🪔"
  },
  {
    id: "minimal",
    name: "Quiet & Minimal",
    bg: "#eee8dc",
    accent: "#55705b",
    ink: "#28352d",
    pattern: "minimal",
    sticker: "❋"
  },
  {
    id: "floral",
    name: "Floral Celebration",
    bg: "#6d3c4d",
    accent: "#f3d28e",
    ink: "#fff4e2",
    pattern: "flowers",
    sticker: "✿"
  },
  {
    id: "lotus",
    name: "Lotus Devotion",
    bg: "#34233d",
    accent: "#e5a8b7",
    ink: "#fff2e8",
    pattern: "lotus",
    sticker: "🪷"
  },
  {
    id: "gold",
    name: "Golden Wishes",
    bg: "#352719",
    accent: "#e8bd68",
    ink: "#fff2d2",
    pattern: "gold",
    sticker: "✨"
  },
  {
    id: "terracotta",
    name: "Mithila Terracotta",
    bg: "#7c3e2c",
    accent: "#f2c58c",
    ink: "#fff1d8",
    pattern: "frame",
    sticker: "🌼"
  },
  {
    id: "night",
    name: "Moonlit Blessing",
    bg: "#172a38",
    accent: "#b9d9df",
    ink: "#f3fbff",
    pattern: "stars",
    sticker: "🌙"
  },
  {
    id: "rang",
    name: "Colourful Utsav",
    bg: "#34213c",
    accent: "#f1a6a1",
    ink: "#fff3df",
    pattern: "rang",
    sticker: "🎊"
  }
];
const initialObjects = (t, festival) => [
  {
    id: 1,
    type: "text",
    text: festival === "Chhath" ? "Happy Chhath Puja" : "Happy Tihar",
    x: 540,
    y: 470,
    size: 76,
    color: t.ink,
    font: "Georgia",
    bold: true,
    align: "center"
  },
  {
    id: 2,
    type: "text",
    text: "May your home be filled with light, peace and blessings.",
    x: 540,
    y: 650,
    size: 34,
    color: t.ink,
    font: "Arial",
    bold: false,
    align: "center"
  },
  {
    id: 3,
    type: "text",
    text: "With love and warm wishes",
    x: 540,
    y: 1040,
    size: 30,
    color: t.accent,
    font: "Georgia",
    bold: false,
    align: "center"
  },
  {
    id: 4,
    type: "sticker",
    text: t.sticker,
    x: 540,
    y: 300,
    size: 100,
    color: t.accent
  }
];
const blankObjects = () => [{
  id: 1,
  type: "text",
  text: "Your festival greeting",
  x: 540,
  y: 560,
  size: 68,
  color: "#fff4dc",
  font: "Georgia",
  bold: true,
  align: "center"
}];
function drawCard(canvas, doc, selectedId = null, imageCache = null) {
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const {
    bg,
    accent,
    ink,
    objects,
    pattern
  } = doc;
  ctx.clearRect(0, 0, 1080, 1350);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 1080, 1350);
  const grad = ctx.createRadialGradient(540, 450, 80, 540, 650, 900);
  grad.addColorStop(0, accent + "22");
  grad.addColorStop(1, "transparent");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1080, 1350);
  ctx.save();
  ctx.strokeStyle = accent;
  ctx.lineWidth = 7;
  if (pattern !== "minimal") {
    ctx.strokeRect(38, 38, 1004, 1274);
    ctx.lineWidth = 2;
    ctx.strokeRect(58, 58, 964, 1234);
  }
  if (pattern === "flowers" || pattern === "rang" || pattern === "lotus") {
    for (let i = 0; i < 16; i++) {
      const a = i * Math.PI / 8;
      const x = 540 + 465 * Math.cos(a),
        y = 675 + 590 * Math.sin(a);
      ctx.beginPath();
      ctx.arc(x, y, 14, 0, Math.PI * 2);
      ctx.fillStyle = accent;
      ctx.fill();
    }
  }
  if (pattern === "stars" || pattern === "gold") {
    for (let i = 0; i < 42; i++) {
      const x = i * 173 % 1080,
        y = i * 293 % 1350;
      ctx.fillStyle = accent + "aa";
      ctx.beginPath();
      ctx.arc(x, y, i % 3 + 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  if (pattern === "sun") {
    ctx.beginPath();
    ctx.arc(540, 170, 80, 0, Math.PI * 2);
    ctx.stroke();
  }
  if (pattern === "glow") {
    for (let i = 0; i < 7; i++) {
      ctx.beginPath();
      ctx.arc(150 + i * 130, 180, 18, 0, Math.PI * 2);
      ctx.fillStyle = accent + "99";
      ctx.fill();
    }
  }
  ctx.restore();
  objects.forEach(o => {
    ctx.save();
    ctx.textAlign = o.align || "center";
    ctx.textBaseline = "middle";
    if (o.type === "text" || o.type === "sticker") {
      ctx.fillStyle = o.color || ink;
      ctx.font = `${o.bold ? "bold " : ""}${o.size || 48}px ${o.font || "Arial"}`;
      const lines = String(o.text || "").split("\n");
      lines.forEach((line, i) => ctx.fillText(line, o.x, o.y + i * (o.size || 48) * 1.25, 900));
    } else if (o.type === "rect") {
      ctx.fillStyle = o.color;
      ctx.fillRect(o.x - o.w / 2, o.y - o.h / 2, o.w, o.h);
    } else if (o.type === "circle") {
      ctx.fillStyle = o.color;
      ctx.beginPath();
      ctx.arc(o.x, o.y, o.size, 0, Math.PI * 2);
      ctx.fill();
    } else if (o.type === "image" && o.src) {
      if (imageCache) {
        const img = imageCache.get(o.src);

        if (img) {
          ctx.drawImage(img, o.x - o.w / 2, o.y - o.h / 2, o.w, o.h);
        }
      } else {
        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, o.x - o.w / 2, o.y - o.h / 2, o.w, o.h);
        };
        img.onerror = () => {};
        img.src = o.src;
      }
    }
    if (selectedId === o.id) {
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 3;
      ctx.setLineDash([9, 7]);
      const w = o.type === "text" ? Math.max(180, (o.text || "").length * (o.size || 30) * .52) : o.w || o.size * 2;
      const h = o.type === "text" ? (o.size || 30) * 1.5 : o.h || o.size * 2;
      ctx.strokeRect(o.x - w / 2, o.y - h / 2, w, h);
    }
    ctx.restore();
  });
}
export default function Wishes() {
  const canvasRef = useRef(null),
    dragRef = useRef(null),
    history = useRef([]),
    future = useRef([]);
  const [festival, setFestival] = useState("Chhath"),
    [template, setTemplate] = useState(templates[0]),
    [objects, setObjects] = useState(() => initialObjects(templates[0], "Chhath"));
  const [bg, setBg] = useState(templates[0].bg),
    [accent, setAccent] = useState(templates[0].accent),
    [ink, setInk] = useState(templates[0].ink);
  const [selected, setSelected] = useState(1),
    [newText, setNewText] = useState(""),
    [from, setFrom] = useState(""),
    [to, setTo] = useState(""),
    [activeTab, setActiveTab] = useState("templates"),
    [pattern, setPattern] = useState("sun");
  const [fontSize, setFontSize] = useState(48),
    [font, setFont] = useState("Georgia"),
    [color, setColor] = useState("#fff4dc");
  const [exporting, setExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState("");
  const doc = {
    bg,
    accent,
    ink,
    objects,
    pattern
  };
  useEffect(() => {
    drawCard(canvasRef.current, doc, selected);
  }, [
    bg,
    accent,
    ink,
    objects,
    pattern,
    selected
  ]);
  const commit = next => {
    history.current.push(objects);
    if (history.current.length > 60) history.current.shift();
    future.current = [];
    setObjects(next);
  };
  const setObj = (id, patch) => setObjects(v => v.map(o => o.id === id ? {
    ...o,
    ...patch
  } : o));
  const chosen = objects.find(o => o.id === selected);
  const add = (type, extra = {}) => {
    const id = Date.now() + Math.random();
    const obj = {
      id,
      type,
      x: 540,
      y: 720,
      size: 54,
      color,
      ...extra
    };
    commit([...objects, obj]);
    setSelected(id);
    setActiveTab("elements");
  };
  const applyTemplate = t => {
    setTemplate(t);
    setBg(t.bg);
    setAccent(t.accent);
    setInk(t.ink);
    setPattern(t.pattern);
    setObjects(initialObjects(t, festival));
    setSelected(1);
  };
  const newBlank = () => {
    setBg("#281a22");
    setAccent("#e6bd69");
    setInk("#fff1dc");
    setPattern("minimal");
    setObjects(blankObjects());
    setSelected(1);
    setActiveTab("elements");
  };
  const undo = () => {
    const p = history.current.pop();
    if (p) {
      future.current.push(objects);
      setObjects(p);
    }
  };
  const redo = () => {
    const n = future.current.pop();
    if (n) {
      history.current.push(objects);
      setObjects(n);
    }
  };
  const point = e => {
    const r = canvasRef.current.getBoundingClientRect();
    return {
      x: (e.clientX - r.left) * 1080 / r.width,
      y: (e.clientY - r.top) * 1350 / r.height
    };
  };
  const down = e => {
    const p = point(e);
    const found = [...objects].reverse().find(object => {
      const hitRadius = Math.max(80, object.size || 100);

      return (
        Math.abs(object.x - p.x) < hitRadius &&
        Math.abs(object.y - p.y) < hitRadius
      );
    });
    if (found) {
      setSelected(found.id);
      dragRef.current = {
        id: found.id,
        dx: p.x - found.x,
        dy: p.y - found.y
      };
      e.currentTarget.setPointerCapture(e.pointerId);
    }
  };
  const move = e => {
    if (!dragRef.current) return;
    const p = point(e);
    setObjects(v => v.map(o => o.id === dragRef.current.id ? {
      ...o,
      x: p.x - dragRef.current.dx,
      y: p.y - dragRef.current.dy
    } : o));
  };
  const up = () => {
    if (dragRef.current) {
      history.current.push(objects);
      dragRef.current = null;
    }
  };
  const createPngBlob = async () => {
    const imageObjects = objects.filter(
      object => object.type === "image" && object.src
    );
    const imageEntries = await Promise.all(
      imageObjects.map(
        object =>
          new Promise(resolve => {
            const image = new Image();
            image.onload = () => resolve([object.src, image]);
            image.onerror = () => resolve([object.src, null]);
            image.src = object.src;
          })
      )
    );
    if (document.fonts?.ready) {
      await document.fonts.ready;
    }

    const imageCache = new Map(imageEntries);
    const exportCanvas = document.createElement("canvas");
    exportCanvas.width = 1080;
    exportCanvas.height = 1350;
    drawCard(exportCanvas, doc, null, imageCache);

    const blob = await new Promise(resolve => {
      exportCanvas.toBlob(resolve, "image/png");
    });
    if (!blob) {
      throw new Error("The browser could not create a PNG image.");
    }

    return {
      blob,
      failedImages: imageEntries.some(([, image]) => !image)
    };
  };

  const downloadBlob = blob => {
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `utsav-${festival.toLowerCase()}-greeting.png`;
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1500);
  };

  const download = async () => {
    if (exporting) return;
    setExporting(true);
    setExportStatus("Preparing your greeting card PNG…");

    try {
      const { blob, failedImages } = await createPngBlob();
      downloadBlob(blob);
      setExportStatus(
        failedImages
          ? "The PNG was downloaded, but one or more uploaded photos could not be included."
          : "Your greeting card PNG has been downloaded."
      );
    } catch (error) {
      console.error("Unable to export the festival greeting:", error);
      setExportStatus(
        "The PNG could not be created. Please try again or remove an unsupported image."
      );
    } finally {
      setExporting(false);
    }
  };

  const sharePng = async () => {
    if (exporting) return;
    setExporting(true);
    setExportStatus("Creating a high-quality PNG for sharing…");

    try {
      const { blob, failedImages } = await createPngBlob();
      const fileName = `utsav-${festival.toLowerCase()}-greeting.png`;
      const imageWarning = failedImages
        ? " One or more uploaded photos could not be included."
        : "";
      let file = null;
      let canShareFile = false;

      if (
        typeof File !== "undefined" &&
        typeof navigator !== "undefined" &&
        typeof navigator.share === "function" &&
        typeof navigator.canShare === "function"
      ) {
        try {
          file = new File([blob], fileName, { type: "image/png" });
          canShareFile = navigator.canShare({ files: [file] });
        } catch {
          // Some browsers expose these APIs but do not support file sharing.
          canShareFile = false;
        }
      }

      if (!canShareFile || !file) {
        downloadBlob(blob);
        setExportStatus(
          "Image sharing is not supported in this browser. Your PNG was downloaded—open WhatsApp and attach it manually." +
            imageWarning
        );
        return;
      }

      try {
        await navigator.share({
          files: [file],
          title: `${festival} greeting from Utsav`,
          text: "A festival greeting created with Utsav – Our Culture, Our Light."
        });
        setExportStatus(
          "Your device's share sheet was opened. Choose WhatsApp there and complete sending the PNG." +
            imageWarning
        );
      } catch (shareError) {
        if (shareError?.name === "AbortError") {
          setExportStatus(
            "Sharing was cancelled. Your design is unchanged; you can try again or download the PNG."
          );
        } else {
          console.error("Native image sharing failed:", shareError);
          downloadBlob(blob);
          setExportStatus(
            "Native image sharing was unavailable. Your PNG was downloaded—attach it manually in WhatsApp." +
              imageWarning
          );
        }
      }
    } catch (error) {
      console.error("Unable to prepare the festival greeting for sharing:", error);
      setExportStatus(
        "The PNG could not be prepared. Please try again or remove an unsupported image."
      );
    } finally {
      setExporting(false);
    }
  };

  const shareText = () => {
    const greeting =
      festival === "Chhath" ? "Happy Chhath Puja!" : "Happy Tihar!";
    const message = [
      to ? `Dear ${to},` : "",
      greeting,
      from ? `With love, ${from}` : "",
    ]
      .filter(Boolean)
      .join(" ");
    window.open(
      `https://wa.me/?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };
  const upload = e => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setExportStatus("Please choose a valid image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setExportStatus("Choose an image smaller than 5 MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== "string") {
        setExportStatus("The selected image could not be read.");
        return;
      }

      add("image", {
        src: reader.result,
        w: 280,
        h: 220,
      });
      setExportStatus("Your image was added to the greeting.");
    };
    reader.onerror = () => {
      setExportStatus("The selected image could not be read. Try another file.");
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };
  const changeFestival = v => {
    setFestival(v);
    setObjects(initialObjects(template, v));
    setSelected(1);
  };
  return <main className="phase-page wishes-studio">
    <section className="phase-hero">
      <Eyebrow>DESIGN YOUR OWN GREETING</Eyebrow>
      <h1>A little art.<br /><em>A lot of love.</em></h1>
      <p>
        Choose a handcrafted template or start with a blank canvas. Add words,
        colours, shapes, stickers and your own photos, then share your creation.
      </p>
    </section>
    <section className="phase-section wish-studio-shell">
      <div className="wish-studio-toolbar">
        <div className="wish-studio-actions">
          <button
            onClick={undo}
            disabled={!history.current.length}
          ><Undo2 size={16} /> Undo</button>
          <button
            onClick={redo}
            disabled={!future.current.length}
          ><Redo2 size={16} /> Redo</button>
          <button onClick={newBlank}><Plus size={16} /> Blank canvas</button>
        </div>
        <div className="wish-studio-actions">
          <button
            className="wish-download"
            onClick={sharePng}
            disabled={exporting}
          >
            <Share2 size={16} />
            {exporting ? "Preparing PNG…" : "Share as PNG"}
          </button>
          <button onClick={shareText} disabled={exporting}>
            <MessageCircle size={16} /> Share as Text
          </button>
          <button onClick={download} disabled={exporting}>
            <Download size={16} /> Download PNG
          </button>
        </div>
      </div>
      {exportStatus && (
        <p className="phase-note" role="status">
          {exportStatus}
        </p>
      )}
      <div className="wish-studio-grid">
        <div className="wish-canvas-wrap">
          <div className="wish-canvas-top">
            <span>LIVE DESIGN · 1080 × 1350</span>
            <span>Drag elements to position</span>
          </div>
          <canvas
            ref={canvasRef}
            width="1080"
            height="1350"
            onPointerDown={down}
            onPointerMove={move}
            onPointerUp={up}
            onPointerCancel={up}
            aria-label="Editable festival greeting card canvas"
          />
          <div className="wish-canvas-bottom">Your design is rendered locally in your browser.</div>
        </div>
        <aside className="wish-tools-panel">
          <div className="wish-tabs">{[
            ["templates", "Templates"],
            ["elements", "Elements"],
            ["design", "Design"],
            ["text", "Text"]
          ].map(([id, label]) => <button
            key={id}
            className={activeTab === id ? "active" : ""}
            onClick={() => setActiveTab(id)}
          >{label}</button>)}</div>
          {activeTab === "templates" && <div className="wish-tool-content">
            <label>Festival<select
              value={festival}
              onChange={e => changeFestival(e.target.value)}
            >
              <option>Chhath</option>
              <option>Tihar</option>
            </select></label>
            <h3>10 popular designs</h3>
            <div className="wish-template-grid">{templates.map(t => <button
              key={t.id}
              className={template.id === t.id ? "selected" : ""}
              onClick={() => applyTemplate(t)}
              aria-label={`Use ${t.name} template`}
            >
              <i style={{
                background: t.bg,
                borderColor: t.accent
              }}><span>{t.sticker}</span></i>
              <b>{t.name}</b>
            </button>)}</div>
            <button
              className="wish-wide-button"
              onClick={newBlank}
            >Start from scratch</button>
          </div>}
          {activeTab === "elements" && <div className="wish-tool-content">
            <h3>Add to your design</h3>
            <div className="wish-element-grid">
              <button onClick={() => add("text", {
                text: "Your message",
                font: "Georgia",
                bold: true
              })}><Type />Text</button>
              <button onClick={() => add("sticker", { text: "🌼" })}><Sparkles />Sticker</button>
              <button onClick={() => add("rect", {
                w: 220,
                h: 90,
                color: accent
              })}><Square />Rectangle</button>
              <button onClick={() => add("circle", {
                size: 65,
                color: accent
              })}><Circle />Circle</button>
              <label className="wish-upload"><ImagePlus />Photo<input
                type="file"
                accept="image/*"
                onChange={upload}
              /></label>
            </div>
            <h3>Decorative elements</h3>
            <div className="wish-stickers">{[
              "🪔",
              "🌞",
              "🌅",
              "🌼",
              "🌸",
              "🪷",
              "✨",
              "🎉",
              "🕉️",
              "💛",
              "🌺",
              "🪻",
              "🌿",
              "🪔",
              "☀️",
              "🎊",
              "🧡",
              "🙏"
            ].map((s, i) => <button
              key={i}
              onClick={() => add("sticker", {
                text: s,
                size: 72
              })}
            >{s}</button>)}</div>
            <p className="wish-help">Select any element on the canvas to edit, move or delete it.</p>
          </div>}
          {activeTab === "design" && <div className="wish-tool-content">
            <h3>Canvas appearance</h3>
            <label>Background colour<input
              type="color"
              value={bg}
              onChange={e => setBg(e.target.value)}
            /></label>
            <label>Accent colour<input
              type="color"
              value={accent}
              onChange={e => setAccent(e.target.value)}
            /></label>
            <label>Text colour<input
              type="color"
              value={ink}
              onChange={e => setInk(e.target.value)}
            /></label>
            <label>Decoration style<select
              value={pattern}
              onChange={e => setPattern(e.target.value)}
            >{[
              "minimal",
              "frame",
              "sun",
              "glow",
              "flowers",
              "lotus",
              "gold",
              "stars",
              "rang"
            ].map(x => <option key={x}>{x}</option>)}</select></label>
            <div className="wish-presets">{[
              "#542b3d",
              "#25151b",
              "#eee8dc",
              "#172a38",
              "#7c3e2c",
              "#34213c"
            ].map(c => <button
              key={c}
              style={{ background: c }}
              onClick={() => setBg(c)}
              aria-label={`Set background ${c}`}
            />)}</div>
          </div>}
          {activeTab === "text" && <div className="wish-tool-content">
            <h3>Personalise your greeting</h3>
            <label>Recipient name<input
              value={to}
              onChange={e => setTo(e.target.value)}
              placeholder="e.g. Dear family"
              maxLength={40}
            /></label>
            <label>Your name<input
              value={from}
              onChange={e => setFrom(e.target.value)}
              placeholder="Your name"
              maxLength={40}
            /></label>
            <button
              className="wish-wide-button"
              onClick={() => add("text", {
                text: to ? `Dear ${to}` : "Dear family",
                size: 34,
                color: accent
              })}
            >Add recipient line</button>
            <button
              className="wish-wide-button"
              onClick={() => add("text", {
                text: from ? `With love, ${from}` : "With love",
                size: 30,
                color: accent
              })}
            >Add signature</button>
            <label>Selected text<input
              value={chosen?.type === "text" ? chosen.text : ""}
              onChange={e => chosen && setObj(chosen.id, { text: e.target.value })}
              placeholder="Select a text element"
            /></label>
            <label>Font family<select
              value={chosen?.font || font}
              onChange={e => {
                setFont(e.target.value);
                chosen && setObj(chosen.id, { font: e.target.value });
              }}
            >
              <option>Georgia</option>
              <option>Arial</option>
              <option>Verdana</option>
              <option>serif</option>
              <option>cursive</option>
            </select></label>
            <label>Font size <strong>{chosen?.size || fontSize}px</strong><input
              type="range"
              min="18"
              max="110"
              value={chosen?.size || fontSize}
              onChange={e => {
                setFontSize(+e.target.value);
                chosen && setObj(chosen.id, { size: +e.target.value });
              }}
            /></label>
            <label>Element colour<input
              type="color"
              value={chosen?.color || color}
              onChange={e => {
                setColor(e.target.value);
                chosen && setObj(chosen.id, { color: e.target.value });
              }}
            /></label>
            <div className="wish-element-actions">
              <button onClick={() => chosen && setObj(chosen.id, { bold: !chosen.bold })}>Bold / regular</button>
              <button
                onClick={() =>
                  chosen && commit(objects.filter(object => object.id !== chosen.id))
                }
              >
                <Trash2 size={14} /> Delete selected
              </button>
            </div>
            <p className="wish-help">Tip: select a text item on the canvas first to edit its wording and typography.</p>
          </div>}
        </aside>
      </div>
    </section>
  </main>;
}
