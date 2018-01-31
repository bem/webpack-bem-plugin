'use strict';

module.exports = files => files.map(file => `require('${file}')`).join(',\n');
