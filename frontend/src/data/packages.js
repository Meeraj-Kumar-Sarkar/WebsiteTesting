export const packages = [
  {
    id: "spiti-circuit-expedition",
    slug: "spiti-circuit-expedition",
    name: "Spiti Valley High Desert Expedition",
    destinationId: "himachal-pradesh",
    destinationName: "Himachal Pradesh",
    duration: "9 Days / 8 Nights",
    durationDays: 9,
    startingPrice: 38500, // Demo illustrative price
    tripType: "Adventure",
    label: "Popular",
    featured: true,
    coverImage: "https://images.unsplash.com/photo-1597074866923-dc0589150358?auto=format&fit=crop&w=1200&q=80",
    heroImage: "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=1920&q=85",
    shortOverview: "Traverse high mountain passes, explore ancient cliffside monasteries, and camp under milky-way skies at Chandratal.",
    overview: "Journey into the rugged cold desert of Spiti through Shimla, Kinnaur, and Kaza, returning via the majestic Kunzum and Atal Tunnels. This legendary overland circuit leads you through dramatic gorges, the world's highest post office at Hikkim, fossil villages in Langza, and the mystical 1,000-year-old Key Gompa. Tailored with dedicated local mountain drivers and cozy handpicked boutique stays.",
    highlights: [
      "Key Gompa monastery blessing with local butter tea",
      "Send a postcard from Hikkim (4,440m), the highest post office on Earth",
      "Stargazing and luxury dome camping by Chandratal Lake",
      "Drive through the dramatic cliff road carved into the Sangla valley rock",
      "Scenic crossing of Kunzum Pass (4,551m) with prayer flags"
    ],
    accommodationOptions: [
      {
        tier: "3-star",
        name: "Standard Heritage & Homestays",
        priceMultiplier: 1.0,
        pricePerPerson: 38500,
        available: true,
        features: [
          "Curated authentic local homestays & 3-star mountain guesthouses",
          "Private en-suite heated bathrooms where supported",
          "Hearty traditional home-cooked Himalayan meals",
          "Clean electric blankets and hot water bottles"
        ],
        description: "Focuses on deep cultural immersion with warm Spitian families, traditional wood-stove heating (bukhari), and clean, authentic family-run retreats."
      },
      {
        tier: "4-star",
        name: "Premium Boutique Eco-Lodges",
        priceMultiplier: 1.35,
        pricePerPerson: 51900,
        available: true,
        features: [
          "Best boutique hotels in Kaza, Tabo, and Kalpa (e.g. Grand Dew, Echor)",
          "24/7 central/radiator room heating & reliable running hot water",
          "Deluxe Swiss alpine tents at Chandratal with attached washrooms",
          "Gourmet multi-cuisine dining showcasing organic regional produce"
        ],
        description: "Combines high mountain scenery with elevated comfort, reliable heating, plush duvets, and breathtaking private balcony vistas."
      },
      {
        tier: "5-star",
        name: "Ultra-Luxury Himalayan Retreats",
        priceMultiplier: 1.8,
        pricePerPerson: 69300,
        available: false,
        unavailableReason: "5-star luxury chain hotels are not ecologically viable in the remote Spiti high desert. We recommend our 4-star Premium Boutique tier for the highest standard available.",
        features: [],
        description: "Not available in this fragile high-altitude desert zone to preserve regional sustainability."
      }
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival in Shimla & Drive to Narkanda",
        description: "Meet your expedition guide in Shimla. Drive uphill past cedar woodlands and apple orchards to the peaceful hamlet of Narkanda. Acclimatize with a gentle stroll to Hatu Peak for evening sunset views over the snow line.",
        meals: "Dinner Included",
        stay: "Mountain Lodge, Narkanda"
      },
      {
        day: 2,
        title: "Narkanda to Sangla Valley (Kinnaur)",
        description: "Descend into the roaring Sutlej valley and follow the Indo-Tibetan highway. Trace the granite cliffs into the fairy-tale Sangla Valley, known for wooden houses, walnut trees, and the Baspa River.",
        meals: "Breakfast & Dinner",
        stay: "Riverside Camp / Boutique Hotel, Sangla"
      },
      {
        day: 3,
        title: "Chitkul Border Village & Transfer to Kalpa",
        description: "Visit Chitkul, the last inhabited village on the Indo-Tibetan border. Walk through ancient stone houses and alongside turquoise riverbanks. Later, drive to Kalpa facing the sacred Kinner Kailash massif.",
        meals: "Breakfast & Dinner",
        stay: "Heritage Hotel, Kalpa"
      },
      {
        day: 4,
        title: "Kalpa to Nako & Tabo Monastery",
        description: "Enter the stark Trans-Himalayan rain shadow. Stop at the calm glacial waters of Nako Lake. Arrive in Tabo to explore its 10th-century mud-brick monastery, known as the Ajanta of the Himalayas.",
        meals: "Breakfast & Dinner",
        stay: "Eco Guest House, Tabo"
      },
      {
        day: 5,
        title: "Dhankar Fort-Monastery to Kaza",
        description: "Ascend to the cliffside Dhankar Gompa perched precariously above the confluence of Spiti and Pin rivers. Short optional hike to Dhankar Lake before continuing to Kaza, the capital of Spiti.",
        meals: "Breakfast & Dinner",
        stay: "Boutique Hotel, Kaza"
      },
      {
        day: 6,
        title: "High Villages of Spiti: Key, Kibber, Langza & Hikkim",
        description: "An unforgettable exploration of high altitude settlements. Visit the majestic fortress-like Key Monastery. Hunt for millions-of-years-old marine fossils in Langza and mail hand-written postcards from Hikkim post office at 4,440m.",
        meals: "Breakfast & Dinner",
        stay: "Boutique Hotel, Kaza"
      },
      {
        day: 7,
        title: "Kaza to Chandratal Lake via Kunzum Pass",
        description: "Ascend to Kunzum Pass (4,551m) to pay homage at the Kunzum Mata shrine. Trek the last 1.5 km to the pristine crescent-shaped moon lake of Chandratal. Mesmerizing reflections and starry night skies.",
        meals: "Breakfast & Dinner",
        stay: "Glamping Dome / Swiss Tents, Chandratal"
      },
      {
        day: 8,
        title: "Chandratal to Manali via Atal Tunnel",
        description: "Navigate the rugged boulders of the Batal-Gramphu trail before seamlessly entering the engineering marvel of the Atal Tunnel. Emerge into the lush, green Kullu Valley and check into your Manali resort.",
        meals: "Breakfast & Dinner",
        stay: "Orchard Resort, Manali"
      },
      {
        day: 9,
        title: "Manali Leisure & Departure",
        description: "Morning stroll through Old Manali's cedar forests and Hadimba Temple. Departure transfer to Kullu Bhuntar Airport or Chandigarh with lasting Himalayan memories.",
        meals: "Breakfast Included",
        stay: "End of Tour"
      }
    ],
    inclusions: [
      "Private sanitized 4x4 / high-clearance SUV with certified Himalayan driver",
      "8 nights handpicked accommodation as per selected category",
      "Daily wholesome mountain breakfasts and regional dinners",
      "Inner Line Permits and green cess for Spiti & Kinnaur",
      "Experienced local English/Hindi-speaking trip leader & naturalist",
      "Medical first-aid kit with portable oxygen cylinder and oximeter",
      "All toll taxes, parking fees, and driver allowances"
    ],
    exclusions: [
      "Airfare / train tickets to and from Shimla / Chandigarh / Manali",
      "Lunches and individual cafe visits in towns",
      "Personal travel insurance (mandatory for high altitude travel)",
      "Monument and monastery entry fees (minimal local contributions)",
      "Personal expenses such as laundry, phone calls, and tips"
    ],
    importantNotes: [
      "Acclimatization is essential: Drink plenty of water and avoid strenuous sprints on the first 48 hours.",
      "Cash is essential: ATMs beyond Rampur are notoriously intermittent.",
      "Mobile networks: Only BSNL / Jio postpaid connectivity works intermittently in Spiti.",
      "Please respect local cultural customs when visiting monasteries and sacred lakes."
    ]
  },
  {
    id: "kashmir-paradise-sojourn",
    slug: "kashmir-paradise-sojourn",
    name: "Kashmir: Valleys, Houseboats & Chinar",
    destinationId: "jammu-and-kashmir",
    destinationName: "Jammu & Kashmir",
    duration: "7 Days / 6 Nights",
    durationDays: 7,
    startingPrice: 32500,
    tripType: "Honeymoon",
    label: "Bestseller",
    featured: true,
    coverImage: "https://images.unsplash.com/photo-1566837945700-30057527ade0?auto=format&fit=crop&w=1200&q=80",
    heroImage: "https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=1920&q=85",
    shortOverview: "Wake to shikara bells on Nigeen Lake, walk through Gulmarg's alpine meadows, and discover Pahalgam's Lidder valley.",
    overview: "Experience the timeless serenity of the Kashmir Valley. Sail into serene lotus waters at dawn on a private Shikara, spend quiet evenings in historic cedar houseboats, ascend to the snow-fields of Apharwat ridge in Gulmarg, and unwind in secluded pine cottages in Pahalgam. Carefully designed for discerning travelers looking for poetic romance, heritage craft, and peaceful nature walks.",
    highlights: [
      "Exclusive vintage cedar wood houseboat stay on serene Nigeen Lake",
      "Phase 1 & Phase 2 cable car Gondola ride in Gulmarg to 3,950m",
      "Private dawn Shikara ride through floating vegetable and flower markets",
      "Picnic by the cascading Lidder River in Aru Valley & Betaab Valley",
      "Guided walk through Old Srinagar craft quarters: Pashmina and walnut carvers"
    ],
    accommodationOptions: [
      {
        tier: "3-star",
        name: "Comfort Heritage Stays",
        priceMultiplier: 1.0,
        pricePerPerson: 32500,
        available: true,
        features: [
          "Super Deluxe Houseboat on Dal Lake with carved walnut woodwork",
          "3-star boutique hotels in Gulmarg & Pahalgam with scenic views",
          "Electric heated mattress pads and central dining hall",
          "Traditional Kashmiri Wazwan tasting dinner"
        ],
        description: "Charming traditional properties providing authentic Kashmiri hospitality, warm kehwa tea, and reliable amenities."
      },
      {
        tier: "4-star",
        name: "Premium Luxury Resorts",
        priceMultiplier: 1.45,
        pricePerPerson: 47125,
        available: true,
        features: [
          "Luxury Heritage Houseboat on quieter Nigeen Lake with private butler",
          "4-star mountain chalets (e.g. Heevan Retreat Gulmarg / Pahalgam Hotel)",
          "Central heating throughout all properties and plush spring beds",
          "Panoramic garden balconies overlooking snow peaks and pine forests"
        ],
        description: "Refined comfort with serene locations, heated suites, wood-panelled dining rooms, and attentive personalized service."
      },
      {
        tier: "5-star",
        name: "Signature Khyber & Heritage Palaces",
        priceMultiplier: 2.3,
        pricePerPerson: 74750,
        available: true,
        features: [
          "The Khyber Himalayan Resort & Spa (Gulmarg) / Vivanta Dal View",
          "World-class L'Occitane spa vouchers and heated indoor swimming pool",
          "Chauffeured luxury Mercedes / Innova Crysta throughout",
          "Private curated Wazwan feast with royal master chefs"
        ],
        description: "The pinnacle of Himalayan luxury, featuring internationally celebrated resort stays, world-class spas, and sublime gastronomic experiences."
      }
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival in Srinagar & Nigeen Lake Shikara",
        description: "Welcome to Srinagar. Transfer to a luxury cedar wood houseboat on quiet Nigeen Lake. Savor traditional saffron Kahwa before embarking on a sunset Shikara ride across lotus channels.",
        meals: "Dinner Included",
        stay: "Heritage Houseboat, Nigeen Lake"
      },
      {
        day: 2,
        title: "Dawn Floating Market & Mughal Heritage",
        description: "Wake early for a magical Shikara excursion to the dawn floating vegetable bazaar. In the afternoon, visit Nishat Bagh and Shalimar Bagh, grand gardens designed by Emperor Jahangir.",
        meals: "Breakfast & Dinner",
        stay: "Heritage Houseboat, Srinagar"
      },
      {
        day: 3,
        title: "Srinagar to Gulmarg Alpine Meadow",
        description: "Drive through willow and apple orchards to Gulmarg (2,650m). Board the famous Gulmarg Gondola rising up to Kongdoori and Apharwat Peak for breathtaking views of the Pir Panjal range.",
        meals: "Breakfast & Dinner",
        stay: "Resort Hotel, Gulmarg"
      },
      {
        day: 4,
        title: "Gulmarg to Pahalgam (Valley of Shepherds)",
        description: "Scenic drive passing saffron fields of Pampore and walnut wood carving hamlets of Avantipur. Arrive in Pahalgam along the roaring emerald Lidder River.",
        meals: "Breakfast & Dinner",
        stay: "Riverside Resort, Pahalgam"
      },
      {
        day: 5,
        title: "Pahalgam Valleys: Aru, Betaab & Baisaran",
        description: "Excursion to pristine Aru Valley, starting point for high alpine treks. Explore Betaab Valley's weeping willows and enjoy a pony ride or leisurely pine forest walk through Baisaran meadow.",
        meals: "Breakfast & Dinner",
        stay: "Riverside Resort, Pahalgam"
      },
      {
        day: 6,
        title: "Pahalgam to Srinagar & Old Town Walk",
        description: "Return to Srinagar. Enjoy an afternoon curated walk through the Old City: historic wooden Jamia Masjid with 378 deodar pillars, spice alleys, and master artisan carpet looms.",
        meals: "Breakfast & Dinner",
        stay: "Boutique Hotel, Srinagar"
      },
      {
        day: 7,
        title: "Farewell to Srinagar",
        description: "Relaxed breakfast overlooking the garden. Transfer to Srinagar Sheikh-ul-Alam International Airport with unforgettable valley memories.",
        meals: "Breakfast Included",
        stay: "End of Tour"
      }
    ],
    inclusions: [
      "Airport transfers and all sightseeing in dedicated private AC Innova",
      "2 nights luxury houseboat + 4 nights premier hotel accommodations",
      "Daily breakfast and four-course dinner included",
      "2 Shikara rides (sunset ride + dawn floating market excursion)",
      "Gulmarg Gondola Phase 1 & 2 tickets pre-reserved",
      "Local union vehicle in Pahalgam for Aru & Betaab Valleys",
      "All driver charges, state permits, and toll taxes"
    ],
    exclusions: [
      "Domestic air tickets to/from Srinagar",
      "Lunches and beverages outside set meals",
      "Horse/pony rides in Gulmarg and Baisaran (payable directly)",
      "Camera fees and entrance to Mughal gardens",
      "Personal tips and travel insurance"
    ],
    importantNotes: [
      "Gulmarg Gondola slots are subject to weather conditions and tickets must be finalized well in advance.",
      "Prepaid mobile sims from outside J&K do not function; please carry a postpaid connection.",
      "Winter visits (Dec–Mar) require heavy snow boots and woollens, available for rent locally."
    ]
  },
  {
    id: "uttarakhand-meadows-and-shrines",
    slug: "uttarakhand-meadows-and-shrines",
    name: "Valley of Flowers & Sacred Bugyals",
    destinationId: "uttarakhand",
    destinationName: "Uttarakhand",
    duration: "7 Days / 6 Nights",
    durationDays: 7,
    startingPrice: 28900,
    tripType: "Leisure",
    label: "Seasonal",
    featured: true,
    coverImage: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=1200&q=80",
    heroImage: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1920&q=85",
    shortOverview: "Walk among endemic alpine wildflowers in a UNESCO World Heritage valley and gaze upon sacred snow peaks.",
    overview: "Trek into one of nature's grandest botanical wonders. Tucked high in the Garhwal Himalayas, the Valley of Flowers explodes into a kaleidoscope of over 500 wildflower species during July and August. Paired with the serene waters of Hemkund Sahib lake at 4,329m and the tranquil mountain sanctuary of Chopta, this journey touches the soul of the sacred hills.",
    highlights: [
      "Hike through the UNESCO World Heritage Valley of Flowers",
      "Ascend to the crystal glacial tarn of Hemkund Sahib (4,329m)",
      "Panoramic views of Mt. Nanda Devi and Trishul from Chopta & Tungnath",
      "Stay in eco-conscious alpine meadows surrounded by rhododendrons",
      "Confluence of sacred Alaknanda and Bhagirathi rivers at Devprayag"
    ],
    accommodationOptions: [
      {
        tier: "3-star",
        name: "Eco Alpine Lodges",
        priceMultiplier: 1.0,
        pricePerPerson: 28900,
        available: true,
        features: [
          "Comfortable mountain lodges in Ghangaria, Joshimath, and Chopta",
          "Private bathrooms with geysers for hot water",
          "Nutritious vegetarian mountain cuisine",
          "Experienced Himalayan trek leaders and porters"
        ],
        description: "Cozy, neat mountain lodges built for trekkers, offering clean bedding, warm meals, and local guide support."
      },
      {
        tier: "4-star",
        name: "Premium Himalayan Retreats",
        priceMultiplier: 1.3,
        pricePerPerson: 37570,
        available: true,
        features: [
          "Best available boutique nature resorts in Joshimath & Chopta",
          "Insulated Swiss alpine luxury cottages with panoramic mountain balconies",
          "Dedicated wilderness chef preparing fresh farm-to-table cuisine",
          "Complimentary trekking poles, ponchos, and high-spec daypacks"
        ],
        description: "Upgraded comfort with charming wooden cottages, scenic tea terraces, and exceptional mountain hospitality."
      },
      {
        tier: "5-star",
        name: "Luxury Glamping Retreats",
        priceMultiplier: 1.7,
        pricePerPerson: 49130,
        available: false,
        unavailableReason: "Higher elevation trekking bases like Ghangaria do not permit 5-star concrete luxury properties to protect the fragile national park ecology.",
        features: [],
        description: "Not available in Ghangaria ecological buffer zone."
      }
    ],
    itinerary: [
      {
        day: 1,
        title: "Rishikesh to Joshimath via Devprayag",
        description: "Depart from Rishikesh along the Badrinath route. Witness the holy Sangam at Devprayag where Bhagirathi and Alaknanda merge into Ganga. Arrive in Joshimath, gateway to the Garhwal.",
        meals: "Dinner Included",
        stay: "Himalayan Lodge, Joshimath"
      },
      {
        day: 2,
        title: "Joshimath to Govindghat & Trek to Ghangaria",
        description: "Short drive to Govindghat. Begin the 10km scenic ascent alongside the roaring Pushpawati River to the tranquil base hamlet of Ghangaria (3,050m).",
        meals: "Breakfast & Dinner",
        stay: "Trekker Lodge, Ghangaria"
      },
      {
        day: 3,
        title: "Trek to Valley of Flowers National Park",
        description: "Enter the UNESCO protected reserve. Cross rustic wooden footbridges over glacial streams to discover miles of blooming Blue Poppies, Brahmakamal, and orchids framed by glaciers.",
        meals: "Breakfast, Packed Lunch & Dinner",
        stay: "Trekker Lodge, Ghangaria"
      },
      {
        day: 4,
        title: "Excursion to Hemkund Sahib (4,329m)",
        description: "A steep, rewarding ascent to the sacred high-altitude glacial lake of Hemkund Sahib. Gaze upon pristine snow reflections and enjoy piping hot langar tea inside the gurudwara.",
        meals: "Breakfast, Packed Lunch & Dinner",
        stay: "Trekker Lodge, Ghangaria"
      },
      {
        day: 5,
        title: "Descent to Govindghat & Drive to Chopta",
        description: "Descend to Govindghat and board your private vehicle toward the rolling high alpine meadows (Bugyals) of Chopta, nestled in dense forests of evergreen oak.",
        meals: "Breakfast & Dinner",
        stay: "Eco Meadows Camp, Chopta"
      },
      {
        day: 6,
        title: "Tungnath Temple & Chandrashila Peak",
        description: "Morning trek up paved stone trails to Tungnath, the highest Shiva shrine in the world (3,680m). Continue 1km to Chandrashila summit for an astonishing 360-degree panorama of Himalayan giants.",
        meals: "Breakfast & Dinner",
        stay: "Eco Meadows Camp, Chopta"
      },
      {
        day: 7,
        title: "Chopta to Rishikesh / Dehradun Departure",
        description: "Scenic morning drive descending through the Mandakini and Alaknanda valleys. Arrive in Rishikesh or Dehradun by late afternoon for your onward travel.",
        meals: "Breakfast Included",
        stay: "End of Tour"
      }
    ],
    inclusions: [
      "All ground transportation by private SUV throughout the itinerary",
      "6 nights accommodation as per selected category",
      "Breakfast and dinners, plus packed trail lunches on trek days",
      "Valley of Flowers National Park entry permits and forest entry fees",
      "Certified local mountaineer and botanical guide",
      "Trekking support and emergency oxygen cylinder"
    ],
    exclusions: [
      "Transportation to Rishikesh / Dehradun",
      "Mule / porter services for personal baggage (can be arranged on request)",
      "Personal trekking gear (boots, thermal wear)",
      "Tips for guides and porters",
      "Medical and evacuation insurance"
    ],
    importantNotes: [
      "Best flowering season is between July 15 and August 30.",
      "Moderate physical fitness is required: daily walks range from 8 to 14 km on mountain trails.",
      "Plastic-free zone: Single-use plastic bottles are strictly prohibited in the park."
    ]
  },
  {
    id: "ladakh-high-passes-monasteries",
    slug: "ladakh-high-passes-monasteries",
    name: "Ladakh: Monasteries, Dunes & Azure Lakes",
    destinationId: "ladakh",
    destinationName: "Ladakh",
    duration: "8 Days / 7 Nights",
    durationDays: 8,
    startingPrice: 44500,
    tripType: "Adventure",
    label: "Iconic",
    featured: true,
    coverImage: "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=1200&q=80",
    heroImage: "https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?auto=format&fit=crop&w=1920&q=85",
    shortOverview: "Cross Khardung La, ride double-humped camels in Hunder's silver dunes, and watch twilight fall on Pangong Tso.",
    overview: "A soul-stirring expedition into the roof of the world. Experience the ancient Buddhist heart of Ladakh in Leh, traverse Khardung La to the lush riverbeds and desert dunes of Nubra Valley, and spend an unforgettable evening watching the sapphire expanse of Pangong Tso transition into deep indigo. Mindfully paced with vital acclimatization days to ensure comfort and safety.",
    highlights: [
      "Sunset and dawn colors reflected on the 134km Pangong Lake",
      "Bactrian camel safari across the cold desert dunes of Hunder",
      "Morning chanting session at Thiksey Monastery, styled after Tibet's Potala Palace",
      "Crossing Khardung La (5,359m) and Chang La passes",
      "Heritage walking tour through Leh Old Town and King's Palace"
    ],
    accommodationOptions: [
      {
        tier: "3-star",
        name: "Ladakhi Heritage Lodges",
        priceMultiplier: 1.0,
        pricePerPerson: 44500,
        available: true,
        features: [
          "Authentic Ladakhi boutique hotels in Leh with oxygen support on call",
          "Deluxe Swiss tent cottages in Nubra Valley and Pangong Lake",
          "Warm dining rooms serving Ladakhi Thukpa, Momos, and Indian cuisine",
          "Clean en-suite western bathrooms"
        ],
        description: "Cozy, traditional solar-powered properties operated by warm Ladakhi hosts, providing reliable comfort at high altitude."
      },
      {
        tier: "4-star",
        name: "Premium Eco-Boutique Hotels",
        priceMultiplier: 1.4,
        pricePerPerson: 62300,
        available: true,
        features: [
          "Top-tier boutique heritage properties (e.g. The Grand Dragon / Stone Hedge Nubra)",
          "Central oxygen-enriched rooms or generator heating in Leh",
          "Luxury glamping wooden cottages at Pangong with panoramic lake windows",
          "Multi-cuisine organic dining sourced from local valley greenhouses"
        ],
        description: "High mountain luxury designed for optimal acclimatization, featuring oxygen-assisted sleeping quarters and plush insulation."
      },
      {
        tier: "5-star",
        name: "Ultra-Luxury Himalayan Retreats",
        priceMultiplier: 2.1,
        pricePerPerson: 93450,
        available: true,
        features: [
          "The Ultimate Travelling Camp (TUTC) / Chamba Camp Thiksey",
          "Private luxury colonial tents with antique furnishings and personal butler",
          "Curated private monastery visits with senior Rinpoches",
          "Gourmet champagne breakfast and five-star culinary service"
        ],
        description: "World-class experiential luxury glamping, offering bespoke high-altitude comfort reminiscent of royal expedition caravans."
      }
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival in Leh & Essential Rest",
        description: "Fly into Leh (3,524m) over snow-capped Himalayan summits. Mandatory complete resting day at your hotel to acclimatize to high altitude. Evening gentle stroll in Leh market.",
        meals: "Dinner Included",
        stay: "Heritage Hotel, Leh"
      },
      {
        day: 2,
        title: "Monasteries of the Indus Valley",
        description: "Visit the iconic 12-storey Thiksey Monastery, Shey Palace with its giant copper-gilt Buddha, and the modern Shanti Stupa for panoramic sunset views over Leh town.",
        meals: "Breakfast & Dinner",
        stay: "Heritage Hotel, Leh"
      },
      {
        day: 3,
        title: "Leh to Nubra Valley via Khardung La",
        description: "Ascend the legendary Khardung La pass (5,359m). Descend into the dramatic Nubra Valley. Check into your camp in Hunder and enjoy a Bactrian camel ride across white sand dunes.",
        meals: "Breakfast & Dinner",
        stay: "Deluxe Camp / Resort, Nubra"
      },
      {
        day: 4,
        title: "Diskit Monastery & Turtuk Village Tour",
        description: "Excursion to Turtuk, a picturesque Balti village on the Shayok River opened to travelers only recently. Visit the giant 32-meter Maitreya Buddha statue at Diskit Monastery.",
        meals: "Breakfast & Dinner",
        stay: "Deluxe Camp / Resort, Nubra"
      },
      {
        day: 5,
        title: "Nubra to Pangong Tso via Shyok River",
        description: "Follow the dramatic gorges of the Shyok River directly toward Pangong Tso. Arrive in the afternoon to witness the lake change colors through shades of turquoise and deep cobalt.",
        meals: "Breakfast & Dinner",
        stay: "Lakefront Cottage / Camp, Pangong"
      },
      {
        day: 6,
        title: "Pangong Sunrise to Leh via Chang La",
        description: "Witness the unforgettable sunrise over Pangong Lake. Journey back toward Leh crossing Chang La (5,360m). Stop at Hemis Monastery, the largest and wealthiest in Ladakh.",
        meals: "Breakfast & Dinner",
        stay: "Heritage Hotel, Leh"
      },
      {
        day: 7,
        title: "Sangam, Magnetic Hill & Hall of Fame",
        description: "Drive along the Indus to the scenic Sangam where the muddy waters of the Zanskar meet the clear Indus. Experience the optical illusion of Magnetic Hill and visit Gurudwara Pathar Sahib.",
        meals: "Breakfast & Dinner",
        stay: "Heritage Hotel, Leh"
      },
      {
        day: 8,
        title: "Departure from Leh",
        description: "Early morning transfer to Leh Kushok Bakula Rimpochee Airport for your scenic flight back over the Great Himalayas.",
        meals: "Breakfast Included",
        stay: "End of Tour"
      }
    ],
    inclusions: [
      "All ground transportation by private non-AC Toyota Innova / Scorpio",
      "7 nights accommodation in selected category with private facilities",
      "Breakfast and dinners included every day",
      "Inner Line Permits for Nubra Valley & Pangong Lake, Wildlife fees",
      "Oxygen cylinder in the vehicle for emergency high-altitude support",
      "Experienced local Ladakhi mountain driver"
    ],
    exclusions: [
      "Flights to and from Leh",
      "Camel ride fees in Hunder",
      "Monument and monastery entry fees",
      "Personal expenses, travel insurance, and tips"
    ],
    importantNotes: [
      "Day 1 must be spent resting in the hotel room. Do not rush to sightsee immediately upon arrival.",
      "Keep hydrated with warm water, ginger tea, and soups.",
      "Carry ample warm fleece layers even during summer months."
    ]
  },
  {
    id: "himachal-kinnaur-spiti-serenity",
    slug: "himachal-kinnaur-spiti-serenity",
    name: "Kinnaur & Tirthan Valley Slow Travel",
    destinationId: "himachal-pradesh",
    destinationName: "Himachal Pradesh",
    duration: "6 Days / 5 Nights",
    durationDays: 6,
    startingPrice: 26500,
    tripType: "Family",
    label: "Relaxed",
    featured: false,
    coverImage: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80",
    heroImage: "https://images.unsplash.com/photo-1597074866923-dc0589150358?auto=format&fit=crop&w=1920&q=85",
    shortOverview: "Unwind in pristine apple valleys, riverside cedar chalets, and quiet Himalayan stone hamlets.",
    overview: "Designed for travelers who want to avoid long, exhausting road journeys and savor unhurried mountain time. Wander through stone apple orchards in Sangla, listen to the Baspa river from your wooden balcony, and take gentle forest trails in Tirthan Valley on the edge of the UNESCO Great Himalayan National Park.",
    highlights: [
      "Relaxed riverside stay beside the Baspa and Tirthan rivers",
      "Walk through the historic wooden tower temple of Kamru",
      "Day hike to the cascading Chhoie waterfall in Tirthan",
      "Orchard walks and sampling fresh Himalayan stone fruits and honey"
    ],
    accommodationOptions: [
      {
        tier: "3-star",
        name: "Riverside Wooden Cabins",
        priceMultiplier: 1.0,
        pricePerPerson: 26500,
        available: true,
        features: [
          "Boutique wooden cottages with river balconies",
          "Home-cooked Himachali meals: Siddu, Rajma, and fresh trout",
          "Private en-suite bathrooms and fireplace lounges"
        ],
        description: "Authentic pine and cedar log cabins with cozy heating and peaceful river sounds."
      },
      {
        tier: "4-star",
        name: "Premium Himalayan Estates",
        priceMultiplier: 1.35,
        pricePerPerson: 35775,
        available: true,
        features: [
          "Luxury riverside chalets with private lawns and fire pits",
          "Personalized nature guides for birdwatching and forest bathing",
          "Radiator room heating and luxury bath amenities"
        ],
        description: "Exceptional country luxury with expansive verandas, gourmet food, and tailored walking itineraries."
      },
      {
        tier: "5-star",
        name: "Private Mountain Villas",
        priceMultiplier: 1.8,
        pricePerPerson: 47700,
        available: false,
        unavailableReason: "Private 5-star standalone resorts are limited in rural Tirthan Valley; our 4-star boutique estate represents the top tier.",
        features: [],
        description: "Currently unavailable in this peaceful sanctuary."
      }
    ],
    itinerary: [
      {
        day: 1,
        title: "Chandigarh to Shimla Foothills & Narkanda",
        description: "Meet your chauffeur in Chandigarh and drive into the cool pine forests of Narkanda.",
        meals: "Dinner Included",
        stay: "Orchard Resort, Narkanda"
      },
      {
        day: 2,
        title: "Narkanda to Sangla Valley",
        description: "Follow the winding Sutlej gorge to the breathtaking Sangla Valley.",
        meals: "Breakfast & Dinner",
        stay: "Riverside Chalet, Sangla"
      },
      {
        day: 3,
        title: "Chitkul Border Hamlet & Local Walks",
        description: "Gentle day trip to Chitkul village, followed by tea with local villagers.",
        meals: "Breakfast & Dinner",
        stay: "Riverside Chalet, Sangla"
      },
      {
        day: 4,
        title: "Sangla to Tirthan Valley via Jalori Pass",
        description: "Cross the scenic Jalori Pass into the serene, lush Tirthan Valley.",
        meals: "Breakfast & Dinner",
        stay: "Eco River Lodge, Tirthan"
      },
      {
        day: 5,
        title: "Great Himalayan National Park Trails",
        description: "Gentle guided walk along the pristine river into the buffer zone of the national park.",
        meals: "Breakfast & Dinner",
        stay: "Eco River Lodge, Tirthan"
      },
      {
        day: 6,
        title: "Tirthan to Chandigarh Departure",
        description: "Descent from the hills and transfer to Chandigarh airport or railway station.",
        meals: "Breakfast Included",
        stay: "End of Tour"
      }
    ],
    inclusions: [
      "Private AC vehicle throughout the tour",
      "5 nights boutique cottage accommodation",
      "Daily breakfast and dinner",
      "Local village guide for nature walks"
    ],
    exclusions: [
      "Travel to/from Chandigarh",
      "Lunches and snacks",
      "Personal expenses and tips"
    ],
    importantNotes: [
      "Ideal for all age groups, including elderly travellers and young children.",
      "Warm clothes are recommended for evenings even during mid-summer."
    ]
  },
  {
    id: "uttarakhand-kumaon-himalayan-retreat",
    slug: "uttarakhand-kumaon-himalayan-retreat",
    name: "Kumaon: Mist, Oak Forests & Nanda Devi",
    destinationId: "uttarakhand",
    destinationName: "Uttarakhand",
    duration: "5 Days / 4 Nights",
    durationDays: 5,
    startingPrice: 22800,
    tripType: "Leisure",
    label: "Peaceful",
    featured: false,
    coverImage: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80",
    heroImage: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=1920&q=85",
    shortOverview: "Wake up to 300-kilometer panoramas of the snow-crested Himalayas in tranquil Binsar and Kausani.",
    overview: "Far from congested tourist hubs, Kumaon is a region of gentle meditation, ancient cedar and oak canopies, and bird song. Experience quiet village walks, historic Katarmal sun temples, and sweeping views of Nanda Devi, Trishul, and Panchachuli peaks from your hillside veranda.",
    highlights: [
      "Panoramic Himalayan sunrise from Zero Point in Binsar Wildlife Sanctuary",
      "Ancient stone architecture of 9th-century Jageshwar temple complex",
      "Heritage tea garden walk in Kausani",
      "Stargazing and peaceful reading in secluded oak-surrounded lodges"
    ],
    accommodationOptions: [
      {
        tier: "3-star",
        name: "Forest Nature Retreats",
        priceMultiplier: 1.0,
        pricePerPerson: 22800,
        available: true,
        features: [
          "Charming stone and wood cottages inside forest reserves",
          "Private verandas with mountain views",
          "Fresh Kumaoni meals (Bhatt ki Churkani, Kumaoni Raita)",
          "Guided forest birdwatching walks"
        ],
        description: "Quiet nature properties that emphasize serenity, reading spaces, and clean air."
      },
      {
        tier: "4-star",
        name: "Heritage Mountain Manors",
        priceMultiplier: 1.4,
        pricePerPerson: 31920,
        available: true,
        features: [
          "Boutique colonial estates and luxury mountain lodges",
          "Private fireplace suites and heated beds",
          "Personalized high-tea served on pine lawns overlooking snow peaks"
        ],
        description: "Exceptional colonial charm with brass fittings, library lounges, and gourmet organic dining."
      },
      {
        tier: "5-star",
        name: "Luxury Wellness Estates",
        priceMultiplier: 2.0,
        pricePerPerson: 45600,
        available: false,
        unavailableReason: "Selected properties in Kumaon are small intimate boutique retreats rather than commercial 5-star complexes.",
        features: [],
        description: "Not applicable."
      }
    ],
    itinerary: [
      {
        day: 1,
        title: "Kathgodam to Binsar Sanctuary",
        description: "Drive uphill from Kathgodam railway station through oak canopies into Binsar Wildlife Sanctuary.",
        meals: "Dinner Included",
        stay: "Forest Manor, Binsar"
      },
      {
        day: 2,
        title: "Binsar Zero Point & Jageshwar Temples",
        description: "Early morning hike to Zero Point for breathtaking views of Nanda Devi. Afternoon visit to the sacred Jageshwar forest temples.",
        meals: "Breakfast & Dinner",
        stay: "Forest Manor, Binsar"
      },
      {
        day: 3,
        title: "Binsar to Kausani via Katarmal",
        description: "Visit the 9th-century Sun Temple at Katarmal before winding toward Kausani, dubbed the Switzerland of India by Mahatma Gandhi.",
        meals: "Breakfast & Dinner",
        stay: "Valley View Resort, Kausani"
      },
      {
        day: 4,
        title: "Kausani Tea Estates & Village Walks",
        description: "Explore the gentle slopes of Kausani tea gardens and learn about regional organic honey production.",
        meals: "Breakfast & Dinner",
        stay: "Valley View Resort, Kausani"
      },
      {
        day: 5,
        title: "Kausani to Kathgodam Departure",
        description: "Descend toward Kathgodam or Pantnagar with stops at Ranikhet golf greens.",
        meals: "Breakfast Included",
        stay: "End of Tour"
      }
    ],
    inclusions: [
      "Private vehicle for all transfers and sightseeing",
      "4 nights boutique accommodation",
      "Breakfast and dinners",
      "Sanctuary entry passes"
    ],
    exclusions: [
      "Train or flight tickets to Kathgodam",
      "Personal items and insurance"
    ],
    importantNotes: [
      "Quiet hours are observed after 9:30 PM to preserve forest sanctuary tranquility."
    ]
  }
];
