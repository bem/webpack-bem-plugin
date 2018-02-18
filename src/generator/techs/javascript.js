'use strict';

function lastRequire(file) {
    // `require().default` for babel-imports
    return `(require('${file}').default || require('${file}')).applyDecls()`;
}

function generalRequire(file) {
    return `require('${file}')`;
}

module.exports = files => {
    const lastIndex = files.length - 1;

    return files
        .map((file, index) => index === lastIndex ? lastRequire(file) : generalRequire(file))
        .join(',\n');
};
