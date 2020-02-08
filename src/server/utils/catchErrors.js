export default routeMiddleware => (req, res, next) => {
    try {
        routeMiddleware(req, res, next)
    } catch (error) {
        next(error)
    }
}
