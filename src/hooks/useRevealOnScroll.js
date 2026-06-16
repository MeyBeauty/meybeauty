import { useEffect } from 'react';

export default function useRevealOnScroll(selector = '.reveal', options = { threshold: 0.1 }) {
  useEffect(() => {
    const elements = document.querySelectorAll(selector);
    if (!elements.length) return;

    if (typeof window === 'undefined' || typeof window.IntersectionObserver !== 'function') {
      elements.forEach((el) => el.classList.add('visible'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          observer.unobserve(e.target);
        }
      });
    }, options);

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [selector, JSON.stringify(options)]);
}
