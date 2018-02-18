'use strict';

const BemConfig = require('@bem/sdk.config');
const rc = require('betterc');

class BemPluginConfig {
    constructor(mainCompiler, options = {}) {
        const context = mainCompiler.context;
        const bemConfig = BemConfig({ cwd: context });

        this.__prepareRc(bemConfig, options.libs, options.self);

        // TODO: handle async watch-mode updates in issues/5
        const config = bemConfig.getSync();

        if (typeof config.sets === 'object') {
            // набор set-ов
            this.sets = Object.keys(config.sets);
            this.setLevels = this.sets.map(set => bemConfig.levelsSync(set));
        } else {
            // один set
            this.sets = ['main'];
            this.setLevels = [config.levels];
        }

        this.options = {
            techs: ['js'],
            techMap: {},
            ...options
        };

        // TODO: add i18n in issues/7
    }

    /**
     * Overriding configs:
     *   a. main config for testing purpose
     *   b. libraries configs:
     *     - if wanted library has no its bemrc and adding it (via PR) is not simple
     *     - if wanted library or bem/sdk-config itself have unresolved issues but we can't wait
     *         example: https://github.com/bem/bem-sdk/issues/261
     */
    __prepareRc(bemConfig, libs, self) {
        if (!libs && !self) return;

        const configsMap = {};
        const oldSync = rc.sync;

        // overriding bem/sdk-config internal mechanism of reading config .bemrc file
        // overriding only sync-method because BemPluginConfig uses sync-api only
        rc.sync = function(options) {
            return configsMap[options.cwd] || oldSync(options);
        };

        // overriding main config
        self && (configsMap[bemConfig._options.cwd] = [self]);

        // overriding libraries configs
        libs && Object.keys(libs).forEach(libName => {
            configsMap[bemConfig.librarySync(libName)._options.cwd] = [libs[libName]];
        });
    }

    getSet(setIndex) {
        return this.sets[setIndex];
    }

    getSetLevels(setIndex) {
        return this.setLevels[setIndex];
    }

    getOption(name) {
        return this.options[name];
    }

    forEachAdditionalSet(callback) {
        for (let i = 1, len = this.sets.length; i < len; i++) callback(i);
    }

    static writeSetTo(compiler, setIndex) {
        compiler.__bemSetIndex = setIndex;
    }

    static readSetFrom(compiler) {
        return compiler.__bemSetIndex;
    }
}

module.exports = BemPluginConfig;
