const path = require('path');
const WebpackBemPlugin = require('../../index');

function resolver(relativePath) {
    return path.resolve(`examples/promo/${relativePath}`);
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
        filename: '[setName].bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: 'babel-loader'
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }
        ]
    },
    plugins: [
        new WebpackBemPlugin({
            techs: ['js', 'css'],
            techMap: { js: 'react.js' }
        })
    ],
    context: resolver('src')
};
