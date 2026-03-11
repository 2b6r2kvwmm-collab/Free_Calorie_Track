// Utility to lock body scroll without causing layout shift
// Calculates scrollbar width and adds padding to compensate

export function lockScroll() {
  // Calculate scrollbar width
  const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

  // Set CSS variable for scrollbar width
  document.documentElement.style.setProperty('--scrollbar-width', `${scrollbarWidth}px`);

  // Add modal-open class to body
  document.body.classList.add('modal-open');
}

export function unlockScroll() {
  // Remove modal-open class from body
  document.body.classList.remove('modal-open');

  // Clean up CSS variable
  document.documentElement.style.removeProperty('--scrollbar-width');
}
