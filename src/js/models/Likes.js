export default class Likes {
    constructor() {
        this.likes = [];
    }

    //新增最愛
    addLike(id, title, author, img) {
        const like = { id, title, author, img };
        this.likes.push(like);

        // Perist data in localStorage
        this.persistData();

        return like;
    }

    //刪除最愛
    deleteLike(id) {
        const index = this.likes.findIndex(el => el.id === id);
        this.likes.splice(index, 1);

        // Perist data in localStorage
        this.persistData();
    }

    isLiked(id) {
        return this.likes.findIndex(el => el.id === id) !== -1;
    }

    // 取得目前喜歡數量
    getNumLikes() {
        return this.likes.length;
    }

    // 設定 讀取localStorage key->likes item->this.linkes
    persistData() {
        localStorage.setItem('likes', JSON.stringify(this.likes));
    }

    // 讀取localStorage 並且轉換 json
    readStorage() {
        const storage = JSON.parse(localStorage.getItem('likes'));

        // Restoring likes from the localStorage
        if (storage) this.likes = storage;
    }
}
