import { festivalDates } from "../data/festivals";
import { calendarObservances } from "../data/calendarObservances";
export const KATHMANDU_TZ = "Asia/Kathmandu";
export const KATHMANDU_LOCATION = {
  name: "Kathmandu",
  latitude: 27.7172,
  longitude: 85.324
};
// Override with VITE_TRISAMBAT_API_BASE (see .env.example). No API key is needed.
const configuredApiBase =
  import.meta.env.VITE_TRISAMBAT_API_BASE || "https://trisambat.com/api/v1";

export const TRISAMBAT_API = configuredApiBase.replace(/\/+$/, "");
export const BS_MONTHS = [
  "Baisakh",
  "Jestha",
  "Ashadh",
  "Shrawan",
  "Bhadra",
  "Ashwin",
  "Kartik",
  "Mangsir",
  "Poush",
  "Magh",
  "Falgun",
  "Chaitra"
];
export const BS_MONTHS_NE = [
  "बैशाख",
  "जेठ",
  "असार",
  "साउन",
  "भदौ",
  "असोज",
  "कार्तिक",
  "मंसिर",
  "पुष",
  "माघ",
  "फागुन",
  "चैत"
];
export const WEEKDAYS = [
  "Sun",
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat"
];
export const WEEKDAYS_NE = [
  "आइत",
  "सोम",
  "मंगल",
  "बुध",
  "बिही",
  "शुक्र",
  "शनि"
];
export const DAY_MS = 24 * 60 * 60 * 1000;
const CACHE_PREFIX = "utsav-trisambat-v1:";
const CACHE_TTL = 12 * 60 * 60 * 1000;
const TODAY_CACHE_TTL = 60 * 1000;
export function dateKey(date) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

export function parseLocalDate(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return new Date(Number.NaN);
  }

  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return new Date(Number.NaN);
  }

  return date;
}
export function getKathmanduToday() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: KATHMANDU_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(new Date());
  const part = type => parts.find(item => item.type === type)?.value;
  return parseLocalDate(`${part("year")}-${part("month")}-${part("day")}`);
}

// Offline fallback: keep the calendar route usable when the free BS service is
// blocked by CORS, unavailable, or unreachable. These records intentionally do
// not claim BS dates; festival dates still come from Utsav's own dataset.
export function makeGregorianFallbackMonth(date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const count = new Date(year, month + 1, 0).getDate();
  return Array.from({ length: count }, (_, index) => {
    const day = new Date(year, month, index + 1);
    return {
      ad: dateKey(day),
      bs: null,
      events: [],
      fallback: true
    };
  });
}
export function formatFestivalDate(date, options = {
  day: "numeric",
  month: "long",
  year: "numeric"
}) {
  return new Intl.DateTimeFormat("en-NP", {
    ...options,
    timeZone: KATHMANDU_TZ
  }).format(date);
}

// Requests already in progress, so two components asking for the same URL share one request.
const inflight = new Map();
function cachedJson(url, ttl = CACHE_TTL) {
  if (!inflight.has(url)) {
    inflight.set(url, loadJson(url, ttl).finally(() => inflight.delete(url)));
  }
  return inflight.get(url);
}
async function loadJson(url, ttl = CACHE_TTL) {
  const cacheKey = `${CACHE_PREFIX}${url}`;
  let stale = null;
  try {
    stale = JSON.parse(localStorage.getItem(cacheKey) || "null");
    if (stale?.savedAt && Date.now() - stale.savedAt < ttl && stale.data) {
      return stale.data;
    }
  } catch {/* Ignore unavailable or malformed browser storage. */}
  try {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 10000);
    let response;
    try {
      response = await fetch(url, {
        headers: { Accept: "application/json" },
        signal: controller.signal
      });
    } finally {
      window.clearTimeout(timeout);
    }
    if (!response.ok) throw new Error(`Nepali calendar service returned ${response.status}.`);
    const data = await response.json();
    try {
      localStorage.setItem(cacheKey, JSON.stringify({
        savedAt: Date.now(),
        data
      }));
    } catch {/* The calendar remains usable when storage is full or disabled. */}
    return data;
  } catch (error) {
    if (stale?.data) return stale.data;
    throw error;
  }
}
export async function fetchKathmanduToday() {
  const url = `${TRISAMBAT_API}/today.json`;
  const data = await cachedJson(url, TODAY_CACHE_TTL);
  const expectedDate = dateKey(getKathmanduToday());

  if (data?.ad !== expectedDate) {
    throw new Error(
      "The cached Nepali calendar date is out of date. Please retry shortly."
    );
  }

  return data;
}
export async function fetchAdMonth(year, month) {
  if (!Number.isInteger(year) || !Number.isInteger(month) || month < 1 || month > 12) {
    throw new Error("Choose a valid Gregorian month.");
  }
  return cachedJson(`${TRISAMBAT_API}/ad/${year}/${String(month).padStart(2, "0")}.json`);
}
export async function fetchBsMonth(year, month) {
  if (!Number.isInteger(year) || !Number.isInteger(month) || month < 1 || month > 12) {
    throw new Error("Choose a valid Bikram Sambat month.");
  }
  return cachedJson(`${TRISAMBAT_API}/bs/${year}/${String(month).padStart(2, "0")}.json`);
}

