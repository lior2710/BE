var path = require('path');
var webpack = require('webpack');

module.exports = {
  devtool: 'eval',
  node: {
        fs: 'empty'
  },
  entry: [
    'react-hot-loader/patch',
    'webpack-dev-server/client?http://localhost:3000',
    'webpack/hot/only-dev-server',
    './src/index'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/static/'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  module: {
    loaders: [{
        test: /\.jsx?$/,
        loader: 'babel',
        include: path.join(__dirname, 'src'),
        query: {
            presets:['react', 'es2015', 'stage-1']
        }
    }, {
        test: /\.json$/,
        loaders: ['json-loader']
    }, {
        test: /\.scss$/,
        loaders: ['style', 'css', 'sass']
    }, {
        test: /\.css$/,
        loaders: ['style', 'css', 'sass']
    }]
  }
};
