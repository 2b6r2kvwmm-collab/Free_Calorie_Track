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
   * Medical Disclaimer - Top priority, required by law
   */
  medicalDisclaimer: {
    title: "⚠️ Medical Disclaimer",
    text: "This app provides estimates for informational purposes only and is not intended for medical diagnosis, treatment, or professional health advice. TDEE and calorie estimates are approximations and may not be accurate for all individuals. Always consult a qualified healthcare provider before making changes to your diet, exercise, or health routine. Free Calorie Track is provided \"as is\" without warranties and is not liable for any damages, data loss, or inaccuracies."
  },

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
    heading: "My favorite health and fitness gear",
    disclaimer: "As an Amazon Associate I earn from qualifying purchases.",
    items: [
      {
        emoji: "⚖️",
        text: "Favorite Digital Food Scale",
        url: "https://amzn.to/4qNU4Ko"
      },
      {
        emoji: "🫙",
        text: "Favorite Meal Prep Containers",
        url: "https://amzn.to/4bquRRF"
      },
      {
        emoji: "💧",
        text: "Favorite Insulated Water Bottle",
        url: "https://amzn.to/45ORPhU"
      },
      {
        emoji: "🏋️",
        text: "Favorite Small Dumbbells",
        url: "https://amzn.to/4txlhTV"
      },
      {
        emoji: "💪",
        text: "Favorite Adjustable Dumbbells",
        url: "https://amzn.to/4qU7fJY"
      },
      {
        emoji: "🥤",
        text: "Favorite Smoothie & Protein Blender",
        url: "https://amzn.to/3P38ZCB"
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