// Annual festival and public-holiday feed. This supplements each month's day.events
// so the calendar can show the full Nepali festival list, not only the hand-curated highlights.
export async function fetchBsHolidays(year) {
  if (!Number.isInteger(year)) throw new Error("Choose a valid Bikram Sambat year.");
  return cachedJson(`${TRISAMBAT_API}/holidays/${year}.json`);
}
function toDisplayText(value) {
  if (typeof value === "string") return value.trim();
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  if (Array.isArray(value)) return value.map(toDisplayText).filter(Boolean).join(", ");
  if (value && typeof value === "object") {
    // Nepali calendar feeds may return localized fields as an object rather
    // than a plain string, e.g. name: { en: "Tihar", ne: "तिहार" }.
    const preferred = [
      "en",
      "english",
      "ne",
      "nepali",
      "value",
      "label",
      "title",
      "text"
    ];
    for (const key of preferred) {
      const text = toDisplayText(value[key]);
      if (text) return text;
    }
  }
  return "";
}
function eventName(event) {
  if (typeof event === "string") return event.trim();
  if (!event || typeof event !== "object") return "";
  return toDisplayText(
    event.name ??
    event.name_en ??
    event.name_ne ??
    event.title ??
    event.title_en ??
    event.title_ne ??
    event.text ??
    event.event ??
    event.festival ??
    event.holiday
  );
}
function isValidDateKey(value) {
  return (
    typeof value === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    !Number.isNaN(parseLocalDate(value).getTime())
  );
}

function eventDateString(value, inheritedDate = "") {
  if (isValidDateKey(value)) return value;

  if (value && typeof value === "object") {
    const candidate =
      value.ad ||
      value.gregorian ||
      value.gregorianDate ||
      value.date ||
      value.value;

    if (isValidDateKey(candidate)) return candidate;
  }

  return isValidDateKey(inheritedDate) ? inheritedDate : "";
}

export function normalizeCalendarEvent(event, inheritedDate = "") {
  if (!event) return null;

  const name = eventName(event);
  const dateString = eventDateString(
    event.dateString || event.ad || event.gregorianDate || event.date,
    inheritedDate
  );

  if (!name || !isValidDateKey(dateString)) return null;

  const safeId =
    (typeof event === "object" && event.id) ||
    `${String(name).toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${dateString}`;

  return {
    ...(typeof event === "object" && event || {}),
    id: String(safeId),
    name,
    dateString,
    date: parseLocalDate(dateString),
    icon: toDisplayText(event?.icon) || "🎊",
    category: toDisplayText(event?.category ?? event?.type) || "Nepali calendar observance",
    description:
      toDisplayText(event?.description ?? event?.details) ||
      "Festival or observance listed in the Nepali calendar.",
    status: toDisplayText(event?.status) || (event?.verified ? "Verified listing" : "Calendar listing"),
    source: toDisplayText(event?.source) || "Trisambat calendar"
  };
}

