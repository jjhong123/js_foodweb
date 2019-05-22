import axios from 'axios';
import { key, proxy } from '../config';

export default class Recipe {
    constructor(id) {
        this.id = id;
    }

    // Global app controller
    async getRecipe() {
        axios.defaults.headers.common['x-requested-with'] = '*';
        try {
            const res = await axios(`${proxy}http://food2fork.com/api/get?key=${key}&rId=${this.id}`);
            this.title = res.data.recipe.title;
            this.author = res.data.recipe.publisher;
            this.img = res.data.recipe.image_url;
            this.url = res.data.recipe.source_url;
            this.ingredients = res.data.recipe.ingredients;
        } catch (error) {
            console.log(error);
            console.log('Something went wrong :(!');
        }
    }

    // 計算時間
    calcTime() {
        // 假設每3種成分需要15分鐘
        const numIng = this.ingredients.length;
        const periods = Math.ceil(numIng / 3);
        this.time = periods * 15;
    }
    // 計算服務
    calcServings() {
        this.servings = 4;
    }

    // 解析成分
    parseIngredients() {
        // ['湯匙','湯匙','盎司','盎司','茶匙','茶匙','杯子','磅']
        const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];

        const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];

        const units = [...unitsShort, 'kg', 'g'];

        const newIngredients = this.ingredients.map(el => {
            // 1) 統一單位
            let ingredient = el.toLowerCase(); //將字串 (string) 中所有英文字母改為小寫
            unitsLong.forEach((unit, i) => {
                //將小寫的字串替換成簡寫統一單位
                ingredient = ingredient.replace(unit, unitsShort[i]);
            });

            // 2) 刪除括號
            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');
            // 3) 將ingredients(成分)分為計數，(unit)單位和成分

            // 將食譜用空行切割
            const arrIng = ingredient.split(' ');

            // 尋找切割後的字有沒有符合特定的元素
            const unitIndex = arrIng.findIndex(el2 => units.includes(el2));

            let objIng;

            if (unitIndex > -1) {
                // 這邊再把4 1/2 轉成小數 4.5
                // 有一個單位
                // Ex. 4 1/2 cups, arrCount is [4, 1/2] --> eval("4+1/2") --> 4.5
                // Ex. 4 cups, arrCount is [4]

                // 重新淺複製從第0個 ~ 到第一筆遇到的
                const arrCount = arrIng.slice(0, unitIndex);

                let count;

                // 如果 只有一筆
                if (arrCount.length === 1) {
                    console.log(arrIng[0]);
                    // 1-1/2 => 1+1/2
                    count = eval(arrIng[0].replace('-', '+'));
                } else {
                    console.log(arrIng.slice(0, unitIndex));
                    // 分數轉換
                    count = eval(arrIng.slice(0, unitIndex).join('+'));
                }

                objIng = {
                    count,
                    unit: arrIng[unitIndex],
                    ingredient: arrIng.slice(unitIndex + 1).join(' '),
                };
            } else if (parseInt(arrIng[0], 10)) {
                // 沒有單位，但是第1個要素是數字
                // 將第二個字以後透過join重新空格
                objIng = {
                    count: parseInt(arrIng[0], 10),
                    unit: '',
                    ingredient: arrIng.slice(1).join(' '),
                };
            } else if (unitIndex === -1) {
                // 第1位沒有單位和數字
                // 原封不動
                objIng = {
                    count: 1,
                    unit: '',
                    ingredient,
                };
            }

            return objIng;
        });

        this.ingredients = newIngredients;
    }

    updateServings(type) {
        // Servings
        const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1;

        // Ingredients
        this.ingredients.forEach(ing => {
            ing.count *= newServings / this.servings;
        });

        this.servings = newServings;
    }
}
