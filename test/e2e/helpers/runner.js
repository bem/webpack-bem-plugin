'use strict';

const webpack = require('webpack');
const webpackWatchOptions = { aggregateTimeout: 1 };

const WebpackBemPlugin = require('../../../index');

const resolver = require('./resolver');

function getModules(compilation) {
    return compilation.modules.concat(...compilation.children.map(getModules));
}

function createWebpackInstance(pluginOptions) {
    return webpack({
        entry: './entry.js',
        output: {
            path: resolver('build'),
            filename: '[setName]/[setName].bundle.js'
        },
        plugins: [
            new WebpackBemPlugin(pluginOptions)
        ],
        context: resolver('src')
    });
}

function getWebpackError(err, stats) {
    if (err) {
        return err;
    }

    if (stats.compilation.errors.length) {
        return stats.compilation.errors.join(',\n');
    }

    const erroredModules = getModules(stats.compilation).filter(m => m.errors.length);

    if (erroredModules.length) {
        return erroredModules.join(',\n');
    }
}

/**
 * Does webpack-run and webpack-watch
 */
module.exports = {
    watch: pluginOptions => {
        let hook;
        let instance;

        return {
            build: () => new Promise(( resolve, reject ) => {
                hook = { resolve, reject };
                instance = createWebpackInstance(pluginOptions).watch(webpackWatchOptions, watchCallback);
            }),
            watchNext: action => new Promise((resolve, reject) => {
                hook = { resolve, reject };

                // do some action to trigger rebuild
                setTimeout(action, 100);
            }),
            close: () => new Promise(resolve => {
                hook = null;

                instance.close(resolve);
            })
        };

        function watchCallback(err, stats) {
            const error = getWebpackError(err, stats);

            error ? hook.reject(error) : hook.resolve();
        }
    },

    run: pluginOptions => new Promise((resolve, reject) => {
        createWebpackInstance(pluginOptions).run((err, stats) => {
            const error = getWebpackError(err, stats);

            error ? reject(error) : resolve();
        });
    })
};
