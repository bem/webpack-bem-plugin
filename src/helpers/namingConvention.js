'use strict';

const namingPresets = require('@bem/sdk.naming.presets');

function getPreset(naming) {
    return namingPresets[naming || 'origin'];
}

module.exports = {
    /**
     * Returns preset for level
     */
    getFromLevel(level) {
        return getPreset(level.naming);
    },

    /**
     * Returns preset for path in project with levels
     */
    getFromLevelsByPath(levels, filePath) {
        const found = levels.find(level => filePath.startsWith(level.path + '/'));

        return getPreset(found && found.naming);
    }
};
