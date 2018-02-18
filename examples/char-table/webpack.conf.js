const path = require('path');
const WebpackBemPlugin = require('../../index');

function resolver(relativePath) {
    return path.resolve(`examples/char-table/${relativePath}`);
}

module.exports = {
    entry: './entry.js',
    externals: {
        'react': 'React',
        'react-dom': 'ReactDOM'

        // TODO: put bem-react-core here after https://github.com/bem/bem-react-core/issues/218
    },
    output: {
        path: resolver('public'),
        filename: 'bundle.js'
    },
    plugins: [
        new WebpackBemPlugin()
    ],
    context: resolver('src')
};
