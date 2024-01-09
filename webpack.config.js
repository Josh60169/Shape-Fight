const path = require("path");

module.exports = {
    mode: 'production',
    entry: './Shape Fight/JavaScript/game.js',
    output:
    {
        path: path.resolve(__dirname, 'Final')
    },

    module:
    {
        rules:
        [
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.ttf$/i,
                type: 'asset/resource'
            },
            {
                test: /\.mp3$/i,
                use: 'file-loader'
            }
        ]
    }
}