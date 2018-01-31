'use strict';

const WebpackNormalModule = require('webpack/lib/NormalModule');
const BemDependency = require('./BemDependency');
const BemModule = require('./BemModule');

function getRequireArgument(requireExpr) {
    const arg = requireExpr.arguments[0];

    if (arg && arg.type === 'Literal' && typeof arg.value === 'string') return arg.value;
}

/**
 * BemModuleFactoryPlugin
 *  1. parses require('b:block') adding BemDependency in dependency graph
 *  2. resolves each BemDependency in BemModule
 */
class BemModuleFactoryPlugin {
    constructor(config, setIndex) {
        this.config = config;
        this.setIndex = setIndex;
    }

    apply(normalModuleFactory) {
        const self = this;

        normalModuleFactory.plugin('parser', function(parser) {
            parser.plugin('call require', function(expr) {
                const currentModule = parser.state.current;

                if (!(currentModule instanceof WebpackNormalModule)) return;

                const request = getRequireArgument(expr);

                if (request && BemDependency.isBemNotation(request)) {
                    currentModule.addDependency(
                        new BemDependency(request, expr.range, currentModule.request)
                    );

                    return true;
                }
            });
        });

        normalModuleFactory.plugin('resolver', function(baseResolver) {
            function bemResolver(data, callback) {
                const dep = data.dependencies[0];

                if (dep instanceof BemDependency) {
                    callback(null,
                        new BemModule(
                            dep.request,
                            dep.filePath,
                            self.config,
                            self.setIndex,
                            normalModuleFactory.getParser({ ident: 'bem-parser' })
                        )
                    );
                } else {
                    baseResolver(data, callback);
                }
            }

            return bemResolver;
        });
    }
}

module.exports = BemModuleFactoryPlugin;
