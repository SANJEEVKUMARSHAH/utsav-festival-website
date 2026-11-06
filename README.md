# Utsav: Our Culture, Our Light

Utsav is a cultural festival platform for Nepal. Visitors can find Chhath ghats, explore Tihar, design a rangoli, read the festival rituals, browse a photo gallery, write festival wishes, follow a Nepali calendar and count down to the next festival.

Built with React, Vite, React Router, Tailwind CSS and Lucide icons.

## Pages

| Route | Page |
| --- | --- |
| `/` | Home |
| `/chhath` | Chhath Explorer |
| `/tihar` | Tihar Explorer |
| `/rangoli-studio` | Rangoli Studio |
| `/wishes` | Festival Wishes |
| `/ritual-guide` | Ritual Guide |
| `/gallery` | Festival Gallery (30 photographs from Wikimedia Commons) |
| `/calendar` | Festival Calendar (Bikram Sambat and Gregorian) |
| `/countdown` | Festival Countdown |
| `/about` | Our Story |

Any other address shows a 404 page.

## Run it

You need [Node.js](https://nodejs.org) 18 or newer.

```bash
npm install
npm run dev        # development server, usually http://localhost:5173
npm run build      # production build in dist/
npm run preview    # serve the production build locally
```

## Configuration

Copy `.env.example` to `.env` only if you need to change a setting. **No API key or secret is needed.**

| Variable | Purpose |
| --- | --- |
| `VITE_TRISAMBAT_API_BASE` | Optional. Base address of the Trisambat Nepali calendar service. Defaults to `https://trisambat.com/api/v1`. |

Anything beginning with `VITE_` is visible in the browser, so never put a private key in it.

## How the calendar and countdown get their data

```text
Trisambat  ->  src/utils/festivalCalendar.js  ->  Calendar page
                (requests, validation,        ->  Countdown page
                 caching, normalising)
                        |
            if Trisambat is unavailable
                        v
   src/data/festivals.js + src/data/calendarObservances.js
```

- All requests go through `src/utils/festivalCalendar.js`. Components never call the API directly.
- Requests time out after 10 seconds and share in-flight requests. Month and holiday data are cached for 12 hours; the changing `today` endpoint is cached for one minute and checked against Kathmandu's current date.
- Event names, dates and other fields are checked and converted to safe text before use, so an unexpected response cannot crash a page.
- If Trisambat fails, the calendar stays usable: it shows Gregorian dates, a clear message, a **Retry** button and Utsav's own festival data, labelled as an offline fallback. Fallback dates are never presented as official.
- The countdown and the calendar both use the same service and the same local data.

### Update festival dates

Edit `src/data/festivals.js` (festival dates) and `src/data/calendarObservances.js` (day-by-day Tihar observances). Only mark dates as `Published` when confirmed by a reliable Nepali calendar source. Future estimates must remain clearly marked `Expected` and should be checked again when the official calendar is released.

## Code style

Handwritten JavaScript, JSX and CSS use a consistent two-space indentation style and readable multiline structures. `.editorconfig` supplies the editor defaults. Keep JSX, object literals, arrays, and CSS declarations expanded enough to avoid unnecessary horizontal scrolling.

## Project structure

```text
src/
├── main.jsx, App.jsx        Entry point and routes
├── components/              Header, Footer, Eyebrow, ScrollTop, RouteErrorBoundary
├── pages/                   One file per route (Rangoli Studio has its own folder)
├── data/                    Festival, gallery, ritual, city and wish content
├── utils/festivalCalendar.js   Calendar data service
├── hooks/useCountdown.js
└── styles/
    ├── index.css            Site-wide styles
    ├── phase2.css           Festival feature pages
    └── responsive.css       Touch targets, focus styles, small-screen fixes, 404 page
```

## Deploying

This is a single-page app. Static hosts must send every address to `index.html`, or opening or refreshing a page such as `/calendar` will show the host's 404 page. `npm run dev` and `npm run preview` already do this. Add the equivalent rewrite rule on your host.

## Known limitations

- Trisambat's public API documentation was checked during this review. It is a beta service, has no uptime guarantee, and is not an official government calendar. Confirm important religious dates with the official Panchanga or Government of Nepal.
- Trisambat asks websites using its data to show a visible link back to `trisambat.com`; Utsav now displays this attribution on the Calendar and Countdown pages.
- Gallery photographs load from Wikimedia Commons and need an internet connection. Check each photo's author and licence on its Commons page before commercial use.
- Offline festival dates are a limited safety net, not a complete official calendar. Some future entries are marked "Expected" and must be confirmed before planning.

## Credits

Calendar data: Trisambat. Photographs: Wikimedia Commons contributors. Icons: [Lucide](https://lucide.dev). Designed and built by Sanjeev Kumar Shah.
