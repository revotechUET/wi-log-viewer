const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
//const CopyWebpackPlugin = require('copy-webpack-plugin');

webpackConfigure = {
	entry: "./src/index.js",
	output: {
		path: path.join(__dirname, "dist"),
		filename: "main.bundle.js"
	},
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				use: {
					loader: "babel-loader"
				}
			},
			{
				test: /\.css$/,
				use: ["style-loader", "css-loader"]
			},
			{
				test: /\.less$/,
				use: ['style-loader', 'css-loader', 'less-loader']
			},
			{
				test: /\.(png|jpg|gif|svg|eot|woff|ttf|svg|woff2)$/,
				use: {
				  loader: 'file-loader',
				  options: {
					name: '[name].[ext]',
					outputPath: './assets/' //define the output of the file (relative path to the workdir)
				  }
				}
			}
		]
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: "./src/index.html"
		}),
		// new CopyWebpackPlugin([
		// 	{from: 'src/assets', to:'assets'}
		// ])
	]
};

module.exports = webpackConfigure;
