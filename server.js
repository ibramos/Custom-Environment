const express = require('express');
const path = require('path');
const app = express();

// process.env.NODE_ENV value differs based on the deployment target
if (process.env.NODE_ENV !== 'production') {
	// webpackMiddleware serves to intercept incoming requests and hand it off to webpack
	const webpackMiddleware = require('webpack-dev-middleware');
	// webpack exists to compile all of the application assets
	const webpack = require('webpack');
	// webpackConfig is what instructs webpack on how to run correctly
	const webpackConfig = require('./webpack.config.js');
	app.use(webpackMiddleware(webpack(webpackConfig)));
} else {
	// instructs express to make everything inside the build directory to be freely available for use
	app.use(express.static('build'));
	// any get request to the serer will result in the sending of the index.html file
	// used specifically for the compatibility with react router
	app.get('*', (req, res) =>
		res.sendFile(path.join(__dirname, 'build/index.html'))
	);
}

const PORT = process.env.NODE_ENV || 8000;

app.listen(PORT, () => console.log(`Listening to ${PORT}`));
