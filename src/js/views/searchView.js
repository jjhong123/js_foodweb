import { elements } from './base';
import { create } from 'domain';

export const getInput = () => elements.searchInput.value;

//清除輸入
export const clearInput = () => {
    elements.searchInput.value = '';
};

//
export const clearResult = () => {
    elements.searchResList.innerHTML = '';
};

/**
 * Pasta with tomato and spinach
 * acc: 0 / acc + cur.length = 5 / newTitle = ['Pasta']
 * acc: 5 / acc + cur.length = 9 / newTitle = ['Pasta','with']
 * acc: 9 / acc + cur.length = 15 / newTitle = ['Pasta','with','tomato]
 * acc: 15 / acc + cur.length = 18 / newTitle = ['Pasta','with','tomato]
 * acc: 18 / acc + cur.length = 24 / newTitle = ['Pasta','with','tomato]
 */
const limitRecipeTitle = (title, limit = 17) => {
    const newTitle = [];
    if (title.length > limit) {
        title.split(' ').reduce((acc, cur) => {
            //比對每次累加的值有沒有超過或等於17
            if (acc + cur.length <= limit) {
                newTitle.push(cur);
            }
            return acc + cur.length;
        }, 0);

        //return the result
        return `${newTitle.join(' ')} ...`;
    }
    return title;
};

const renderRecipe = recipe => {
    const markup = `
    <li>
        <a class="results__link results__link--active" href="#${recipe.recipe_id}">
            <figure class="results__fig">
                <img src="${recipe.image_url}" alt="${recipe.title}">
            </figure>
            <div class="results__data">
                <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                <p class="results__author">${recipe.publisher}</p>
            </div>
        </a>
    </li>
    `;
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

    elements.searchResList.insertAdjacentHTML('beforeend', markup);
};

// type 'prev' or 'next
// 兩者不同
// () => { return ...} vs () => ...;
const createButton = (page, type) =>
    `
    <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page - 1 : page + 1}>
            <svg class="search__icon">
                    <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
            </svg>
            <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
    </button>

    `;
const renderButtons = (page, numResults, resPerPage) => {
    // Math.ceil() 函式會回傳大於等於所給數字的最小整數。
    const pages = Math.ceil(numResults / resPerPage);
    let button;
    if (page === 1 && pages > 1) {
        // Only button to go to next page
        button = createButton(page, 'next');
    } else if (page < pages) {
        // Both buttons
        button = `
            ${createButton(page, 'prev')}
            ${createButton(page, 'next')}
        `;
    } else if (page === pages && pages > 1) {
        // Only button to go to prev page
        button = createButton(page, 'prev');
    }

    elements.searchResPages.insertAdjacentHTML('afterbegin', button);
};

export const renderResults = (recipes, page = 1, resPerPage = 10) => {
    // render results of currents page
    const start = (page - 1) * resPerPage; // 起始頁
    const end = page * resPerPage; // 終點頁

    // recipes.forEach(renderRecipe)
    // slice 回傳薪陣列物件 => 不影響原本陣列
    recipes.slice(start, end).forEach(renderRecipe);

    //render pagination
    renderButtons(page, recipes.length, resPerPage);
};
