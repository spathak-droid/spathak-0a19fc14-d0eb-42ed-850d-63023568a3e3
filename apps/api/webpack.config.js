const { composePlugins, withNx } = require('@nx/webpack');
const { join } = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin'); // ✅ ADD THIS

module.exports = composePlugins(
  withNx({ skipBabelrcCheck: true, skipTypeChecking: false, useBabel: false }),
  (config) => {
    config.entry = {
      main: join(__dirname, 'src/main.ts'),
    };

    config.target = 'node';
    config.output = {
      path: join(__dirname, '../../dist/apps/api'),
      filename: 'main.js',
      clean: true,
    };

    config.mode =
      process.env.NODE_ENV === 'production' ? 'production' : 'development';
    config.devtool = 'source-map';

    config.module.rules = [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        options: {
          transpileOnly: true,
          configFile: join(__dirname, 'tsconfig.app.json'),
        },
        exclude: /node_modules/,
      },
    ];

    config.optimization = { splitChunks: false, runtimeChunk: false };
    // config.externals = [nodeExternals()];
    config.externals = [
  nodeExternals({
    allowlist: [/^@proj\//]   // <-- KEEP INTERNAL LIBRARIES
  })
];


    // ✅ ADD this resolve section so Webpack understands @proj/data paths
    config.resolve = {
      ...config.resolve,
      extensions: ['.ts', '.js'],
      plugins: [
        ...(config.resolve?.plugins || []),
        new TsconfigPathsPlugin({
          configFile: join(__dirname, '../../tsconfig.base.json'), // 👈 correct path
        }),
      ],
      fallback: {
        ...config.resolve?.fallback,
        sqlite3: false,
      },
    };

    config.plugins = [
      ...(config.plugins || []),
      new webpack.IgnorePlugin({
        checkResource(resource) {
          const lazyImports = [
            '@nestjs/microservices',
            '@nestjs/microservices/microservices-module',
            '@nestjs/microservices/server',
            '@nestjs/websockets',
            '@nestjs/websockets/socket-module',
            '@nestjs/platform-socket.io',
            '@grpc/grpc-js',
            '@grpc/proto-loader',
            'amqplib',
            'amqp-connection-manager',
            'kafkajs',
            'mqtt',
            'nats',
            'ioredis',
            'class-validator',
            'class-transformer',
            'bufferutil',
            'utf-8-validate',
          ];

          if (lazyImports.includes(resource)) {
            try {
              require.resolve(resource);
            } catch (err) {
              return true;
            }
          }
          return false;
        },
      }),
    ];

    config.ignoreWarnings = [
      {
        module: /@nestjs/,
        message: /the request of a dependency is an expression/,
      },
      {
        module: /express/,
        message: /the request of a dependency is an expression/,
      },
    ];

    return config;
  }
);
