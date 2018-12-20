const path = require('path');
const webpack = require("webpack");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');

/**
 * Vue-loader v15 has major breaking changes.
 * If your vue-loader version is 15 and above,
 * you should add VueLoaderPlugin like this in your webpack config.
 * https://github.com/vuejs/vue-loader/tree/next
*/
const { VueLoaderPlugin } = require('vue-loader')

const mainSTYL = new ExtractTextPlugin('css/main.css');
const themeCSS = new ExtractTextPlugin('css/black.css');

module.exports = {
  // Entry main JS
  entry: [
     './src/index.js',
  ],
  // Output main JS
  output: {
    filename: 'js/main.js',
    path: path.resolve(__dirname, '../static'),
    //! Server fix
    publicPath: 'static'
    //* To deploy
    // publicPath: '/wcms/wex/static/js'
  },
  // Server
  devServer: {
    overlay: true
  },
  module: {
    rules: [{
        //! VUE
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            stylus: 'vue-style-loader!stylus-loader', // <style lang="stylus">
            // sass: 'vue-style-loader!css-loader!sass-loader?indentedSyntax' // <style lang="sass">
          }
        }
      },{
        //! ALL JS
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: '/node_modules/'
      }, {
        //! MAIN stylus
        test: /main\.styl$/,
        use: mainSTYL.extract({
          use: [{
              loader: 'css-loader'
            }, {
              loader: 'postcss-loader',
              options: { config: { path: 'src/js/postcss.config.js'} },
            }, {
              loader: 'stylus-loader',
              options: { 'include css': true, preferPathResolver: 'webpack', },
          }]
        })
      },{
        //! Other library & vue
        test: /\.css$/,
        use: mainSTYL.extract({
          use: [{
            loader: 'css-loader'
          }, {
            loader: 'postcss-loader',
            options: { config: { path: 'src/js/postcss.config.js' } },
          }]
        })
      },
      //!  ???
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
            name: '[name].[ext]?[hash]',
        },
      },{
        test: /\.pug$/,
        use: ['html-loader?attrs=false', 'pug-html-loader']
      }
    ]
  },
  resolve: {
    alias: {
      vue: 'vue/dist/vue.js'
    }
  },
  // Plugins
  plugins: [
    // Extract css
    // new ExtractTextPlugin('css/[name].css'),
    mainSTYL,
    themeCSS,
    // vue-loader version is 15 and above
    new VueLoaderPlugin(),
    // Fix codemirror
    new webpack.IgnorePlugin(/^codemirror$/),

    new CopyWebpackPlugin([{
      from: './src/static/img',
      to: './img'
    }]),

    // new webpack.DefinePlugin({
      // 'require.specified': 'require.resolve'
    // })
  ]
}