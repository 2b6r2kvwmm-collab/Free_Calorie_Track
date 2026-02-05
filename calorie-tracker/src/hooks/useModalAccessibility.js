import { useEffect, useRef } from 'react';

/**
 * Custom hook to add keyboard accessibility to modals
 * Features:
 * - Focus trapping (Tab/Shift+Tab)
 * - Escape key to close
 * - Auto-focus first element
 * - Return focus to trigger element on close
 *
 * @param {boolean} isOpen - Whether the modal is currently open
 * @param {function} onClose - Callback to close the modal
 * @param {boolean} enableFocusTrap - Whether to trap focus (default: true)
 */
export function useModalAccessibility(isOpen, onClose, enableFocusTrap = true) {
  const modalRef = useRef(null);
  const previousFocusRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    // Store the element that had focus before modal opened
    previousFocusRef.current = document.activeElement;

    // Focus first focusable element in modal after a brief delay
    // (gives React time to render modal content)
    const focusTimer = setTimeout(() => {
      if (modalRef.current) {
        const focusableElements = getFocusableElements(modalRef.current);
        if (focusableElements.length > 0) {
          focusableElements[0].focus();
        }
      }
    }, 100);

    return () => clearTimeout(focusTimer);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !enableFocusTrap) return;

    const handleKeyDown = (e) => {
      // Handle Escape key
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      // Handle Tab key for focus trapping
      if (e.key === 'Tab' && modalRef.current) {
        const focusableElements = getFocusableElements(modalRef.current);

        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        // Shift+Tab on first element -> go to last
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
        // Tab on last element -> go to first
        else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);

      // Return focus to previous element when modal closes
      if (previousFocusRef.current && typeof previousFocusRef.current.focus === 'function') {
        previousFocusRef.current.focus();
      }
    };
  }, [isOpen, onClose, enableFocusTrap]);

  return modalRef;
}

/**
 * Get all focusable elements within a container
 */
function getFocusableElements(container) {
  const focusableSelectors = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ];

  const elements = container.querySelectorAll(focusableSelectors.join(','));
  return Array.from(elements).filter(el => {
    // Filter out elements that are hidden or have display: none
    return el.offsetParent !== null && window.getComputedStyle(el).visibility !== 'hidden';
  });
}
