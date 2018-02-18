'use strict';

const path = require('path');

const BemCell = require('@bem/sdk.cell');

const cellPath = require('./cellPath');
const namingConvention = require('./namingConvention');

// TODO: improve in issues/10
function resolveCellPath(relativePath, levelPath) {
    return path.resolve(levelPath, '../' + relativePath);
}

/**
 * Returns paths for BEM-entities across all levels
 */
module.exports = (entities, levels, { techs, techMap }) => {
    let bemDeps = [];

    entities.forEach(entity => {
        const entityTechs = entity.tech ? [entity.tech] : techs;

        entityTechs.forEach(tech => {
            const techExt = techMap[tech] || tech;
            const files = levels.map(level => {
                const convention = namingConvention.getFromLevel(level);
                const cell = BemCell.create({ entity, tech: techExt, layer: level.layer });

                return {
                    path: resolveCellPath(cellPath(cell, convention), level.path),
                    tech
                };
            });

            bemDeps = bemDeps.concat(files);
        });
    });

    return bemDeps;
};
