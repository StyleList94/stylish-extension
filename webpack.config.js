const path = require('node:path');

const { EnvironmentPlugin } = require('webpack');
const { merge } = require('webpack-merge');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const defaultConfig = {
  entry: {
    main: './src/popup/index.tsx',
    content: './src/scripts/content.ts',
    background: './src/service-worker/background.ts',
  },
  output: {
    filename: (pathData) => {
      switch (pathData.chunk.name) {
        case 'content':
          return 'scripts/[name].js';
        case 'background':
          return '[name].js';
        default:
          return '[name].[fullhash].js';
      }
    },
    publicPath: 'auto',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(png|jpg|gif)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.svg$/i,
        issuer: /\.tsx?$/,
        use: ['@svgr/webpack'],
        type: 'asset',
      },
    ],
  },
  resolve: { extensions: ['.*', '.ts', '.tsx', '.js'] },
  performance: {
    hints: false,
    maxAssetSize: 400000,
    maxEntrypointSize: 400000,
  },
  plugins: [
    new CleanWebpackPlugin({ cleanAfterEveryBuildPatterns: ['*.LICENSE.txt'] }),
    new ESLintPlugin(),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'src/images'),
          to: path.resolve(__dirname, 'dist/images'),
        },
        {
          from: path.resolve(__dirname, 'src/manifest.json'),
          to: path.resolve(__dirname, 'dist'),
        },
      ],
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src/popup/index.html'),
      minify: true,
    }),
  ],
  optimization: {
    splitChunks: {
      chunks: 'all',
      name: false,
      cacheGroups: {
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
          enforce: true,
        },
      },
    },
    minimize: true,
    minimizer: [
      new TerserPlugin({
        minify: TerserPlugin.esbuildMinify,
        terserOptions: {},
      }),
    ],
  },
};

module.exports = (env, argv) => {
  if (argv.mode === 'development') {
    return merge(defaultConfig, {
      mode: 'development',
      devServer: {
        port: 3000,
        open: true,
      },
      module: {
        rules: [
          {
            test: /\.css$/,
            use: ['style-loader', 'css-loader', 'postcss-loader'],
          },
        ],
      },
      plugins: [new EnvironmentPlugin({})],
    });
  }

  return merge(defaultConfig, {
    mode: 'production',
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
        },
      ],
    },
    optimization: {
      minimizer: [new CssMinimizerPlugin()],
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: '[name].css',
        chunkFilename: '[id].css',
      }),
      new EnvironmentPlugin({}),
    ],
  });
};
