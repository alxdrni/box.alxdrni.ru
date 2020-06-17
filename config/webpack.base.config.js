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
    minimize: isProd,
    minimizer: isProd ? [
      new TerserJSPlugin({
        terserOptions: {
          output: {
            comments: false
          }
        },
        extractComments: false
      }),
      new OptimizeCSSAssetsPlugin({})
    ] : []
  },
  entry: './src/index.js',
  output: {
    publicPath: '/',
    filename: 'scripts.js'
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
          /*,
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
              name: 'assets/images/[name].[ext]'
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
              name: 'assets/fonts/[name].[ext]'
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
      filename: 'styles.css'
    })
  ]
}

module.exports = config
