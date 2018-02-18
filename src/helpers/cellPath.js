'use strict';

const BemCellStringify = require('@bem/sdk.naming.cell.stringify');

/**
 * Returns path to file of BEM-cell using naming rules
 */
module.exports = (bemCell, convention) => BemCellStringify(convention)(bemCell);
