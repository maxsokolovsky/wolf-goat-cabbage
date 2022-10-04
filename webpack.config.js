const path = require('path');

module.exports = {
	entry: './src/app.js',
	output: {
		path: path.join(__dirname, 'public'),
		filename: 'bundle.js'
	},
	module: {
		rules: [
			{
				loader: 'babel-loader',
				test: /\.js$/,
				exclude: /node_modules/
			},
			{
  				use: ['style-loader', 'css-loader'],
  				test: /\.css$/,
  				include: /flexboxgrid/
			}
		]
	},
	mode: 'development',
	devServer: {
		static: path.join(__dirname, 'public')
	}
};
