/* Shared site data for ColourDiam remastered site */

const DIAMOND_COLORS = [
  { name: "Black",      slug: "black",  img: "images/loosestones/Black.png",  desc: "Mysterious, bold and completely opaque fancy black diamonds." },
  { name: "Blue",       slug: "blue",   img: "images/loosestones/Blue.png",   desc: "One of nature's rarest colours, prized for its serene depth." },
  { name: "Brown",      slug: "brown",  img: "images/loosestones/Brown.png",  desc: "Chocolate and champagne hues with warm sophistication." },
  { name: "Gray",       slug: "gray",   img: "images/loosestones/Gray.png",   desc: "Cool, contemporary greys with a silvery shimmer." },
  { name: "Green",      slug: "green",  img: "images/loosestones/Green.png",  desc: "A rare botanical green caused by natural radiation exposure." },
  { name: "Orange",     slug: "orange", img: "images/loosestones/Orange.png", desc: "Sunset-orange diamonds full of fiery brilliance." },
  { name: "Pink",       slug: "pink",   img: "images/loosestones/pink.png",   desc: "Feminine, romantic and among the most coveted in the world." },
  { name: "Purple",     slug: "purple", img: "images/loosestones/Purple.png", desc: "An extraordinarily rare violet-tinged fancy colour." },
  { name: "Red",        slug: "red",    img: "images/loosestones/Red.png",    desc: "The rarest of all diamonds — only a handful ever mined." },
  { name: "Violet",     slug: "violet", img: "images/loosestones/Violet.png", desc: "Deep violet hues with an unmistakable royal presence." },
  { name: "White",      slug: "white",  img: "images/loosestones/White.png",  desc: "Classic colourless brilliance — timeless and versatile." },
  { name: "Yellow",     slug: "yellow", img: "images/loosestones/Yellow.png", desc: "Golden canary diamonds that radiate warmth and joy." }
];

const FEATURED_PRODUCTS = [
  {
    name: "Argyle Pink Diamond Ring",
    category: "Rings",
    meta: "0.58 ct · Fancy Pink · GIA",
    price: "$48,500",
    was: "$52,000",
    img: "images/banners/ring.jpg",
    badge: "Bestseller",
    url: "diamonds.html"
  },
  {
    name: "Canary Yellow Pendant",
    category: "Pendants",
    meta: "1.12 ct · Fancy Vivid Yellow · GIA",
    price: "$12,900",
    was: "$14,200",
    img: "images/banners/Pendant.jpg",
    badge: "New",
    url: "jewelry.html"
  },
  {
    name: "Blue Diamond Halo Earrings",
    category: "Earrings",
    meta: "1.40 ct TW · Fancy Blue · GIA",
    price: "$36,400",
    was: null,
    img: "images/banners/Earring.jpg",
    badge: null,
    url: "diamonds.html"
  },
  {
    name: "Champagne Diamond Bracelet",
    category: "Bracelets",
    meta: "2.65 ct TW · Fancy Brown · IGI",
    price: "$9,750",
    was: "$10,900",
    img: "images/banners/Bracelet.jpg",
    badge: "Hot",
    url: "jewelry.html"
  }
];

const TESTIMONIALS = [
  {
    text: "I'd been eyeing a fancy pink diamond for months and finally found the right one here. The ring exceeded photos — the color is even more vivid in person. Shipping to Singapore was smooth too.",
    name: "Priya M.",
    location: "Singapore"
  },
  {
    text: "Bought a yellow diamond pendant as an anniversary gift. My wife hasn't taken it off since. The certification paperwork gave me total peace of mind about authenticity.",
    name: "James Carter",
    location: "London, UK"
  },
  {
    text: "What stood out was the personal attention — someone actually walked me through clarity and cut differences over a video call before I committed to my earrings.",
    name: "Natcha S.",
    location: "Bangkok, Thailand"
  },
  {
    text: "I collect colored stones and was skeptical about buying loose diamonds online. ColourDiam's GIA certs matched exactly what was described. Will be back for a blue diamond next.",
    name: "David Lindqvist",
    location: "Stockholm, Sweden"
  },
  {
    text: "The custom design process for my engagement ring took about three weeks start to finish. They sent progress photos at each stage, which I really appreciated.",
    name: "Ananya R.",
    location: "Mumbai, India"
  },
  {
    text: "Ordered a bracelet for my mother's birthday — arrived beautifully packaged and right on schedule. The brown diamond setting is exactly the warm tone we wanted.",
    name: "Michael Tan",
    location: "Kuala Lumpur, Malaysia"
  }
];

