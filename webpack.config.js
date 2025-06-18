const path = require('node:path');

const { EnvironmentPlugin } = require('webpack');
const { mergeWithRules } = require('webpack-merge');

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
        use: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
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
  plugins: [
    new EnvironmentPlugin({}),
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
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
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
      maxSize: 200000, // 200KB
      cacheGroups: {
        external: {
          test: /[\\/]node_modules[\\/]/,
          name: 'external',
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
      new CssMinimizerPlugin(),
    ],
  },
};

const mergeRules = mergeWithRules({
  module: {
    rules: {
      test: 'match',
      use: 'replace',
    },
  },
  plugins: 'append',
  optimization: {
    minimizer: 'append',
  },
});

module.exports = (env, argv) => {
  if (argv.mode === 'development') {
    return mergeRules(defaultConfig, {
      mode: 'development',
      devtool: 'cheap-module-source-map',
      module: {
        rules: [
          {
            test: /\.(ts|tsx)$/,
            use: 'ts-loader',
            exclude: /node_modules/,
          },
        ],
      },
      performance: {
        hints: 'warning',
        maxAssetSize: 400000,
        maxEntrypointSize: 400000,
      },
    });
  }

  return mergeRules(defaultConfig, {
    mode: 'production',
  });
};
