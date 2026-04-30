// Schema data for blog posts
// Used by BlogLayout.astro to conditionally render structured data

interface ReviewSchema {
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

interface HowToStep {
  name: string;
  text: string;
}

interface HowToSchema {
  type: 'HowTo';
  name: string;
  description: string;
  step: HowToStep[];
}

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSchema {
  type: 'FAQPage';
  mainEntity: FAQItem[];
}

type SchemaData = ReviewSchema | HowToSchema | FAQSchema;

export const schemaData: Record<string, SchemaData> = {
  // Gear Reviews (all 5 stars)
  'best-adjustable-dumbbells-advanced': {
    type: 'Review',
    itemReviewed: {
      name: 'Nuobell 580 Adjustable Dumbbells',
      description: 'Heavy-duty adjustable dumbbells with 5-80 lb range, textured steel grips, twist-to-select mechanism, and all-metal plates.'
    },
    reviewRating: {
      ratingValue: 5,
      bestRating: 5
    },
    author: {
      type: 'Organization',
      name: 'Free Calorie Track'
    },
    reviewBody: 'The Nuobell 580 is the best adjustable dumbbell I\'ve used. The 80 lb max weight, textured steel grips, minimal chatter, and compact design make them feel like premium gym equipment. The twist-to-select mechanism is fast and reliable, and the build quality is excellent. If you\'re serious about lifting at home and need heavy dumbbells, these are worth every penny.'
  },

  'best-adjustable-dumbbells-beginners': {
    type: 'Review',
    itemReviewed: {
      name: 'Core Fitness Adjustable Dumbbells',
      description: 'Adjustable dumbbell set with twist-to-select mechanism, 5-50 lb range, compact design, and comfortable rubber grips.'
    },
    reviewRating: {
      ratingValue: 5,
      bestRating: 5
    },
    author: {
      type: 'Organization',
      name: 'Free Calorie Track'
    },
    reviewBody: 'The Core Fitness Adjustable Dumbbells are perfect for beginners and intermediate lifters. The twist-to-select mechanism is ridiculously easy, the design is compact and well-balanced, and the comfortable grip makes longer sets manageable. I\'ve had these for a while now and they\'ve held up great with regular use. They come with a 2-year warranty which is reassuring. For anyone who needs weights up to 50 lbs and wants the convenience of adjustables without a full rack, these are an excellent choice.'
  },

  'best-blenders-for-protein-shakes': {
    type: 'Review',
    itemReviewed: {
      name: 'NutriBullet Pro 900',
      description: '900-watt personal blender with extractor blades, portable blending cups, and dishwasher-safe parts. Designed for protein shakes and smoothies.'
    },
    reviewRating: {
      ratingValue: 5,
      bestRating: 5
    },
    author: {
      type: 'Organization',
      name: 'Free Calorie Track'
    },
    reviewBody: 'I\'ve owned two NutriBullet Pro 900s for 2+ years and use them daily for protein shakes. The cleanup takes 30 seconds, the flatter blades are safer and more effective, and you can drink straight from the container. It\'s perfect for daily protein shakes and smoothies, blending everything smooth in seconds. The 900-watt motor handles typical protein shakes with ease. The design is sleek and compact, fitting under most cabinets. For consistent daily protein shakes, this is the best blender I\'ve used.'
  },

  'breville-barista-express-review': {
    type: 'Review',
    itemReviewed: {
      name: 'Breville Barista Express Espresso Machine',
      description: 'Semi-automatic espresso machine with built-in conical burr grinder, 15-bar Italian pump, and precise temperature control.'
    },
    reviewRating: {
      ratingValue: 5,
      bestRating: 5
    },
    author: {
      type: 'Organization',
      name: 'Free Calorie Track'
    },
    reviewBody: 'After 6+ years of daily use, the Breville Barista Express is the greatest product I own. It has saved us thousands on coffee while delivering café-quality espresso at home. The built-in grinder is convenient, the machine is reliable and consistent, and the espresso quality rivals high-end coffee shops. The only maintenance needed has been descaling and replacing the water filter. If you drink espresso regularly and want to stop spending $5+ per drink, this machine pays for itself in months and will last for years.'
  },

  'oxo-obsidian-carbon-steel-pan-review': {
    type: 'Review',
    itemReviewed: {
      name: 'OXO Obsidian 10" Carbon Steel Frying Pan',
      description: 'Lightweight carbon steel frying pan with factory seasoning, rubber handle grip, and no chemical coating. Gets better with use.'
    },
    reviewRating: {
      ratingValue: 5,
      bestRating: 5
    },
    author: {
      type: 'Organization',
      name: 'Free Calorie Track'
    },
    reviewBody: 'The OXO Obsidian is the best entry point into chemical-free cookware. Lightweight compared to cast iron but thick enough to distribute heat evenly, it excels at searing and handles delicate things like pancakes better than expected. The factory seasoning gives you a real head start. Eggs require technique and patience, and scrambled eggs will cake on — that\'s the honest tradeoff. Maintenance is simple: skip the soap, scrub with a Scrub Daddy and cold water, dry completely, and rub with a little high-heat oil. For anyone trying to get chemical coatings out of their kitchen, this is a great pan to start with.'
  },

  'zelus-weighted-vest-review': {
    type: 'Review',
    itemReviewed: {
      name: 'ZELUS Weighted Vest',
      description: 'Adjustable weighted vest with removable weight bags, comfortable shoulder padding, and low-profile design. Available in multiple weight options.'
    },
    reviewRating: {
      ratingValue: 5,
      bestRating: 5
    },
    author: {
      type: 'Organization',
      name: 'Free Calorie Track'
    },
    reviewBody: 'The ZELUS weighted vest is the best budget option for rucking and calisthenics. It\'s comfortable enough for long walks, has adjustable weights that are easy to add or remove, and the low-profile design doesn\'t restrict movement. After months of regular use for rucking and bodyweight exercises, it\'s held up perfectly with no durability issues. For anyone wanting to add load to walks, runs, or bodyweight exercises without breaking the bank, this vest delivers excellent value.'
  },

  // HowTo guides
  'how-to-use-a-food-scale': {
    type: 'HowTo',
    name: 'How to Use a Food Scale for Accurate Calorie Counting',
    description: 'Learn to use a food scale correctly for precise calorie tracking. Master the tare function, weighing techniques, and avoid common mistakes.',
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

  // FAQ pages
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
