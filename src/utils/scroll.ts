/**
 * Smoothly scrolls to a target element ID while accounting for the sticky navbar height
 * and respecting user reduced-motion preferences across Android Chrome, Samsung Internet, and iOS Safari.
 */
export function scrollToElementById(id: string): void {
  const el = document.getElementById(id);
  if (!el) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const headerOffset = 74;
  const elementPosition = el.getBoundingClientRect().top + window.scrollY;
  const offsetPosition = Math.max(0, elementPosition - headerOffset);

  window.scrollTo({
    top: offsetPosition,
    behavior: prefersReduced ? 'auto' : 'smooth',
  });
}
