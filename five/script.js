const container = document.querySelector(
    '.horizontal-scroll-container'
);
const overlay = document.getElementById(
    'scroll-arrow-overlay'
);
const AMOUNT = 600;

// show/hide
container.addEventListener('pointerenter', () => {
    overlay.style.display = 'block';
});
container.addEventListener('pointerleave', () => {
    overlay.style.display = 'none';
});

// move & flip icon
container.addEventListener('pointermove', e => {
    const rect = container.getBoundingClientRect();
    const mid = rect.left + rect.width / 2;
    overlay.style.left = `${e.clientX}px`;
    overlay.style.top = `${e.clientY}px`;

    if (e.clientX < mid) {
        overlay.classList.add('dir-left');
        overlay.dataset.dir = 'left';
    } else {
        overlay.classList.remove('dir-left');
        overlay.dataset.dir = 'right';
    }
});

// click → scroll
container.addEventListener('click', () => {
    const dir = overlay.dataset.dir;
    const delta = dir === 'left' ? -AMOUNT : AMOUNT;
    container.scrollBy({ left: delta, behavior: 'smooth' });
});

// your wheel → horiz (desktop only)
container.addEventListener('wheel', e => {
    if (window.innerWidth > 768) {
        e.preventDefault();
        container.scrollLeft += e.deltaY * 1.5;
    }
}, { passive: false });