export const elements = {
    searchForm: document.querySelector('.search'),
    searchInput: document.querySelector('.search__field'),
    searchRes: document.querySelector('.results'),
    searchResList: document.querySelector('.results__list'),
    searchResPages: document.querySelector('.results__pages'),
    recipe: document.querySelector('.recipe'),
    shopping: document.querySelector('.shopping__list'),
    likesMenu: document.querySelector('.likes__field'),
    likesList: document.querySelector('.likes__list'),
};

export const elementStrings = {
    loader: 'loader',
};

// 渲染讀取
export const renderLoader = parent => {
    const loader = `
        <div class="${elementStrings.loader}">
            <svg>
                <use href="img/icons.svg#icon-cw"></use>
            </svg>
        </div>
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
    parent.insertAdjacentHTML('afterbegin', loader);
};

// 清除讀取
export const clearLoader = () => {
    // 選擇讀取
    const loader = document.querySelector(`.${elementStrings.loader}`);
    /**
     * 清除讀取 為何不用remove
     * remove -> 可以刪除loader 的 子元素
     * removeChild -> 可以刪除全部 但必須有明確的 父元素 與 子元素
     */

    if (loader) loader.parentElement.removeChild(loader);
};
