const yearTarget = document.querySelector("#copyright");
const modifiedTarget = document.querySelector("#lastModified");

if (yearTarget) {
    const year = new Date().getFullYear();
    yearTarget.textContent = `© ${year} Sanonie | Nigeria`;
}

if (modifiedTarget) {
    modifiedTarget.textContent = `Last Modified: ${document.lastModified}`;
}
