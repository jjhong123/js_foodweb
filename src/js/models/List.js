import uniqid from 'uniqid';

export default class List {
    constructor() {
        this.items = [];
    }

    addItem(count, unit, ingredient) {
        const item = {
            id: uniqid(),
            count,
            unit,
            ingredient
        };
        this.items.push(item);
        return item;
    }

    deleteItem(id) {
        const index = this.items.findIndex(el => el.id === id);
        //slice() 方法會回傳一個新陣列物件，為原陣列選擇之 begin 至 end（不含 end）部分的淺拷貝（shallow copy）。而原本的陣列將不會被修改。

        // [2,4,8] splice(1,2) ->returns [4,8] , original array is [2]
        // [2,4,8] slice(1,2) ->returns [4] , original array is [4]

        this.items.splice(index, 1);
    }

    updateCount(id, newCount) {
        // find() 方法會回傳第一個滿足所提供之測試函式的元素值。否則回傳 undefined。
        this.items.find(el => el.id === id).count = newCount;
    }
}
