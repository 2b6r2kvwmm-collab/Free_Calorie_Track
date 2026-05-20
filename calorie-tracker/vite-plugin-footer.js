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

      const marker = '<div class="app-footer"><!-- FOOTER_INJECT --></div>';
      if (html.includes(marker)) {
        return html.replace(marker, `<div class="app-footer">\n${footerHTML}\n    </div>`);
      }

      // Fallback: append before closing body tag
      return html.replace('</body>', `<div class="app-footer">\n${footerHTML}\n    </div>\n  </body>`);
    },
  };
}

function generateFooterHTML(content) {
  return `
      <div style="margin-bottom: 25px;">
        <h3 class="footer-heading">
          ${content.supportSection.heading}
        </h3>
        <p style="font-size: 14px; line-height: 1.5; color: #999; max-width: 500px; margin: 0 auto 15px;">
          ${content.supportSection.description}
        </p>
        <div style="display: flex; gap: 10px; justify-content: center;">
          <a href="${content.supportSection.buttonUrl}" target="_blank" rel="noopener noreferrer" class="support-button" onclick="history.pushState({},'','/support-clicked-footer')">
            ${content.supportSection.buttonText}
          </a>
          <a href="${content.supportSection.shopUrl}" target="_blank" rel="noopener noreferrer" class="shop-button" onclick="history.pushState({},'','/shop-clicked-footer')">
            <span class="shop-button-inner">${content.supportSection.shopText}</span>
          </a>
        </div>
      </div>

      <hr class="footer-divider">

      <div style="margin-top: 30px; margin-bottom: 20px;">
        <p style="font-size: 12px; color: #888; margin-bottom: 8px;">
          ${content.gearLinks.disclaimer}
        </p>
        <a href="https://freecalorietrack.com/blog?category=Gear+Reviews" target="_blank" rel="noopener noreferrer" style="color: #10b981; text-decoration: none; font-size: 14px; font-weight: 500;">
          Check out my favorite gear →
        </a>
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
