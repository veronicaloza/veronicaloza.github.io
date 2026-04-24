(function () {
    if (typeof Lenis === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    window.lenis = new Lenis({
        autoRaf: true,
        lerp: 0.075,
        smoothWheel: true,
        syncTouch: true,
        touchMultiplier: 0.88,
        wheelMultiplier: 0.9,
        anchors: true,
    });
})();
