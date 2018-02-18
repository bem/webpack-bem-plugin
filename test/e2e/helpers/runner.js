'use strict';

const webpack = require('webpack');

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
        let next;

        const promise = new Promise(( resolve, reject ) => {
            next = { resolve, reject };
        });

        let instance = createWebpackInstance(pluginOptions).watch({}, (err, stats) => {
            const error = getWebpackError(err, stats);

            error ? next.reject(error) : next.resolve();
        });

        return {
            promise,
            afterChanges: () => new Promise((resolve, reject) => {
                next = { resolve, reject };
            }),
            close: () => new Promise(resolve => instance.close(resolve))
        };
    },

    run: pluginOptions => new Promise((resolve, reject) => {
        createWebpackInstance(pluginOptions).run((err, stats) => {
            const error = getWebpackError(err, stats);

            error ? reject(error) : resolve();
        })
    })
};
