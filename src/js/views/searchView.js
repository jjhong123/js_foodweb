import { elements } from './base'

export const getInput = () => elements.searchInput.value

//清除輸入
export const clearInput = () => {
    elements.searchInput.value = ''
}

//
export const clearResult = () => {
    elements.searchResList.innerHTML = ''
}

const renderRecipe = recipe => {
    const markup = `
    <li>
        <a class="results__link results__link--active" href="#${recipe.recipe_id}">
            <figure class="results__fig">
                <img src="${recipe.image_url}" alt="${recipe.title}">
            </figure>
            <div class="results__data">
                <h4 class="results__name">${recipe.title}</h4>
                <p class="results__author">${recipe.publisher}</p>
            </div>
        </a>
    </li>
    `
    // Example
    /*
    'beforebegin': 在 element 之前。
    'afterbegin': 在 element 裡面，第一個子元素之前。
    'beforeend': 在 element 裡面，最後一個子元素之後。
    'afterend': 在 element 之後。

    <!-- beforebegin -->
    <p>
        <!-- afterbegin -->
    foo
        <!-- beforeend -->
    </p>
        <!-- afterend -->

    */

    elements.searchResList.insertAdjacentHTML('beforeend', markup)
}

export const renderResults = recipes => {
    recipes.forEach(renderRecipe)
}
