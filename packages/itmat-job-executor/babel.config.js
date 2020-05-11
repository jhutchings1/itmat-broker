// babel.config.js
module.exports = {
    presets: [
        [
            '@babel/preset-env',
            {
                targets: {
                    node: 'current',
                },
            },
        ],
        ["@babel/preset-typescript",
            {
                allExtensions: true
            }
        ]
    ],
    plugins: [
        "@babel/plugin-syntax-dynamic-import",
        "@babel/proposal-class-properties",
        "@babel/proposal-object-rest-spread"
    ]
};