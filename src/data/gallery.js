const commons = filename => `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(filename)}?width=1200`;
const filePage = filename => `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(filename).replaceAll("%20", "_")}`;
export const galleryCategories = [
  "Chhath Puja",
  "Tihar",
  "Traditional Rituals",
  "Traditional Food",
  "Cultural Heritage",
  "Rangoli & Decorations"
];
const entries = [
  [
    "Chhath Puja",
    "Sunrise arghya",
    "Chhat Puja at Inaruwa 01.jpg",
    "Devotees gather at the water's edge for Chhath offerings."
  ],
  [
    "Chhath Puja",
    "Chhath at the ghat",
    "Chhath festival at Gangasagar, Janakpur 20221031.jpg",
    "A festival gathering at Gangasagar in Janakpur, Nepal."
  ],
  [
    "Chhath Puja",
    "Offerings for the Sun",
    "Chaath festivals offerings to god in Hakpara Siraha Nepal.jpg",
    "Traditional offerings prepared for the Chhath observance in Siraha."
  ],
  [
    "Chhath Puja",
    "Devotion by the river",
    "Celebrating Chhath in Kataiya, Saptari by giving Argha to Sun God.jpg",
    "A Chhath arghya ceremony in Kataiya, Saptari."
  ],
  [
    "Chhath Puja",
    "Thekua prasad",
    "Thekua.jpg",
    "Thekua, a traditional offering prepared for Chhath Puja."
  ],
  [
    "Tihar",
    "A home lit for Tihar",
    "2018 Dipawali in Biratnagar.jpg",
    "Festival lights illuminate Biratnagar during Tihar."
  ],
  [
    "Tihar",
    "Lighting the traditional diya",
    "Sister lighting traditional lamp during Tihar festival.jpg",
    "A woman lights a traditional oil lamp during Tihar in Nepal."
  ],
  [
    "Tihar",
    "Bhai Tika blessings",
    "Bhai tika Tihar.jpg",
    "A mandala made for the Bhai Tika celebration."
  ],
  [
    "Tihar",
    "Seven-colour tika",
    "Tihar Tika.jpg",
    "The colourful tika applied during the Bhai Tika ritual."
  ],
  [
    "Tihar",
    "Kukur Tihar blessings",
    "Kukur Tihar( Where we worship Dogs).jpg",
    "Dogs are honoured with tika and flower garlands during Kukur Tihar.",
    "Alish Bhandarii",
    "CC BY-SA 4.0"
  ],
  [
    "Traditional Rituals",
    "Sacred worship",
    "Chhat puja in Lalitpur. (21967).jpg",
    "A traditional Chhath worship scene in Lalitpur."
  ],
  [
    "Traditional Rituals",
    "Morning prayers",
    "Morning worship of Chhath.jpg",
    "Devotees offer prayers during the morning observance."
  ],
  [
    "Traditional Rituals",
    "A ritual offering",
    "Chhath Puja Ritual from India.jpg",
    "A traditional ritual moment from Chhath Puja."
  ],
  [
    "Traditional Rituals",
    "Puja preparations",
    "Chhath puja bedi.jpg",
    "A prepared worship space for the festival ritual."
  ],
  [
    "Traditional Rituals",
    "A moment of devotion",
    "Faith to sun god.jpg",
    "A devotee's offering as part of the Sun worship tradition."
  ],
  [
    "Traditional Food",
    "Sel roti",
    "Sel Roti (Traditional Nepali Rice Bread).jpg",
    "A ring-shaped rice bread prepared for Nepali festivals."
  ],
  [
    "Traditional Food",
    "Dal bhat tarkari",
    "Dal Bhat Tarkari 1.jpg",
    "A traditional Nepali meal of rice, lentils and vegetables."
  ],
  [
    "Traditional Food",
    "Dahi chiura",
    "Dahi Chuira – Traditional Yogurt and Flattened Rice Dish of Nepal.jpg",
    "Yogurt and beaten rice, a familiar traditional Nepali dish."
  ],
  [
    "Traditional Food",
    "Newari feast",
    "Dudh Jhāu(दुध झाउ) – Traditional Newari Yogurt Rice of Nepal.jpg",
    "A traditional Newari yogurt-and-rice preparation."
  ],
  [
    "Traditional Food",
    "Sel roti being made",
    "Cookingselroti.jpg",
    "Sel roti is shaped and fried for a festive gathering."
  ],
  [
    "Cultural Heritage",
    "Lakhe dance",
    "Lakhey dance.jpg",
    "A masked Lakhe dancer performs a traditional Newar dance."
  ],
  [
    "Cultural Heritage",
    "Jhijhiya folk dance",
    "Jhijhiya, a folk dance of Mithila.png",
    "A folk dance tradition from the Mithila region."
  ],
  [
    "Cultural Heritage",
    "Newari cultural dance",
    "Newari Traditional Dance.jpg",
    "Traditional Newari dance performed in cultural dress."
  ],
  [
    "Cultural Heritage",
    "Gai Jatra tradition",
    "Bhaktapur Gai Jatra.jpg",
    "A traditional Gai Jatra procession in Bhaktapur."
  ],
  [
    "Cultural Heritage",
    "Traditional folk dance",
    "Traditional Nepali folk dances.jpg",
    "A performance celebrating Nepal's diverse folk traditions."
  ],
  [
    "Rangoli & Decorations",
    "Nepali-style rangoli",
    "Nepali Style Rangoli.jpg",
    "A colourful rangoli design photographed in Nepal."
  ],
  [
    "Rangoli & Decorations",
    "Rangoli and lamps",
    "Rangoli and Diyas.jpg",
    "A festive floor design arranged with traditional oil lamps."
  ],
  [
    "Rangoli & Decorations",
    "Flower rangoli",
    "Flower Rangoli Diwali.jpg",
    "A floral rangoli arrangement made for a festival."
  ],
  [
    "Rangoli & Decorations",
    "Peacock rangoli",
    "Peacock Rangoli.jpg",
    "A colourful peacock-inspired rangoli design."
  ],
  [
    "Rangoli & Decorations",
    "Diwali floor decoration",
    "Floor Rangoli decoration on Diwali.jpg",
    "A decorative rangoli pattern prepared for Diwali."
  ]
];
export const galleryItems = entries.map(
  ([category, title, filename, description, attribution, license], index) => ({
    id: `gallery-${index + 1}`,
    category,
    title,
    description,
    src: commons(filename),
    sourceUrl: filePage(filename),
    sourceName: "Wikimedia Commons",
    attribution: attribution || "",
    license: license || "",
  })
);
