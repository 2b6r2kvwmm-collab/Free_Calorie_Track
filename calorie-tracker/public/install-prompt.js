// Install prompt logic for PWA
// Moved from inline script to fix CSP 'unsafe-inline' vulnerability

// Add event listeners for close buttons
document.addEventListener('DOMContentLoaded', function() {
  // iOS prompt close button
  document.getElementById('ios-close-btn')?.addEventListener('click', function() {
    document.getElementById('ios-install-prompt').style.display = 'none';
  });

  // Desktop banner close button
  document.getElementById('desktop-close-btn')?.addEventListener('click', function() {
    document.getElementById('desktop-install-banner').style.display = 'none';
    localStorage.setItem('desktopBannerDismissed', 'true');
  });
});

// 1. Check if user is on iOS
const isIos = /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase());

// 2. Check if user is on Android
const isAndroid = /android/.test(window.navigator.userAgent.toLowerCase());

// 3. Check if on mobile (iOS or Android)
const isMobile = isIos || isAndroid;

// 4. Check if app is already installed (standalone mode)
const isStandalone = window.navigator.standalone || window.matchMedia('(display-mode: standalone)').matches;

// 5. Check if desktop banner was dismissed
const desktopBannerDismissed = localStorage.getItem('desktopBannerDismissed');

// Show iOS popup ONLY if on iOS and NOT installed
if (isIos && !isStandalone) {
  setTimeout(() => {
      document.getElementById('ios-install-prompt').style.display = 'block';
  }, 2000);
}

// Show desktop banner ONLY if on desktop (not mobile) and not dismissed
if (!isMobile && !desktopBannerDismissed) {
  setTimeout(() => {
      document.getElementById('desktop-install-banner').style.display = 'block';
  }, 1000);
}
