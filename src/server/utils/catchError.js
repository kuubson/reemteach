export default routeMiddleware => (req, res, next) => routeMiddleware(req, res, next).catch(next)
