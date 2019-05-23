import '../css/style.css'; //css
import Search from './models/Search';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import { elements, renderLoader, clearLoader } from './views/base';
import Recipe from './models/Recipe';
/** Global state of the app
 * - Search object
 * - Current recioe object
 * - Shopping list object
 */

const state = {};

const controlSearch = async () => {
    // 1) Get query from view
    const query = searchView.getInput(); //T000

    if (query) {
        // 2) New search object and add to state
        state.search = new Search(query);

        // 3) 準備 UI for results
        searchView.clearInput();
        searchView.clearResult();
        renderLoader(elements.searchRes);

        try {
            // 4) Search for recipes(食譜)
            await state.search.getResults();
            // 5) Render results on UI
            clearLoader();
            searchView.renderResults(state.search.result);
        } catch (err) {
            alert('Something wrong with the seach...');
            clearLoader();
        }
    }
};

// 送出
elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});

// 換頁
elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResult();
        searchView.renderResults(state.search.result, goToPage);
        console.log(goToPage);
    }
});

/**
 * Recipe Controller
 */
const controlRecipe = async () => {
    // Get ID from url
    const id = window.location.hash.replace('#', '');
    if (id) {
        // Prepare UI from result
        recipeView.clearRecipe(); // 清除舊畫面
        renderLoader(elements.recipe); // 讀取

        // Highlight 選擇搜尋
        if (state.search) searchView.highlightSelected(id);

        // Create new recipe object
        state.recipe = new Recipe(id);
        try {
            // 獲取食譜數據並解析成分
            await state.recipe.getRecipe();
            console.log(state.recipe.ingredients);
            state.recipe.parseIngredients();

            // 計算服務和時間
            state.recipe.calcTime();
            state.recipe.calcServings();

            // Render recipe
            clearLoader();
            recipeView.renderRecipe(state.recipe);
        } catch (err) {
            alert('Error processing recipe!');
        }
    }
};

// window.addEventListener('hashchange', controlRecipe);
// window.addEventListener('load', controlRecipe);
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));
