'use strict';

const REGEXP_SET_NAME = /\[setname\]/gi;

const BemPluginConfig = require('./src/BemPluginConfig');
const BemDependency = require('./src/BemDependency');
const BemModuleFactoryPlugin = require('./src/BemModuleFactoryPlugin');

function copyPlugins(from, to, names) {
    to.context = from.context;

    names.forEach(pluginName => {
        const sourcePlugins = from._plugins[pluginName];

        sourcePlugins && (to._plugins[pluginName] = sourcePlugins.slice());
    });
}

class BemReactWebpackPlugin {
    constructor(options) {
        this.options = options;
    }

    handleRequire(compiler) {
        const self = this;

        compiler.plugin('compilation', function(compilation, params) {
            const setIndex = BemPluginConfig.readSetFrom(compilation.compiler);
            const deferred = [];

            if (typeof setIndex === 'undefined') return;

            // adding variable into output.filename
            compilation.mainTemplate.plugin(
                'asset-path',
                path => path.replace(REGEXP_SET_NAME, self.config.getSet(setIndex))
            );

            // FIXME: clear deferred at rebuild

            // applying deferred dependency templates
            compilation.mainTemplate.plugin(
                'modules',
                modules => {
                    deferred.map(d => d());

                    return modules;
                }
            );

            const normalModuleFactory = params.normalModuleFactory;

            compilation.dependencyFactories.set(BemDependency, normalModuleFactory);
            compilation.dependencyTemplates.set(BemDependency, new BemDependency.Template(deferred));

            normalModuleFactory.apply(
                new BemModuleFactoryPlugin(self.config, setIndex)
            );
        });
    }

    // parent-compiler builds 1st set
    prepareParentCompiler(compiler) {
        BemPluginConfig.writeSetTo(compiler, 0);

        // applying 3rd party plugins
        this.config.applyPlugins(compiler);

        this.handleRequire(compiler);
    }

    // child-compilers build all sets except 1st
    prepareChildCompiler(compilation, setIndex) {
        const set = this.config.getSet(setIndex);
        const parentCompiler = compilation.compiler;
        const childCompiler = compilation.createChildCompiler(`bem-webpack-compiler for set ${set}`);

        BemPluginConfig.writeSetTo(childCompiler, setIndex);

        // TODO: shallow copies are not safe enough. Rewrite in case of errors
        // examples of make-plugins: *-entry-plugin
        // examples of compile-plugins: externals-plugin
        copyPlugins(parentCompiler, childCompiler, ['make', 'compile']);

        // applying 3rd party plugins
        this.config.applyPlugins(childCompiler);

        return childCompiler;
    }

    apply(compiler) {
        this.config = new BemPluginConfig(compiler, this.options);

        this.prepareParentCompiler(compiler);

        const self = this;

        this.config.forEachAdditionalSet(function(setIndex) {
            compiler.plugin('make', function(compilation, callback) {
                if (compilation.compiler.isChild()) return callback();

                self.prepareChildCompiler(compilation, setIndex).runAsChild(() => callback());
            });
        });
    }
}

module.exports = BemReactWebpackPlugin;
