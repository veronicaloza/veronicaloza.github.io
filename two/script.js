document.querySelector('.scroll-top-btn')?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});
if (typeof initProjectNav === 'function') initProjectNav();
