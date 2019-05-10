const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const Webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

// 是否为开发环境
const isDev = process.env.NODE_ENV === 'development';
const ENVIRONMENT = process.env.ENVIRONMENT;
console.log(ENVIRONMENT, '环境');
const config = {
  mode: isDev ? 'development' : 'production', //开发模式 || 生产模式,
  entry: {
    app: path.join(__dirname, '../client/app.js')
  },
  output: {
    path: path.join(__dirname, '../dist'),
    filename: '[name].[hash].js',
    publicPath: isDev ? '/public/' : '/storetheme/',
  },
  module: {
    rules: [{
        test: /\.(js|jsx)$/,
        loader: ['babel-loader', 'eslint-loader'],
        exclude: path.join(__dirname, '../node_modules')
      },
      {
        test: /\.css$/,
        use: [{
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: 'css-loader',
          }
        ],
      },
      {
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: true,
              localIdentName: '[name]__[local]-[hash:base64:10]',
            },
          },
          'postcss-loader',
          'less-loader',
        ],
        exclude: path.join(__dirname, '../node_modules')
      },
      {
        test: /\.(png|jpg|jpeg|gif)$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 500,
            outputPath: 'images'
          }
        }]
      },
      {
        test: /\.(html)$/,
        use: {
          loader: 'html-loader',
          options: {
            attrs: ['img:src', 'img:data-src', 'audio:src']
          }
        }
      },
      {
        test: /\.(ttf|eot|woff|woff2|svg)$/,
        loader: 'url-loader',
        options: {
          name: '[name].[ext]?[hash]',
        }
      },
    ]
  },
  plugins: [
    new HTMLWebpackPlugin({
      template: path.resolve(__dirname, '../client/index.html'),
      filename: isDev ? 'index.html' : 'customize.html',
    }),
    new MiniCssExtractPlugin({
      filename: isDev ? '[name].[hash].css' : '[name].css',
      chunkFilename: isDev ? '[id].[hash].css' : '[name].[id].[hash].css',
    }),
    new Webpack.DefinePlugin({ // 根据环境不同  图片前缀请求不同的域名
      'process.env.IMG_BASE': ENVIRONMENT === 'test'
        ? JSON.stringify("https://cdn.influmonsters.com")
        : JSON.stringify("https://img.influmonsters.com"),
      'process.env.URL_BASE': isDev
        ? JSON.stringify("")
        : JSON.stringify("/business/store_themes"),
      'process.env.IS_DEV': isDev
    }),
    new OptimizeCssAssetsPlugin(),
  ],
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendors: {
          test: /node_modules/,
          name: 'vendors',
          filename: '[name].bundle.js',
          enforce: true,
        }
      },
      chunks: 'all',
    },
    runtimeChunk: {
      name: 'runtime'
    }
  }
};

if (isDev) {
  config.devServer = {
    host: '0.0.0.0',
    port: 8080,
    hot: true,
    overlay: {
      errors: true
    },
    contentBase: path.join(__dirname, '../dist'),
    // historyApiFallback: true,
    publicPath: '/public/',
    historyApiFallback: {
      index: '/public/index.html'
    },
    proxy: { //解决跨域 代理有请求 /business的全部代理到 'http://192.168.1.26:8081'
      '/business': {
        target: 'http://192.168.1.26:8081',
      },
    }
  };
  config.plugins.push(new Webpack.HotModuleReplacementPlugin())
}

module.exports = config;
