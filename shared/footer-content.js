/**
 * SINGLE SOURCE OF TRUTH: Footer Content
 *
 * This file defines all footer content for Free Calorie Track.
 * It is imported by:
 * - /calorie-tracker/index.html (Vite app) - via build-time injection
 * - /blog-astro/src/layouts/BlogLayout.astro (Astro blog) - direct import
 *
 * ⚠️ IMPORTANT: Edit this file to update footer in BOTH projects.
 * DO NOT edit footer HTML directly in index.html or BlogLayout.astro.
 *
 * Last updated: 2026-02-27
 * Maintained by: Unexpectable LLC
 */

export const footerContent = {
  /**
   * Support Section - Donation button and message
   */
  supportSection: {
    heading: "Help keep Free Calorie Track free",
    description: "No ads. No paywalls. Funded by donations and commissions on gear I actually use and love.",
    buttonText: "Chip in $5",
    buttonUrl: "https://buymeacoffee.com/griffs"
  },

  /**
   * Affiliate Gear Links - Products we recommend
   */
  gearLinks: {
    heading: "Gear I actually use",
    disclaimer: "As an Amazon Associate I earn from qualifying purchases.",
    items: [
      {
        emoji: "⚖️",
        name: "Crownful Digital Food Scale",
        desc: "The #1 thing that improved my tracking accuracy",
        url: "https://amzn.to/4bjHj5e",
        reviewUrl: "/blog/how-to-use-a-food-scale"
      },
      {
        emoji: "🥤",
        name: "NutriBullet Pro 900",
        desc: "I own two of these · Best for daily protein shakes, easy to clean",
        url: "https://amzn.to/4r0CClz",
        reviewUrl: "/blog/best-blenders-for-protein-shakes"
      },
      {
        emoji: "🏋️",
        name: "Core Fitness Adjustable Dumbbells",
        desc: "5–50 lbs · What I use at home instead of a full rack",
        url: "https://amzn.to/3MtBjNW",
        reviewUrl: "/blog/best-adjustable-dumbbells-beginners"
      }
    ]
  },

  /**
   * Feedback Link
   */
  feedbackLink: {
    text: "Feedback? We'd love to hear from you.",
    url: "https://tally.so/r/VLQOJv"
  },

  /**
   * Legal Links - Terms and Privacy
   */
  legalLinks: [
    { text: "Privacy Policy", url: "/privacy-policy.html" },
    { text: "Terms of Service", url: "/terms-of-service.html" }
  ],

  /**
   * Copyright - Auto-updates year
   */
  copyright: {
    year: new Date().getFullYear(), // Auto-updates, or set manually: 2027
    entity: "Unexpectable LLC"
  }
};

/**
 * HOW TO UPDATE FOOTER:
 *
 * 1. Add new affiliate link:
 *    Add to gearLinks.items array:
 *    { emoji: "🎽", text: "Product Name", url: "https://amzn.to/..." }
 *
 * 2. Update medical disclaimer:
 *    Edit medicalDisclaimer.text
 *
 * 3. Change support button:
 *    Edit supportSection.buttonText or buttonUrl
 *
 * 4. Update copyright year:
 *    Either let it auto-update, or set copyright.year manually
 *
 * 5. Add/remove legal links:
 *    Edit legalLinks array
 *
 * After editing, rebuild both projects:
 *   cd calorie-tracker && npm run build
 *   cd blog-astro && npm run build
 */
