'use strict';

const WebpackNormalModule = require('webpack/lib/NormalModule');
const WebpackRawSource = require('webpack-sources').RawSource;
const importedFiles = require('./helpers/importedFiles');
const codeGenerator = require('./generator');

const BemRequest = require('./BemRequest');

/**
 * BemModule loads all requested BEM-entities as a single webpack-module
 */
class BemModule extends WebpackNormalModule {
    constructor(request, filePath, config, setIndex, parser) {
        const techs = config.getOption('techs');
        const techMap = config.getOption('techMap');
        const levels = config.getSetLevels(setIndex);

        const bemRequest = new BemRequest(request, filePath, levels, setIndex);
        const ident = bemRequest.ident;

        super(ident, ident, undefined, [], 'bem-resource', parser);

        this.bemDeps = importedFiles(bemRequest.entities, levels, { techs, techMap });

        this.fileDependencies = this.fileDependencies.concat(
            this.bemDeps.map(bemDep => bemDep.path)
        );

        this.cacheable = true;
    }

    shouldPreventParsing() {
        return false;
    }

    doBuild(options, compilation, resolver, fs, callback) {
        const code = codeGenerator(this.bemDeps);

        this._source = new WebpackRawSource(code ? `module.exports = (\n${code}\n);` : '');

        return callback();
    }
}

module.exports = BemModule;
