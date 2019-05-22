import Search from './models/Search';
import * as searchView from './views/searchView';
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

        // 4) Search for recipes(食譜)
        await state.search.getResults();

        // 5) Render results on UI
        clearLoader();
        searchView.renderResults(state.search.result);
        console.log(state.search.result);
    }
};

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});
