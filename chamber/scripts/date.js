const developmentInfo = document.querySelector("#developmentInfo");
const modifiedTarget = document.querySelector("#lastModified");

if (developmentInfo) {
    const year = new Date().getFullYear();
    developmentInfo.textContent = `Sanonie | WDD 231 | © ${year}`;
}

if (modifiedTarget) {
    modifiedTarget.textContent = `Last Modified: ${document.lastModified}`;
}
