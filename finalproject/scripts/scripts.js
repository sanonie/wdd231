const yearTarget = document.querySelector("#copyright");
const modifiedTarget = document.querySelector("#lastModified");

if (yearTarget) {
    const year = new Date().getFullYear();
    yearTarget.textContent = `© ${year} Sanonie | Uganda All Rights Reserved`;
}

if (modifiedTarget) {
    modifiedTarget.textContent = `Last Modified: ${document.lastModified}`;
}

fetch('data.json')
    .then(response => response.json())
    .then(data => {
        if (document.getElementById('name'))
            document.getElementById('name').textContent = data.name;

        if (document.getElementById('tagline'))
            document.getElementById('tagline').textContent = data.tagline;

        if (document.getElementById('address'))
            document.getElementById('address').textContent = data.address;

        if (document.getElementById('email'))
            document.getElementById('email').textContent = data.email;

        if (document.getElementById('phone'))
            document.getElementById('phone').textContent = data.phone;

        if (document.getElementById('hours'))
            document.getElementById('hours').textContent = data.hours;
    })
    .catch(error => console.error('Error loading JSON:', error));


const menuButton = document.getElementById('menuButton');
const nav = document.getElementById('primaryNav');

if (menuButton && nav) {
    menuButton.addEventListener('click', () => {
        nav.classList.toggle('show');

        const expanded = menuButton.getAttribute('aria-expanded') === 'true';
        menuButton.setAttribute('aria-expanded', String(!expanded));
    });
}
