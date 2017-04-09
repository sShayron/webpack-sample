var webpack = require('webpack');
var path = require('path');
var glob = require('glob');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var PurifyCSSPlugin = require('purifycss-webpack');
var CleanWebpackPlugin = require('clean-webpack-plugin');

var inProduction = (process.env.NODE_ENV === 'production');

module.exports = {
    entry: {
        main: [
            './src/main.js',
            './src/main.scss'
        ],
        vendor: 'jquery'
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: '[name].[chunkhash].js'
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
                test: /\.(svg|eot|ttf|woff|woff2)$/,
                loader: 'file-loader',
                options: {
                    name: 'fonts/[name].[ext]'
                }
            },
            {
                // CArrega todos arquivos dessas extensões para dist/
                test: /\.(png|je?pg|gif)$/,
                loaders: [
                    {
                        loader: "file-loader",
                        options: {
                            name: 'images/[name].[hash].[ext]'
                        }
                    },

                    'img-loader'

                ]
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

        // Apaga a pasta dist antes de realizar novo build
        new CleanWebpackPlugin(['dist'], {
            root: __dirname,
            verbose: true,
            dry: false
        }),

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
        }),

        function () {
            this.plugin('done', stats => {
                require('fs').writeFileSync(
                    path.join(__dirname, 'dist/manifest.json'),
                    JSON.stringify(stats.toJson().assetsByChunkName)
                );
            });
        }

    ]
}

if (inProduction) {
    // Minifica arquivo .js se NODE_ENV production
    module.exports.plugins.push(
        new webpack.optimize.UglifyJsPlugin()
    );

}