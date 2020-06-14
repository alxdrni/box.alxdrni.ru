const path = require('path')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const TerserJSPlugin = require('terser-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')

const isProd = process.env.NODE_ENV === 'production'

const config = {
  watch: !isProd,
  mode: process.env.NODE_ENV,
  stats: 'errors-only',
  optimization: {
    minimizer: isProd ? [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})] : []
  },
  output: {
    publicPath: '/',
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
          'postcss-loader'/*,
          {
            loader: 'style-resources-loader',
            options: {
              patterns: [
                './src/styles/colors.css'
              ]
             }
          }
          */
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
    new MiniCssExtractPlugin({
      filename: 'styles.[hash].css'
    }),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, '../src/html', 'index.html'),
          to: path.resolve(__dirname, '../dist', 'index.box.html')
        }
      ]
    })
  ]
}

module.exports = config
