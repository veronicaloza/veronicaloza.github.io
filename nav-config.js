// Project order matches index.html display order. Categories must match entry class names.
const PROJECT_NAV = [
    { id: 'one', path: 'one/index.html', categories: ['Editorial'] },
    { id: 'three', path: 'three/index.html', categories: ['Branding'] },
    { id: 'printed_matter', path: 'printed_matter/index.html', categories: ['Motion', 'Branding'] },
    { id: 'five', path: 'five/index.html', categories: ['Website', 'Editorial'] },
    { id: 'four', path: 'four/index.html', categories: ['Editorial'] },
];

function getFilteredOrder(filter) {
    if (!filter || filter === 'all') {
        return PROJECT_NAV.map(p => p.path);
    }
    return PROJECT_NAV
        .filter(p => p.categories.includes(filter))
        .map(p => p.path);
}

function getCurrentProjectPath() {
    const path = window.location.pathname;
    const match = path.match(/\/([^/]+)\/index\.html$/);
    return match ? match[1] + '/index.html' : null;
}

function initProjectNav() {
    const params = new URLSearchParams(window.location.search);
    const filter = params.get('filter') || 'all';
    const filteredPaths = getFilteredOrder(filter);
    const currentPath = getCurrentProjectPath();
    if (!currentPath) return;

    const currentIndex = filteredPaths.findIndex(p => p === currentPath || p.endsWith(currentPath));
    const filterParam = filter !== 'all' ? `?filter=${encodeURIComponent(filter)}` : '';

    const prevBtn = document.querySelector('.nav-prev');
    const nextBtn = document.querySelector('.nav-next');

    if (prevBtn) {
        if (currentIndex > 0) {
            prevBtn.href = '../' + filteredPaths[currentIndex - 1] + filterParam;
        } else {
            prevBtn.href = '../index.html';
        }
    }

    if (nextBtn) {
        if (currentIndex >= 0 && currentIndex < filteredPaths.length - 1) {
            nextBtn.href = '../' + filteredPaths[currentIndex + 1] + filterParam;
        } else {
            nextBtn.href = '../index.html';
        }
    }
}
