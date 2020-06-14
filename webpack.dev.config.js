const path = require('path')
const find = require('find')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const config = {
  mode: process.env.NODE_ENV,
  stats: 'errors-only',
  entry: './src/index.js',
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    index: `index.${__dirname.split('/').pop()}.html`,
    hot: true,
    watchOptions: {
      aggregateTimeout: 300,
      poll: true
    }
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'scripts.[hash].js'
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: [
          process.env.NODE_ENV !== 'production'
            ? 'vue-style-loader'
            : MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              modules: true
            }
          },
          'postcss-loader'
        ]
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'assets/images/[name].[contenthash].[ext]'
            }
          }
        ]
      },
      {
        test: /\.(ttf|otf|woff|woff2)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'assets/fonts/[name].[contenthash].[ext]'
            }
          }
        ]
      }
    ]
  },
  resolve: {
    extensions: [
      '.js',
      '.vue'
    ],
    alias: {
      vue$: 'vue/dist/vue.esm.js',
      '@src': path.resolve(__dirname, 'src/')
    }
  },
  plugins: [
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      template: './src/html/index.html',
      filename: `index.${__dirname.split('/').pop()}.html`
    }),
    new MiniCssExtractPlugin({
      filename: 'styles.[hash].css'
    })
  ]
}

module.exports = config
