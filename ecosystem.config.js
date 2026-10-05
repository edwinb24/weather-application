module.exports = {
    apps: [
        {
            name: 'weather-application',
            script: '.next/standalone/server.js',
            env: {
                NODE_ENV: 'production',
            },
        },
    ],
}
