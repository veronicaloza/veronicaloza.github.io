document.querySelector('.scroll-top-btn')?.addEventListener('click', () => {
    if (window.lenis) {
        window.lenis.scrollTo(0, { lerp: 0.12 });
    } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
});
if (typeof initProjectNav === 'function') initProjectNav();
