'use strict';

const BemConfig = require('@bem/sdk.config');
const BemPluginConfig = require('../../src/BemPluginConfig');

jest.mock('@bem/sdk.config');

describe('BemPluginConfig', () => {
    const sdkConfigSimplestStub = () => ({ getSync: () => ({}) });
    const compilerStub = { context: '/foo/bar' };

    afterEach(() => {
        BemConfig.mockReset();
    });

    describe('compiler', () => {
        beforeEach(() => {
            BemConfig.mockImplementation(sdkConfigSimplestStub);
        });

        it('should pass compiler context to sdk.config', () => {
            new BemPluginConfig(compilerStub);

            expect(BemConfig).toHaveBeenCalledWith({ cwd: compilerStub.context });
        });

        it('should attach compiler to set', () => {
            const compiler = {};

            expect(BemPluginConfig.readSetFrom(compiler)).toBe(undefined);

            BemPluginConfig.writeSetTo(compiler, 5);

            expect(BemPluginConfig.readSetFrom(compiler)).toBe(5);
        });

        it('should do apply plugins', () => {
            const config = new BemPluginConfig(compilerStub, { plugins: () => ['foo', 'bar'] });
            const applyFn = jest.fn();

            config.applyPlugins({ apply: applyFn });

            expect(applyFn).toHaveBeenCalledWith('foo', 'bar');
        });
    });

    describe('options', () => {
        beforeEach(() => {
            BemConfig.mockImplementation(sdkConfigSimplestStub);
        });

        describe('techs', () => {
            it('should have default value', () => {
                const config = new BemPluginConfig(compilerStub);

                expect(config.getOption('techs')).toEqual(['js']);
            });

            it('should be overridable', () => {
                const config = new BemPluginConfig(compilerStub, { techs: ['js', 'css'] });

                expect(config.getOption('techs')).toEqual(['js', 'css']);
            });
        });

        describe('techMap', () => {
            it('should have default value', () => {
                const config = new BemPluginConfig(compilerStub);

                expect(config.getOption('techMap')).toEqual({});
            });

            it('should be overridable', () => {
                const config = new BemPluginConfig(compilerStub, { techMap: { js: 'react.js' } });

                expect(config.getOption('techMap')).toEqual({ js: 'react.js' });
            });
        });

        describe('plugins', () => {
            it('should have default value', () => {
                const config = new BemPluginConfig(compilerStub);

                expect(config.getOption('plugins')()).toEqual([]);
            });

            it('should be overridable', () => {
                const config = new BemPluginConfig(compilerStub, { plugins: () => ['foo', 'bar'] });

                expect(config.getOption('plugins')()).toEqual(['foo', 'bar']);
            });
        });

        // libs and self options are tested under e2e
    });

    describe('sets', () => {
        it('should build single set if no sets specified', () => {
            BemConfig.mockImplementation(
                () => ({
                    getSync: () => ({ levels: [{ layer: 'foo' }, { layer: 'baz' }] })
                })
            );

            const config = new BemPluginConfig(compilerStub);

            expect(config.getSet(0)).toEqual('main');
            expect(config.getSetLevels(0)).toEqual([{ layer: 'foo' }, { layer: 'baz' }]);

            const callback = jest.fn();

            config.forEachAdditionalSet(callback);

            expect(callback).not.toHaveBeenCalled();
        });

        it('should build all sets specified', () => {
            BemConfig.mockImplementation(
                () => ({
                    getSync: () => ({
                        levels: [
                            { layer: 'common' },
                            { layer: 'desktop' },
                            { layer: 'touch' }
                        ],
                        sets: {
                            desktop: 'common desktop',
                            touch: 'common touch'
                        }
                    }),
                    levelsSync: setName => {
                        switch (setName) {
                            case 'desktop':
                                return [{ layer: 'common' }, { layer: 'desktop' }];

                            case 'touch':
                                return [{ layer: 'common' }, { layer: 'touch' }];
                        }
                    }
                })
            );

            const config = new BemPluginConfig(compilerStub);

            expect(config.getSet(0)).toEqual('desktop');
            expect(config.getSet(1)).toEqual('touch');

            expect(config.getSetLevels(0)).toEqual([{ layer: 'common' }, { layer: 'desktop' }]);
            expect(config.getSetLevels(1)).toEqual([{ layer: 'common' }, { layer: 'touch' }]);

            const callback = jest.fn();

            config.forEachAdditionalSet(callback);

            expect(callback).toHaveBeenCalledTimes(1);
            expect(callback).toHaveBeenCalledWith(1);
        });
    });
});
