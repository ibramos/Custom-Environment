// webpack at its core links up JS modules together in a correct order
const webpack = require('webpack');
// path module is part of Node
const path = require('path');
// extract-text-webpack-plugin helps separate styles into a separate file
// styles will no longer be inlined into the JS bundle
const ExtractTextPlugin = require('extract-text-webpack-plugin');
// html-webpack-plugin is to replace the need for manually maintaining script tags upon bundle generation
const HtmlWebPackPlugin = require('html-webpack-plugin');

// separated module dependencies for scalability and streamlining updates
const VENDOR_LIBRARIES = [
  'axios',
  'react',
  'react-dom',
  'react-redux',
  'react-router-dom',
  'redux',
  'redux-thunk',
];

const config = {
  // single point entry
  // ------------------------------------------- //
  // index.js is the naming convention used
  // entry point starts the bundling process
  // think of it as top node in a BST
  // entry: './src/index.js',
  // ------------------------------------------- //

  // code splitting **
  entry: {
    // bundle for all application specific code
    bundle: './src/index.jsx',
    // vendor creates vendor.js which is a separate output from bundle.js
    // bundle for all module dependencies
    vendor: VENDOR_LIBRARIES,
  },
  output: {
    // path dictates the directory
    // resolve function will take in the path to a file
    // makes sure file path is correctly specified regardless of operating system
    // __dirname is a constant in Node
    // it is a reference to the current working directory
    // build is the naming convention used for the folder that will be generated in the current working directory
    path: path.resolve(__dirname, 'build'),

    // single point entry
    // ------------------------------------------- //
    // filename dictates the name of the output
    // bundle.js is the naming convention used
    // filename: 'bundle.js',
    // ------------------------------------------- //

    // code splitting **
    // [name] gets replaced with the key from the entry section
    // [chunkhash] is a hashed string of characters
    // every change to either bundle or vendor will result in a slight change to the name
    // the change forces the browser to redownload the newer version
    filename: '[name].[chunkhash].js',

    // single point entry
    // ------------------------------------------- //
    // publicPath prepends the path when contructing urls
    // used by any loader with a direct file path reference to a file in output directory
    // publicPath: 'build/'
    // ------------------------------------------- //
  },
  resolve: {
    // order of finding the right file type
    // ./App -> ./App.js -> ./App.jsx and so forth
    extensions: ['.js', '.jsx', '.json'],
  },
  // loaders are used to enhance the behavior of webpack
  module: {
    rules: [
      {
        // use describes the loader being used
        // babel-loader teaches babel to work with webpack
        use: 'babel-loader',
        // test describes the type of files the specified loader will be assigned to
        // RESOURCE: https://regex101.com/
        test: /\.jsx?$/,
        // exclude instructs loader to skip files
        // safe to transform node_modules, but it is a waste of resource
        exclude: /node_modules/,
      },
      {
        // plugins work outside of the webpack pipeline
        // they have the ability to keep files from ending up inside the bundle output
        use: ExtractTextPlugin.extract({
          // css-loader deals with CSS imports
          // use represents loader for converting resource to a CSS exporting module
          use: 'css-loader',
          // style-loader takes CSS imports and inject it into a style tag in the HTML document
          // fallback is the secondary option when CSS is not extracted
          fallback: 'style-loader',
        }),
        test: /\.css$/,
      },
      {
        // image-webpack-loader compresses the image size automatically
        // url-loader behaves depending on the output image size
        // small results in the compressed image being bundled in the output (base64)
        // large results in the raw image being generated in the ouput directory
        // loaders are applied from right to left (MULTIPLE LOADERS)
        // image-webpack-loader is initiated first and then pipes output to url-loader
        // if the image is greater than 40kB, the image will be saved as a separate file
        use: [
          { loader: 'url-loader', options: { limit: 40000 } },
          'image-webpack-loader',
        ],
        test: /\.(jpe?g|png|gif|svg)$/,
      },
      // eslint support
      // enforce: "pre" section to check source files, not modified by other loaders like babel-loader
      {
        enforce: 'pre',
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
      },
    ],
  },
  // plugins are differentiated from loaders because plugins look at the total sum of output that is going through webpack
  // loaders work with individual files
  plugins: [
    // ExtractTextPlugin tells the extract library to find any files transformed by its loader
    // files will be saved under style.css
    new ExtractTextPlugin('style.css'),
    // CommonsChunkPlugin analyzes both entry and vendor bundle points
    // if any modules are identical, they will be pulled out and added into the vendor entry point
    // GOTCHA: adding manifest enhances the browser's ability to determine if the vendor file has changed
    new webpack.optimize.CommonsChunkPlugin({ names: ['vendor', 'manifest'] }),
    // HtmlWebPackPlugin is to replace the need for manually maintaining script tags upon bundle generation
    // index.html becomes a template for the bundle to append to
    // the appropriate link tags will also apply for ExtractTextPlugin generated CSS files
    new HtmlWebPackPlugin({ template: 'src/index.html' }),
    // whenever React runs, it looks for a Window scoped variable of process.env.NODE_ENV to determine the way that it should behave
    // in production React will not perform as many error checkings while it runs and renders the application which will increase performance
    // DefinePlugin is used to define Windows scope variables that will be defined in the bundle so that React behaves accordingly
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),
  ],
  // current bug in webpack
  // reason for the issue is unknown, but this workaround resolves it
  node: {
    fs: 'empty',
    net: 'empty',
  },
};

module.exports = config;
