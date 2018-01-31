'use strict';

const fs = require('fs');

const jsGenerator = require('./techs/javascript');
const generalGenerator = require('./techs/general');

/*
 * Returns js-code that requires BEM entities
 */
module.exports = bemDeps => {
    const techToFiles = {};

    bemDeps.forEach(({ path, tech }) => {
        techToFiles[tech] = (techToFiles[tech] || []).concat(path);
    });

    return Object
        .keys(techToFiles)
        .sort(tech => tech === 'js') // js should be the last
        .map(tech => {
            const generator = tech === 'js' ? jsGenerator : generalGenerator;
            const existingFiles = techToFiles[tech].filter(fs.existsSync);

            return existingFiles.length > 0 && generator(existingFiles);
        })
        .filter(Boolean)
        .join(',\n');
};
