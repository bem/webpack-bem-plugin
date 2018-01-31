'use strict';

const path = require('path');

const BemEntityParse = require('@bem/sdk.naming.entity.parse');

function trimFilename(filePath) {
    return path.basename(filePath).split('.')[0];
}

/**
 * Returns BEM-entity for path using naming rules
 */
module.exports = (filePath, convention) => BemEntityParse(convention)(trimFilename(filePath));
