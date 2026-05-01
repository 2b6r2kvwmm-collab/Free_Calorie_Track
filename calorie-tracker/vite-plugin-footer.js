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
        <a href="${content.supportSection.buttonUrl}" target="_blank" rel="noopener noreferrer" class="support-button">
          ${content.supportSection.buttonText}
        </a>
      </div>

      <hr class="footer-divider">

      <div style="margin-top: 35px; margin-bottom: 20px;">
        <p class="gear-header" style="color: #999; margin-bottom: 4px;">
          <strong>${content.gearLinks.heading}</strong>
        </p>
        <p style="font-size: 12px; color: #888; margin-bottom: 20px;">
          ${content.gearLinks.disclaimer}
        </p>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; max-width: 700px; margin: 0 auto;">
          ${content.gearLinks.items.map(item => `
          <div class="gear-card">
            <div style="font-size: 22px; margin-bottom: 8px;">${item.emoji}</div>
            <div class="gear-card-title">${item.name}</div>
            <div class="gear-card-desc">${item.desc}</div>
            <a href="${item.url}" target="_blank" rel="noopener noreferrer" style="display: block; background: #10b981; color: #fff; text-decoration: none; font-size: 12px; font-weight: 600; padding: 7px 12px; border-radius: 6px; margin-bottom: 8px;">Buy on Amazon →</a>
            <a href="${item.reviewUrl}" class="gear-card-review">Read my review</a>
          </div>`).join('')}
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
