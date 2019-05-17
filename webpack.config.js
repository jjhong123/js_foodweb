const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    entry: ['babel-polyfill', './src/js/index.js'],
    output: {
        //如果沒有傳入 path 片段，則 path.resolve() 將返回現在工作目錄的絕對路經．
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/bundle.js'
    },
    devServer: {
        contentBase: path.join(__dirname, 'dist')//告訴服務器從哪個目錄中提供內容。只用在你想要提供靜態文件時才需要。
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',// 輸出
            template: './src/index.html' // 源頭
        })
    ],
    module: {
        rules: [
            {
                test: /\.js$/,// 所有js
                exclude: /node_modules/,// 排除node_modules
                use: {
                    loader: 'babel-loader'// use bable-loader
                }
            }
        ],

    }
}

/*
IE 是許多前端工程師的夢靨，在 Vue 中我們會使用 axios 來存取 api ，
但是 axios 會使用到 ES6 的 Promise ，所以 IE 會沒有辦法支援，
因此我們要用 babel-polyfill 來將 ES6 的語法轉到 ES5。
*/