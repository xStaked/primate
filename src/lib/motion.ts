import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
document.documentElement.classList.add('js');

if (reduced) {
  document.documentElement.classList.remove('js');
} else {
  /* Hero: entrada escalonada */
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  tl.from('[data-hero="kicker"]', { y: 24, opacity: 0, duration: 0.7 }, 0.1)
    .from('[data-hero="title"] .line', { yPercent: 110, duration: 1, stagger: 0.12 }, 0.2)
    .from('[data-hero="lede"]', { y: 28, opacity: 0, duration: 0.8 }, 0.7)
    .from('[data-hero="cta"]', { y: 28, opacity: 0, duration: 0.8 }, 0.85)
    .from('[data-hero="fig"]', { opacity: 0, scale: 1.04, duration: 1.4, ease: 'power2.out' }, 0.35)
    .from('[data-hero="meta"]', { opacity: 0, duration: 0.8 }, 1);

  /* Reveal genérico al hacer scroll */
  gsap.utils.toArray<HTMLElement>('[data-reveal]:not([data-reveal="clip"])').forEach((el) => {
    gsap.fromTo(
      el,
      { y: 36, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%' },
      },
    );
  });

  /* Imágenes con clip-path */
  gsap.utils.toArray<HTMLElement>('[data-reveal="clip"]').forEach((el) => {
    gsap.to(el, {
      opacity: 1,
      clipPath: 'inset(0% 0% 0% 0%)',
      duration: 1.2,
      ease: 'power3.inOut',
      scrollTrigger: { trigger: el, start: 'top 85%' },
    });
  });

  /* Parallax suave */
  gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((el) => {
    const speed = parseFloat(el.dataset.parallax || '0.12');
    gsap.fromTo(
      el,
      { yPercent: -speed * 100 },
      {
        yPercent: speed * 100,
        ease: 'none',
        scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
      },
    );
  });

  /* Contadores */
  gsap.utils.toArray<HTMLElement>('[data-count]').forEach((el) => {
    const target = parseInt(el.dataset.count || '0', 10);
    const pad = (el.dataset.count || '').length;
    const obj = { v: 0 };
    ScrollTrigger.create({
      trigger: el,
      start: 'top 90%',
      once: true,
      onEnter: () =>
        gsap.to(obj, {
          v: target,
          duration: 1.4,
          ease: 'power2.out',
          onUpdate: () => {
            el.textContent = String(Math.round(obj.v)).padStart(pad, '0');
          },
        }),
    });
  });

  /* Progreso de navegación */
  const progress = document.querySelector<HTMLElement>('[data-progress]');
  if (progress) {
    gsap.to(progress, {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: 0.3 },
    });
  }

  /* Transición de color entre secciones marcadas */
  gsap.utils.toArray<HTMLElement>('[data-tint]').forEach((el) => {
    gsap.fromTo(
      el,
      { opacity: 0.35 },
      {
        opacity: 1,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top 90%', end: 'top 40%', scrub: true },
      },
    );
  });

  /* Hover 3D sutil en productos (solo puntero fino) */
  if (window.matchMedia('(pointer: fine)').matches) {
    document.querySelectorAll<HTMLElement>('[data-tilt]').forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        gsap.to(card, { rotateY: x * 7, rotateX: -y * 7, transformPerspective: 900, duration: 0.4 });
      });
      card.addEventListener('mouseleave', () => {
        gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.6, ease: 'power3.out' });
      });
    });
  }
}