// Trisambat's annual feed may be an array of dated events, a day list with
// nested events, or a date-keyed object. Normalize each shape at this boundary.
export function getAnnualCalendarEvents(payload) {
  if (!payload) return [];
  const records = [];
  const addRecord = (record, inheritedDate = "") => {
    if (!record) return;
    if (Array.isArray(record)) {
      record.forEach(item => addRecord(item, inheritedDate));
      return;
    }
    if (typeof record === "string") {
      const normalized = normalizeCalendarEvent(record, inheritedDate);
      if (normalized) records.push(normalized);
      return;
    }
    if (typeof record !== "object") return;
    const date = eventDateString(record.ad || record.dateString || record.gregorianDate || record.date, inheritedDate);
    const nested = record.events || record.holidays || record.observances;
    if (nested) addRecord(nested, date);
    const normalized = normalizeCalendarEvent(record, date);
    if (normalized) records.push(normalized);
    if (!nested) {
      Object.entries(record).forEach(([key, value]) => {
        const keyedDate = /^\d{4}-\d{2}-\d{2}$/.test(key) ? key : date;
        if (value && typeof value === "object") addRecord(value, keyedDate);
      });
    }
  };
  if (Array.isArray(payload)) {
    addRecord(payload);
  } else {
    addRecord(
      payload.holidays ||
      payload.events ||
      payload.data ||
      payload.days ||
      payload
    );
  }

  return [...new Map(
    records.map(event => [
      `${event.dateString}|${event.name.toLocaleLowerCase()}`,
      event,
    ])
  ).values()].sort((a, b) => a.date - b.date || a.name.localeCompare(b.name));
}
export function preferIndividualTiharDays(events = []) {
  const specificPattern = /kaag|kag tihar|crow tihar|kukur|dog tihar|gai tihar|cow tihar|goru tihar|govardhan|mha puja|bhai tika|kija puja|काग तिहार|कुकुर तिहार|गाई तिहार|गोरु तिहार|गोवर्धन|म्ह पूजा|भाइटीका/i;
  const yearsWithDayEntries = new Set(
    events
      .filter(event => specificPattern.test(String(event?.name || "")))
      .map(event => String(event.dateString || "").slice(0, 4))
  );
  return events.filter(event => {
    const name = String(event?.name || "").trim();
    const year = String(event?.dateString || "").slice(0, 4);
    const isGenericTihar = /^tihar(?: festival)?$/i.test(name) || /^तिहार$/.test(name);
    return !(isGenericTihar && yearsWithDayEntries.has(year));
  });
}
export function getFestivalOccurrences(year) {
  return festivalDates.flatMap(festival => {
    const occurrence = festival.dates[year];
    if (!occurrence?.date) return [];
    return [{
      ...festival,
      year: Number(year),
      date: parseLocalDate(occurrence.date),
      dateString: occurrence.date,
      label: occurrence.label,
      status: occurrence.status
    }];
  }).sort((a, b) => a.date - b.date);
}
export function getAllFestivalOccurrences() {
  return festivalDates.flatMap(festival => Object.entries(festival.dates).map(([year, occurrence]) => ({
    ...festival,
    year: Number(year),
    date: parseLocalDate(occurrence.date),
    dateString: occurrence.date,
    label: occurrence.label,
    status: occurrence.status
  }))).sort((a, b) => a.date - b.date);
}
export function getNepaliDayLabel(day) {
  const localizedLabel = toDisplayText(day?.text?.bs?.ne);
  if (localizedLabel) return localizedLabel;

  if (!day?.bs) return "BS date unavailable";

  const dayNumber = toDisplayText(day.bs.day);
  const monthNumber = Number(day.bs.month);
  const monthName = BS_MONTHS[monthNumber - 1] || "";
  const year = toDisplayText(day.bs.year);

  return [dayNumber, monthName, year].filter(Boolean).join(" ");
}

export function getTithiLabel(day) {
  return (
    toDisplayText(day?.text?.tithi?.en) ||
    toDisplayText(day?.text?.tithi?.ne) ||
    toDisplayText(day?.text?.ns?.en) ||
    toDisplayText(day?.ns?.tithiName) ||
    null
  );
}

export function getPakshaLabel(day) {
  const paksha = toDisplayText(day?.ns?.paksha);
  if (!paksha) return null;

  return (
    {
      shukla: "Shukla Paksha",
      krishna: "Krishna Paksha",
    }[paksha.toLowerCase()] || paksha
  );
}
export function getEventsForDay(day) {
  if (!Array.isArray(day?.events)) return [];
  return day.events.map(event => normalizeCalendarEvent(event, day.ad)).filter(Boolean);
}

// Panchanga is read directly from the selected Trisambat day record.
// Trisambat day objects document tithi, paksha, sunrise and sunset; no second API is used.
export async function fetchTrisambatFestivalEvents(years = []) {
  const uniqueYears = [...new Set(years.map(Number).filter(Number.isInteger))];
  // The annual feed is the primary list. Also read Kartik's daily events from
  // the same API so each Tihar observance (Kaag, Kukur, Gai/Laxmi, Govardhan/Mha,
  // Bhai Tika) is included even if an annual holiday summary groups them.
  const requests = uniqueYears.flatMap(year => [
    fetchBsHolidays(year).then(getAnnualCalendarEvents),
    fetchBsMonth(year, 7).then(month =>
      Array.isArray(month?.days)
        ? month.days.flatMap(getEventsForDay)
        : []
    ),
  ]);
  const responses = await Promise.allSettled(requests);
  const events = responses.flatMap(result => result.status === "fulfilled" ? result.value : []);
  const unique = [
    ...new Map(
      events.map(event => [
        `${event.dateString}|${event.name.toLocaleLowerCase()}`,
        event,
      ])
    ).values(),
  ];
  return preferIndividualTiharDays(unique).sort((a, b) => a.date - b.date || a.name.localeCompare(b.name));
}

// Offline fallback events from Utsav's own verified dataset. Used only when Trisambat
// returns nothing, and always labelled so they are not mistaken for official listings.
export function getLocalFallbackEvents() {
  const FALLBACK_STATUS = "Offline fallback date. Confirm with your local panchang.";
  const daily = calendarObservances.map(item => ({
    ...item,
    status: FALLBACK_STATUS,
    source: "Utsav offline data"
  }));
  const annual = getAllFestivalOccurrences().map(festival => ({
    id: `${festival.id}-${festival.year}`,
    name: festival.name,
    dateString: festival.dateString,
    category: festival.category,
    description: festival.description,
    icon: festival.icon,
    status: festival.status === "Published" ? FALLBACK_STATUS : `${festival.status} date. Confirm before planning.`,
    source: "Utsav offline data"
  }));
  return preferIndividualTiharDays([...daily, ...annual].map(event => normalizeCalendarEvent(event)).filter(Boolean));
}
