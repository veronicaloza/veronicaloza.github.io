(function () {
    const header = document.querySelector('.Mini-Titles');
    if (!header) return;

    const bar = document.createElement('div');
    bar.className = 'scroll-progress-bar';
    bar.innerHTML = '<div class="scroll-progress-fill"></div>';
    header.after(bar);

    const fill = bar.querySelector('.scroll-progress-fill');
    let raf = 0;
    function apply() {
        const lenis = window.lenis;
        const scrollTop = lenis ? lenis.scroll : window.scrollY;
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = scrollHeight > 0 ? Math.min((scrollTop / scrollHeight) * 100, 100) : 0;
        fill.style.width = progress + '%';
        raf = 0;
    }
    function update() {
        if (raf) return;
        raf = requestAnimationFrame(apply);
    }
    if (window.lenis) {
        window.lenis.on('scroll', apply);
    } else {
        window.addEventListener('scroll', update, { passive: true });
    }
    apply();
})();
