const path = require('path')
const rewireReactHotLoader = require('react-app-rewire-hot-loader')

const resolve = directory => path.resolve(__dirname, directory)

module.exports = function(config, env) {
    config = rewireReactHotLoader(config, env)
    config.resolve.alias = Object.assign(config.resolve.alias, {
        '@redux': resolve('src/redux/store'),
        '@styles': resolve('src/assets/styles'),
        '@animations': resolve('src/assets/animations'),
        '@images': resolve('src/assets/images'),
        '@hoc': resolve('src/hoc'),
        '@components': resolve('src/components'),
        '@utils': resolve('src/utils')
    })
    return config
}
