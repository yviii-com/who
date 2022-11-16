var path = require('path');
var webpack = require('webpack');
const TerserJSPlugin = require('terser-webpack-plugin');
const pkg = require('./package');

var repository = pkg.repository.url.replace(/(.+)(:\/\/.+)\.git$/,'https$2');
var now = new Date();
var date = (new Date(now.getTime()-now.getTimezoneOffset()*60000)).toISOString().substr(0,10);
var copyright = `${pkg.name} v${pkg.version}
${pkg.description}
${pkg.homepage}

Copyright (c) 2016-present, ${pkg.author}

Released under the ${pkg.license} License
${repository}

Created on: ${date}`;

module.exports = [
    {
        mode: 'production',
        entry: './src/relationship.js',
        output: {
            path: path.resolve(__dirname,'dist'),
            filename: 'relationship.min.js',
            globalObject: 'this',
            library: 'relationship',
            libraryTarget: 'umd',
            libraryExport:'default'
        },
        plugins: [
            new webpack.BannerPlugin(copyright)
        ],
        optimization: {
            minimizer: [
                new TerserJSPlugin({
                    extractComments: false
                }),
            ]
        }
    },
    {
        mode: 'production',
        entry:'./src/relationship-mode.js',
        output: {
            path: path.resolve(__dirname,'dist'),
            filename: 'relationship-mode.min.js',
            globalObject: 'this',
            library: 'relationshipMode',
            libraryTarget: 'umd',
            libraryExport:'default'
        },
        optimization: {
            minimizer: [
                new TerserJSPlugin({
                    extractComments: false
                }),
            ]
        }
    }
];
