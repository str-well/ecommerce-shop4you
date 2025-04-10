const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/remoteCheckout.tsx',
  output: {
    filename: 'remoteEntry.js',
    path: path.resolve(__dirname, 'public'),
    library: {
      type: 'umd',
      name: 'remoteCheckout',
    },
    publicPath: 'auto',
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-env',
                '@babel/preset-react',
                '@babel/preset-typescript',
              ],
            },
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM',
  },
};
