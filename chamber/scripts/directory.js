const memberContainer = document.querySelector("#memberContainer");
const gridViewButton = document.querySelector("#gridView");
const listViewButton = document.querySelector("#listView");

const membersUrl = "data/members.json";
let members = [];

function getMembershipLabel(level) {
    if (level === 3) {
        return "Gold";
    }

    if (level === 2) {
        return "Silver";
    }

    return "Member";
}

function renderMembers(view = "grid") {
    if (!memberContainer) {
        return;
    }

    const wrapperClass = view === "list" ? "members-list" : "members-grid";
    memberContainer.className = wrapperClass;

    memberContainer.innerHTML = members
        .map((member) => {
            return `
                <article class="member-card">
                    <img src="images/${member.image}" alt="${member.name} logo" loading="lazy" width="320" height="180">
                    <h3>${member.name}</h3>
                    <p>${member.address}</p>
                    <p>${member.phone}</p>
                    <p>Membership: ${getMembershipLabel(member.membershipLevel)}</p>
                    <p>Industry: ${member.industry}</p>
                    <p>${member.tagline}</p>
                    <p><a href="${member.website}" target="_blank" rel="noopener noreferrer">Visit Website</a></p>
                </article>
            `;
        })
        .join("");
}

async function loadMembers() {
    if (!memberContainer) {
        return;
    }

    try {
        const response = await fetch(membersUrl);

        if (!response.ok) {
            throw new Error("Member data request failed.");
        }

        members = await response.json();
        renderMembers("grid");
    } catch (error) {
        memberContainer.className = "members-list";
        memberContainer.innerHTML = "<p>Unable to load chamber members at this time.</p>";
        console.error(error);
    }
}

function setActiveView(view) {
    if (!gridViewButton || !listViewButton) {
        return;
    }

    const isGrid = view === "grid";
    gridViewButton.classList.toggle("active", isGrid);
    listViewButton.classList.toggle("active", !isGrid);
    gridViewButton.setAttribute("aria-pressed", String(isGrid));
    listViewButton.setAttribute("aria-pressed", String(!isGrid));
}

if (gridViewButton && listViewButton) {
    gridViewButton.addEventListener("click", () => {
        setActiveView("grid");
        renderMembers("grid");
    });

    listViewButton.addEventListener("click", () => {
        setActiveView("list");
        renderMembers("list");
    });
}

setActiveView("grid");
loadMembers();
