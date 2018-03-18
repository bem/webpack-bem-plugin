const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
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
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: 'css-loader'
                })
            }
        ]
    },
    plugins: [
        new WebpackBemPlugin({
            techs: ['js', 'css'],
            techMap: { js: 'react.js' },
            plugins: () => [
                new ExtractTextPlugin('[setName].bundle.css')
            ]
        })
    ],
    context: resolver('src')
};
