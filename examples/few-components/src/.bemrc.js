// TODO: move to root after https://github.com/bem/bem-sdk/issues/283

module.exports = {
    levels: [
        { layer: 'common' },
        { layer: 'desktop' },
        { layer: 'touch' }
    ],
    sets: {
        desktop: 'common desktop',
        touch: 'common touch'
    }
};
