const gallery = document.querySelector('#discoverGallery');
const visitMessage = document.querySelector('#visitMessage');
const closeVisitButton = document.querySelector('#closeVisitMessage');
const VISIT_STORAGE_KEY = 'chamberDiscoverLastVisit';

function formatVisitMessage() {
    const lastVisitValue = localStorage.getItem(VISIT_STORAGE_KEY);
    const now = Date.now();

    if (!lastVisitValue) {
        localStorage.setItem(VISIT_STORAGE_KEY, String(now));
        return 'Welcome! Let us know if you have any questions.';
    }

    const lastVisit = Number(lastVisitValue);
    if (Number.isNaN(lastVisit)) {
        localStorage.setItem(VISIT_STORAGE_KEY, String(now));
        return 'Welcome! Let us know if you have any questions.';
    }

    const elapsedDays = Math.floor((now - lastVisit) / 86400000);
    localStorage.setItem(VISIT_STORAGE_KEY, String(now));

    if (elapsedDays === 0) {
        return 'Back so soon! Awesome!';
    }

    return `You last visited ${elapsedDays} ${elapsedDays === 1 ? 'day' : 'days'} ago.`;
}

async function loadDiscoverPlaces() {
    try {
        const response = await fetch('data/discover-data.json');
        if (!response.ok) {
            throw new Error(`Failed to load discover data: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error(error);
        return [];
    }
}

async function renderDiscoverCards() {
    if (!gallery) return;

    const discoverPlaces = await loadDiscoverPlaces();

    gallery.innerHTML = discoverPlaces
        .map((place, index) => `
        <article class="discover-card place-${index + 1}">
            <h2>${place.title}</h2>
            <figure>
                <picture>
                    <source srcset="${place.image}" type="image/webp">
                    <img src="${place.fallback}" alt="${place.title} photo" width="300" height="200" loading="lazy">
                </picture>
            </figure>
            <address>${place.address}</address>
            <p>${place.description}</p>
            <button type="button">learn more</button>
        </article>
    `)
        .join('');
}

function initVisitMessage() {
    if (!visitMessage) return;
    visitMessage.textContent = formatVisitMessage();

    if (closeVisitButton) {
        closeVisitButton.addEventListener('click', () => {
            visitMessage.parentElement?.classList.add('hidden');
        });
    }
}

renderDiscoverCards();
initVisitMessage();
