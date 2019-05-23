import { elements } from './base';

export const getInput = () => elements.searchInput.value;

// 清除輸入
export const clearInput = () => {
    elements.searchInput.value = '';
};

// 清除結果,分頁
export const clearResult = () => {
    elements.searchResList.innerHTML = '';
    elements.searchResPages.innerHTML = '';
};

// 選擇食物
export const highlightSelected = id => {
    /*
    使用 classList 屬性是取得元素 Class 的一種便利方式，也可以透過 element.className 
    來得到以空格分隔之 Class 清單字串。
    */
    const resultsArr = Array.from(document.querySelectorAll('.results_link'));
    resultsArr.forEach(el => {
        el.classList.remove('results__link--active');
    });
    document.querySelector(`a[href=#${id}]`).classList.add('.result__link--active');
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
        <a class="results__link " href="#${recipe.recipe_id}">
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
    // pages 總頁數  = ( 30/10 ) = 3頁
    // page = 要去頁數
    const pages = Math.ceil(numResults / resPerPage);
    let button;
    if (page === 1 && pages > 1) {
        // 如果 頁數===第一頁 並且 總頁數大於1 只可以往後
        // Only button to go to next page
        button = createButton(page, 'next');
    } else if (page < pages) {
        // 如果 頁數小於總頁數 只可以往前或往後
        // Both buttons
        button = `
            ${createButton(page, 'prev')}
            ${createButton(page, 'next')}
        `;
    } else if (page === pages && pages > 1) {
        // 如果 頁數=總頁數 只可以往前
        // Only button to go to prev page
        button = createButton(page, 'prev');
    }

    elements.searchResPages.insertAdjacentHTML('afterbegin', button);
};

export const renderResults = (recipes, page = 1, resPerPage = 10) => {
    // render results of currents page
    // resPerPage 一頁最多幾個
    // 第二頁
    // example =>
    // ( 2 - 1 ) * 10 = 10
    // ( 2 * 10 ) = 20
    // 10-20～～～～
    const start = (page - 1) * resPerPage;
    const end = page * resPerPage;

    // recipes.forEach(renderRecipe)
    // slice 回傳新陣列物件 => 不影響原本陣列
    // 10 - 20 筆資料 -> renderRecipe(渲染list) , renderButton(渲染分頁)
    recipes.slice(start, end).forEach(renderRecipe);

    //render pagination
    renderButtons(page, recipes.length, resPerPage);
};