/* Sample inventory for the diamonds listing page */
const DIAMOND_INVENTORY = [
  { id: 1, color: "Pink", shape: "Oval", carat: 0.58, clarity: "VS1", intensity: "Fancy Pink", lab: "GIA", price: "$48,500", img: "images/loosestones/pink.png" },
  { id: 2, color: "Yellow", shape: "Cushion", carat: 1.12, clarity: "VS2", intensity: "Fancy Vivid Yellow", lab: "GIA", price: "$12,900", img: "images/loosestones/Yellow.png" },
  { id: 3, color: "Blue", shape: "Radiant", carat: 0.74, clarity: "SI1", intensity: "Fancy Blue", lab: "GIA", price: "$36,400", img: "images/loosestones/Blue.png" },
  { id: 4, color: "Brown", shape: "Round", carat: 2.65, clarity: "SI2", intensity: "Fancy Brown", lab: "IGI", price: "$9,750", img: "images/loosestones/Brown.png" },
  { id: 5, color: "Green", shape: "Pear", carat: 0.92, clarity: "VS2", intensity: "Fancy Green", lab: "GIA", price: "$22,800", img: "images/loosestones/Green.png" },
  { id: 6, color: "Orange", shape: "Emerald", carat: 1.05, clarity: "VVS1", intensity: "Fancy Orange", lab: "GIA", price: "$18,600", img: "images/loosestones/Orange.png" },
  { id: 7, color: "Purple", shape: "Marquise", carat: 0.44, clarity: "VS1", intensity: "Fancy Purple", lab: "CGL", price: "$30,200", img: "images/loosestones/Purple.png" },
  { id: 8, color: "Red", shape: "Round", carat: 0.21, clarity: "IF", intensity: "Fancy Red", lab: "GIA", price: "$96,000", img: "images/loosestones/Red.png" },
  { id: 9, color: "Violet", shape: "Pear", carat: 0.63, clarity: "VS2", intensity: "Fancy Deep Violet", lab: "GIA", price: "$41,700", img: "images/loosestones/Violet.png" },
  { id: 10, color: "White", shape: "Round", carat: 1.50, clarity: "VVS2", intensity: "D Colour", lab: "GIA", price: "$14,200", img: "images/loosestones/White.png" },
  { id: 11, color: "Gray", shape: "Oval", carat: 0.88, clarity: "VS1", intensity: "Fancy Gray", lab: "IGI", price: "$8,400", img: "images/loosestones/Gray.png" },
  { id: 12, color: "Black", shape: "Cushion", carat: 3.10, clarity: "SI1", intensity: "Fancy Black", lab: "GIA", price: "$6,950", img: "images/loosestones/Black.png" },
  { id: 13, color: "Pink", shape: "Round", carat: 0.36, clarity: "VS2", intensity: "Fancy Intense Pink", lab: "Argyle", price: "$39,800", img: "images/loosestones/pink.png" },
  { id: 14, color: "Yellow", shape: "Radiant", carat: 2.02, clarity: "SI1", intensity: "Fancy Yellow", lab: "GIA", price: "$15,500", img: "images/loosestones/Yellow.png" },
  { id: 15, color: "Blue", shape: "Cushion", carat: 0.95, clarity: "VS1", intensity: "Fancy Intense Blue", lab: "GIA", price: "$88,000", img: "images/loosestones/Blue.png" },
  { id: 16, color: "Pink", shape: "Pear", carat: 0.72, clarity: "VVS2", intensity: "Fancy Pink", lab: "GIA", price: "$54,300", img: "images/loosestones/pink.png" }
];

const JEWELRY_INVENTORY = [
  { name: "Argyle Pink Solitaire Ring", category: "Rings", color: "Pink", price: "$48,500", img: "images/banners/ring.jpg", badge: "Bestseller" },
  { name: "Canary Yellow Pendant", category: "Pendants", color: "Yellow", price: "$12,900", img: "images/banners/Pendant.jpg", badge: "New" },
  { name: "Blue Halo Drop Earrings", category: "Earrings", color: "Blue", price: "$36,400", img: "images/banners/Earring.jpg", badge: null },
  { name: "Champagne Tennis Bracelet", category: "Bracelets", color: "Brown", price: "$9,750", img: "images/banners/Bracelet.jpg", badge: "Hot" },
  { name: "Emerald Green Diamond Necklace", category: "Necklaces", color: "Green", price: "$22,800", img: "images/banners/Necklace.jpg", badge: null },
  { name: "Violet Diamond Cocktail Ring", category: "Rings", color: "Violet", price: "$41,700", img: "images/banners/ring.jpg", badge: "Rare" },
  { name: "Canary Stud Earrings", category: "Earrings", color: "Yellow", price: "$6,400", img: "images/banners/Earring.jpg", badge: null },
  { name: "White Diamond Eternity Band", category: "Rings", color: "White", price: "$4,800", img: "images/banners/ring.jpg", badge: null }
];
