/**
 * Vite Plugin: Footer Injection
 *
 * Injects footer content from /shared/footer-content.js into index.html at build time.
 * This ensures the footer stays in sync between the main app and the Astro blog.
 */

import { footerContent } from '../shared/footer-content.js';

export default function footerInjectionPlugin() {
  return {
    name: 'footer-injection',
    transformIndexHtml(html) {
      // Generate footer HTML from shared content
      const footerHTML = generateFooterHTML(footerContent);

      // Replace the existing footer section
      // Look for the app-footer div and replace it with the generated footer
      const footerRegex = /<div class="app-footer">[\s\S]*?<\/div>\s*<\/body>/;

      if (footerRegex.test(html)) {
        return html.replace(footerRegex, `<div class="app-footer">\n${footerHTML}\n    </div>\n  </body>`);
      }

      // If no footer found, append before closing body tag
      return html.replace('</body>', `<div class="app-footer">\n${footerHTML}\n    </div>\n  </body>`);
    },
  };
}

function generateFooterHTML(content) {
  return `
      <!-- Medical Disclaimer - Top Priority -->
      <div class="medical-disclaimer">
        <h3>${content.medicalDisclaimer.title}</h3>
        <p>
          ${content.medicalDisclaimer.text}
        </p>
      </div>

      <hr class="footer-divider">

      <div style="margin-bottom: 25px;">
        <h3 class="footer-heading">
          ${content.supportSection.heading}
        </h3>
        <p style="font-size: 14px; line-height: 1.5; color: #999; max-width: 500px; margin: 0 auto 15px;">
          ${content.supportSection.description}
        </p>
        <a href="${content.supportSection.buttonUrl}" target="_blank" rel="noopener noreferrer" class="support-button">
          ${content.supportSection.buttonText}
        </a>
      </div>

      <hr class="footer-divider">

      <div style="margin-top: 35px; margin-bottom: 20px;">
        <p class="gear-header" style="color: #999; margin-bottom: 8px;">
          <strong>${content.gearLinks.heading}</strong>
        </p>
        <p style="font-size: 12px; color: #888; margin-bottom: 12px;">
          ${content.gearLinks.disclaimer}
        </p>
        <div class="gear-grid">
          ${content.gearLinks.items.map(link => `
          <a href="${link.url}" target="_blank" rel="noopener noreferrer" class="footer-link">
            ${link.emoji} ${link.text}
          </a>`).join('')}
        </div>
      </div>

      <hr class="footer-divider">

      <div style="margin-top: 30px;">
        <a href="${content.feedbackLink.url}" target="_blank" rel="noopener noreferrer" style="color: #999; text-decoration: none; font-size: 12px;">
          ${content.feedbackLink.text}
        </a>
      </div>

      <div style="margin-top: 20px; font-size: 12px; color: #999; line-height: 1.8;">
        <div style="margin-bottom: 8px;">
          ${content.legalLinks.map((link, index) => `
          <a href="${link.url}" target="_blank" style="color: #999; text-decoration: none; margin: 0 6px;">${link.text}</a>${index < content.legalLinks.length - 1 ? '\n          <span>•</span>' : ''}`).join('')}
          <span>•</span>
          <span style="margin: 0 6px;">© ${content.copyright.year} ${content.copyright.entity}</span>
        </div>
      </div>`;
}
