import '../css/style.css'; //css
import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import { elements, renderLoader, clearLoader } from './views/base';

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

            // 食譜 與 喜歡
            recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));
        } catch (err) {
            console.log(err);
            alert('Error processing recipe!');
        }
    }
};

// window.addEventListener('hashchange', controlRecipe);
// window.addEventListener('load', controlRecipe);
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

/**
 * LIST CONTROLLER
 */
const controlList = () => {
    // Create a new list if there in noen yet
    if (!state.list) state.list = new List();

    // Add each ingredient to the list and UI
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    });
};
/**
 * LIKE CONTROLLER
 */
const controlLike = () => {
    if (!state.likes) state.likes = new Likes();
    const currentID = state.recipe.id;

    // 用戶尚未喜歡當前食譜
    if (!state.likes.isLiked(currentID)) {
        // Add like to the state
        const newLike = state.likes.addLike(currentID, state.recipe.title, state.recipe.author, state.recipe.img);
        // 切換 the like button
        likesView.toggleLikeBtn(true);

        // Add like to UI list
        likesView.renderLike(newLike);

        // 用戶已經喜歡當前食譜
    } else {
        // 從狀態中刪除
        state.likes.deleteLike(currentID);

        // 切換 the like button
        likesView.toggleLikeBtn(false);

        // Remove like from UI list
        likesView.deleteLike(currentID);
    }
    // 切換喜歡菜單顯示 如果裡面空的則不顯示
    likesView.toggleLikeMenu(state.likes.getNumLikes());
};

// 處理刪除和更新列表項事件
elements.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;

    // Handle the delete button
    if (e.target.matches('.shopping__delete, .shopping__delete *')) {
        // Delete from state
        state.list.deleteItem(id);
        // Delete from ui
        ListView.deleteItem(id);
    } else if (e.target.matches('.shopping__count-value')) {
        const val = parseFloat(e.target.value, 10);
        state.list.updataCount(id, val);
    }
});

// 處理食譜按鈕點擊
elements.recipe.addEventListener('click', e => {
    if (e.target.matches('.btn-decrease, .btn-decrease *')) {
        // Decrease button is clicked
        if (state.recipe.servings > 1) {
            // 增加
            state.recipe.updateServings('dec');

            recipeView.updateServingsIngredients(state.recipe);
        }
    } else if (e.target.matches('.btn-increase, .btn-increase *')) {
        // Increase button is clicked
        //減少
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        // List controller
        controlList();
    } else if (e.target.matches('.recipe__love, .recipe__love *')) {
        // Like controller
        controlLike();
    }
});

// 當畫面重新刷新
window.addEventListener('load', () => {
    state.likes = new Likes();

    // 恢復 likes
    state.likes.readStorage();

    // 切換喜歡菜單顯示 如果裡面空的則不顯示
    likesView.toggleLikeMenu(state.likes.getNumLikes());

    // 渲染現有的喜歡
    state.likes.likes.forEach(like => likesView.renderLike(like));
});
