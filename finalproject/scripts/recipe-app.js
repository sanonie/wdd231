const recipesContainer = document.querySelector('#recipes');
const searchInput = document.querySelector('#searchInput');
const searchButton = document.querySelector('#searchButton');
const searchStatus = document.querySelector('#searchStatus');
const modal = document.querySelector('#recipeModal');
const modalTitle = document.querySelector('#modalTitle');
const modalBody = document.querySelector('#modalBody');
const modalClose = document.querySelector('#modalClose');

const storageKey = 'recipeLastSearch';
const recipeDataFile = 'recipes.json';
let recipesData = [];

function saveLastSearch(query) {
    localStorage.setItem(storageKey, query);
}

function getLastSearch() {
    return localStorage.getItem(storageKey) || '';
}

async function loadRecipes() {
    if (!recipesContainer) {
        return;
    }

    try {
        const response = await fetch(recipeDataFile);
        if (!response.ok) {
            throw new Error('Recipe data not available');
        }

        recipesData = await response.json();
        const previousQuery = getLastSearch();

        if (previousQuery && searchInput) {
            searchInput.value = previousQuery;
            renderRecipes(filterRecipes(previousQuery));
        } else {
            renderRecipes(recipesData);
        }
    } catch (error) {
        recipesContainer.innerHTML = `<p class="error-message">Sorry, we could not load the recipe list right now.</p>`;
        console.error(error);
    }
}

function filterRecipes(query) {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
        return recipesData;
    }

    return recipesData.filter(recipe => {
        return [
            recipe.title,
            recipe.description,
            recipe.cuisine,
            recipe.diet.join(' ')
        ]
            .join(' ')
            .toLowerCase()
            .includes(normalized);
    });
}

function renderRecipes(recipes) {
    if (!recipesContainer) {
        return;
    }

    const count = recipes.length;
    recipesContainer.innerHTML = recipes
        .map(recipe => `
      <article class="card" tabindex="0">
        <img src="${recipe.image}" alt="${recipe.title}" loading="lazy" width="400" height="250">
        <div class="card-content">
          <h3>${recipe.title}</h3>
          <p>${recipe.description}</p>
          <ul class="recipe-details">
            <li><strong>Calories:</strong> ${recipe.calories}</li>
            <li><strong>Cuisine:</strong> ${recipe.cuisine}</li>
            <li><strong>Diet:</strong> ${recipe.diet.join(', ')}</li>
          </ul>
          <div class="card-actions">
            <button type="button" class="details-button" data-id="${recipe.id}">View Details</button>
            <a class="button" href="${recipe.url}" target="_blank" rel="noopener noreferrer">View Recipe</a>
          </div>
        </div>
      </article>
    `)
        .join('');

    if (searchStatus) {
        const label = count === 1 ? 'recipe' : 'recipes';
        searchStatus.textContent = `${count} ${label} found`;
    }
}

function openModal(recipeId) {
    const recipe = recipesData.find(item => item.id === recipeId);
    if (!recipe || !modal) {
        return;
    }

    modalTitle.textContent = recipe.title;
    modalBody.innerHTML = `
    <img src="${recipe.image}" alt="${recipe.title}" loading="lazy" width="600" height="360">
    <p>${recipe.description}</p>
    <ul>
      <li><strong>Calories:</strong> ${recipe.calories}</li>
      <li><strong>Cuisine:</strong> ${recipe.cuisine}</li>
      <li><strong>Diet:</strong> ${recipe.diet.join(', ')}</li>
    </ul>
    <a class="button" href="${recipe.url}" target="_blank" rel="noopener noreferrer">Open full recipe</a>
  `;

    modal.showModal();
    modalClose.focus();
}

function closeModal() {
    if (modal) {
        modal.close();
    }
}

function handleRecipeClick(event) {
    const button = event.target.closest('[data-id]');
    if (!button) {
        return;
    }

    const recipeId = Number(button.dataset.id);
    openModal(recipeId);
}

function handleSearch() {
    if (!searchInput) {
        return;
    }

    const query = searchInput.value.trim();
    saveLastSearch(query);
    renderRecipes(filterRecipes(query));
}

function initSearch() {
    if (!searchInput || !searchButton) {
        return;
    }

    searchButton.addEventListener('click', handleSearch);
    searchInput.addEventListener('keydown', event => {
        if (event.key === 'Enter') {
            event.preventDefault();
            handleSearch();
        }
    });
}

function initModal() {
    if (!modal) {
        return;
    }

    modal.addEventListener('click', event => {
        if (event.target === modal) {
            closeModal();
        }
    });

    modal.addEventListener('cancel', closeModal);
    modalClose?.addEventListener('click', closeModal);
}

window.addEventListener('DOMContentLoaded', () => {
    if (!recipesContainer) {
        return;
    }

    initSearch();
    initModal();
    recipesContainer.addEventListener('click', handleRecipeClick);
    loadRecipes();
});
