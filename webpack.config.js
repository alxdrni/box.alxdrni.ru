const webpack = require('webpack')
const path = require('path')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const TerserJSPlugin = require('terser-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const isProd = process.env.NODE_ENV === 'production'

const config = {
  mode: process.env.NODE_ENV,
  stats: 'errors-only',
  optimization: {
    minimize: isProd,
    minimizer: isProd
      ? [
        new TerserJSPlugin({
          terserOptions: {
            output: {
              comments: false
            }
          },
          extractComments: false
        }),
        new OptimizeCSSAssetsPlugin({})
      ]
      : []
  },
  entry: './src/entry-client.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
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
          isProd
            ? MiniCssExtractPlugin.loader
            : 'vue-style-loader',
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
    new HtmlWebpackPlugin({
      template: './src/templates/index.html',
      filename: 'index.html'
    }),
    new VueLoaderPlugin(),
    ...(isProd
      ? [
        new MiniCssExtractPlugin({
          filename: 'styles.css'
        })
      ]
      : [
        new webpack.HotModuleReplacementPlugin()
      ]
    )
  ],
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    publicPath: '/',
    hot: true
  }
}

module.exports = config
