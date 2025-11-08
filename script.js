const select = document.getElementById('categorySelect');
const entries = document.querySelectorAll('.entry');

select.addEventListener('change', (e) => {
    const selectedCategory = e.target.value;
    entries.forEach((entry) => {
        if (selectedCategory === 'all' || entry.classList.contains(selectedCategory)) {
            entry.style.display = 'flex';
        } else {
            entry.style.display = 'none';
        }
    });
});