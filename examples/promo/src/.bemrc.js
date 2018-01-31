// TODO: move to root after https://github.com/bem/bem-sdk/issues/283

const path = require('path');

module.exports = {
    levels: [
        { layer: 'common' },
        { layer: 'desktop' },
        { layer: 'touch' }
    ],
    sets: {
        desktop: '@few-components common desktop',
        touch: '@few-components common touch'
    },
    libs: {
        'few-components': {
            // TODO: fix it also after https://github.com/bem/bem-sdk/issues/283
            path: path.resolve('examples/few-components/src')
        }
    }
};
