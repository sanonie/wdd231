
document.addEventListener('DOMContentLoaded', () => {
    initPage();
});

async function initPage() {
    showPageInfo();
    await Promise.all([fetchWeather(), loadSpotlights()]);
}

function showPageInfo() {
    const dev = document.getElementById('developmentInfo');
    if (dev) dev.textContent = 'Local development build';
    const lm = document.getElementById('lastModified');
    if (lm) lm.textContent = `Last modified: ${document.lastModified}`;
}

async function fetchWeather() {
    const key = window.OWM_API_KEY;
    const location = window.OWM_LOCATION || 'Lagos,NG';
    const units = window.OWM_UNITS || 'metric';

    const currentEl = document.getElementById('weatherCurrent');
    const forecastEl = document.getElementById('weatherForecast');

    if (!key || key === 'REPLACE_WITH_YOUR_OWM_KEY') {
        if (currentEl) currentEl.textContent = 'OpenWeatherMap API key not configured. See scripts/config.js';
        return;
    }

    try {
        const curUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&units=${units}&appid=${key}`;
        const fUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(location)}&units=${units}&appid=${key}`;

        const [curRes, fRes] = await Promise.all([fetch(curUrl), fetch(fUrl)]);
        if (!curRes.ok) throw new Error('Failed to load current weather');
        if (!fRes.ok) throw new Error('Failed to load forecast');

        const cur = await curRes.json();
        const fdata = await fRes.json();


        const temp = Math.round(cur.main.temp);
        const desc = cur.weather?.[0]?.description || '';
        if (currentEl) currentEl.innerHTML = `<strong>${temp}°</strong> — ${desc}`;

        const days = {};
        const todayStr = new Date().toDateString();
        for (const item of fdata.list) {
            const d = new Date(item.dt * 1000);
            const keyDate = d.toDateString();
            if (keyDate === todayStr) continue; // skip today
            const label = d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
            if (!days[keyDate]) days[keyDate] = { label, temps: [] };
            days[keyDate].temps.push(item.main.temp);
        }

        const dayKeys = Object.keys(days).slice(0, 3);
        if (forecastEl) {
            forecastEl.innerHTML = '';
            if (dayKeys.length === 0) {
                forecastEl.textContent = '3-day forecast not available.';
            } else {
                const ul = document.createElement('ul');
                ul.className = 'forecast-list';
                dayKeys.forEach(k => {
                    const info = days[k];
                    const temps = info.temps;
                    const avg = Math.round(temps.reduce((a, b) => a + b, 0) / temps.length);
                    const li = document.createElement('li');
                    li.innerHTML = `<strong>${info.label}:</strong> ${avg}°`;
                    ul.appendChild(li);
                });
                forecastEl.appendChild(ul);
            }
        }

    } catch (err) {
        if (currentEl) currentEl.textContent = 'Weather information unavailable';
        console.error(err);
    }
}

async function loadSpotlights() {
    try {
        const res = await fetch('data/members.json');
        if (!res.ok) throw new Error('Failed to load members');
        const members = await res.json();

        const eligible = members.filter(m => m.membershipLevel === 2 || m.membershipLevel === 3);
        shuffleArray(eligible);
        const count = Math.floor(Math.random() * 2) + 2;
        const selected = eligible.slice(0, count);

        const container = document.getElementById('spotlightContainer');
        if (!container) return;
        container.innerHTML = '';

        selected.forEach(m => {
            const card = document.createElement('div');
            card.className = 'spotlight-card';

            const logo = document.createElement('img');
            logo.src = `images/${m.image}`;
            logo.alt = `${m.name} logo`;
            logo.className = 'spotlight-logo';

            const h3 = document.createElement('h3');
            h3.textContent = m.name;

            const level = document.createElement('p');
            level.className = 'membership-level';
            level.textContent = `Membership: ${membershipName(m.membershipLevel)}`;

            const addr = document.createElement('p');
            addr.textContent = m.address;

            const phone = document.createElement('p');
            phone.textContent = `Phone: ${m.phone}`;

            const site = document.createElement('a');
            site.href = m.website;
            site.target = '_blank';
            site.rel = 'noopener';
            site.textContent = 'Visit website';

            card.appendChild(logo);
            card.appendChild(h3);
            card.appendChild(level);
            card.appendChild(addr);
            card.appendChild(phone);
            card.appendChild(site);
            container.appendChild(card);
        });

    } catch (err) {
        console.error(err);
    }
}

function membershipName(level) {
    if (level === 3) return 'Gold';
    if (level === 2) return 'Silver';
    return 'Member';
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
