'use strict';

const fs = require('fs');
const resolver = require('./resolver');

function getFilePath(setName) {
    return resolver(`build/${setName}/${setName}.bundle.js`);
}

module.exports = {
    clear: function(...setNames) {
        setNames.forEach(setName => {
            const file = getFilePath(setName);

            fs.existsSync(file) && fs.unlinkSync(file);
        });
    },

    test: function(setToStrings) {
        const errors = [];

        Object.keys(setToStrings).forEach(setName => {
            const value = setToStrings[setName];
            const file = getFilePath(setName);

            if (!fs.existsSync(file)) {
                return errors.push(`${file} not found`);
            }

            const strings = Array.isArray(value) ? value : [value];
            const fileContent = fs.readFileSync(file, 'utf8');

            strings.forEach(string => {
                const items = string.split(/^!/);
                const invert = items.length === 2;

                string = items.pop();

                if (fileContent.includes(string)) {
                    invert && errors.push(`${file} should not contain "${string}"`);
                } else {
                    !invert && errors.push(`${file} should contain "${string}"`);
                }
            });
        });

        return new Promise((resolve, reject) => {
            errors.length ? reject(errors.join('\n')) : resolve();
        });
    },

    wait: timeout => new Promise(resolve => setTimeout(resolve, timeout))
};
