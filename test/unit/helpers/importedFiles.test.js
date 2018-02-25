'use strict';

const importedFiles = require('../../../src/helpers/importedFiles');

jest.mock('@bem/sdk.cell',
    () => ({ create: obj => obj })
);

jest.mock('../../../src/helpers/namingConvention',
    () => ({ getFromLevel: () => '[origin]' })
);

jest.mock('../../../src/helpers/cellPath',
    () => (cell, naming) => {
        expect(naming).toBe('[origin]');

        return `${cell.layer}.blocks/${cell.entity.block}/${cell.entity.block}.${cell.tech}`;
    }
);

describe('helpers/importedFiles', () => {
    it('should return files for techs specified', () => {
        const entites = [
            { block: 'foo' }
        ];
        const levels = [
            { layer: 'common', path: 'src/common' },
            { layer: 'desktop', path: 'src/desktop' }
        ];

        expect(
            importedFiles(entites, levels, { techs: ['js', 'css'], techMap: {} })
        ).toEqual(
            [
                {
                    path: expect.stringMatching(/src\/common\.blocks\/foo\/foo\.js$/),
                    tech: 'js'
                },
                {
                    path: expect.stringMatching(/src\/desktop\.blocks\/foo\/foo\.js$/),
                    tech: 'js'
                },
                {
                    path: expect.stringMatching(/src\/common\.blocks\/foo\/foo\.css$/),
                    tech: 'css'
                },
                {
                    path: expect.stringMatching(/src\/desktop\.blocks\/foo\/foo\.css$/),
                    tech: 'css'
                }
            ]
        );
    });

    it('should return specific tech picked from entity', () => {
        const entites = [
            { block: 'foo', tech: 'js' }
        ];
        const levels = [
            { layer: 'common', path: 'src/common' },
            { layer: 'desktop', path: 'src/desktop' }
        ];

        expect(
            importedFiles(entites, levels, { techs: ['js', 'css'], techMap: {} })
        ).toEqual(
            [
                {
                    path: expect.stringMatching(/src\/common\.blocks\/foo\/foo\.js$/),
                    tech: 'js'
                },
                {
                    path: expect.stringMatching(/src\/desktop\.blocks\/foo\/foo\.js$/),
                    tech: 'js'
                }
            ]
        );
    });

    it('should return files using techMap specified', () => {
        const entites = [
            { block: 'foo' }
        ];
        const levels = [
            { layer: 'common', path: 'src/common' },
            { layer: 'desktop', path: 'src/desktop' }
        ];

        expect(
            importedFiles(entites, levels, { techs: ['js'], techMap: { js: 'react.js' } })
        ).toEqual(
            [
                {
                    path: expect.stringMatching(/src\/common\.blocks\/foo\/foo\.react\.js$/),
                    tech: 'js'
                },
                {
                    path: expect.stringMatching(/src\/desktop\.blocks\/foo\/foo\.react\.js$/),
                    tech: 'js'
                }
            ]
        );
    });
});
