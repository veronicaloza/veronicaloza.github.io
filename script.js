function escapeHtml(text) {
    const el = document.createElement('div');
    el.textContent = text;
    return el.innerHTML;
}

function initCaptionWordAnimation() {
    document.querySelectorAll('.entry-caption').forEach((caption) => {
        let wordIndex = 0;
        const lines = caption.innerHTML.split(/<br\s*\/?>/i);
        const built = lines
            .map((line) => {
                const textOnly = line.replace(/<[^>]*>/g, '').trim();
                if (!textOnly) return '';
                return textOnly
                    .split(/\s+/)
                    .filter(Boolean)
                    .map((word) => {
                        const i = wordIndex;
                        wordIndex += 1;
                        return `<span class="caption-word" style="--w:${i}">${escapeHtml(word)}</span>`;
                    })
                    .join(' ');
            })
            .filter((s) => s !== '');
        caption.innerHTML = built
            .map((line) => (line ? `<span class="caption-line">${line}</span>` : ''))
            .filter(Boolean)
            .join('');
    });
}

initCaptionWordAnimation();

const scrollProgressFill = document.querySelector('.scroll-progress-fill');
if (scrollProgressFill) {
    let progressRaf = 0;
    function readScrollProgress() {
        const lenis = window.lenis;
        const scrollTop = lenis ? lenis.scroll : window.scrollY;
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = scrollHeight > 0 ? Math.min((scrollTop / scrollHeight) * 100, 100) : 0;
        scrollProgressFill.style.width = `${progress}%`;
        progressRaf = 0;
    }
    function updateScrollProgress() {
        if (progressRaf) return;
        progressRaf = requestAnimationFrame(readScrollProgress);
    }
    if (window.lenis) {
        window.lenis.on('scroll', readScrollProgress);
    } else {
        window.addEventListener('scroll', updateScrollProgress, { passive: true });
    }
    readScrollProgress();
}

const filterButtons = document.querySelectorAll('.filter-btn');
const select = document.getElementById('categorySelect');
const entries = document.querySelectorAll('.entry');
const selectedWorksCount = document.querySelector('#selected-works .count');

const categories = ['all', 'Branding', 'Website', 'Editorial', 'Motion'];

function getCategoryCounts() {
    const counts = { all: entries.length };
    categories.forEach(cat => {
        if (cat !== 'all') {
            counts[cat] = [...entries].filter(entry => entry.classList.contains(cat)).length;
        }
    });
    return counts;
}

function updateCounts() {
    const counts = getCategoryCounts();

    // Update selected-works count
    if (selectedWorksCount) selectedWorksCount.textContent = counts.all;

    // Update filter button counts
    filterButtons.forEach(btn => {
        const countEl = btn.querySelector('.count');
        if (countEl) countEl.textContent = counts[btn.dataset.category] ?? 0;
    });

    // Update select options with counts
    if (select) {
        const options = select.querySelectorAll('option');
        options.forEach(opt => {
            const label = opt.value === 'all' ? 'All' : opt.value;
            opt.textContent = `${label} (${counts[opt.value] ?? 0})`;
        });
    }
}

function filterEntries(selectedCategory) {
    entries.forEach((entry) => {
        const wrapper = entry.closest('.entry-item');
        const item = wrapper || entry;
        if (selectedCategory === 'all' || entry.classList.contains(selectedCategory)) {
            item.style.display = '';
        } else {
            item.style.display = 'none';
        }
    });
    updateEntryLinks(selectedCategory);
}

function updateEntryLinks(filter) {
    const param = filter && filter !== 'all' ? `?filter=${encodeURIComponent(filter)}` : '';
    entries.forEach((entry) => {
        const href = entry.getAttribute('href');
        if (href && !href.startsWith('http')) {
            const base = href.split('?')[0];
            entry.setAttribute('href', base + param);
        }
    });
}

if (select && filterButtons.length) {
    updateCounts();
    updateEntryLinks(select.value);

    filterButtons.forEach((button) => {
        button.addEventListener('click', () => {
            filterButtons.forEach((btn) => btn.classList.remove('active'));
            button.classList.add('active');
            select.value = button.dataset.category;
            filterEntries(button.dataset.category);
        });
    });

    select.addEventListener('change', (e) => {
        const selectedCategory = e.target.value;
        filterButtons.forEach((btn) => {
            btn.classList.toggle('active', btn.dataset.category === selectedCategory);
        });
        filterEntries(selectedCategory);
    });
} else if (select && entries.length) {
    updateEntryLinks(select.value);
}