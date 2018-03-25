'use strict';

const WebpackModuleDependency = require('webpack/lib/dependencies/ModuleDependency');
const WebpackModuleDependencyTemplateAsRequireId = require('webpack/lib/dependencies/ModuleDependencyTemplateAsRequireId');

/**
 * BemDependency replaces require('b:block') with __webpack_require__(idx) inside the webpack
 */
class BemDependency extends WebpackModuleDependency {
    constructor(request, range, filePath) {
        super(request);
        this.range = range;
        this.filePath = filePath;
    }

    static isBemNotation(request) {
        return /^[bemt]:/.test(request);
    }

    get type() {
        return 'bem require';
    }
}

BemDependency.Template = class CustomTemplate {
    constructor(deferred) {
        this.deferred = deferred;
    }

    apply(dep, source) {
        const m = dep.module;

        // FIXME: handle with WebpackMissingModule
        if (!dep.range || !m) return;

        if (m.shouldInline()) {
            // do inline as deferred at mainTemplate.plugin("modules")
            this.deferred.push(() => {
                source.replace(dep.range[0], dep.range[1] - 1,
                    `${m._deferredSource.source()} /* from ${m.id} */`);
            });
        } else {
            // do ordinary require
            source.replace(dep.range[0], dep.range[1] - 1, `__webpack_require__(${JSON.stringify(m.id)})`);
        }
    }
};

module.exports = BemDependency;
