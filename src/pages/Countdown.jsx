import { useEffect, useMemo, useState } from "react";
import { CalendarDays, Sparkles, LoaderCircle } from "lucide-react";
import Eyebrow from "../components/Eyebrow";
import {
  getLocalFallbackEvents,
  getKathmanduToday,
  formatFestivalDate,
  fetchAdMonth,
  getNepaliDayLabel,
  fetchKathmanduToday,
  fetchTrisambatFestivalEvents,
} from "../utils/festivalCalendar";
import "../styles/phase2.css";
const formatDate = date => formatFestivalDate(date, { dateStyle: "full" });

const formatBsDate = (bsDates, dateString, fallback) =>
  bsDates[dateString]
    ? getNepaliDayLabel(bsDates[dateString])
    : fallback;
function Clock({ target, now }) {
  const diff = Math.max(0, target.getTime() - now.getTime());
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor(diff / 3600000) % 24;
  const minutes = Math.floor(diff / 60000) % 60;
  const seconds = Math.floor(diff / 1000) % 60;
  return <div className="countdown-clock">{[
    ["Days", days],
    ["Hours", hours],
    ["Minutes", minutes],
    ["Seconds", seconds]
  ].map(([label, value]) => <div key={label}>
    <strong>{String(value).padStart(2, "0")}</strong>
    <span>{label}</span>
  </div>)}</div>;
}
export default function Countdown() {
  const [now, setNow] = useState(() => new Date());
  const [bsDates, setBsDates] = useState({});
  const [calendarStatus, setCalendarStatus] = useState("loading");
  const [apiFestivalEvents, setApiFestivalEvents] = useState([]);
  const [festivalSource, setFestivalSource] = useState("Loading calendar data");
  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const todayData = await fetchKathmanduToday();
        const currentBsYear = Number(todayData?.bs?.year);
        if (!currentBsYear) throw new Error("Current Bikram Sambat year is unavailable.");
        const events = await fetchTrisambatFestivalEvents([currentBsYear, currentBsYear + 1]);
        if (!active) return;
        if (events.length) {
          setApiFestivalEvents(events);
          setFestivalSource("Trisambat");
        } else {
          setApiFestivalEvents(getLocalFallbackEvents());
          setFestivalSource("Utsav offline highlights");
        }
      } catch {
        if (!active) return;
        setApiFestivalEvents(getLocalFallbackEvents());
        setFestivalSource("Utsav offline highlights");
      }
    })();
    return () => {
      active = false;
    };
  }, []);
  const upcoming = useMemo(() => {
    const today = getKathmanduToday();
    const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return apiFestivalEvents
      .filter(
        event =>
          event?.date instanceof Date &&
          !Number.isNaN(event.date.getTime()) &&
          event.date >= start
      )
      .sort(
        (a, b) =>
          a.date - b.date || a.name.localeCompare(b.name)
      )
      .slice(0, 40);
  }, [apiFestivalEvents, now]);
  const next = upcoming[0];
  const upcomingKey = upcoming.map(event => event.dateString).join("|");
  useEffect(() => {
    let active = true;
    const months = [...new Set(upcoming.map(event => event.dateString.slice(0, 7)))];
    if (!months.length) {
      setCalendarStatus("ready");
      return () => {
        active = false;
      };
    }
    setCalendarStatus("loading");
    Promise.allSettled(
      months.slice(0, 12).map(async key => {
        const [year, month] = key.split("-").map(Number);
        const data = await fetchAdMonth(year, month);

        return Array.isArray(data?.days) ? data.days : [];
      })
    ).then(results => {
      if (!active) return;

      const mapped = {};
      let successfulMonths = 0;

      results.forEach(result => {
        if (result.status !== "fulfilled") return;

        successfulMonths += 1;
        result.value.forEach(day => {
          if (typeof day?.ad === "string") {
            mapped[day.ad] = day;
          }
        });
      });

      setBsDates(mapped);
      setCalendarStatus(successfulMonths > 0 ? "ready" : "unavailable");
    });
    return () => {
      active = false;
    };
  }, [upcomingKey]);
  return (
    <main className="phase-page">
      <section className="phase-hero">
        <Eyebrow>CELEBRATE EVERY MOMENT</Eyebrow>
        <h1>
          Every festival.
          <br />
          <em>One countdown.</em>
        </h1>
        <p>
          Keep every celebration in sight. This countdown shares the same
          festival dates as the Utsav Nepali Calendar and follows Kathmandu time.
        </p>
      </section>

      <section className="phase-section">
        {festivalSource === "Loading calendar data" ? (
          <div className="phase-panel">
            <h2>Loading festival dates…</h2>
            <p>Connecting to the Nepali calendar service.</p>
          </div>
        ) : next ? (
          <div className="phase-panel countdown-panel countdown-feature">
            <div>
              <span className="phase-kicker">
                <Sparkles size={14} /> NEXT UP · {next.status.toUpperCase()}
              </span>
              <h2>
                {next.icon} {next.name}
              </h2>
              <p>{next.description}</p>
              <p className="date-line">
                <CalendarDays size={17} />
                {formatDate(next.date)}
              </p>
              <p className="countdown-bs-date">
                {formatBsDate(
                  bsDates,
                  next.dateString,
                  calendarStatus === "unavailable"
                    ? "BS date temporarily unavailable"
                    : "Loading Nepali date…"
                )}
              </p>
              <small className="countdown-zone">
                Countdown uses Nepal time · Asia/Kathmandu
              </small>
            </div>
            <Clock target={next.date} now={now} />
          </div>
        ) : (
          <div className="phase-panel">
            <h2>More celebrations are on the way.</h2>
            <p>
              Festival dates will appear here as they are added to the calendar.
            </p>
          </div>
        )}
      </section>

      <section className="phase-section">
        <Eyebrow>THE FESTIVAL LINE-UP</Eyebrow>
        <h2>
          Coming <em>up next.</em>
        </h2>
    

        <div className="countdown-list">
          {upcoming.length > 0 ? (
            upcoming.map(festival => (
              <article
                className="countdown-row"
                key={`${festival.id}-${festival.year}`}
              >
                <span className="countdown-row-icon">{festival.icon}</span>
                <div className="countdown-row-copy">
                  <b>{festival.name}</b>
                  <small>
                    {formatDate(festival.date)} ·{" "}
                    {formatBsDate(
                      bsDates,
                      festival.dateString,
                      festival.status
                    )}
                  </small>
                </div>
                <span className="countdown-row-days">
                  {Math.max(
                    0,
                    Math.ceil(
                      (festival.date.getTime() - now.getTime()) / 86400000
                    )
                  )}
                  <small>days</small>
                </span>
              </article>
            ))
          ) : (
            <p className="calendar-empty-copy">
              No upcoming festival dates are available in the current calendar
              data.
            </p>
          )}
        </div>

        {calendarStatus === "loading" && (
          <p className="phase-note">
            <LoaderCircle className="spin" size={14} />
            Loading Bikram Sambat dates…
          </p>
        )}
      </section>
    </main>
  );
}
