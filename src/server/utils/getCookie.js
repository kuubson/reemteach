module.exports = (cookiesString, cookieName) => {
    const cookies = `; ${cookiesString}`
    return cookies
        .split(`; ${cookieName}=`)
        .pop()
        .split(';')
        .shift()
}
