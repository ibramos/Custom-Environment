// path module is part of Node
const path = require('path');
// extract-text-webpack-plugin helps separate styles into a separate file
// styles will no longer be inlined into the JS bundle
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const config = {
	// index.js is the naming convention used
	// entry point starts the bundling process
	// think of it as top node in a BST
	entry: './src/index.js',
	output: {
		// path dictates the directory
		// resolve function will take in the path to a file
		// makes sure file path is correctly specified regardless of operating system
		// __dirname is a constant in Node
		// it is a reference to the current working directory
		// build is the naming convention used
		// will be the folder that will be generated in the current working directory
		path: path.resolve(__dirname, 'build'),
		// filename dictates the name of the output
		// bundle.js is the naming convention used
		filename: 'bundle.js',
		// publicPath prepends the path when contructing urls
		// used by any loader with a direct file path reference to a file in output directory
		publicPath: 'build/'
	},
	// loaders are used to enhance the behavior of Webpack
	module: {
		rules: [
			{
				// use describes the loader being used
				// babel-loader teaches babel to work with webpack
				use: 'babel-loader',
				// test describes the type of files the specified loader will be assigned to
				// RESOURCE: https://regex101.com/
				test: /\.jsx?$/
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
					fallback: 'style-loader'
				}),
				test: /\.css$/
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
					'image-webpack-loader'
				],
				test: /\.(jpe?g|png|gif|svg)$/
			}
		]
	},
	// tells the extract library to find any files transformed by its loader
	// files will be saved under style.css
	plugins: [new ExtractTextPlugin('style.css')]
};

module.exports = config;
