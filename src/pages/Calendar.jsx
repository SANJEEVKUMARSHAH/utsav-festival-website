import { useEffect, useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  Download,
  Info,
  Search,
  List,
  CalendarRange,
  CalendarCheck,
  StickyNote,
  X,
  Sun,
  Sunrise,
  Sunset,
  RefreshCw,
  LoaderCircle,
} from "lucide-react";
import Eyebrow from "../components/Eyebrow";
import {
  BS_MONTHS,
  BS_MONTHS_NE,
  WEEKDAYS,
  WEEKDAYS_NE,
  dateKey,
  parseLocalDate,
  getKathmanduToday,
  formatFestivalDate,
  fetchKathmanduToday,
  fetchBsMonth,
  getNepaliDayLabel,
  getTithiLabel,
  getPakshaLabel,
  fetchAdMonth,
  getEventsForDay,
  fetchBsHolidays,
  getAnnualCalendarEvents,
  normalizeCalendarEvent,
  makeGregorianFallbackMonth,
  preferIndividualTiharDays,
  getLocalFallbackEvents,
} from "../utils/festivalCalendar";
import "../styles/phase2.css";
const VIEWS = [
  {
    id: "month",
    label: "Month",
    icon: CalendarDays
  },
  {
    id: "week",
    label: "Week",
    icon: CalendarRange
  },
  {
    id: "agenda",
    label: "Agenda",
    icon: List
  }
];
const NOTES_KEY = "utsav-calendar-notes-v2";
const toAdDate = day => day?.ad ? parseLocalDate(day.ad) : null;
const dayKey = day => day?.ad || "";

const isValidAdDate = value =>
  typeof value === "string" &&
  !Number.isNaN(parseLocalDate(value).getTime());

const hasValidBsMonth = day => {
  const year = Number(day?.bs?.year);
  const month = Number(day?.bs?.month);

  return (
    Number.isInteger(year) &&
    year >= 2000 &&
    year <= 2090 &&
    Number.isInteger(month) &&
    month >= 1 &&
    month <= 12
  );
};

