module.exports = {
    apps: [
        {
            name: 'weather-application',
            script: '.next/standalone/server.js',
            env: {
                PORT: 3000,
                HOSTNAME: '0.0.0.0',
            },
        },
    ],
}
