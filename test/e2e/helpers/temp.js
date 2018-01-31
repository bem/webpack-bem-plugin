'use strict';

const fs = require('fs');
const resolver = require('./resolver');

const TEMP_MARK = 'temp.foo';
const TEMP_FILE_PATH = resolver('src/temp.blocks/foo/foo.js');
const TEMP_FILE_CONTENT = `var foo = '${TEMP_MARK}';\n`;

module.exports = {
    mark: TEMP_MARK,

    add: function() {
        fs.createWriteStream(TEMP_FILE_PATH).end(TEMP_FILE_CONTENT);
    },

    remove: function() {
        fs.existsSync(TEMP_FILE_PATH) && fs.unlinkSync(TEMP_FILE_PATH);
    }
};
