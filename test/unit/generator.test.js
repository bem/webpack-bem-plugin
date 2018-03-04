'use strict';

const fs = require('fs');
const generator = require('../../src/generator');

jest.mock('fs', () => ({ existsSync: jest.fn() }));

describe('generator', () => {
    it('should generate for js tech only', () => {
        fs.existsSync.mockReturnValue(true);

        const bemDeps = [
            { path: 'dir/foo.js', tech: 'js' },
            { path: 'dir/bar.js', tech: 'js' }
        ];

        expect(generator(bemDeps)).toBe(
            'require(\'dir/foo.js\'),' + '\n' +
            '(require(\'dir/bar.js\').default || require(\'dir/bar.js\')).applyDecls()'
        );
    });

    it('should generate for css and js techs', () => {
        fs.existsSync.mockReturnValue(true);

        const bemDeps = [
            { path: 'dir/foo.js', tech: 'js' },
            { path: 'dir/foo.css', tech: 'css' },
            { path: 'dir/bar.js', tech: 'js' },
            { path: 'dir/bar.css', tech: 'css' }
        ];

        expect(generator(bemDeps)).toBe(
            'require(\'dir/foo.css\'),' + '\n' +
            'require(\'dir/bar.css\'),' + '\n' +
            'require(\'dir/foo.js\'),' + '\n' +
            '(require(\'dir/bar.js\').default || require(\'dir/bar.js\')).applyDecls()'
        );
    });

    it('should filter nonexistent files', () => {
        fs.existsSync.mockImplementation(path => path === 'dir/foo.js');

        const bemDeps = [
            { path: 'dir/foo.js', tech: 'js' },
            { path: 'dir/bar.js', tech: 'js' }
        ];

        expect(generator(bemDeps)).toBe(
            '(require(\'dir/foo.js\').default || require(\'dir/foo.js\')).applyDecls()'
        );
    });
});
