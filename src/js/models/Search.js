import axios from 'axios'

export default class Search {
    constructor(query) {
        this.query = query
    }

    // Global app controller
    async getResults() {
        const proxy = 'https://cors-anywhere.herokuapp.com/'
        const key = 'c06af7c082841f10c580e719684b7a16'
        try {
            const res = await axios(`${proxy}http://food2fork.com/api/search?key=${key}&q=${this.query}`)
            this.result = res.data.recipes
            // console.log(this.recipes)
        } catch (error) {
            alert(error)
        }
    }
}

// getResults('pizza')
// https://www.food2fork.com/api/search
// c06af7c082841f10c580e719684b7a16
