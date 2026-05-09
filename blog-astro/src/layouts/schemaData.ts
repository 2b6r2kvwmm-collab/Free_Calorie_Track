// Schema data for blog posts
// Used by BlogLayout.astro to conditionally render structured data
// A single post can have multiple schemas by using an array.

export interface ReviewSchema {
  type: 'Review';
  itemReviewed: {
    name: string;
    description: string;
  };
  reviewRating: {
    ratingValue: number;
    bestRating: number;
  };
  author: {
    type: string;
    name: string;
  };
  reviewBody: string;
}

export interface HowToStep {
  name: string;
  text: string;
}

export interface HowToSchema {
  type: 'HowTo';
  name: string;
  description: string;
  totalTime?: string;
  step: HowToStep[];
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface FAQSchema {
  type: 'FAQPage';
  mainEntity: FAQItem[];
}

type SchemaData = ReviewSchema | HowToSchema | FAQSchema;

export const schemaData: Record<string, SchemaData | SchemaData[]> = {
  // ─── Gear Reviews ──────────────────────────────────────────────────────────

  'best-adjustable-dumbbells-advanced': {
    type: 'Review',
    itemReviewed: {
      name: 'Nuobell 580 Adjustable Dumbbells',
      description: 'Heavy-duty adjustable dumbbells with 5-80 lb range, textured steel grips, twist-to-select mechanism, and all-metal plates.'
    },
    reviewRating: { ratingValue: 5, bestRating: 5 },
    author: { type: 'Organization', name: 'Free Calorie Track' },
    reviewBody: 'The Nuobell 580 is the best adjustable dumbbell I\'ve used. The 80 lb max weight, textured steel grips, minimal chatter, and compact design make them feel like premium gym equipment. The twist-to-select mechanism is fast and reliable, and the build quality is excellent. If you\'re serious about lifting at home and need heavy dumbbells, these are worth every penny.'
  },

  'best-adjustable-dumbbells-beginners': {
    type: 'Review',
    itemReviewed: {
      name: 'Core Fitness Adjustable Dumbbells',
      description: 'Adjustable dumbbell set with twist-to-select mechanism, 5-50 lb range, compact design, and comfortable rubber grips.'
    },
    reviewRating: { ratingValue: 5, bestRating: 5 },
    author: { type: 'Organization', name: 'Free Calorie Track' },
    reviewBody: 'The Core Fitness Adjustable Dumbbells are perfect for beginners and intermediate lifters. The twist-to-select mechanism is ridiculously easy, the design is compact and well-balanced, and the comfortable grip makes longer sets manageable. I\'ve had these for a while now and they\'ve held up great with regular use. They come with a 2-year warranty which is reassuring. For anyone who needs weights up to 50 lbs and wants the convenience of adjustables without a full rack, these are an excellent choice.'
  },

  'best-blenders-for-protein-shakes': {
    type: 'Review',
    itemReviewed: {
      name: 'NutriBullet Pro 900',
      description: '900-watt personal blender with extractor blades, portable blending cups, and dishwasher-safe parts. Designed for protein shakes and smoothies.'
    },
    reviewRating: { ratingValue: 5, bestRating: 5 },
    author: { type: 'Organization', name: 'Free Calorie Track' },
    reviewBody: 'I\'ve owned two NutriBullet Pro 900s for 2+ years and use them daily for protein shakes. The cleanup takes 30 seconds, the flatter blades are safer and more effective, and you can drink straight from the container. It\'s perfect for daily protein shakes and smoothies, blending everything smooth in seconds. The 900-watt motor handles typical protein shakes with ease. The design is sleek and compact, fitting under most cabinets. For consistent daily protein shakes, this is the best blender I\'ve used.'
  },

  'breville-barista-express-review': {
    type: 'Review',
    itemReviewed: {
      name: 'Breville Barista Express Espresso Machine',
      description: 'Semi-automatic espresso machine with built-in conical burr grinder, 15-bar Italian pump, and precise temperature control.'
    },
    reviewRating: { ratingValue: 5, bestRating: 5 },
    author: { type: 'Organization', name: 'Free Calorie Track' },
    reviewBody: 'After 6+ years of daily use, the Breville Barista Express is the greatest product I own. It has saved us thousands on coffee while delivering café-quality espresso at home. The built-in grinder is convenient, the machine is reliable and consistent, and the espresso quality rivals high-end coffee shops. The only maintenance needed has been descaling and replacing the water filter. If you drink espresso regularly and want to stop spending $5+ per drink, this machine pays for itself in months and will last for years.'
  },

  'oxo-obsidian-carbon-steel-pan-review': {
    type: 'Review',
    itemReviewed: {
      name: 'OXO Obsidian 10" Carbon Steel Frying Pan',
      description: 'Lightweight carbon steel frying pan with factory seasoning, rubber handle grip, and no chemical coating. Gets better with use.'
    },
    reviewRating: { ratingValue: 5, bestRating: 5 },
    author: { type: 'Organization', name: 'Free Calorie Track' },
    reviewBody: 'After noticing flakes of coating coming off my old nonstick pan, I switched to the OXO Obsidian Carbon Steel. Lightweight compared to cast iron but thick enough to distribute heat evenly, it excels at searing and handles delicate things like pancakes better than expected. The factory seasoning gives you a real head start. Eggs require technique and patience, and scrambled eggs will cake on — that\'s the honest tradeoff. Maintenance is simple: skip the soap, scrub with a Scrub Daddy and cold water, dry completely, and rub with a little high-heat oil. For anyone trying to get chemical coatings out of their kitchen, this is a great pan to start with.'
  },

  'zelus-weighted-vest-review': {
    type: 'Review',
    itemReviewed: {
      name: 'ZELUS Weighted Vest',
      description: 'Adjustable weighted vest with removable weight bags, comfortable shoulder padding, and low-profile design. Available in multiple weight options.'
    },
    reviewRating: { ratingValue: 5, bestRating: 5 },
    author: { type: 'Organization', name: 'Free Calorie Track' },
    reviewBody: 'The ZELUS weighted vest is the best budget option for rucking and calisthenics. It\'s comfortable enough for long walks, has adjustable weights that are easy to add or remove, and the low-profile design doesn\'t restrict movement. After months of regular use for rucking and bodyweight exercises, it\'s held up perfectly with no durability issues. For anyone wanting to add load to walks, runs, or bodyweight exercises without breaking the bank, this vest delivers excellent value.'
  },

  // ─── HowTo Guides ──────────────────────────────────────────────────────────

  'how-to-use-a-food-scale': {
    type: 'HowTo',
    name: 'How to Use a Food Scale for Accurate Calorie Counting',
    description: 'Learn to use a food scale correctly for precise calorie tracking. Master the tare function, weighing techniques, and avoid common mistakes.',
    totalTime: 'PT5M',
    step: [
      {
        name: 'Place scale on flat surface',
        text: 'Place the food scale on a flat, stable surface. Make sure it\'s not on a towel or uneven countertop as this affects accuracy.'
      },
      {
        name: 'Turn on the scale',
        text: 'Power on the scale using the power button. Most digital scales turn on when you place something on them.'
      },
      {
        name: 'Place container on scale',
        text: 'Place your container, plate, or bowl on the scale. This could be the packaging the food came in or any container you\'ll use.'
      },
      {
        name: 'Press tare or zero',
        text: 'Press the "Tare" or "Zero" button to reset the scale to 0. This ensures you\'re only weighing the food, not the container.'
      },
      {
        name: 'Add your food',
        text: 'Add your food to the container. The display will show only the weight of the food in grams.'
      },
      {
        name: 'Log the weight',
        text: 'Log the weight in grams in your calorie tracking app. Use grams for precision and round to the nearest whole number if needed.'
      }
    ]
  },

  'rucking-guide-weighted-vest-training': {
    type: 'HowTo',
    name: 'How to Start Rucking for Fitness',
    description: 'Complete guide to starting rucking (weighted walking). Learn proper form, weight progression, and how to build a safe training program.',
    totalTime: 'PT30M',
    step: [
      {
        name: 'Start with a backpack',
        text: 'Before buying equipment, start with a comfortable backpack you already own. Load it with books, dumbbells wrapped in towels, water bottles, or heavy household items.'
      },
      {
        name: 'Begin with light weight',
        text: 'Start with 10-15 lbs (4.5-7 kg) for your first ruck. This allows your body to adapt to the added load without risking injury.'
      },
      {
        name: 'Keep short duration initially',
        text: 'Start with 15-20 minute walks at a comfortable pace. Focus on maintaining good posture and getting used to the weight.'
      },
      {
        name: 'Progress gradually',
        text: 'Increase either weight or duration by 10% per week, not both at once. This gradual progression prevents overuse injuries.'
      },
      {
        name: 'Maintain proper form',
        text: 'Keep your shoulders back, core engaged, and avoid leaning forward. The weight should be positioned high on your back, close to your shoulder blades.'
      },
      {
        name: 'Track your progress',
        text: 'Log your rucking sessions including weight carried, distance walked, and time. Use a calorie tracking app to monitor the extra calories burned from weighted walking.'
      }
    ]
  },

  // ─── Calculator Posts (HowTo + FAQPage) ────────────────────────────────────

  'calorie-deficit-calculator': [
    {
      type: 'HowTo',
      name: 'How to Calculate Your Calorie Deficit',
      description: 'Step-by-step guide to calculating a safe, effective calorie deficit for weight loss based on your TDEE and goals.',
      totalTime: 'PT5M',
      step: [
        {
          name: 'Calculate your TDEE',
          text: 'Use the Mifflin-St Jeor equation or the calculator on this page to find your Total Daily Energy Expenditure — the calories your body burns per day based on your age, sex, height, weight, and activity level. This is your maintenance calorie number.'
        },
        {
          name: 'Choose your weight loss goal',
          text: 'For safe, sustainable loss, choose a 250-500 calorie daily deficit (0.5-1 lb/week). Only go up to 500-750 cal/day if you have 50+ lbs to lose, are very active, and are maintaining high protein intake. Never exceed a 750 calorie daily deficit without medical supervision.'
        },
        {
          name: 'Set your daily calorie target',
          text: 'Subtract your chosen deficit from your TDEE: Daily Target = TDEE - Deficit. For example, a TDEE of 2,200 with a 400-calorie deficit gives a daily target of 1,800 calories.'
        },
        {
          name: 'Respect safe minimum limits',
          text: 'Your calorie intake must never exceed a 25% deficit (minimum = TDEE × 0.75) and must never fall below 1,200 cal/day for women or 1,500 cal/day for men. Use whichever number is higher as your floor. Recalculate every 10-15 lbs lost as your TDEE decreases with weight.'
        }
      ]
    },
    {
      type: 'FAQPage',
      mainEntity: [
        {
          question: 'How long does it take to see results from a calorie deficit?',
          answer: 'Weeks 1-2: Expect a 2-5 lb drop, mostly water weight from reduced carbohydrate and sodium intake — not pure fat loss. Weeks 3-4: Weight loss slows to your expected rate of 0.5-1 lb per week based on your deficit size. Week 5 onward: Consistent, steady progress if you maintain the deficit. Focus on the 4-6 week trend rather than daily or weekly fluctuations, which are heavily influenced by water retention.'
        },
        {
          question: 'Why am I not losing weight even though I\'m in a calorie deficit?',
          answer: 'The most common reasons are: (1) Tracking errors — most people underestimate intake by 20-30%. Use a food scale for 2 weeks to calibrate. (2) Water retention from exercise, sodium, hormones, or stress — track weekly averages, not daily weight. (3) Overestimating exercise burn — fitness trackers often overestimate by 20-30%, so only eat back 50-75% of estimated exercise calories. (4) Metabolic adaptation — try a 2-week diet break at maintenance calories. (5) A medical condition such as thyroid disorder or PCOS — see your doctor for testing.'
        },
        {
          question: 'Should I eat back exercise calories?',
          answer: 'It depends on how your TDEE was calculated. If you used a traditional TDEE calculator that bakes exercise into your activity level, do not eat back exercise calories — they are already included. If you use Free Calorie Track\'s approach (baseline TDEE without exercise, then log workouts separately), eat back 50-75% of estimated exercise calories to avoid an unintentionally large deficit.'
        },
        {
          question: 'What is the maximum safe calorie deficit?',
          answer: 'Research supports a maximum deficit of 25% of your TDEE — for example, if your TDEE is 2,200 calories, your minimum safe intake is 1,650 calories. Absolute floors are 1,200 cal/day for women and 1,500 cal/day for men regardless of TDEE. Use whichever number is higher. Deficits beyond these limits increase muscle loss, hormonal disruption, nutrient deficiencies, and the likelihood of weight regain.'
        },
        {
          question: 'Is it better to eat less or exercise more to create a calorie deficit?',
          answer: 'Both contribute, but diet is more reliable for creating a deficit. Exercise burns fewer calories than most people expect — 1 hour of cardio typically burns 300-500 calories, which a single high-calorie meal can offset. However, exercise preserves muscle mass during a deficit, improves body composition, and supports long-term metabolic health. The most effective approach combines both: roughly 70% diet, 30% exercise.'
        }
      ]
    }
  ],

  'how-to-calculate-tdee': [
    {
      type: 'HowTo',
      name: 'How to Calculate Your TDEE',
      description: 'Step-by-step guide to calculating your Total Daily Energy Expenditure using the Mifflin-St Jeor equation and activity multipliers.',
      totalTime: 'PT5M',
      step: [
        {
          name: 'Calculate your BMR',
          text: 'Use the Mifflin-St Jeor equation. For men: BMR = (10 × weight in kg) + (6.25 × height in cm) - (5 × age) + 5. For women: BMR = (10 × weight in kg) + (6.25 × height in cm) - (5 × age) - 161. This gives your Basal Metabolic Rate — calories burned at complete rest.'
        },
        {
          name: 'Multiply by your activity factor',
          text: 'Multiply your BMR by your activity level: Sedentary (little/no exercise) = BMR × 1.2. Light activity (1-3 days/week) = BMR × 1.375. Moderate activity (3-5 days/week) = BMR × 1.55. Active (6-7 days/week) = BMR × 1.725. Very active (intense daily exercise) = BMR × 1.9.'
        },
        {
          name: 'Set your calorie goal based on your TDEE',
          text: 'Eat 300-500 calories below your TDEE for fat loss (0.5-1 lb/week). Eat at your TDEE for maintenance. Eat 200-300 calories above your TDEE for muscle gain. Track your weight for 2-3 weeks and adjust by 100-200 calories if results don\'t match expectations — individual metabolism varies.'
        }
      ]
    },
    {
      type: 'FAQPage',
      mainEntity: [
        {
          question: 'What is TDEE?',
          answer: 'TDEE (Total Daily Energy Expenditure) is the total number of calories your body burns in a 24-hour period — including breathing, digestion, daily movement, and intentional exercise. It is your maintenance calorie level: eating at your TDEE keeps your weight stable, eating below causes weight loss, and eating above causes weight gain. TDEE is the number that matters for tracking, not BMR alone.'
        },
        {
          question: 'What is the difference between BMR and TDEE?',
          answer: 'BMR (Basal Metabolic Rate) is the calories your body burns at complete rest — just keeping you alive with no movement. TDEE accounts for real life: your BMR multiplied by an activity factor to include daily movement, work, and exercise. A typical TDEE is 1.2 to 1.9 times your BMR depending on how active you are. TDEE is the number to use when setting calorie goals.'
        },
        {
          question: 'How accurate is a TDEE calculator?',
          answer: 'TDEE calculators provide estimates based on population averages, not your individual metabolism. Your actual TDEE can vary due to genetics, muscle mass, hormones (thyroid conditions, PCOS, menopause), medication side effects, and adaptive thermogenesis. Use your calculated TDEE as a starting point, then adjust by 100-200 calories based on actual weight change over 2-3 weeks. If you have a metabolic condition, work with a healthcare provider for personalized guidance.'
        },
        {
          question: 'How do I use my TDEE to lose weight?',
          answer: 'Subtract 300-500 calories from your TDEE to create a daily deficit that produces 0.5-1 lb of weight loss per week. Track your weight weekly and adjust if progress stalls for 3+ consecutive weeks. As you lose weight your TDEE decreases because smaller bodies burn fewer calories — recalculate every 10-15 lbs lost to keep your deficit accurate.'
        }
      ]
    }
  ],

  // ─── FAQ-Only Posts ─────────────────────────────────────────────────────────

  'macro-calculator-guide': {
    type: 'FAQPage',
    mainEntity: [
      {
        question: 'Do I need to hit my macros exactly every day?',
        answer: 'No. Aim for weekly averages, not daily perfection. If you\'re within 5-10g of your targets most days, you\'re on track. Body composition changes happen over weeks, not individual days — one day over or under won\'t affect your results. What matters is your rolling weekly average across all three macros.'
      },
      {
        question: 'What if I go over one macro but under another?',
        answer: 'As long as total calories are on track, occasional macro imbalances are not a big deal. Protein is the most important macro to hit consistently because it preserves muscle during a deficit and supports muscle growth. Carb and fat balance is flexible as long as you stay near your daily calorie target.'
      },
      {
        question: 'Should I track fiber separately from carbs?',
        answer: 'Fiber is a type of carbohydrate and is typically included in your total carb count by most tracking apps. Aim for 25-35g of fiber per day for digestive health, but it does not need to be tracked separately unless you have a specific medical reason to do so. Focus on hitting your total carb target from whole food sources and fiber intake tends to take care of itself. If you want to monitor it, Free Calorie Track has an optional setting to display fiber separately on each food entry and in your daily totals — you can turn it on in the app settings.'
      },
      {
        question: 'Can I eat anything as long as it fits my macros (IIFYM)?',
        answer: 'Technically yes — you can lose weight or build muscle eating foods that fit your macro targets regardless of food quality. In practice, eating mostly whole foods (roughly 80%) while leaving room for whatever you enjoy (20%) will improve how you feel, perform, and sustain the approach long-term. Micronutrient deficiencies are a real concern if you fill your macros primarily with processed foods.'
      }
    ]
  },

  'bmi-vs-ffmi': {
    type: 'FAQPage',
    mainEntity: [
      {
        question: 'What is the difference between BMI and FFMI?',
        answer: 'BMI (Body Mass Index) measures weight relative to height using a simple formula and does not distinguish between muscle and fat. FFMI (Fat-Free Mass Index) measures muscle mass relative to height after accounting for body fat percentage. FFMI requires knowing your body fat percentage and is a far more accurate indicator of body composition for active individuals and athletes.'
      },
      {
        question: 'Why is BMI inaccurate for muscular people?',
        answer: 'BMI treats a pound of muscle identically to a pound of fat. A lean, muscular person and a sedentary person with high body fat at the same height and weight receive identical BMI scores despite having completely different body compositions. BMI was designed by a 19th-century mathematician for population-level statistics, not individual health assessment. Athletes and regular lifters are routinely classified as "overweight" by BMI despite having low body fat percentages.'
      },
      {
        question: 'What is a good FFMI score?',
        answer: 'For men, an FFMI of 18-20 is average, 20-22 is above average, 22-23 is excellent, and 23-25 represents the natural genetic ceiling for most people without performance-enhancing drugs. For women, 15-17 is average, 17-18 is above average, 18-19 is excellent, and 19-21 represents the natural ceiling for most. Scores consistently above 25 for men or 21 for women are rare naturally.'
      },
      {
        question: 'Do I need to know my body fat percentage to calculate FFMI?',
        answer: 'Yes — FFMI requires your body fat percentage to calculate fat-free mass (the muscle, bone, and organ weight without fat). You can estimate body fat using a DEXA scan (most accurate), hydrostatic weighing, skinfold calipers, or a bioelectrical impedance scale. The calculators on this page compute FFMI once you enter your body fat percentage alongside your height and weight.'
      }
    ]
  },

  'calorie-app-privacy': {
    type: 'FAQPage',
    mainEntity: [
      {
        question: 'Is my data really private if it\'s stored in my browser?',
        answer: 'Yes. Browser local storage is isolated per-domain and protected by your device\'s operating system security. Other websites cannot access it, and neither can the app\'s creators. It uses the same storage technology as banking and password manager web apps. Your nutrition logs, weight history, and profile data never leave your device unless you explicitly use an optional AI feature.'
      },
      {
        question: 'How can the app be free without selling data?',
        answer: 'Free Calorie Track is funded through voluntary donations and affiliate commissions on gear and products the developer personally uses and recommends. This model keeps the app completely free without requiring data collection, advertising revenue, or investor monetization pressure.'
      },
      {
        question: 'What do most calorie tracking apps do with my data?',
        answer: 'Most free calorie tracking apps are funded through advertising or a freemium model that locks core features behind a subscription. Ad-supported apps typically collect behavioral data — including your food logs, meal timing, and search patterns — to serve targeted ads or sell to third-party data brokers. Subscription apps often require account creation, which ties your health data to an identity and email address. Some apps share data with insurance, pharmacy, or wellness partners. Free Calorie Track uses none of these models: no ads, no subscriptions, no accounts, and no server-side storage of your food or health data.'
      },
      {
        question: 'Does the AI food logging feature share my photos with anyone?',
        answer: 'Yes, when you choose to use it. Photos and text descriptions you submit are sent to Google Gemini to estimate nutrition. Images are compressed before sending (800px maximum, approximately 70% quality), and neither the photo nor the description is stored on the server after the request completes. No profile data travels with the request — Gemini receives only the food image or text, nothing that identifies you. The feature is entirely optional and the rest of the app works without it.'
      },
      {
        question: 'Does the Nutrition Coach feature send my data anywhere?',
        answer: 'Yes, when you choose to use it. The Nutrition Coach sends your last 7 days of food logs, your calorie and macro targets, and your profile (goal, activity level, age, weight) to Google Gemini to generate a personalized weekly analysis. The app shows you a disclosure screen with the exact data list before you confirm. Nothing is stored on the server — only the coaching result is saved, on your device. The Coach only runs when you explicitly trigger it.'
      },
      {
        question: 'Do you use any analytics or tracking?',
        answer: 'The app uses privacy-respecting Vercel Analytics, which provides basic traffic statistics (page views, general usage patterns) without collecting personal information or using cookies. There are no advertising SDKs, no behavioral tracking, and no third-party data sharing. Analytics data cannot be linked to individual users.'
      }
    ]
  },

  'high-protein-low-calorie-foods': {
    type: 'FAQPage',
    mainEntity: [
      {
        question: 'What qualifies as a high protein low calorie food?',
        answer: 'A food qualifies as high protein and low calorie when it provides at least 10g of protein per 100g, with relatively low fat and carbohydrates. The best examples include chicken breast (31g per 100g, 165 cal), cod or tilapia (18–26g per 100g, 82–96 cal), shrimp (24g per 100g, 99 cal), egg whites (11g per 100g, 52 cal), and non-fat Greek yogurt (10g per 100g, 59 cal).'
      },
      {
        question: 'Why do high protein foods help with weight loss?',
        answer: 'Protein has three distinct advantages for weight loss. First, it has the highest thermic effect of any macronutrient — your body burns 20-30% of protein calories just digesting it. Second, protein is the most satiating macronutrient, suppressing hunger hormones and keeping you fuller longer on fewer total calories. Third, adequate protein preserves lean muscle mass during a calorie deficit, preventing the metabolic slowdown that causes weight regain after dieting.'
      },
      {
        question: 'How much protein do I need per day for weight loss?',
        answer: 'For fat loss while preserving muscle, aim for 0.8-1g of protein per pound of body weight per day. A 150 lb person should target 120-150g of protein daily. This is significantly higher than the minimum RDA (0.36g per lb) and is supported by research showing high protein intake reduces muscle loss during calorie restriction. Spreading intake across 3-4 meals of 30-40g each is more effective than concentrating protein at one meal.'
      },
      {
        question: 'Can I get enough protein from plant-based foods alone?',
        answer: 'Yes. The best plant-based high protein, lower-calorie options include edamame (18g protein per cup, 188 cal), tempeh (16g per 3oz, 140 cal), tofu (10g per 4oz, 90 cal), lentils (18g per cup cooked, 230 cal), and seitan (21g per 3oz, 120 cal). Combining incomplete plant proteins throughout the day — such as beans with grains — provides all essential amino acids. Plant-based protein powder can help bridge gaps when whole food intake falls short.'
      }
    ]
  },

  'free-calorie-tracker-app-features': {
    type: 'FAQPage',
    mainEntity: [
      {
        question: 'Is Free Calorie Track really free?',
        answer: 'Yes — completely free with no premium tier, no subscriptions, and no paywalls. Every feature including barcode scanning, macro tracking, AI food logging, weekly nutrition coaching, exercise logging, and trend analysis is included at no cost. The app is funded by voluntary donations and affiliate commissions, not by gating features or showing ads.'
      },
      {
        question: 'Do I need to create an account to use Free Calorie Track?',
        answer: 'No. There is no account, no email address, no password. Open the app and start tracking immediately. All your data is stored locally on your device using browser storage — nothing is sent to a server or tied to an identity. You can export a backup file at any time and import it on another device.'
      },
      {
        question: 'Does the app work offline?',
        answer: 'Yes. Free Calorie Track is a Progressive Web App (PWA) that works fully offline after the first load. The common food database, your saved custom foods, recipes, exercise history, and all logged data are available without an internet connection. Barcode scanning and branded food search require a connection only for products not already cached on your device.'
      },
      {
        question: 'How does barcode scanning work?',
        answer: 'Tap the barcode icon in the food logger and point your camera at any product barcode. The app looks up the product in the Open Food Facts database (220,000+ products), automatically fills in the nutrition information, and lets you adjust the serving size before logging. Barcode scanning is completely free with no daily or monthly limit.'
      },
      {
        question: 'What are all the ways I can log food?',
        answer: 'Free Calorie Track supports five food logging methods: (1) barcode scanning for packaged products, (2) searching the built-in common food database with thousands of pre-loaded whole foods, (3) AI food logging — describe a meal in text or snap a photo and AI estimates the calories and macros instantly, (4) custom food entries for foods not in the database, and (5) recipes — build a recipe once from its ingredients, then log any portion of it repeatedly.'
      }
    ]
  },

  // ─── Existing FAQ Pages ─────────────────────────────────────────────────────

  'protein-tracking-on-glp-1': {
    type: 'FAQPage',
    mainEntity: [
      {
        question: 'How much protein should I eat on Ozempic or Wegovy?',
        answer: 'Most evidence-based guidance for people eating in a significant calorie deficit falls between 1.4 and 2.0 grams of protein per kilogram of body weight per day. For a 170 lb (77 kg) person, that\'s roughly 110 to 155 grams per day. If you\'re doing resistance training, aim for the higher end. Your doctor or a registered dietitian can give you a target tailored to your specific health situation.'
      },
      {
        question: 'Is muscle loss really a significant risk on GLP-1 medications?',
        answer: 'Yes — it\'s a recognized clinical concern that prescribers routinely discuss with patients. When calories are cut significantly and protein intake is too low, muscle makes up a meaningful portion of the weight lost. GLP-1 medications create particularly large calorie deficits, and the appetite suppression that makes protein-dense foods hard to eat compounds the problem.'
      },
      {
        question: 'What should I eat on Ozempic when I\'m not hungry?',
        answer: 'Focus on high-protein, low-volume foods: Greek yogurt, cottage cheese, protein shakes, egg whites, deli turkey, shrimp, and white fish. These give you 15–22 grams of protein per 100 calories without needing a big appetite. On rough nausea days, liquid protein — shakes and smoothies with protein powder — is usually easier to tolerate than solid food.'
      },
      {
        question: 'Do I need to track sugar and saturated fat on a GLP-1?',
        answer: 'Not necessarily. Protein and total calories are the two most important numbers to watch. Fiber is worth tracking if you\'re dealing with GI side effects. Sodium is worth monitoring if your doctor has flagged blood pressure or heart health. Sugar and saturated fat are optional unless your prescriber has specifically asked you to watch them.'
      },
      {
        question: 'What happens if I consistently under-eat protein on a GLP-1?',
        answer: 'Short term: more fatigue, slower recovery, and increased hunger between doses. Long term: significant muscle loss, a lower resting metabolism, and a much higher chance of regaining fat — rather than muscle — if you ever reduce or stop the medication. The scale might look good while your body composition quietly moves in the wrong direction.'
      }
    ]
  },

  'what-is-protein': {
    type: 'FAQPage',
    mainEntity: [
      {
        question: 'What if I\'m vegetarian or vegan?',
        answer: 'You can absolutely get enough protein on a plant-based diet. Focus on complete protein sources like soy (tofu, tempeh, edamame), quinoa, and buckwheat. Combine incomplete proteins like beans and rice to get all essential amino acids. Consider using plant-based protein powder (pea, hemp, rice) to help meet your daily targets. Track your intake to ensure you\'re consistently hitting your protein goals.'
      },
      {
        question: 'Is protein powder safe?',
        answer: 'Yes, protein powder is safe for most people. It\'s simply a convenient form of protein extracted from foods like milk (whey, casein), soy, peas, or rice. Choose reputable brands that are third-party tested for quality and purity. Protein powder is not necessary if you can meet your protein needs through whole foods, but it\'s a convenient supplement when you need extra protein or want a quick meal.'
      },
      {
        question: 'Can kids/teens eat high protein?',
        answer: 'Yes, protein is essential for growing children and teenagers. Active teens, especially those playing sports or strength training, may benefit from higher protein intake (1.0-1.2g per lb of body weight). However, kids and teens should prioritize getting protein from whole foods first—chicken, fish, eggs, dairy, beans, nuts—rather than relying heavily on protein powders. Consult with a pediatrician or registered dietitian for personalized recommendations.'
      },
      {
        question: 'Does timing matter?',
        answer: 'Protein timing is less important than total daily intake. The "anabolic window" (eating protein immediately after workouts) is not as critical as once thought. As long as you spread protein intake throughout the day (20-40g per meal), your muscles will have the amino acids they need. That said, eating protein within a few hours after training can support recovery, especially if you train fasted or haven\'t eaten in several hours.'
      }
    ]
  }
};
