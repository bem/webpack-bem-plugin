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

BemDependency.Template = WebpackModuleDependencyTemplateAsRequireId;

module.exports = BemDependency;
