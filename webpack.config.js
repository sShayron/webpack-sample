var webpack = require('webpack');
var path = require('path');
var glob = require('glob');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var PurifyCSSPlugin = require('purifycss-webpack');

var inProduction = (process.env.NODE_ENV === 'production');

module.exports = {
    entry: {
        app: [
            './src/main.js',
            './src/main.scss'
        ]
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: '[name].js'
    },

    module: {
        rules: [
            {
            // seleciona todos arquivos com essa extensão .scss ou .sass
                test: /\.s[ac]ss$/,
                // O plugin irá extrair para o arquivo informado em plugins
                use: ExtractTextPlugin.extract({
                //sass-loader compila o sass, css-loader carrega css dentro do javascript
                    // use: ['css-loader', 'sass-loader'],
                    // Irá o css-loader com opção de compilar url relativa desativada
                    // use : [
                    //     {
                    //         loader: 'css-loader',
                    //         options: { url: false }
                    //     },
                    //     'sass-loader'
                    // ],
                     use: ['raw-loader', 'sass-loader'],
                    fallback: 'style-loader'
                })
            },
            {
                // CArrega todos arquivos dessas extensões para dist/
                test: /\.(png|je?pg|gif|svg|eot|ttf|woff|woff2)$/,
                loader: "file-loader",
                options: {
                    name: 'images/[name].[hash].[ext]'
                }
            },
            // {
            //     // seleciona todos arquivos com essa extensão .scss ou .sass
            //     test: /\.s[ac]ss$/,
            //     //sass-loader compila o sass, css-loader carrega css dentro do javascript e style-loader injeta na pagina
            //     use: ['style-loader', 'css-loader', 'sass-loader']
            // },
            // {
            //     // seleciona todos arquivos com essa extensão para essa regra
            //     test: /\.css$/,
            //     //css-loader carrega css dentro do javascript e style-loader injeta na pagina
            //     use: ['style-loader', 'css-loader']
            // },
            {
                // seleciona todos arquivos com essa extensão para essa regra
                test: /\.js$/,
                exclude: /node_modules/,
                // compila os arquivos .js com babel
                loader: "babel-loader"
            },
        ]
    },

    plugins: [
        // Extrai texto para app.css
        new ExtractTextPlugin('[name].css'),

        // Certifique-se de colocar após o ExtractTextPlugin!
        new PurifyCSSPlugin({
        // Passe o diretorio que aplicará a regra, deve ser fixo
            paths: glob.sync(path.join(__dirname, 'index.html')),
            minimize: inProduction
        }),

        // Minifica arquivo .css se NODE_ENV production
        new webpack.LoaderOptionsPlugin({
            minimize: inProduction
        })
    ]
}

if (inProduction) {
    // Minifica arquivo .js se NODE_ENV production
    module.exports.plugins.push(
        new webpack.optimize.UglifyJsPlugin()
    );

}