const getValidMonthDays = data => {
  if (!Array.isArray(data?.days)) return [];

  const validDays = data.days.filter(day => isValidAdDate(day?.ad));
  const uniqueDays = new Map(validDays.map(day => [day.ad, day]));

  return [...uniqueDays.values()].sort((a, b) =>
    a.ad.localeCompare(b.ad)
  );
};
function downloadICS(event) {
  const compact = event.dateString.replaceAll("-", "");
  const endDate = parseLocalDate(event.dateString);
  endDate.setDate(endDate.getDate() + 1);
  const exclusiveEnd = dateKey(endDate).replaceAll("-", "");
  const escape = (value = "") =>
    value
      .replaceAll("\\", "\\\\")
      .replaceAll(",", "\\,")
      .replaceAll(";", "\\;")
      .replaceAll("\n", "\\n");
  const content = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Utsav//Nepali Festival Calendar//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${event.id}-${event.dateString}@utsav.local`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "")}`,
    `DTSTART;VALUE=DATE:${compact}`,
    `DTEND;VALUE=DATE:${exclusiveEnd}`,
    `SUMMARY:${escape(event.name)}`,
    `DESCRIPTION:${escape(event.description)}`,
    "END:VEVENT",
    "END:VCALENDAR"
  ].join("\r\n");
  const url = URL.createObjectURL(new Blob([content], { type: "text/calendar;charset=utf-8" }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `${event.id}-${event.dateString}.ics`;
  anchor.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
function EventDetails({
  day,
  events,
  selectedDate,
  onAddToCalendar
}) {
  return <aside className="calendar-events calendar-details-panel">
    <span className="phase-kicker">SELECTED DATE · KATHMANDU</span>
    <h3>{day ? getNepaliDayLabel(day) : formatFestivalDate(selectedDate)}</h3>
    <p className="calendar-date-subtitle">{formatFestivalDate(selectedDate, {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric"
    })}</p>
    <div className="bs-panchanga-grid">
      <div>
        <small>तिथि · Tithi</small>
        <b>{getTithiLabel(day) || "Not available"}</b>
      </div>
      <div>
        <small>पक्ष · Paksha</small>
        <b>{getPakshaLabel(day) || "Not available"}</b>
      </div>
      <div>
        <small><Sunrise size={13} /> Sunrise</small>
        <b>{day?.sunrise || "Not available"}</b>
      </div>
      <div>
        <small><Sunset size={13} /> Sunset</small>
        <b>{day?.sunset || "Not available"}</b>
      </div>
    </div>
    {events.length > 0 ? <div className="calendar-selected-events">
      <span className="phase-kicker">FESTIVALS & OBSERVANCES</span>
      {events.map(event => <article
        className="calendar-event-detail"
        key={`${event.id}-${event.dateString}`}
      >
        <span>{event.icon}</span>
        <div>
          <b>{event.name}</b>
          <small>{event.category} · {event.status}</small>
          <p>{event.description}</p>
          <button onClick={() => onAddToCalendar(event)}><Download size={14} /> Add to calendar (.ics)</button>
        </div>
      </article>)}
    </div> : <div className="calendar-empty">
      <CalendarDays size={26} />
      <b>No festival listed for this date</b>
      <p>You can still save a personal note for this day.</p>
    </div>}
    {day?.provisional && (
      <p className="calendar-data-warning">
        This BS month is provisional and may change when the official annual
        calendar is published.
      </p>
    )}
  </aside>;
}
export default function Calendar() {
  const [today, setToday] = useState(() => getKathmanduToday());
  const [bsYear, setBsYear] = useState(null);
  const [bsMonth, setBsMonth] = useState(null);
  const [monthData, setMonthData] = useState([]);
  const [annualEvents, setAnnualEvents] = useState([]);
  const [selected, setSelected] = useState(dateKey(today));
  const [view, setView] = useState("month");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notes, setNotes] = useState(() => {
    try {
      const storedNotes = JSON.parse(typeof window !== "undefined" ? window.localStorage.getItem(NOTES_KEY) || "{}" : "{}");

      return storedNotes &&
        typeof storedNotes === "object" &&
        !Array.isArray(storedNotes)
        ? storedNotes
        : {};
    } catch {
      return {};
    }
  });
  const [noteDraft, setNoteDraft] = useState("");
  const [noteMessage, setNoteMessage] = useState("");
  const [fallbackMode, setFallbackMode] = useState(false);
  const [fallbackDate, setFallbackDate] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1)
  );

  useEffect(() => {
    const timer = window.setInterval(() => {
      const currentDate = getKathmanduToday();

      setToday(previousDate =>
        dateKey(previousDate) === dateKey(currentDate)
          ? previousDate
          : currentDate
      );
    }, 60000);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    let active = true;
    fetchKathmanduToday().then(todayData => {
      if (!active) return;
    
      if (!hasValidBsMonth(todayData)) {
        throw new Error(
          "The Nepali calendar service returned an incomplete date. Please retry."
        );
      }

      setFallbackMode(false);
      setBsYear(Number(todayData.bs.year));
      setBsMonth(Number(todayData.bs.month));
      setSelected(
        isValidAdDate(todayData.ad) ? todayData.ad : dateKey(today)
      );
      setLoading(false);
    }).catch(() => {
      if (!active) return;
      setFallbackMode(true);
      setFallbackDate(new Date(today.getFullYear(), today.getMonth(), 1));
      setMonthData(makeGregorianFallbackMonth(today));
      setSelected(dateKey(today));
      setError(
        "Live Bikram Sambat data is unavailable. Showing a Gregorian calendar fallback; festival highlights and saved notes are still available."
      );
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [today]);
  useEffect(() => {
    if (!bsYear || !bsMonth) return undefined;
    let active = true;
    setLoading(true);
    setError("");
    fetchBsMonth(bsYear, bsMonth).then(data => {
      if (!active) return;
      const days = getValidMonthDays(data);
      if (!days.length) throw new Error("No day records were returned for this month.");
      setFallbackMode(false);
      setMonthData(days);
      setLoading(false);
    }).catch(() => {
      if (!active) return;
      const fallback = parseLocalDate(selected || dateKey(today));
      setFallbackMode(true);
      setFallbackDate(new Date(fallback.getFullYear(), fallback.getMonth(), 1));
      setMonthData(makeGregorianFallbackMonth(fallback));
      setError(
        "The Nepali calendar service could not load this month. Showing Gregorian dates instead; festival highlights remain available."
      );
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [bsYear, bsMonth]);
  useEffect(() => {
    if (!bsYear) return undefined;
    let active = true;
    fetchBsHolidays(bsYear).then(payload => {
      if (active) setAnnualEvents(getAnnualCalendarEvents(payload));
    }).catch(() => {
      if (active) setAnnualEvents([]);
    });
    return () => {
      active = false;
    };
  }, [bsYear]);
  const calendarEvents = useMemo(() => {
    const fromMonth = monthData.flatMap(day => getEventsForDay(day));
    const hasLiveEvents = annualEvents.length > 0 || fromMonth.length > 0;
    const combined = [
      ...annualEvents,
      ...fromMonth,
      ...(hasLiveEvents ? [] : getLocalFallbackEvents())
    ];

    const normalized = combined.map(event => normalizeCalendarEvent(event)).filter(Boolean);
    const unique = [
      ...new Map(
        normalized.map(event => [
          `${event.dateString}|${event.name.toLocaleLowerCase()}`,
          event,
        ])
      ).values(),
    ];
    return preferIndividualTiharDays(unique).sort((a, b) => a.date - b.date || a.name.localeCompare(b.name));
  }, [annualEvents, monthData]);
  const festivalByDate = useMemo(() => calendarEvents.reduce((map, event) => {
    const key = event.dateString;
    if (!key) return map;
    map[key] ||= [];
    if (!map[key].some(item => item.name.toLowerCase() === event.name.toLowerCase())) map[key].push(event);
    return map;
  }, {}), [calendarEvents]);
  const selectedDay = monthData.find(day => dayKey(day) === selected) || null;
  const selectedDate = selectedDay ? toAdDate(selectedDay) : parseLocalDate(selected);
  const selectedEvents = festivalByDate[selected] || [];
  const filteredFestivals = [...calendarEvents]
    .filter(
      event =>
        event.date &&
        event.date >=
          new Date(today.getFullYear(), today.getMonth(), today.getDate())
    )
    .filter(
      (event, index, array) =>
        array.findIndex(
          item =>
            item.dateString === event.dateString &&
            item.name.toLowerCase() === event.name.toLowerCase()
        ) === index
    )
    .filter(event => {
      const searchableText = [
        event.name,
        event.category,
        event.description || "",
        event.nepaliName || "",
      ].join(" ");

      return searchableText.toLowerCase().includes(query.toLowerCase());
    })
    .sort((a, b) => a.date - b.date);
  useEffect(() => {
    if (monthData.length && !monthData.some(day => day.ad === selected)) setSelected(monthData[0].ad);
  }, [monthData, selected]);
  useEffect(() => {
    setNoteDraft(notes[selected] || "");
  }, [selected, notes]);

  useEffect(() => {
    setNoteMessage("");
  }, [selected]);
  const setMonth = (year, month) => {
    if (fallbackMode) {
      const next = new Date(fallbackDate.getFullYear(), fallbackDate.getMonth() + (month - bsMonth), 1);
      setFallbackDate(next);
      setMonthData(makeGregorianFallbackMonth(next));
      setSelected(dateKey(next));
      setError("Showing Gregorian fallback dates because live BS data is unavailable.");
      return;
    }
    let nextYear = year;
    let nextMonth = month;
    if (nextMonth < 1) {
      nextMonth = 12;
      nextYear -= 1;
    }
    if (nextMonth > 12) {
      nextMonth = 1;
      nextYear += 1;
    }
    setBsYear(nextYear);
    setBsMonth(nextMonth);
  };
  const selectAdDate = async ad => {
    if (!isValidAdDate(ad)) return;
    setSelected(ad);
    const [adYear, adMonth] = ad.split("-").map(Number);
    try {
      const data = await fetchAdMonth(adYear, adMonth);
      const match = getValidMonthDays(data).find(day => day.ad === ad);

      if (!match || !hasValidBsMonth(match)) {
        throw new Error("The selected date could not be converted to BS.");
      }

      setFallbackMode(false);
      setBsYear(Number(match.bs.year));
      setBsMonth(Number(match.bs.month));
    } catch {
      const fallback = parseLocalDate(ad);
      setFallbackMode(true);
      setFallbackDate(new Date(fallback.getFullYear(), fallback.getMonth(), 1));
      setMonthData(makeGregorianFallbackMonth(fallback));
      setError("BS conversion is temporarily unavailable. Showing Gregorian dates for this month.");
      setLoading(false);
    }
  };
  const selectDay = day => {
    if (isValidAdDate(day?.ad)) {
      setSelected(day.ad);
      if (!fallbackMode && !hasValidBsMonth(day)) {
        selectAdDate(day.ad);
      }
    }
  };
  const goToday = async () => {
    setLoading(true);
    setError("");
    try {
      const day = await fetchKathmanduToday();
      if (!hasValidBsMonth(day)) {
        throw new Error(
          "The Nepali calendar service returned an incomplete date."
        );
      }

      setFallbackMode(false);
      setBsYear(Number(day.bs.year));
      setBsMonth(Number(day.bs.month));
      setSelected(isValidAdDate(day.ad) ? day.ad : dateKey(today));
      setLoading(false);
    } catch {
      setFallbackMode(true);
      setFallbackDate(new Date(today.getFullYear(), today.getMonth(), 1));
      setMonthData(makeGregorianFallbackMonth(today));
      setSelected(dateKey(today));
      setError("Live BS data is unavailable. Showing the Gregorian calendar fallback.");
      setLoading(false);
    }
  };
  const retryLiveData = async () => {
    if (!bsYear || !bsMonth) {
      await goToday();
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data = await fetchBsMonth(bsYear, bsMonth);
      const days = getValidMonthDays(data);

      if (!days.length) {
        throw new Error("No day records were returned for this month.");
      }

      setMonthData(days);
      setFallbackMode(false);
      setLoading(false);
    } catch {
      const fallback = parseLocalDate(selected || dateKey(today));

      setFallbackMode(true);
      setFallbackDate(
        new Date(fallback.getFullYear(), fallback.getMonth(), 1)
      );
      setMonthData(makeGregorianFallbackMonth(fallback));
      setError(
        "Live Bikram Sambat data is still unavailable. The Gregorian fallback remains active."
      );
      setLoading(false);
    }
  };

  const saveNote = () => {
    const updated = { ...notes };

    if (noteDraft.trim()) {
      updated[selected] = noteDraft.trim();
    } else {
      delete updated[selected];
    }

    setNotes(updated);

    try {
      localStorage.setItem(NOTES_KEY, JSON.stringify(updated));
      setNoteMessage("Your note has been saved on this device.");
    } catch {
      setNoteMessage(
        "The note is visible for this session but could not be saved in browser storage."
      );
    }
  };

  const clearNote = () => {
    const updated = { ...notes };
    delete updated[selected];

    setNotes(updated);
    setNoteDraft("");

    try {
      localStorage.setItem(NOTES_KEY, JSON.stringify(updated));
      setNoteMessage("The saved note has been cleared.");
    } catch {
      setNoteMessage("The note was cleared for this session only.");
    }
  };
  const monthCells = useMemo(() => {
    if (!monthData.length) return [];
    const firstDate = toAdDate(monthData[0]);
    const offset = firstDate ? firstDate.getDay() : 0;
    return [...Array(offset).fill(null), ...monthData];
  }, [monthData]);
  const weekDays = useMemo(() => {
    if (!selectedDate) return [];
    const start = new Date(selectedDate);
    start.setDate(start.getDate() - start.getDay());
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      const key = dateKey(date);
      return monthData.find(day => day.ad === key) || {
        ad: key,
        bs: null,
        outsideMonth: true
      };
    });
  }, [selectedDate, monthData]);
  const agendaEvents = filteredFestivals.filter(event => {
    const eventDate = event.date;
    const firstDate = monthData[0] ? toAdDate(monthData[0]) : today;
    const lastDate = monthData.at(-1) ? toAdDate(monthData.at(-1)) : today;

    return eventDate >= firstDate && eventDate <= lastDate;
  });
  return <main className="phase-page">
    <section className="phase-hero">
      <Eyebrow>NEPAL'S FESTIVAL CALENDAR</Eyebrow>
      <h1>Mark the days.<br /><em>Keep the traditions.</em></h1>
      <p>
        Explore Bikram Sambat dates, daily tithi and sunrise, and festivals and
        observances listed throughout the Nepali calendar.
      </p>
      <div className="calendar-hero-meta">
        <span><Sun size={15} /> Kathmandu · Asia/Kathmandu</span>
        <span><CalendarCheck size={15} /> BS + AD · Tithi · Festivals</span>
      </div>
    </section>
    <section className="phase-section calendar-workspace">
      <div className="calendar-toolbar">
        <div>
          <Eyebrow>BIKRAM SAMBAT PLANNER</Eyebrow>
          <h2>
            {bsYear || "Nepali"}
            <em>calendar.</em>
          </h2>
        </div>
        <div className="calendar-toolbar-actions">
          <label>BS Year<select
            value={bsYear || ""}
            disabled={!bsYear || fallbackMode}
            onChange={event => setMonth(Number(event.target.value), bsMonth || 1)}
          >
              {Array.from({ length: 91 }, (_, index) => 2000 + index).map(value => <option
            key={value}
            value={value}
          >{value}</option>)}
            </select></label>
          <button
            className="calendar-today-btn"
            onClick={goToday}
          ><RefreshCw size={13} /> Today</button>
        </div>
      </div>
      <div className="calendar-controls-row">
        <div
          className="calendar-view-switch"
          role="tablist"
          aria-label="Calendar view"
        >
            {VIEWS.map(({
          id,
          label,
          icon: Icon
        }) => <button
          key={id}
          role="tab"
          aria-selected={view === id}
          className={view === id ? "selected" : ""}
          onClick={() => setView(id)}
        >
          <Icon size={15} />
          {label}
        </button>)}
          </div>
        <label className="calendar-search">
          <Search size={16} />
          <input
            value={query}
            onChange={event => setQuery(event.target.value)}
            placeholder="Search festivals..."
          />
          <button
            aria-label="Clear search"
            onClick={() => setQuery("")}
          ><X size={14} /></button>
        </label>
      </div>
      <div className="calendar-layout">
        <section className="calendar-card">
          <div className="calendar-head">
            <button
              onClick={() => setMonth(bsYear, bsMonth - 1)}
              aria-label="Previous Nepali month"
            ><ChevronLeft /></button>
            <h3>
              {fallbackMode ? new Intl.DateTimeFormat("en", {
                month: "long",
                year: "numeric"
              }).format(fallbackDate) : `${bsMonth ? BS_MONTHS[bsMonth - 1] : "Loading"} ${bsYear || ""}`}
              <small>
                {fallbackMode
                  ? "Gregorian fallback · BS data unavailable"
                  : bsMonth
                    ? BS_MONTHS_NE[bsMonth - 1]
                    : "नेपाली पात्रो"}
              </small>
            </h3>
            <button
              onClick={() => setMonth(bsYear, bsMonth + 1)}
              aria-label="Next Nepali month"
            ><ChevronRight /></button>
          </div>
          {loading && <div className="calendar-loading"><LoaderCircle
            className="spin"
            size={22}
          /> Loading Bikram Sambat dates…</div>}
          {error && <div className="calendar-api-error">
            <Info size={18} />
            <span>{error}</span>
            <button onClick={retryLiveData}>Retry live BS data</button>
          </div>}
          {!loading && (!error || fallbackMode) && view === "month" && (
            <div className="calendar-grid calendar-month-grid bs-calendar-grid">
            {WEEKDAYS.map((day, i) => <b key={day}>
              {day}
              <small>{WEEKDAYS_NE[i]}</small>
            </b>)}
            {monthCells.map((day, index) => {
              if (!day) {
                return <span key={`blank-${index}`} />;
              }

              const adDate = toAdDate(day);
              const key = day.ad;
              const events = festivalByDate[key] || [];
              const className = [
                events.length || day.events?.length ? "has-event" : "",
                selected === key ? "selected" : "",
                key === dateKey(today) ? "is-today" : "",
                notes[key] ? "has-note" : "",
              ]
                .filter(Boolean)
                .join(" ");

              return (
                <button
                  key={key}
                  className={className}
                  onClick={() => selectDay(day)}
                  aria-label={`${getNepaliDayLabel(day)}, ${day.ad}`}
                >
                  <span>{day.bs?.day ?? adDate?.getDate()}</span>
                  {day.bs && (
                    <small className="bs-ad-day">
                      {adDate?.getDate()}
                    </small>
                  )}
                  {(events.length || day.events?.length) ? <i /> : null}
                  {notes[key] && (
                    <small className="bs-note-label">Note</small>
                  )}
                </button>
              );
            })}
            </div>
          )}
          {!loading && (!error || fallbackMode) && view === "week" && (
            <div className="calendar-week-grid bs-week-grid">
              {weekDays.map(day => {
                const dayEvents =
                  festivalByDate[day.ad] || getEventsForDay(day);
                const eventNames =
                  dayEvents.map(event => event.name).join(", ") || "No event";
                const className = [
                  selected === day.ad ? "selected" : "",
                  dayEvents.length || day.events?.length ? "has-event" : "",
                  day.ad === dateKey(today) ? "is-today" : "",
                ]
                  .filter(Boolean)
                  .join(" ");

                return (
                  <button
                    key={day.ad}
                    className={className}
                    onClick={() => selectDay(day)}
                    aria-label={`${getNepaliDayLabel(day)}, ${day.ad}`}
                  >
                    <small>
                      {WEEKDAYS[parseLocalDate(day.ad).getDay()]}
                    </small>
                    <strong>
                      {day.bs?.day || parseLocalDate(day.ad).getDate()}
                    </strong>
                    <span>{eventNames}</span>
                  </button>
                );
              })}
            </div>
          )}
          {!loading && (!error || fallbackMode) && view === "agenda" && (
            <div className="calendar-agenda-list">
              {agendaEvents.length ? (
                agendaEvents.map(event => (
                  <button
                    key={`${event.id}-${event.dateString}`}
                    className={selected === event.dateString ? "selected" : ""}
                    onClick={() => selectAdDate(event.dateString)}
                  >
                    <span>{event.icon}</span>
                    <span>
                      <b>{event.name}</b>
                      <small>
                        {formatFestivalDate(event.date)} ·{" "}
                        {event.status || "Calendar listing"}
                      </small>
                    </span>
                    <ChevronRight size={16} />
                  </button>
                ))
              ) : (
                <p className="calendar-empty-copy">
                  No festivals in this month match your search.
                </p>
              )}
            </div>
          )}
          <div className="calendar-legend">
            <i /> Festival date
            <span>·</span>
            <b className="calendar-note-dot" /> Personal note
            <span>·</span>
            BS date large / AD date small
          </div>
          <div className="calendar-month-actions">
            <button onClick={goToday}>← Back to today</button>
            <button onClick={() => setMonth(bsYear, bsMonth + 1)}>Next month →</button>
          </div>
        </section>
        <div className="calendar-side-stack">
          <EventDetails
            day={selectedDay}
            events={selectedEvents}
            selectedDate={selectedDate || parseLocalDate(selected)}
            onAddToCalendar={downloadICS}
          />
          <section className="calendar-events calendar-note-editor">
            <span className="phase-kicker"><StickyNote size={13} /> YOUR DAY NOTE</span>
            <h3>Personal reminder</h3>
            <p>
              Keep a shopping list, family plan, or reminder for{" "}
              {selectedDay ? getNepaliDayLabel(selectedDay) : selected}.
            </p>
            <textarea
              value={noteDraft}
              onChange={event => setNoteDraft(event.target.value)}
              rows={3}
              placeholder="Write a note for this date..."
            />
            <div className="calendar-note-actions">
              <button onClick={saveNote}>Save note</button>
              {notes[selected] && (
                <button className="calendar-clear-note" onClick={clearNote}>
                  Clear
                </button>
              )}
            </div>
            {noteMessage && (
              <p className="calendar-note-status" role="status">
                {noteMessage}
              </p>
            )}
          </section>
        </div>
      </div>
      <div className="calendar-year-list">
        <div>
          <Eyebrow>YOUR FESTIVAL LINE-UP</Eyebrow>
          <h3>Festival highlights</h3>
        </div>
        {filteredFestivals.map(event => <button
          key={`${event.id}-${event.dateString}`}
          onClick={() => {
            selectAdDate(event.dateString);
            setView("month");
          }}
        >
          <span>{event.icon}</span>
          <b>{event.name}</b>
          <small>{formatFestivalDate(event.date)} · {event.status || "Calendar listing"}</small>
          <ChevronRight size={16} />
        </button>)}
      </div>
    </section>
  </main>;
}
