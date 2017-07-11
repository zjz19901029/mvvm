var path = require('path');
const webpack = require('webpack');

module.exports = {
	entry: './src/index.js',
	output: {
		filename: 'mvvm.js',
		path: path.resolve(__dirname, 'dist')
	},
	plugins: [
	    new webpack.HotModuleReplacementPlugin() // Enable HMR
	],
	module: {
        loaders:[{
            test: /\.js$/,
            exclude: /(node_modules|bower_components)/,
            loader: 'babel-loader',
            query: {
                presets: ['es2015']
            }
        }]
    },
    devtool: 'cheap-module-source-map',
    devServer: {
	    hot: true, // Tell the dev-server we're using HMR
	    contentBase: './'
	}
};