'use strict';

const importedFiles = require('../../src/helpers/importedFiles');
const codeGenerator = require('../../src/generator');
const BemRequest = require('../../src/BemRequest');
const BemModule = require('../../src/BemModule');

jest.mock('webpack/lib/NormalModule',
    () => class NormalModuleStub {
        constructor() {
            this.fileDependencies = [];
        }
    }
);

jest.mock('webpack-sources',
    () => ({
        RawSource: function(code) {
            this.code = code;
        }
    })
);

jest.mock('../../src/generator');
jest.mock('../../src/BemRequest');
jest.mock('../../src/helpers/importedFiles');

describe('BemModule', () => {
    const buildParamStub = {};
    const configStub = {
        getOption(name) {
            switch (name) {
                case 'techs':
                    return ['baz'];

                case 'techMap':
                    return { baz: 'react.baz' };
            }
        },
        getSetLevels() {
            return [{ layer: 'common', path: 'src/common' }];
        }
    };

    BemRequest.mockImplementation(
        () => ({ entities: [{ block: 'foo' }, { block: 'bar' }] })
    );

    importedFiles.mockImplementation(
        () => [
            { path: 'common.blocks/foo/foo.react.baz', tech: 'baz' },
            { path: 'common.blocks/bar/bar.react.baz', tech: 'baz' }
        ]
    );

    let module;

    beforeEach(() => {
        module = new BemModule('some-request', 'some-file', configStub);
    });

    it('should find dependencies with options', () => {
        expect(importedFiles).toHaveBeenCalledWith(
            [{ block: 'foo' }, { block: 'bar' }],
            [{ layer: 'common', path: 'src/common' }],
            {
                techs: ['baz'],
                techMap: { baz: 'react.baz' }
            }
        );

        expect(module.fileDependencies).toEqual([
            'common.blocks/foo/foo.react.baz',
            'common.blocks/bar/bar.react.baz'
        ]);
    });

    it('should build code', () => {
        const buildCallbackStub = jest.fn();

        codeGenerator.mockImplementation(() => 'someCode()');

        module.doBuild(buildParamStub, buildParamStub, buildParamStub, buildParamStub, buildCallbackStub);

        expect(codeGenerator).toHaveBeenCalledWith([
            { path: 'common.blocks/foo/foo.react.baz', tech: 'baz' },
            { path: 'common.blocks/bar/bar.react.baz', tech: 'baz' }
        ]);

        expect(module._source.code).toBe('module.exports = (\nsomeCode()\n);');

        expect(buildCallbackStub).toHaveBeenCalled();
    });

    // extract-text-plugin can remove code for example
    it('should build empty code if generator has empty return value', () => {
        const buildCallbackStub = jest.fn();

        codeGenerator.mockImplementation(() => '');

        module.doBuild(buildParamStub, buildParamStub, buildParamStub, buildParamStub, buildCallbackStub);

        expect(module._source.code).toBe('');

        expect(buildCallbackStub).toHaveBeenCalled();
    });
});
