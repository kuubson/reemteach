const req = require.context('./', false, /^\.\/(?!index).*\.js$/)
req.keys().forEach(fileName => {
    const exportName = fileName.replace('./', '').replace('.js', '')
    module.exports[exportName] = req(fileName).default
})
