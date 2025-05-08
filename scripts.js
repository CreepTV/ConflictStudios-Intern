document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search');
    const categoryFilter = document.getElementById('category-filter');
    const images = document.querySelectorAll('.gallery img');

    function filterImages() {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedCategory = categoryFilter.value;

        images.forEach(img => {
            const fileName = img.src.split('/').pop().toLowerCase();
            const category = img.closest('section').id;

            if ((fileName.includes(searchTerm) || searchTerm === '') &&
                (category === selectedCategory || selectedCategory === 'all')) {
                img.parentElement.classList.remove('hidden');
            } else {
                img.parentElement.classList.add('hidden');
            }
        });
    }

    searchInput.addEventListener('input', filterImages);
    categoryFilter.addEventListener('change', filterImages);

    const categories = [
        { id: 'logos', path: './logos/' },
        { id: 'banner', path: './banner/' },
        { id: 'grafik-elemente', path: './grafik-elemente/' },
        { id: 'anderes', path: './anderes/' }
    ];

    categories.forEach(category => {
        const section = document.getElementById(category.id);
        const gallery = section.querySelector('.gallery');

        fetch(category.path)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Ordner ${category.path} konnte nicht geladen werden`);
                }
                return response.text();
            })
            .then(html => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                const links = Array.from(doc.querySelectorAll('a[href]'));

                const imageLinks = links.filter(link => link.getAttribute('href').match(/\.(jpg|jpeg|png|gif|svg)$/i));

                if (imageLinks.length > 0) {
                    imageLinks.forEach(link => {
                        const href = link.getAttribute('href');
                        const img = document.createElement('img');
                        img.src = `${category.path}${href}`; // Pfad korrekt zusammensetzen
                        img.alt = href;
                        gallery.appendChild(img);
                    });
                } else {
                    gallery.innerHTML = '<p>Keine Bilder verfügbar.</p>';
                }
            })
            .catch(error => {
                console.error(`Fehler beim Laden der Bilder aus ${category.path}:`, error);
                gallery.innerHTML = '<p>Fehler beim Laden der Bilder.</p>';
            });
    });
});