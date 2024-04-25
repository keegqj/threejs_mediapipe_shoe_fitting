const path = require('path');

module.exports = {
  mode :'production',
  entry: './src/script.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  performance: {
    hints: false
  }
}; 