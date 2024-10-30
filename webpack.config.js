const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

module.exports = {
  mode: 'development',
  entry: {
    bundle: path.resolve(__dirname, 'client/index.js'), // Entry point name is 'bundle'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name][contenthash].js', // Filename template for JS bundles.  Assigns bundle to [name], [contenthash] appends a unique hash to each rebuild of bundle.
    clean: true, // Cleans old files in the output directory before each build
    assetModuleFilename: '[name][ext]', // Template for assest file names & their file extensions
  },
  //maps from bundle to source creating bundle.map file.  Apparently helpful for debugging w/in the bundle...?
  devtool: 'source-map',
  devServer: {
    static: {
      directory: path.resolve(__dirname, 'dist'), // serve static files from 'dist'
    },
    //changed from 3000 to 8080
    port: 8080,
    open: true, // Automatically opens browser when server starts
    hot: true, //  Enables Hot Module Replacement (HMR) w/out relaoding/refreshing the whole page
    compress: true,
    historyApiFallback: true, //unknown routes redirect user to index.html..?
  },
  // Enable importing JS / JSX files without specifying their extension
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      { test: /\.css$/, 
        use: ['style-loader', 'css-loader'] },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          // options: {
          //   //presets are defined in my .babelrc file including preset for react
          //     presets: ['@babel/preset-env']
          // },
        },
      },
      {
        //for being able to load images
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
    ],
  },
  // resolve: {
  //   extensions: ['.js', '.jsx'],
  // },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Iteration Project',
      filename: 'index.html',
      template: 'client/template.html', //relative path of template.html
    }),
    // new BundleAnalyzerPlugin(),
  ],
};

/////*******   Clara's solo project webpack config */

// const webpack = require('webpack');
// const path = require('path');
// const HtmlWebpackPlugin = require('html-webpack-plugin');
// const CopyWebpackPlugin = require('copy-webpack-plugin');

// module.exports = {
//   entry: [
//     './client/index.js',
//     //need to create an indexjs folder within client that enters application here?
//   ],

//   output: {
//     path: path.resolve(__dirname, 'dist'),
//     publicPath: '/',
//     filename: 'bundle.js',
//   },

//   mode: 'development',

//   devtool: 'eval-source-map',

//   module: {
//     rules: [
//       {
//         test: /.(js|jsx)$/,
//         exclude: /node_modules/,
//         use: {
//           loader: 'babel-loader',
//           options: {
//             presets: ['@babel/preset-env', '@babel/preset-react'],
//           },
//         },
//       },
//     ],
//   },

//   resolve: {
//     extensions: ['.js', '.jsx'], // Added this to ensure proper resolution of file types
//   },

//   devServer: {
//     host: 'localhost',
//     port: 8080,
//     // enable HMR on the devServer
//     hot: true,
//     // fallback to root for other urls
//     historyApiFallback: true,

//     static: {
//       // match the output path
//       directory: path.resolve(__dirname, 'dist'),
//       // match the output 'publicPath'
//       publicPath: '/',
//     },

//     headers: { 'Access-Control-Allow-Origin': '*' },
//     /**
//      * proxy is required in order to make api calls to
//      * express server while using hot-reload webpack server
//      * routes api fetch requests from localhost:8080/api/* (webpack dev server)
//      * to localhost:3000/api/* (where our Express server is running)
//      */
//     proxy: {
//       '/api/**': {
//         target: 'http://localhost:3000/',
//         secure: false,
//       },
//     },
//   },

//   plugins: [
//     new HtmlWebpackPlugin({
//       title: 'Development',
//       template: './client/index.html',
//     }),
//     new CopyWebpackPlugin({
//       patterns: [{ from: './client/style.css', to: 'style.css' }],
//     }),
//   ],
// };
