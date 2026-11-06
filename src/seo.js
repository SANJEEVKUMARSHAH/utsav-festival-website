export const SITE_URL = 'https://utsavnepal.vercel.app';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/assets/images/utsav-social-preview.png`;
export const routeSeo = {
  "/": {
    "title": "Utsav – Explore Nepali Festivals, Culture and Traditions",
    "description": "Discover Nepali festivals, culture and traditions with Utsav. Explore Chhath Puja, Tihar, rituals, rangoli, festival dates and cultural stories.",
    "breadcrumb": "Home"
  },
  "/chhath": {
    "title": "Chhath Explorer – Chhath Puja Ghats, Rituals and Traditions | Utsav",
    "description": "Explore Chhath Puja traditions, reported celebration locations, ghats and practical guidance for communities across Nepal and India.",
    "breadcrumb": "Chhath Explorer",
    "image": `${SITE_URL}/assets/images/utsav-chhath-preview.png`
  },
  "/tihar": {
    "title": "Tihar Festival – Five Days, Traditions and Meaning | Utsav",
    "description": "Discover the five days of Tihar in Nepal, the meaning behind its rituals, the stories of family and gratitude, and the festival of lights.",
    "breadcrumb": "Tihar",
    "image": `${SITE_URL}/assets/images/utsav-tihar-preview.png`
  },
  "/rangoli-studio": {
    "title": "Rangoli Studio – Create Your Own Festival Rangoli | Utsav",
    "description": "Create colourful rangoli designs with Utsav's interactive Rangoli Studio. Explore patterns, colours and creative ways to celebrate festival traditions.",
    "breadcrumb": "Rangoli Studio"
  },
  "/calendar": {
    "title": "Nepali Calendar – Festival Dates and Observances | Utsav",
    "description": "Explore the Nepali calendar, festival dates and cultural observances with Utsav. View dates and plan around celebrations throughout the year.",
    "breadcrumb": "Nepali Calendar"
  },
  "/wishes": {
    "title": "Festival Wishes – Create and Share Greeting Cards | Utsav",
    "description": "Design personalised Chhath Puja and Tihar greeting cards with Utsav. Customise your festival wishes and share them as text or PNG images.",
    "breadcrumb": "Festival Wishes"
  },
  "/gallery": {
    "title": "Nepali Festival Gallery – Culture, Rituals and Celebrations | Utsav",
    "description": "Explore photographs of Nepali festivals, rituals, colours, food and cultural moments in the Utsav festival gallery.",
    "breadcrumb": "Festival Gallery"
  },
  "/ritual-guide": {
    "title": "Festival Ritual Guide – Chhath Puja and Tihar | Utsav",
    "description": "Learn about the meaning, common practices and traditions of Chhath Puja and Tihar with Utsav's festival ritual guide.",
    "breadcrumb": "Ritual Guide"
  },
  "/about": {
    "title": "About Utsav – Our Culture, Our Light",
    "description": "Learn about Utsav, a digital celebration of Nepali festivals, living traditions, cultural discovery and creativity, designed and built by Sanjeev Kumar Shah.",
    "breadcrumb": "About Utsav"
  },
  "/countdown": {
    "title": "Festival Countdown – Upcoming Nepali Festivals | Utsav",
    "description": "Keep track of upcoming Nepali festivals and cultural celebrations with Utsav's festival countdown.",
    "breadcrumb": "Festival Countdown"
  }
};

export function getSeoForPath(pathname = '/') {
  const cleanPath = pathname.replace(/\/+$/, '') || '/';
  return routeSeo[cleanPath] || {
    title: 'Page not found | Utsav',
    description: 'The page you are looking for could not be found on Utsav.',
    breadcrumb: 'Page not found',
    noindex: true,
  };
}
