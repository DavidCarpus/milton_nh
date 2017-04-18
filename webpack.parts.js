const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const NpmInstallPlugin = require('npm-install-webpack-plugin');
const WebpackBuildNotifierPlugin = require('webpack-build-notifier');

const bootstrapEntryPoints = require('./webpack.bootstrap.config.js');

// eslint-disable-next-line no-console

exports.bootstrap = function(TARGET) {
    // console.log(`=> bootstrap-loader configuration: ${TARGET}`);
    const entry = {};
    // entry[bootstrapEntryPoints.dev] = options.entries;
    if (TARGET == 'build') {
        entry[bootstrapEntryPoints.prod] = bootstrapEntryPoints.prod;
        console.log(`=> bootstrap-loader configuration: ${bootstrapEntryPoints.prod}`);
    } else {
        entry[bootstrapEntryPoints.dev] = bootstrapEntryPoints.dev;
        console.log(`=> bootstrap-loader configuration: ${bootstrapEntryPoints.dev}`);
    }

    return {
      // Define an entry point needed for splitting.
      entry: entry,
      }
  }

exports.notifications = function(options) {
  return {
    plugins: [
        new WebpackBuildNotifierPlugin({
            title: "Milton Webpack Build",
            failureIcon: options.iconPath,
            successIcon: './',
            suppressSuccess: true,
            failureSound:'/usr/share/sounds/ubuntu/notifications/Xylo.ogg',
            sound:true,
        })
    ]
  };
}

exports.indexTemplate = function(options) {
  return {
    plugins: [
      new HtmlWebpackPlugin({
        //   template: require('html-webpack-template'),
        template: 'index.ejs',
        // filename: 'index.html',
        styles: options.styles,
        title: options.title,
        appMountId: options.appMountId,
        inject: false,
        meta: [
        {
          name: 'description',
          content: 'A better default template for html-webpack-plugin.'
        }
        ],
      })
    ]
  };
}

exports.loadJSX = function(include) {
  return {
    module: {
      loaders: [
        {
          test: /\.(js|jsx)$/,
          // Enable caching for extra performance
          loaders: ['babel?cacheDirectory'],
          include: include
        }
      ]
    }
  };
}

exports.loadIsparta = function(include) {
  return {
    module: {
      preLoaders: [
        {
          test: /\.(js|jsx)$/,
          loaders: ['isparta'],
          include: include
        }
      ]
    }
  };
}

exports.lintJSX = function(include) {
  return {
    module: {
      preLoaders: [
        {
          test: /\.(js|jsx)$/,
          loaders: ['eslint'],
          include: include
        }
      ]
    }
  };
}

exports.jsonData = function(include) {
  return {
    module: {
      preLoaders: [
        {
          test: /\.json$/,
          loaders: ['json'],
          include: include
        }
      ]
    }
  };
}

exports.enableReactPerformanceTools = function() {
  return {
    module: {
      loaders: [
        {
          test: require.resolve('react'),
          loader: 'expose?React'
        }
      ]
    }
  };
}

exports.devServer = function(options) {
  const ret = {
    devServer: {
      // Enable history API fallback so HTML5 History API based
      // routing works. This is a good default that will come
      // in handy in more complicated setups.
      historyApiFallback: true,

      // Unlike the cli flag, this doesn't set
      // HotModuleReplacementPlugin!
      hot: true,
      inline: true,

      // Display only errors to reduce the amount of output.
      stats: 'errors-only',

      // Parse host and port from env to allow customization.
      //
      // If you use Vagrant or Cloud9, set
      // host: options.host || '0.0.0.0';
      //
      // 0.0.0.0 is available to all network devices
      // unlike default `localhost`.
    //   host: options.host, // Defaults to `localhost`
      host: '0.0.0.0', // Defaults to `localhost`
      port: options.port // Defaults to 8080
    },
    plugins: [
      // Enable multi-pass compilation for enhanced performance
      // in larger projects. Good default.
      new webpack.HotModuleReplacementPlugin({
        multiStep: true
      })
    ]
  };

  if(options.poll) {
    ret.watchOptions = {
      // Delay the rebuild after the first change
      aggregateTimeout: 300,
      // Poll using interval (in ms, accepts boolean too)
      poll: 1000
    };
  }

  return ret;
}

exports.setupCSS = function(paths) {
  return {
    module: {
      loaders: [
          {
              test: /\.css$/,
              loader: 'style-loader'
          },
          {
              test: /\.css$/,
              loader: 'css-loader',
              query: {
                  modules: true,
                  sourcemap: true
                //   localIdentName: '[name]__[local]___[hash:base64:5]'
              }
          },
          {
              test: /\.css$/,
              loader: "resolve-url-loader"
            },

          {
              test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
              loader: "url-loader?limit=10000&mimetype=application/font-woff"
            },
            {
              test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
              loader: "url-loader?limit=10000&mimetype=application/font-woff"
            },
            {
              test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
              loader: "url-loader?limit=10000&mimetype=application/octet-stream"
            },
            {
              test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
              loader: "file-loader"
            },
            {
              test: /\.png(\?v=\d+\.\d+\.\d+)?$/,
              loader: "file-loader"
            },
            {
              test: /\.jpg(\?v=\d+\.\d+\.\d+)?$/,
              loader: "file-loader"
            },
            {
              test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
              loader: "url-loader?limit=10000&mimetype=image/svg+xml"
          },
           {
               test: /\.scss$/,
               loader: "style!css!autoprefixer!sass"
           },

            // {
            //   // When you encounter images, compress them with image-webpack (wrapper around imagemin)
            //   // and then inline them as data64 URLs
            //   test: /\.(png|jpg|svg)/,
            //   loaders: ['url', 'image-webpack'],
            // },
      ]
    }
  };
}

exports.minify = function() {
  return {
    plugins: [
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false
        }
      })
    ]
  };
}

exports.setFreeVariable = function(key, value) {
  const env = {};
  env[key] = JSON.stringify(value);

  return {
    plugins: [
      new webpack.DefinePlugin(env)
    ]
  };
}

exports.extractBundle = function(options) {
  const entry = {};
  entry[options.name] = options.entries;

  return {
    // Define an entry point needed for splitting.
    entry: entry,
    plugins: [
      // Extract bundle and manifest files. Manifest is
      // needed for reliable caching.
      new webpack.optimize.CommonsChunkPlugin({
        names: [options.name, 'manifest'],

        // options.name modules only
        minChunks: Infinity
      })
    ]
  };
}

exports.clean = function(path) {
  return {
    plugins: [
      new CleanWebpackPlugin([path], {
        root: process.cwd()
      })
    ]
  };
}

exports.extractCSS = function(paths) {
  return {
    module: {
      loaders: [
        // Extract CSS during build
        {
          test: /\.css$/,
          loader: ExtractTextPlugin.extract('style', 'css'),
          include: paths
      },
        {
          test: /\.scss$/,
          loader: ExtractTextPlugin.extract('style', 'css!sass'),
          include: paths
        }
      ]
    },
    plugins: [
      // Output extracted CSS to a file
      new ExtractTextPlugin('[name].[chunkhash].css')
    ]
  };
}

exports.npmInstall = function(options) {
  options = options || {};

  return {
    plugins: [
      new NpmInstallPlugin(options)
    ]
  };
}
